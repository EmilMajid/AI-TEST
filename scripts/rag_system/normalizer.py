# normalizer.py
import unicodedata
import re

class Normalizer:
    """
    Unicode normalization and whitespace cleaning.
    """
    def normalize(self, text: str) -> str:
        if not text:
            return ""
            
        # 1. Unicode Normalization (NFKC is good for compatibility)
        text = unicodedata.normalize("NFKC", text)
        
        # 2. Join hyphens (e.g., "tele- viziyası" -> "televiziyası")
        text = self.join_hyphens(text)
        
        # 3. Whitespace cleanup (tabs, multiple spaces, etc.)
        text = re.sub(r'[ \t]+', ' ', text)
        
        # 4. Standardize line breaks
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\n+', '\n', text)
        
        return text.strip()

    def join_hyphens(self, text: str) -> str:
        """Joins words split by hyphens (tele- viziyası -> televiziyası)"""
        # Case 1: Hyphen + whitespace (e.g. "tele- viziyası")
        text = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', text)
        # Case 2: Hyphen + newline (e.g. "tele-\nviziyası")
        text = re.sub(r'(\w+)-\n+(\w+)', r'\1\2', text)
        return text
