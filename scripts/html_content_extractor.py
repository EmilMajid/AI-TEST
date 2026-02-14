"""
HTML Content Extractor for EPUB/HTML textbooks
Extracts text content from HTML/XHTML files in textbook directories
"""
from bs4 import BeautifulSoup
from pathlib import Path
import re
import logging
from typing import List, Dict, Any

class HTMLContentExtractor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)
    
    def clean_html_text(self, text: str) -> str:
        """Clean extracted HTML text"""
        # Remove excessive whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r' +', ' ', text)
        
        # Remove common HTML artifacts
        text = text.replace('\xa0', ' ')  # Non-breaking space
        text = text.replace('\u200b', '')  # Zero-width space
        
        return text.strip()
    
    def extract_html_file(self, html_path: Path) -> Dict[str, Any]:
        """Extract content from a single HTML/XHTML file"""
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
                soup = BeautifulSoup(content, 'html.parser')
            
            # Remove script, style, and navigation elements
            for element in soup(['script', 'style', 'nav', 'header', 'footer']):
                element.decompose()
            
            # Extract text
            text = soup.get_text(separator='\n', strip=True)
            text = self.clean_html_text(text)
            
            # Find images
            images = []
            for img in soup.find_all('img'):
                src = img.get('src')
                if src:
                    # Resolve relative path
                    img_path = (html_path.parent / src).resolve()
                    if img_path.exists():
                        images.append(str(img_path))
            
            # Heuristic for image-only pages (e.g. Grade 8 foreign languages)
            is_image_only = len(text) < 100 and len(images) > 0
            
            # Only return if there's substantial content OR it's an image-only page
            if len(text) > 100 or is_image_only:
                return {
                    "file": html_path.name,
                    "text": text,
                    "type": "html",
                    "length": len(text),
                    "images": images,
                    "is_image_only": is_image_only
                }
        except Exception as e:
            self.logger.warning(f"Failed to extract {html_path.name}: {e}")
        
        return None
    
    def extract_html_book(self, html_dir: Path, subject: str = "Ümumi") -> List[Dict[str, Any]]:
        """
        Extract content from HTML/EPUB textbook directory
        
        Args:
            html_dir: Path to the textbook directory
            subject: Subject name for logging
            
        Returns:
            List of content dictionaries
        """
        self.logger.info(f"Extracting HTML book from: {html_dir}")
        
        # Find all HTML/XHTML files
        html_files = []
        for pattern in ['**/*.xhtml', '**/*.html', '**/*.htm']:
            html_files.extend(html_dir.glob(pattern))
        
        # Filter out cover and navigation files
        exclude_keywords = ['cover', 'nav', 'toc', 'copyright', 'title']
        html_files = [
            f for f in html_files 
            if not any(keyword in f.name.lower() for keyword in exclude_keywords)
        ]
        
        # Sort files for consistent ordering
        html_files = sorted(html_files)
        
        self.logger.info(f"Found {len(html_files)} HTML files to process")
        
        content = []
        for html_file in html_files:
            extracted = self.extract_html_file(html_file)
            if extracted:
                content.append(extracted)
        
        self.logger.info(f"Successfully extracted {len(content)} files with content")
        
        return content
    
    def extract_with_page_numbers(self, html_dir: Path, subject: str = "Ümumi") -> List[Dict[str, Any]]:
        """
        Extract content with simulated page numbers
        
        This method extracts HTML content and assigns sequential page numbers
        to maintain compatibility with the existing chunking system.
        """
        content = self.extract_html_book(html_dir, subject)
        
        # Add page numbers
        for i, item in enumerate(content, 1):
            item['page'] = i
        
        return content

if __name__ == "__main__":
    # Test the extractor
    import sys
    if len(sys.argv) > 1:
        test_dir = Path(sys.argv[1])
        extractor = HTMLContentExtractor()
        content = extractor.extract_html_book(test_dir)
        print(f"\nExtracted {len(content)} content items")
        if content:
            print(f"First item preview: {content[0]['text'][:200]}...")
