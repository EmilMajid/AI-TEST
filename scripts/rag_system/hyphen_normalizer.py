import re

class HyphenNormalizer:
    """
    Azerbaijani OCR hyphenation cleaner for DUİS RAG pipeline.
    Implements a hybrid approach: Regex for deterministic cases and Heuristics for line breaks.
    """

    def __init__(self):
        # word-\nword → wordword
        # Using Azerbaijani alphabet extension
        self.az_alpha = "a-zA-ZçəğıöşüÇƏĞİÖŞÜ"
        self.hyphen_linebreak_pattern = re.compile(rf'([{self.az_alpha}]+)-\n+([{self.az_alpha}]+)')
        
        # Pattern for hyphen + optional spaces + newline + optional spaces
        self.complex_hyphen_pattern = re.compile(rf'([{self.az_alpha}]+)-\s*\n\s*([{self.az_alpha}]+)')

        # word\nword → heuristic merge (e.g. kitab\nxana -> kitabxana)
        self.linebreak_pattern = re.compile(rf'([{self.az_alpha}]+)\n+([{self.az_alpha}]+)')

    def fix_hyphen_linebreaks(self, text: str) -> str:
        """
        Fix cases like:
        güclən-\ndirilməsi → gücləndirilməsi
        """
        # First pass: standard word-\nword
        text = self.hyphen_linebreak_pattern.sub(r'\1\2', text)
        
        # Second pass: complex spacing word- \n part
        text = self.complex_hyphen_pattern.sub(r'\1\2', text)
        
        return text

    def fix_simple_linebreaks(self, text: str) -> str:
        """
        Fix cases where words are split by newline WITHOUT hyphen:
        kitab\nxana → kitabxana (heuristic)
        mühüm\nrol → mühüm rol
        """
        def replacer(match):
            left, right = match.groups()

            # Heuristic 1: If it's a very short part on the left/right, it's likely a split
            # Heuristic 2: If the right part is not a capitalized start of a sentence
            # Heuristic 3: Azerbaijani specific: if it's a common suffix or split word
            
            # Simple length-based heuristic from user proposal
            if len(left) <= 3 or len(right) <= 3:
                # Common short words in AZ that SHOULD be separate: "və", "ilə", "nə", "ki"
                if left.lower() in ["və", "ilə", "nə", "ki", "mən", "sən", "o", "biz", "siz", "on"]:
                    return left + "\n" + right
                return left + right

            # If the next word is lowercase, it's very likely a continuation
            if right[0].islower():
                return left + right

            return left + "\n" + right

        return self.linebreak_pattern.sub(replacer, text)

    def normalize(self, text: str) -> str:
        if not text:
            return ""
            
        # Step 1: Fix explicit hyphens at line breaks
        text = self.fix_hyphen_linebreaks(text)
        
        # Step 2: Fix words split across lines without hyphen
        text = self.fix_simple_linebreaks(text)

        # Final cleanup of extraneous whitespace preserved within strings
        # (Though we might want to keep single newlines for paragraph structure, 
        # the RAG often prefers normalized sentences)
        # We'll normalize to single spaces as per user example OUTPUT
        text = re.sub(r'\s+', ' ', text)

        return text.strip()

if __name__ == "__main__":
    # Test cases
    hn = HyphenNormalizer()
    test_text = """dövlətin
güclən-
dirilməsi mühüm
rol oy-
namışdır
kitab
xana"""
    print(f"Input:\n{test_text}")
    print(f"Output:\n{hn.normalize(test_text)}")
