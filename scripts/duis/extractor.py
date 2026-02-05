import os
import json
import fitz
import sys
from bs4 import BeautifulSoup

# Force UTF-8 for Windows terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

class DuisExtractor:
    def __init__(self):
        pass

    def extract_html_toc(self, toc_path):
        if not os.path.exists(toc_path):
            return []
        
        with open(toc_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
        
        topics = []
        # Standard EPUB 3 toc.xhtml structure
        nav_ol = soup.find("nav", {"epub:type": "toc"})
        if not nav_ol:
            # Fallback for older styles
            nav_ol = soup.find("ol") or soup.find("ul")
            
        if nav_ol:
            items = nav_ol.find_all("li")
            for item in items:
                link = item.find("a")
                if link:
                    title = link.get_text(separator=" ", strip=True)
                    href = link.get("href", "")
                    if title and "cover" not in href.lower() and "nav" not in href.lower():
                        topics.append(title)
        return topics

    def extract_pdf_toc(self, pdf_path):
        if not os.path.exists(pdf_path):
            return []
        
        try:
            doc = fitz.open(pdf_path)
            toc = doc.get_toc() # [[lvl, title, page], ...]
            # Filter for Level 1 (Chapters) and Level 2 (Subtopics)
            topics = [item[1] for item in toc if item[0] <= 2]
            doc.close()
            return topics
        except Exception as e:
            print(f"  [PDF ERROR] {pdf_path}: {e}")
            return []

    def get_topics(self, textbook_dir):
        """Unified entry point for automated extraction"""
        
        # Priority 0: Manual/Rescue topics.json (Vision-AI result or manual fix)
        manual_path = os.path.join(textbook_dir, "topics.json")
        if os.path.exists(manual_path):
            with open(manual_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {"type": "manual", "topics": data["topics"], "source": manual_path, "map": data.get("map")}

        # Priority 1: HTML/EPUB TOC
        html_toc_paths = [
            os.path.join(textbook_dir, "OEBPS", "toc.xhtml"),
            os.path.join(textbook_dir, "toc.xhtml"),
            os.path.join(textbook_dir, "OEBPS", "nav.xhtml")
        ]
        
        for p in html_toc_paths:
            topics = self.extract_html_toc(p)
            if topics:
                return {"type": "html", "topics": topics, "source": p}
        
        # Priority 2: PDF Bookmarks
        pdf_path = os.path.join(textbook_dir, "book.pdf")
        if os.path.exists(pdf_path):
            topics = self.extract_pdf_toc(pdf_path)
            if topics:
                return {"type": "pdf", "topics": topics, "source": pdf_path}
            
        return None

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python extractor.py <textbook_directory>")
        sys.exit(1)
        
    ext = DuisExtractor()
    res = ext.get_topics(sys.argv[1])
    if res:
        print(json.dumps(res, indent=2, ensure_ascii=False))
    else:
        print("No topics found via standard extraction.")
