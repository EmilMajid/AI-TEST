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
        text = self.fix_cyrillic_mix(text)
        text = self.remove_repetition_noise(text)
        text = self.fix_letter_spacing(text)
        text = self.fix_hyphenation(text)
        text = self.remove_layout_noise(text)
        text = self.normalize_whitespace(text)

        return text.strip()

    # =========================
    # Cleaning Steps
    # =========================
    def normalize_unicode(self, text):
        return unicodedata.normalize("NFKC", text)

    def fix_cyrillic_mix(self, text):
        # Only apply if text seems to be German/English but has Cyrillic chars
        # Simple heuristic: if mixed script
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
