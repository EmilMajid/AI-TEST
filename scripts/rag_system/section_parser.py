
# section_parser.py
import re
from typing import List, Dict, Any

class SectionParser:
    """
    Intelligent document segmentation for Production RAG 2.0.
    Splits text based on semantic headers (Chapter, Section, Topic) rather than pages.
    """
    
    # Common header patterns for Azerbaijani and English textbooks
    HEADER_PATTERNS = [
        r'^\[\[HEADER:\s*(.+?)\]\]$',                       # NEW: Explicit markers from HTML extractor
        r'(?i)^(?:Fəsil|Bölmə|Mövzu|Dərs|DƏRS|BÖLMƏ|MÖVZU|FƏSİL|UNIT|Unit|Lesson|LESSON|§)\s+\d+[:.]?.*$', 
        r'^\d+(?:\.\d+)*\.\s+[A-ZƏÖÜÇŞĞIİ].{3,80}$',   # e.g. 1. Title or 1.1. Topic (Must have dot)
        r'^[A-ZƏÖÜÇŞĞIİ][A-ZƏÖÜÇŞĞIİ\s\d\.]{4,60}$',      # ALL CAPS
        r'(?i)^(?:Bölmə|BÖLMƏ|UNIT|Unit)\s+[IVXLCDM]+[:.]?.*$', # BÖLMƏ I or UNIT I
        r'(?i)^\d+[-]\w+\s+(?:fəsil|bölmə).*$',           # 1-ci fəsil
        r'^[A-ZƏÖÜÇŞĞIİ][a-zəöüçşğıiA-ZƏÖÜÇŞĞIİ\s\d\-\'\?\!]{8,45}(?<![\.\,\: \-\?])\s*$', # Stricter Mixed Case (min 8 chars)
        r'^§\s?.*$'                                       # Paragraph
    ]
    
    # Non-section titles that often appear in ALL CAPS or specific noise
    BLACKLIST_HEADERS = [
        "HEYDƏR ƏLİYEV AZƏRBAYCAN XALQININ ÜMUMMİLLİ LİDERİ",
        "HEYDƏR ƏLİYEVAZƏRBAYCAN XALQININ ÜMUMMİLLİ LİDERİ",
        "HEYDƏR ƏLİYEV",
        "AZƏRBAYCAN XALQININ ÜMUMMİLLİ LİDERİ",
        "ZAUR İSAYEV, MƏNSUR MƏHƏRRƏMOV, MƏHƏMMƏD KƏRİMOV",
        "GÜNAY HÜSEYNZADƏ, VÜQAR MUSAYEV, AQŞİN ABDULLAYEV",
        "ÜMUMİ TƏHSİL MÜƏSSİSƏLƏRİNİN 5-Cİ SİNİFLƏRİ ÜÇÜN",
        "STUDENT BOOK",
        "WORKBOOK",
        "TEACHER'S BOOK",
        "IN YOUR NOTEBOOK",
        "Listen and repeat",
        "Listen and check",
        "Read and listen",
        "Listen and write",
        "Read and complete",
        "Look at the picture",
        "Ask and answer",
        "Work in pairs",
        "Work in groups",
        "Talk to your partner",
        "Check your answers",
        "Copy the chart",
        "Match the questions",
        "Fill in the blanks",
        "Student Book",
        "Workbook",
        "BİLİRSİNİZMİ?",
        "BİLİRSİNİZMİ",
        "YADINIZA SALIN",
        "TAPŞIRIQ",
        "DİQQƏT",
        "ARAŞDIRMA",
        "MÜZAKİRƏ EDİN",
        "SÖZLÜK",
    ]
    
    def __init__(self):
        self.patterns = [re.compile(p) for p in self.HEADER_PATTERNS]

    def parse(self, text: str, subject: str = None, is_html: bool = False) -> List[Dict[str, Any]]:
        """
        Parses full document text into logical sections.
        Returns check-able blocks with metadata.
        
        is_html: If True, priorities [[HEADER: ...]] markers and suppresses weak regex patterns.
        """
        lines = text.split('\n')
        sections = []
        
        current_section = {
            "title": "Giriş", 
            "content": [],
            "level": 0
        }
        
        subject_lower = subject.lower() if subject else ""
        is_math_book = "riyaziyyat" in subject_lower or "math" in subject_lower
        
        skip_next_n_chars = 0
        
        for line_idx, line in enumerate(lines):
            stripped = line.strip()
            if not stripped:
                continue
                
            # Stage 6: Skip characters consumed by title hyphenation resolution
            if skip_next_n_chars > 0:
                if len(stripped) <= skip_next_n_chars:
                    skip_next_n_chars -= len(stripped)
                    continue
                else:
                    stripped = stripped[skip_next_n_chars:].strip()
                    skip_next_n_chars = 0
                    if not stripped: continue

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
                # Check for embedded headers in very long lines (OCR without newlines)
                is_strong_keyword = "UNIT" in stripped.upper() or "LESSON" in stripped.upper()
                if is_strong_keyword and len(stripped) > 100:
                    # Find embedded headers like "Numbers Lesson", "UNIT 1 Title"
                    match = re.search(r'\b((?:[A-Z][a-z]+\s+){0,4}(?:UNIT\s+\d+|Lesson|LESSON)\b(?:\s+[A-Z][a-z]+)*)', stripped)
                    if match:
                        header_text = match.group(0).strip()
                        # Exclude false positives like "a lesson"
                        if "a lesson" not in header_text.lower() and len(header_text) > 4:
                            before_text = stripped[:match.start()].strip()
                            after_text = stripped[match.end():].strip()
                            
                            if before_text:
                                current_section["content"].append(before_text)
                            
                            if current_section["content"]:
                                sections.append({
                                    "title": current_section["title"],
                                    "content": "\n".join(current_section["content"]),
                                    "level": 1
                                })
                            
                            current_section = {
                                "title": header_text,
                                "content": [after_text] if after_text else [],
                                "level": 1
                            }
                            is_header = True
                            continue # Successfully processed line with mid-line header

                for i, pattern in enumerate(self.patterns):
                    # HTML Mode heuristic: Only trust Marker (i=0) or Numbered headers (i=2, i=4) 
                    # as strong sources. Others are suppressed unless they are exceptionally clean.
                    if is_html and i not in [0, 2, 4]: 
                        # In HTML, weak patterns like ALL CAPS (3) or Mixed Case (6) 
                        # usually detect mid-sentence breaks. Marker is better.
                        if i in [3, 6]: continue 

                    match = pattern.match(stripped)
                    if len(stripped) < 150 and match:
                        title = stripped
                        
                        # Handle explicit markers from HTML extractor
                        if i == 0: # [[HEADER: ...]] is the first pattern
                            title = match.group(1).strip()
                        
                        # Stage 5/6: Clean hyphens from titles and pull next line if needed
                        if title.endswith('-'):
                            # Try to peek at the next non-empty line to complete the title
                            title_cont = ""
                            next_idx = line_idx + 1
                            while next_idx < len(lines):
                                next_line = lines[next_idx].strip()
                                if next_line:
                                    words = next_line.split()
                                    if words:
                                        title_cont = words[0]
                                        title = title[:-1] + title_cont
                                        # Mark this word to be skipped in the next iteration
                                        # (Simple heuristic: skip the length of the word in the next non-empty line)
                                        skip_next_n_chars = len(title_cont)
                                    break
                                next_idx += 1
                        
                        # Apply regex cleaning as well
                        title = re.sub(r'(\w+)-\s*$', r'\1', title)
                        
                        # Stage 3/5: Extra Validation
                        # 1. Don't allow questions as headers (usually discussion prompts)
                        if title.strip().endswith('?'):
                            is_header = False
                            continue
                            
                        # 2. Minimum length for non-official titles
                        # We check against extracted title, not the marked string
                        is_official = any(kw in title.lower() for kw in ['bölmə', 'mövzu', 'unit', 'dərs', 'fəsil', 'lesson', 'chapter'])
                        if not is_official and len(title.strip()) < 5: # Slightly more lenient min length for real topics
                            is_header = False
                            continue

                        # Domain-specific blacklist: Don't allow "Riyaziyyat" headings if this isn't a math book
                        if not is_math_book and "riyaziyyat" in title.lower():
                            is_header = False
                            continue
                        
                        # Save previous section if it has content
                        if current_section["content"]:
                            sections.append({
                                "title": current_section["title"],
                                "content": "\n".join(current_section["content"]),
                                "level": i + 1
                            })
                        
                        # Start new section
                        current_section = {
                            "title": title,
                            "content": [],
                            "level": i + 1
                        }
                        is_header = True
                        break
            
            if not is_header:
                # If a marked line was rejected by validation (e.g. too short or ending in '?'),
                # we must clean the marker before appending it as normal text.
                if stripped.startswith("[[HEADER:") and stripped.endswith("]]"):
                    clean_stripped = re.sub(r'^\[\[HEADER:\s*(.+?)\]\]$', r'\1', stripped)
                    
                    # Stage 5: If it's a single char (Drop Cap), merge with NEXT non-empty line
                    if len(clean_stripped) == 1:
                        current_section["content"].append(clean_stripped + "[[MERGE_NEXT]]")
                    else:
                        current_section["content"].append(clean_stripped)
                else:
                    # Stage 5: Handle syllabification hyphen in normal text that isn't clean_html_text'd yet
                    if stripped.endswith('-'):
                        current_section["content"].append(stripped[:-1] + "[[MERGE_NEXT]]")
                    else:
                        current_section["content"].append(stripped)
                
        # Append final section
        if current_section["content"]:
            # Stage 5: Handle [[MERGE_NEXT]] markers for Drop Caps and Hyphens
            processed_content = []
            current_buffer = ""
            for line in current_section["content"]:
                if line.endswith("[[MERGE_NEXT]]"):
                    current_buffer += line.replace("[[MERGE_NEXT]]", "")
                else:
                    if current_buffer:
                        processed_content.append(current_buffer + line.lstrip())
                        current_buffer = ""
                    else:
                        processed_content.append(line)
            
            # If buffer still has something (edge case)
            if current_buffer:
                processed_content.append(current_buffer)

            sections.append({
                "title": current_section["title"],
                "content": "\n".join(processed_content),
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
