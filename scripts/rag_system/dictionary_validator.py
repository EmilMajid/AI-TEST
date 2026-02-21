
# dictionary_validator.py
import re
from pathlib import Path
from typing import Set, Dict, Any

class DictionaryValidator:
    """
    Production-grade text validation for Azerbaijani and other languages.
    Checks dictionary coverage and structural integrity (vowel loss).
    """
    
    VOWELS_AZ = set('aəeioöuüıAƏEİOÖUÜI')
    VOWELS_EN = set('aeiouAEIOU')
    VOWELS_RU = set('аеёиоуыэюяАЕЁИОУЫЭЮЯ')
    VOWELS_DE = set('aeiouäöüAEIOUÄÖÜ')
    VOWELS_FR = set('aeiouàâéèêëîïôùûüAEIOUÀÂÉÈÊËÎÏÔÙÛÜ')

    # Thresholds for Production Quality Gate
    MIN_COVERAGE = 0.25     # Lowered for pilot (morphological richness makes dict matching hard)
    MAX_VOWEL_LOSS = 0.25   # Max 25% of words can be vowel-less (more robust for noise)
    
    def __init__(self, lang: str = "az"):
        self.lang = lang.lower()
        self.dictionary: Set[str] = set()
        self._load_dictionary()
        
    def _load_dictionary(self):
        """Loads language-specific dictionary from data/dictionaries/"""
        # Map complex language codes to file codes (e.g. 'eng' -> 'en')
        lang_map = {
            'aze': 'az', 'az': 'az',
            'eng': 'en', 'en': 'en',
            'rus': 'ru', 'ru': 'ru',
            'deu': 'de', 'de': 'de', 'ge': 'de',
            'fra': 'fr', 'fr': 'fr'
        }
        self.file_lang = lang_map.get(self.lang, 'en') # Default to English if unknown
        
        # Determine strict path relative to project root
        current_file = Path(__file__).resolve()
        project_root = current_file.parent.parent.parent
        dict_path = project_root / "data" / "dictionaries" / f"{self.file_lang}.txt"
        
        if dict_path.exists():
            with open(dict_path, "r", encoding="utf-8") as f:
                self.dictionary = {line.strip().lower() for line in f if line.strip()}
            print(f"[*] Loaded {len(self.dictionary)} words for '{self.lang}' dictionary validator.")
        else:
            print(f"[!] Dictionary not found at {dict_path}. Validation will run in heuristic mode.")

    def _tokenize(self, text: str) -> list[str]:
        """Simple linguistic tokenization"""
        # Remove punctuation and split
        clean = re.sub(r'[^\w\s]', ' ', text)
        return [w for w in clean.split() if w.strip()]

    def _simple_stem(self, word: str) -> str:
        """Naive stemming per language"""
        lower_word = word.lower()
        if len(lower_word) <= 3: return lower_word
        
        if self.file_lang == 'az':
            suffixes = ["lar", "lər", "dan", "dən", "nın", "nin", "nun", "nün", "da", "də", "a", "ə", "ı", "i", "u", "ü"]
        elif self.file_lang == 'en':
            suffixes = ["s", "ed", "ing", "ly", "es"]
        elif self.file_lang == 'ru':
            suffixes = ["а", "я", "о", "е", "ы", "и", "й", "ом", "ем", "ах", "ях"] # Very basic
        elif self.file_lang == 'de':
            suffixes = ["en", "er", "es", "em", "te"]
        elif self.file_lang == 'fr':
            suffixes = ["s", "e", "es", "ent", "er"]
        else:
            return lower_word

        for suffix in sorted(suffixes, key=len, reverse=True):
            if lower_word.endswith(suffix):
                return lower_word[:-len(suffix)]
        return lower_word

    def calculate_coverage(self, text: str) -> float:
        """Percentage of words found in dictionary"""
        if not self.dictionary: return 1.0 # Pass if no dictionary
        
        words = self._tokenize(text)
        if not words: return 0.0
        
        valid_count = 0
        for w in words:
            if w.isdigit():
                valid_count += 1
                continue
                
            # Check exact match or stemmed match
            stem = self._simple_stem(w)
            if w.lower() in self.dictionary or stem in self.dictionary:
                valid_count += 1
            elif len(w) == 1: # Single letters usually OK (a, I, v, etc)
                 valid_count += 1
                
        return valid_count / len(words)

    def measure_vowel_loss(self, text: str) -> float:
        """
        Detects OCR failure pattern: 'smk', 'hmiyyti' (missing vowels).
        Returns ratio of suspicious words (len > 1 but no vowels).
        """
        words = self._tokenize(text)
        if not words: return 0.0
        
        if self.file_lang == 'az': vowels = self.VOWELS_AZ
        elif self.file_lang == 'ru': vowels = self.VOWELS_RU
        elif self.file_lang == 'de': vowels = self.VOWELS_DE
        elif self.file_lang == 'fr': vowels = self.VOWELS_FR
        else: vowels = self.VOWELS_EN
        
        suspicious_count = 0
        
        for w in words:
            if len(w) > 1 and not w.isdigit():
                # Abbreviations check (CM, KG, USA) -> OK
                if w.isupper() and len(w) <= 4:
                    continue
                    
                has_vowel = any(c in vowels for c in w)
                if not has_vowel:
                     suspicious_count += 1
                        
        return suspicious_count / len(words)

    def validate(self, text: str) -> Dict[str, Any]:
        """
        Primary Quality Gate Logic.
        Returns: { 'valid': bool, 'score': float, 'reason': str, 'details': dict }
        """
        # 1. Coverage Check
        coverage = self.calculate_coverage(text)
        
        # 2. Vowel Loss Check (Crucial for AZ OCR)
        vowel_loss = self.measure_vowel_loss(text)
        
        # 3. Decision Logic
        is_valid = True
        reason = "OK"
        
        if self.dictionary and coverage < self.MIN_COVERAGE:
            is_valid = False
            reason = f"Low Dictionary Coverage ({coverage:.2f})"
            
        if vowel_loss > self.MAX_VOWEL_LOSS:
            # Stricter for AZ
            if self.file_lang == 'az':
                is_valid = False
                reason = f"High Vowel Loss ({vowel_loss:.2f})"
            elif vowel_loss > 0.25: # Looser for others (acronyms etc)
                is_valid = False
                reason = f"High Vowel Loss ({vowel_loss:.2f})"
            
        # Composite Score (0.0 - 1.0)
        # Coverage contributes positively, vowel loss negatively
        score = (coverage * 0.7) + ((1.0 - vowel_loss) * 0.3)
        
        return {
            "valid": is_valid,
            "score": round(score, 3),
            "reason": reason,
            "details": {
                "coverage": round(coverage, 3),
                "vowel_loss": round(vowel_loss, 3)
            }
        }

if __name__ == "__main__":
    # Self-test
    val = DictionaryValidator(lang="az")
    
    good_text = "Azərbaycan Respublikasının Dövlət Himni. Zəfər günü mübarək olsun."
    bad_text = "Azrbaycn Respublksnn Dvlt Hmni. Zfr gn mbrk olsn." # Typical OCR fail
    
    print("\n--- GOOD TEXT ---")
    print(val.validate(good_text))
    
    print("\n--- BAD TEXT ---")
    print(val.validate(bad_text))
