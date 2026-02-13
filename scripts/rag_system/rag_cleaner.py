import re
import unicodedata

class RAGCleaner:
    """
    RAG üçün OCR və PDF mətni təmizləyən və normallaşdıran modul.
    """
    def __init__(self):
        # Kiril-Latın qarışıqlığı mapping
        self.cyrillic_to_latin = str.maketrans({
            "А": "A", "В": "B", "Е": "E", "К": "K",
            "М": "M", "Н": "H", "О": "O", "Р": "P",
            "С": "C", "Т": "T", "Х": "X",
            "а": "a", "е": "e", "о": "o",
            "р": "p", "с": "c", "у": "y", "х": "x",
            "м": "m", "к": "k", "ә": "ə" # Bəzən ə hərfi də qarışır
        })

    def clean(self, text: str) -> str:
        if not text:
            return ""

        text = unicodedata.normalize("NFKC", text)
        text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
        text = text.translate(self.cyrillic_to_latin)
        
        # Sətir sonu tireləri birləşdir
        text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
        text = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', text)
        
        # Hərf arası boşluqları düzəlt (m ə t n -> mətn)
        text = re.sub(
            r'(?:\b\w\s){3,}\w\b',
            lambda m: m.group(0).replace(" ", ""),
            text
        )
        
        # Təkrarlanan simvolları sil (nnnnnn -> n)
        text = re.sub(r'(.)\1{4,}', r'\1', text)
        
        # Artıq rəqəmləri (məs. səhifə nömrələri) təmizlə
        text = re.sub(r'\b\d{1,3}\b', '', text)
        
        # Boşluqları normallaşdır
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
