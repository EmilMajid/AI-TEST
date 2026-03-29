# rag_cleaner.py

import re
import unicodedata
import os
import sys
from pathlib import Path

# Ensure we can import from rag_system subdirectory
scripts_dir = Path(__file__).parent
sys.path.append(str(scripts_dir / "rag_system"))

from hyphen_normalizer import HyphenNormalizer

class RAGCleaner:
    def __init__(self):
        self.cyrillic_to_latin = {
            "а": "a", "е": "e", "о": "o", "р": "p",
            "с": "c", "у": "y", "х": "x", "м": "m",
            "к": "k", "В": "B", "Н": "H"
        }
        self.hyphen_normalizer = HyphenNormalizer()

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
        
        # Use the hybrid Hyphen Normalizer (Regex + Heuristics)
        text = self.hyphen_normalizer.normalize(text)
        
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
        """Fixes common encoding errors in OCR text (UTF-8 bytes interpreted as windows-1254/1252).
        Tuned to avoid false positives on valid Azerbaijani characters.
        """
        if not text: return text
        
        # Refined pattern: Look for specific multi-byte combinations often seen in mojibake
        # like high-entropy non-ASCII sequences, excluding single valid AZ characters.
        # TRIGGER: Sequence of 2+ high-ANSI characters (typical of misinterpreted UTF-8)
        if re.search(r'[\xc0-\xff]{2,}', text.encode('latin-1', errors='ignore').decode('latin-1')):
            try:
                # Only attempt repair if we suspect true encoding corruption
                # Safe-pass: if text already contains common AZ chars, be cautious
                if 'ə' in text or 'Ə' in text:
                    # If 'ə' is already there, it's likely already UTF-8 or correctly decoded.
                    # Don't risk a repair that might use errors='ignore'.
                    return text
                    
                repair = text.encode('windows-1254', errors='ignore').decode('utf-8', errors='ignore')
                if len(repair) > len(text) * 0.8: # Stricter sanity check
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

    def remove_layout_noise(self, text):
        # remove page numbers like 12 13 (isolated numbers)
        text = re.sub(r'\b\d{1,3}\s\d{1,3}\b', '', text)
        
        # remove isolated numbers that look like page numbers (1-3 digits)
        # But keep years like 1990 or larger numbers
        text = re.sub(r'\b\d{1,3}\b', '', text)
        return text

    def normalize_whitespace(self, text):
        # Basic space normalization (replaces any remaining multi-space gaps)
        return re.sub(r'\s+', ' ', text)
