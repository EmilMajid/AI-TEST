import urllib.request
from bs4 import BeautifulSoup
import time
import logging
from typing import List, Dict

class EDerslikExtractor:
    """
    Extracts high-quality HTML text directly from e-derslik.edu.az, 
    bypassing the need for OCR on messy PDFs.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    def fetch_book(self, e_derslik_id: str, max_total_pages: int = 400) -> List[Dict]:
        """
        Iteratively fetches all XHTML pages for a given e-derslik book ID across all units.
        """
        self.logger.info(f"Starting direct HTML extraction for e-derslik ID: {e_derslik_id}")
        extracted_pages = []
        total_pages_count = 0
        
        # Iterate through possible units (usually 1-15)
        for unit_num in range(1, 21):
            unit_had_content = False
            consecutive_failures = 0
            self.logger.info(f"  [*] Probing Unit {unit_num}...")
            
            for page_num in range(1, 201):
                url = f"https://www.e-derslik.edu.az/books/{e_derslik_id}/units/unit-{unit_num}/page{page_num}.xhtml"
                
                try:
                    req = urllib.request.Request(url, headers=self.headers)
                    with urllib.request.urlopen(req, timeout=10) as response:
                        html_content = response.read() # Read as bytes
                        text = self._parse_xhtml(html_content)
                        
                        if text.strip():
                            total_pages_count += 1
                            extracted_pages.append({
                                "page": total_pages_count, # Sequential page number for the whole book
                                "text": text,
                                "type": "html",
                                "ocr_used": False,
                                "quality_score": 1.0
                            })
                            self.logger.info(f"    [+] Unit {unit_num} Page {page_num} -> Book Page {total_pages_count} ({len(text)} chars)")
                            unit_had_content = True
                            consecutive_failures = 0
                        else:
                            self.logger.info(f"    [-] Unit {unit_num} Page {page_num} is empty/image")
                            consecutive_failures += 1
                            
                except urllib.error.HTTPError as e:
                    if e.code == 404:
                        consecutive_failures += 1
                    else:
                        self.logger.warning(f"    [!] HTTP Error on Unit {unit_num} Page {page_num}: {e.code}")
                        consecutive_failures += 1
                except Exception as e:
                    self.logger.error(f"    [X] Error on Unit {unit_num} Page {page_num}: {e}")
                    consecutive_failures += 1
                
                # If we hit 15 failures in a row in a unit, we assume the unit or book is over
                if consecutive_failures >= 15:
                    break
                    
                if total_pages_count >= max_total_pages:
                    break
                
                time.sleep(0.1)
            
            # If a unit had NO content at all, and it's not the first unit, the book might be over
            if not unit_had_content and unit_num > 1:
                self.logger.info(f"  [-] Unit {unit_num} had no content. Stopping book search.")
                break
                
            if total_pages_count >= max_total_pages:
                break
                
        self.logger.info(f"Completed extraction for ID {e_derslik_id}. Total pages with content: {len(extracted_pages)}")
        return extracted_pages
        
    def _parse_xhtml(self, html_content: str) -> str:
        """
        Parses XHTML and extracts clean text while ignoring scripts, styles, etc.
        Identifies and marks headers for better SectionParser accuracy.
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove unwanted tags
        for tag in soup(['script', 'style', 'head', 'title', 'meta', 'link']):
            tag.decompose()
            
        # Extract text using a more semantic approach by adding newlines between blocks
        # No extra newlines for bold tags - causes vertical text in some books


        for br in soup.find_all("br"):
            br.replace_with("\n")
            
        blocks = []
        # Common block-level tags in XHTML that should start a new line
        # We explicitly track headers to mark them
        header_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        content_tags = ['p', 'div', 'li', 'tr', 'title', 'meta', 'td']
        target_tags = header_tags + content_tags
        
        # Find all target tags, but only keep those that are NOT inside another target tag
        for tag in soup.find_all(target_tags):
            # Check if this tag has an ancestor that is also a target tag
            has_nested_ancestor = False
            for parent in tag.parents:
                if parent.name in target_tags:
                    has_nested_ancestor = True
                    break
            
            if not has_nested_ancestor:
                # Is it a header?
                is_header = False
                if tag.name in header_tags:
                    is_header = True
                
                # Check for class-based headers (common in some textbooks)
                classes = tag.get('class', [])
                if any(c.lower() in ['title', 'heading', 'chapter-title', 'topic-title'] for c in classes):
                    is_header = True

                # Use newline separator
                text_part = tag.get_text(separator='\n', strip=True)
                if text_part:
                    # Split into lines
                    lines = [l.strip() for l in text_part.split('\n') if l.strip()]
                    
                    if is_header and lines:
                        # Join multi-line headers into one marked header
                        full_header = " ".join(lines)
                        blocks.append(f"[[HEADER: {full_header}]]")
                    else:
                        blocks.extend(lines)
                
        # If no top-level blocks found using tags, fallback to stripped_strings
        if not blocks:
            text = '\n'.join(soup.stripped_strings)
        else:
            text = '\n'.join(blocks)
            
        return text.strip()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    extractor = EDerslikExtractor()
    # Test with just 5 pages
    result = extractor.fetch_book(e_derslik_id="690", max_pages=5)
    print(f"Extracted {len(result)} pages.")
    if result:
        print("Sample:", result[0]['text'][:200])
