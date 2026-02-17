# auto_language_correction.py
import re
from typing import Dict, Optional

class AutoLanguageCorrector:
    """
    Advanced language recovery for Azerbaijani.
    Uses pattern-based probabilistic restoration for common word structures.
    """
    def __init__(self, default_lang="az"):
        self.default_lang = default_lang
        # Skeleton -> Full word
        self.skeletons: Dict[str, str] = {
            "mktb": "məktəb",
            "hzrlq": "hazırlıq",
            "flyyt": "fəaliyyət",
            "trby": "tərbiyə",
            "thsl": "təhsil",
            "mthsl": "təhsil",
            "qd": "qədər",
            "v": "və",
            "hrkt": "hərəkət",
            "msl": "məsələ",
            "xsusyyt": "xüsusiyyət",
            "vzf": "vəzifə",
            "vait": "vasitə",
            "blm": "bölmə",
            "nki f": "inkişaf",
            "hmiyy": "əhəmiyyət",
            "hmiyyt": "əhəmiyyət",
            "smk": "sümük",
            "snq": "sınıq",
            "ntic": "nəticə",
            "hyat": "həyat",
            "brpa": "bərpa",
            "kmk": "kömək",
            "vziyyt": "vəziyyət",
            "mzakir": "müzakirə",
        }

    def detect_language(self, text: str) -> str:
        # Simple heuristic: Azerbaijani characters or common words
        az_chars = len(re.findall(r'[əöüçşğıƏÖÜÇŞĞİ]', text))
        ru_chars = len(re.findall(r'[а-яА-Я]', text))
        
        if az_chars > 0 or " və " in text or " olan " in text:
            return "az"
        if ru_chars > 5:
            return "ru"
        return "en"

    def correct(self, text: str, lang: str = "az") -> str:
        if lang != "az":
            return text
            
        # 1. Standardize vowels to remove for skeleton generation
        vowels_pattern = r'[aeiouəöüıiAEIOUƏÖÜİI]'
        
        words = text.split()
        corrected_words = []
        
        for word in words:
            # Clean alphabetic part but keep Azerbaijani letters
            clean_word = re.sub(r'[^a-zA-ZəöüçşğıƏÖÜÇŞĞİ]', '', word)
            
            # Get skeleton
            skeleton = re.sub(vowels_pattern, '', clean_word).lower()
            
            # Check if it's a known skeleton and really missing chars
            if skeleton in self.skeletons:
                target = self.skeletons[skeleton]
                if len(clean_word) < len(target):
                    # Replace word with target, preserving case simple
                    corrected = target
                    if word and word[0].isupper():
                        corrected = corrected.capitalize()
                    
                    # Try to keep original punctuation if it was at the end
                    punct = re.search(r'[^a-zA-ZəöüçşğıƏÖÜÇŞĞİ]+$', word)
                    if punct:
                        corrected += punct.group()
                    
                    corrected_words.append(corrected)
                    continue
            
            corrected_words.append(word)
                
        return " ".join(corrected_words)
