import os
import sys
import json
import logging
from pathlib import Path

# Add scripts and rag_system to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rag_system"))

from ederslik_extractor import EDerslikExtractor
from section_parser import SectionParser
from noise_remover import NoiseRemover

def ingest_grade8_html():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    # 1. Initialize Components
    ederslik_extractor = EDerslikExtractor()
    section_parser = SectionParser()
    noise_remover = NoiseRemover()

    base_dir = Path(__file__).parent.parent
    textbooks_json = base_dir / "data" / "textbooks.json"
    target_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    temp_jsonl = base_dir / "data" / "textbook-chunks_temp.jsonl"

    # 2. Load Grade 8 books
    with open(textbooks_json, "r", encoding="utf-8") as f:
        all_data = json.load(f)
    grade8_books = all_data.get("8", [])
    
    # 3. Setup Atomic Write (Copy existing to temp, excluding Grade 8 if any)
    existing_ids = set()
    if target_jsonl.exists():
        logger.info(f"[*] Preparing atomic temp file from {target_jsonl.name}...")
        with open(target_jsonl, "r", encoding="utf-8") as f_in, \
             open(temp_jsonl, "w", encoding="utf-8") as f_out:
            for line in f_in:
                try:
                    c = json.loads(line)
                    if str(c.get("grade")) != "8":
                        f_out.write(line)
                except:
                    f_out.write(line)

    # 4. Ingest Grade 8 HTML Books
    html_books = [b for b in grade8_books if b.get("type") == "ederslik_html"]
    logger.info(f"[*] Found {len(html_books)} HTML books to ingest for Grade 8.")

    total_chunks = 0
    for i, book in enumerate(html_books, 1):
        book_id = book['id']
        logger.info(f"[{i}/{len(html_books)}] Processing {book['title']} ({book_id})...")
        
        try:
            # A. Fetch from e-derslik
            pages = ederslik_extractor.fetch_book(book['e_derslik_id'])
            full_text = "\n".join([p['text'] for p in pages])
            
            # B. Noise Removal
            clean_text = noise_remover.remove_noise(full_text)
            
            # C. Section Parsing
            sections = section_parser.parse(clean_text, subject=book['subject'], is_html=True)
            logger.info(f"  [+] Found {len(sections)} sections.")
            
            # D. Write Chunks
            book_chunks = 0
            with open(temp_jsonl, "a", encoding="utf-8") as f:
                for sec in sections:
                    # RAG 2.0 Segment creation (simple version without embeddings)
                    # We create segments of ~800-1000 chars within each section
                    content = sec["content"]
                    # Basic chunking if content is too long
                    chunk_size = 1200
                    paragraphs = content.split('\n')
                    current_chunk = []
                    current_len = 0
                    
                    def save_chunk(text, s_title, seq_idx):
                        chunk_entry = {
                            "id": f"{book_id}_s{len(sections)}_{seq_idx}",
                            "book_id": book_id,
                            "grade": 8,
                            "subject": book["subject"],
                            "section": s_title,
                            "text": text.strip(),
                            "type": "ederslik_html",
                            "metadata": {"source": "e-derslik", "id": book['e_derslik_id']}
                        }
                        f.write(json.dumps(chunk_entry, ensure_ascii=False) + "\n")

                    seq_idx = 0
                    for p in paragraphs:
                        if current_len + len(p) > chunk_size and current_chunk:
                            save_chunk("\n".join(current_chunk), sec["title"], seq_idx)
                            current_chunk = []
                            current_len = 0
                            seq_idx += 1
                        current_chunk.append(p)
                        current_len += len(p)
                    
                    if current_chunk:
                        save_chunk("\n".join(current_chunk), sec["title"], seq_idx)
                        seq_idx += 1
                    
                    book_chunks += seq_idx
            
            logger.info(f"  [+] Saved {book_chunks} chunks.")
            total_chunks += book_chunks
            
        except Exception as e:
            logger.error(f"  [!] Failed {book_id}: {e}")

    # 5. Final Atomic Swap
    if total_chunks > 0:
        import shutil
        backup = target_jsonl.parent / f"{target_jsonl.stem}_backup.jsonl"
        if target_jsonl.exists():
            shutil.move(str(target_jsonl), str(backup))
        shutil.move(str(temp_jsonl), str(target_jsonl))
        logger.info(f"[*] SUCCESSFULLY integrated Grade 8. Total chunks: {total_chunks}")
    else:
        logger.warning("[!] No chunks generated. Check logs.")

if __name__ == "__main__":
    ingest_grade8_html()
