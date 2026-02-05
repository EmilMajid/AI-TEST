import os
import json
import shutil
import sys
from bs4 import BeautifulSoup

class DuisChunker:
    def __init__(self, output_base="data/chunks"):
        self.output_base = output_base
        if sys.stdout.encoding != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8')

    def chunk_html_textbook(self, textbook_dir, topics_map):
        """Standard HTML/EPUB chunking based on toc.xhtml"""
        # ... (implementation moved to a more generic caller) ...
        return self.chunk(textbook_dir, topics_map)

    def chunk(self, textbook_dir, topics_map):
        """Unified chunking entry point"""
        book_id = os.path.basename(textbook_dir)
        target_dir = os.path.join(self.output_base, book_id)
        os.makedirs(target_dir, exist_ok=True)
        
        t_type = topics_map.get("type")
        if t_type == "html":
            return self._chunk_html(target_dir, topics_map)
        elif t_type == "manual":
            return self._chunk_manual(target_dir, textbook_dir, topics_map)
        else:
            print(f"  [CHUNKER ERROR] Unsupported type: {t_type}")
            return False

    def _chunk_html(self, target_dir, topics_map):
        toc_path = topics_map.get("source")
        if not toc_path or not os.path.exists(toc_path):
            return False

        with open(toc_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            
        nav = soup.find("nav", {"epub:type": "toc"}) or soup.find("ol") or soup.find("ul")
        chunks_created = 0
        if nav:
            links = nav.find_all("a")
            for idx, link in enumerate(links):
                title = link.get_text(strip=True)
                href = link.get("href", "")
                if not href or "cover" in href.lower(): continue
                rel_path = href.split("#")[0]
                source_file = os.path.join(os.path.dirname(toc_path), rel_path)
                if os.path.exists(source_file):
                    safe_title = "".join([c if c.isalnum() else "_" for c in title])
                    chunk_path = os.path.join(target_dir, f"{idx:03d}_{safe_title}.txt")
                    with open(source_file, "r", encoding="utf-8") as sf:
                        text = BeautifulSoup(sf, "html.parser").get_text(separator="\n", strip=True)
                    with open(chunk_path, "w", encoding="utf-8") as cf:
                        cf.write(f"TITLE: {title}\nSOURCE: {rel_path}\n\n{text}")
                    chunks_created += 1
        return chunks_created > 0

    def _chunk_manual(self, target_dir, textbook_dir, topics_map):
        """Chunking for scanned books using page maps"""
        t_map = topics_map.get("map") # { Title: StartPage }
        topics = topics_map.get("topics")
        if not t_map or not topics: return False

        chunks_created = 0
        for idx, title in enumerate(topics):
            start_page = t_map.get(title)
            if start_page is None: continue
            
            # Find end page (next topic's start - 1)
            end_page = 999 
            if idx < len(topics) - 1:
                end_page = t_map.get(topics[idx+1], 999) - 1
            
            # Asset search depth (History 8 uses a subfolder structure)
            content_references = []
            for p_num in range(start_page, end_page + 1):
                # Search for pages in assets/img/pageN/ or similar
                # We'll support standard patterns found in trims assets
                patterns = [
                    f"azerbaycan-tarixi-8-az/assets/img/page{p_num}/1.jpg",
                    f"azerbaycan-tarixi-8-az/assets/img/page{p_num}/1.PNG",
                    f"assets/img/page{p_num}/1.jpg"
                ]
                for p in patterns:
                    full_p = os.path.join(textbook_dir, p)
                    if os.path.exists(full_p):
                        content_references.append(f"IMAGE_PATH: {p}")
                        break
            
            if content_references:
                safe_title = "".join([c if c.isalnum() else "_" for c in title])
                chunk_path = os.path.join(target_dir, f"{idx:03d}_{safe_title}.txt")
                with open(chunk_path, "w", encoding="utf-8") as cf:
                    cf.write(f"TITLE: {title}\nSOURCE: MANAUL_RESCUE\nMODE: SCANNED_IMAGES\n\n")
                    cf.write("\n".join(content_references))
                chunks_created += 1
        return chunks_created > 0

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python chunker.py <textbook_dir> <topics_json_path>")
        sys.exit(1)
        
    with open(sys.argv[2], "r", encoding="utf-8") as f:
        tmap = json.load(f)
        
    chunker = DuisChunker()
    chunker.chunk_html_textbook(sys.argv[1], tmap)
