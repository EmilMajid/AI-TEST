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
        self.base_url_template = "https://www.e-derslik.edu.az/books/{book_id}/units/unit-1/page{page_num}.xhtml"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def fetch_book(self, e_derslik_id: str, max_pages: int = 300) -> List[Dict]:
        """
        Iteratively fetches all XHTML pages for a given e-derslik book ID.
        Stops when it hits 3 consecutive 404s or empty pages.
        """
        self.logger.info(f"Starting direct HTML extraction for e-derslik ID: {e_derslik_id}")
        extracted_pages = []
        consecutive_failures = 0
        
        for page_num in range(1, max_pages + 1):
            url = self.base_url_template.format(book_id=e_derslik_id, page_num=page_num)
            
            try:
                req = urllib.request.Request(url, headers=self.headers)
                with urllib.request.urlopen(req, timeout=10) as response:
                    html_content = response.read().decode('utf-8')
                    
                    text = self._parse_xhtml(html_content)
                    
                    if text.strip():
                        extracted_pages.append({
                            "page": page_num,
                            "text": text,
                            "type": "html",
                            "ocr_used": False,
                            "quality_score": 1.0  # HTML source is considered pristine
                        })
                        self.logger.info(f"  [+] Page {page_num} extracted successfully ({len(text)} chars)")
                        consecutive_failures = 0
                    else:
                        # Some pages are just image wrappers with no text
                        self.logger.info(f"  [-] Page {page_num} is essentially empty or an image wrapper")
                        consecutive_failures += 1
                        
            except urllib.error.HTTPError as e:
                self.logger.warning(f"  [!] HTTP Error on Page {page_num}: {e.code}")
                # 404 means page doesn't exist
                if e.code == 404:
                    consecutive_failures += 1
            except Exception as e:
                self.logger.error(f"  [X] Unexpected Error on Page {page_num}: {e}")
                consecutive_failures += 1
                
            # Stop condition: 3 failures in a row usually marks the end of the book
            if consecutive_failures >= 3:
                self.logger.info(f"Triggered stop condition: {consecutive_failures} consecutive empty/missing pages.")
                break
                
            time.sleep(0.3) # Be nice to the server
            
        self.logger.info(f"Completed extraction for ID {e_derslik_id}. Total pages with content: {len(extracted_pages)}")
        return extracted_pages
        
    def _parse_xhtml(self, html_content: str) -> str:
        """
        Parses XHTML and extracts clean text while ignoring scripts, styles, etc.
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove unwanted tags
        for tag in soup(['script', 'style', 'head', 'title', 'meta', 'link']):
            tag.decompose()
            
        # Extract text, replacing multiple spaces/newlines with single spaces
        text = ' '.join(soup.stripped_strings)
        return text

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    extractor = EDerslikExtractor()
    # Test with just 5 pages
    result = extractor.fetch_book(e_derslik_id="690", max_pages=5)
    print(f"Extracted {len(result)} pages.")
    if result:
        print("Sample:", result[0]['text'][:200])
