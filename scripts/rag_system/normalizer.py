# normalizer.py
import unicodedata
import re
from hyphen_normalizer import HyphenNormalizer

class Normalizer:
    """
    Unicode normalization and whitespace cleaning.
    """
    def __init__(self):
        self.hyphen_normalizer = HyphenNormalizer()
        
    def normalize(self, text: str) -> str:
        if not text:
            return ""
            
        # 1. Unicode Normalization (NFKC is good for compatibility)
        text = unicodedata.normalize("NFKC", text)
        
        # 2. Join hyphens and line-breaks using hybrid normalizer
        text = self.hyphen_normalizer.normalize(text)
        
        # 3. Whitespace cleanup (tabs, multiple spaces, etc.)
        text = re.sub(r'[ \t]+', ' ', text)
        
        # 4. Standardize line breaks (after joining words)
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\n+', '\n', text)
        
        return text.strip()

    def join_hyphens(self, text: str) -> str:
        """Deprecated: Use HyphenNormalizer.normalize instead. Kept for backwards compatibility."""
        return self.hyphen_normalizer.normalize(text)
