
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
        r'^\d+(\.\d+){1,3}\.?\s+[A-ZƏÖÜÇŞĞIİ].{3,100}$',   # e.g. 1.1 Topic
        r'^[A-ZƏÖÜÇŞĞIİ][A-ZƏÖÜÇŞĞIİ\s\d\.]{4,60}$',      # ALL CAPS (e.g. SÖZÜN QÜDRƏTİ)
        r'(?i)^(?:Bölmə|BÖLMƏ)\s+[IVXLCDM]+[:.]?.*$',     # BÖLMƏ I
        r'(?i)^\d+[-]\w+\s+(?:fəsil|bölmə).*$',           # 1-ci fəsil
        r'^[A-ZƏÖÜÇŞĞIİ][a-zəöüçşğıiA-ZƏÖÜÇŞĞIİ\s\d\-]{4,45}(?<![\.\!\?\,\: \-])\s*$', # Mixed Case title (Strict)
        r'^§\s?.*$'                                       # Paragraph
    ]
    
    # Non-section titles that often appear in ALL CAPS on page 1/2
    BLACKLIST_HEADERS = [
        "HEYDƏR ƏLİYEV AZƏRBAYCAN XALQININ ÜMUMMİLLİ LİDERİ",
        "HEYDƏR ƏLİYEVAZƏRBAYCAN XALQININ ÜMUMMİLLİ LİDERİ",
        "HEYDƏR ƏLİYEV",
        "AZƏRBAYCAN XALQININ ÜMUMMİLLİ LİDERİ",
        "ZAUR İSAYEV, MƏNSUR MƏHƏRRƏMOV, MƏHƏMMƏD KƏRİMOV",
        "GÜNAY HÜSEYNZADƏ, VÜQAR MUSAYEV, AQŞİN ABDULLAYEV",
        "ÜMUMİ TƏHSİL MÜƏSSİSƏLƏRİNİN 5-Cİ SİNİFLƏRİ ÜÇÜN",
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
            
            # Skip blacklisted phrases or noise (more aggressive check)
            is_noise = (
                any(phrase in stripped for phrase in self.BLACKLIST_HEADERS) or
                "trims.edu.az" in stripped.lower() or
                "creative commons" in stripped.lower() or
                "lisenziyası" in stripped.lower() or
                "bütün hüquqlar" in stripped.lower() or
                "nəşriyyat" in stripped.lower() or
                "müəllif" in stripped.lower()
            )

            if is_noise:
                is_header = False
            else:
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
