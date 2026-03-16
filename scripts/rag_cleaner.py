# rag_cleaner.py

import re
import unicodedata

class RAGCleaner:
    def __init__(self):
        self.cyrillic_to_latin = {
            "а": "a", "е": "e", "о": "o", "р": "p",
            "с": "c", "у": "y", "х": "x", "м": "m",
            "к": "k", "В": "B", "Н": "H"
        }

    # =========================
    # Public API
    # =========================
    def clean(self, text: str) -> str:
        if not text:
            return ""

        text = self.normalize_unicode(text)
        text = self.fix_mojibake(text)
        text = self.fix_cyrillic_mix(text)
        text = self.remove_repetition_noise(text)
        text = self.fix_letter_spacing(text)
        text = self.fix_hyphenation(text)
        
        # Stage 7: Linguistic Fix (w -> vv for Azerbaijani)
        text = text.replace('w', 'vv').replace('W', 'VV')
        
        text = self.remove_layout_noise(text)
        text = self.normalize_whitespace(text)

        return text.strip()

    # =========================
    # Cleaning Steps
    # =========================
    def normalize_unicode(self, text):
        return unicodedata.normalize("NFKC", text)

    def fix_mojibake(self, text):
        """Fixes common encoding errors in OCR text (UTF-8 bytes interpreted as windows-1254/1252)"""
        if not text: return text
        
        # Example: "Ğ§Ñ‚Ğ¾" (Cyrillic CHTO in UTF-8 -> Windows-1254)
        try:
            # Detect if it looks like typical mojibake (contains Ğ, Ñ, etc. in a tight sequence)
            if re.search(r'[ĞÑĞğ]', text):
                # Attempt to repair: windows-1254 is common in AZ locale, then fallback to latin-1
                repair = text.encode('windows-1254', errors='ignore').decode('utf-8', errors='ignore')
                if len(repair) > len(text) * 0.4: # Simple sanity check
                    return repair
        except:
            pass
        return text

    def fix_cyrillic_mix(self, text):
        # Only replace if we see a clear MIX of scripts (Cyrillic + Latin)
        # and it's just a few characters.
        # This prevents breaking purely Russian text.
        
        # Count alphabetic characters
        latin_chars = len(re.findall(r'[a-zA-Z]', text))
        cyrillic_chars = len(re.findall(r'[а-яА-ЯёЁ]', text))
        
        # Heuristic: If it's mostly Cyrillic, don't touch it
        if cyrillic_chars > latin_chars * 2:
            return text
            
        for cyr, lat in self.cyrillic_to_latin.items():
            text = text.replace(cyr, lat)
        return text

    def remove_repetition_noise(self, text):
        # remove repeated characters like nnnnnnn
        # But be careful with German double letters like 'ss', 'mm', 'nn'
        # So we look for 4 or more repetitions
        return re.sub(r'(.)\1{4,}', r'\1', text)

    def fix_letter_spacing(self, text):
        # K e n n e n → Kennen
        return re.sub(
            r'(?:\b\w\s){3,}\w\b',
            lambda m: m.group(0).replace(" ", ""),
            text
        )

    def fix_hyphenation(self, text):
        # Standard hyphenation: word- word -> wordword
        return re.sub(r'(\w+)-\s+(\w+)', r'\1\2', text)

    def remove_layout_noise(self, text):
        # remove page numbers like 12 13 (isolated numbers)
        text = re.sub(r'\b\d{1,3}\s\d{1,3}\b', '', text)
        
        # remove isolated numbers that look like page numbers (1-3 digits)
        # But keep years like 1990 or larger numbers
        text = re.sub(r'\b\d{1,3}\b', '', text)
        return text

    def normalize_whitespace(self, text):
        return re.sub(r'\s+', ' ', text)
