
# section_parser.py
import re
from typing import List, Dict, Any

class SectionParser:
    """
    Intelligent document segmentation for Production RAG 2.0.
    Splits text based on semantic headers (Chapter, Section, Topic) rather than pages.
    """
    
    # Common header patterns for Azerbaijani textbooks (Expanded for RAG 2.0 with İ)
    HEADER_PATTERNS = [
        r'(?i)^(?:Fəsil|Bölmə|Mövzu|Dərs|DƏRS|BÖLMƏ|MÖVZU|FƏSİL|§)\s+\d+[:.]?.*$', 
        r'^\d+(\.\d+){1..3}\.?\s+[A-ZƏÖÜÇŞĞIİ].{3,100}$',   # Added İ
        r'^[A-ZƏÖÜÇŞĞIİ\s\d\.]{5,80}$',                    # Added İ
        r'(?i)^(?:Bölmə|BÖLMƏ)\s+[IVXLCDM]+[:.]?.*$',     # BÖLMƏ I, II
        r'^§\s?.*$'                                       # Paragraph symbol section
    ]
    
    def __init__(self):
        self.patterns = [re.compile(p) for p in self.HEADER_PATTERNS]

    def parse(self, text: str) -> List[Dict[str, Any]]:
        """
        Parses full document text into logical sections.
        Returns check-able blocks with metadata.
        """
        lines = text.split('\n')
        sections = []
        
        current_section = {
            "title": "Giriş", 
            "content": [],
            "level": 0
        }
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
                
            is_header = False
            for i, pattern in enumerate(self.patterns):
                # Heuristic: Header must be short (< 100 chars) and match pattern
                if len(stripped) < 100 and pattern.match(stripped):
                    # Save previous section if it has content
                    if current_section["content"]:
                        sections.append({
                            "title": current_section["title"],
                            "content": "\n".join(current_section["content"]),
                            "level": i + 1
                        })
                    
                    # Start new section
                    current_section = {
                        "title": stripped,
                        "content": [],
                        "level": i + 1
                    }
                    is_header = True
                    break
            
            if not is_header:
                current_section["content"].append(stripped)
                
        # Append final section
        if current_section["content"]:
            sections.append({
                "title": current_section["title"],
                "content": "\n".join(current_section["content"]),
                "level": current_section["level"]
            })
            
        return sections

    def combine_pages(self, pages: List[Dict[str, Any]]) -> str:
        """
        Combines page dictionaries into a single text stream for parsing.
        """
        full_text = []
        for p in pages:
            # We enforce double newline between pages to separate paragraphs clearly
            full_text.append(p.get('text', ''))
        return "\n\n".join(full_text)

if __name__ == "__main__":
    # Test
    parser = SectionParser()
    sample_text = """
    Mövzu 1. Təbiət elmləri
    
    Təbiət elmləri bizi əhatə edən aləmi öyrənir.
    Bu elmlərə fizika, kimya, biologiya daxildir.
    
    1.1 Fizika nədir?
    
    Fizika maddi aləmin ümumi qanunauyğunluqlarını öyrənir.
    Fizika təbiət hadisələrinin səbəblərini araşdırır.
    
    Bölmə 2. Canlı orqanizmlər
    
    Canlı orqanizmlər hüceyrələrdən təşkil olunub.
    """
    
    sections = parser.parse(sample_text)
    for s in sections:
        print(f"[{s['level']}] {s['title']}")
        print(f"Content: {len(s['content'])} chars")
        print("-" * 20)
