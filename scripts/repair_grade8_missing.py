import os
import sys
import json
import logging
from pathlib import Path

# Add scripts and rag_system to path
sys.path.append(os.path.join(os.getcwd(), "scripts"))
sys.path.append(os.path.join(os.getcwd(), "scripts", "rag_system"))

try:
    from ederslik_extractor import EDerslikExtractor
    from section_parser import SectionParser
    from noise_remover import NoiseRemover
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

def repair_missing():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    # 1. Initialize Components
    ederslik_extractor = EDerslikExtractor()
    section_parser = SectionParser()
    noise_remover = NoiseRemover()

    base_dir = Path(os.getcwd())
    textbooks_json = base_dir / "data" / "textbooks.json"
    target_jsonl = base_dir / "data" / "textbook-chunks.jsonl"
    
    # Missing IDs
    MISSING_IDS = ["riyaziyyat-8", "rus-dili-8"]

    # 2. Load Grade 8 books
    with open(textbooks_json, "r", encoding="utf-8") as f:
        all_data = json.load(f)
    grade8_books = [b for b in all_data.get("8", []) if b['id'] in MISSING_IDS]
    
    if not grade8_books:
        logger.error("Missing book definitions not found in textbooks.json")
        return

    logger.info(f"[*] Starting repair ingestion for {len(grade8_books)} books.")

    total_chunks = 0
    # We append directly to the target file since atomic swap was already done for the others
    # but to be safe, we'll use a temp file and append later or just append
    # Since it's only 2 books, I'll append directly to target_jsonl
    
    for i, book in enumerate(grade8_books, 1):
        book_id = book['id']
        logger.info(f"[{i}/{len(grade8_books)}] Processing {book['title']} ({book_id})...")
        
        try:
            # A. Fetch from e-derslik
            pages = ederslik_extractor.fetch_book(book['e_derslik_id'])
            if not pages:
                logger.warning(f"  [!] No pages found for {book_id}")
                continue
                
            full_text = "\n".join([p['text'] for p in pages])
            
            # B. Noise Removal
            clean_text = noise_remover.remove_noise(full_text)
            
            # C. Section Parsing
            sections = section_parser.parse(clean_text, subject=book['subject'], is_html=True)
            logger.info(f"  [+] Found {len(sections)} sections.")
            
            # D. Write Chunks (Append to target_jsonl)
            book_chunks = 0
            with open(target_jsonl, "a", encoding="utf-8") as f:
                for sec in sections:
                    content = sec["content"]
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

    logger.info(f"[*] REPAIR FINISHED. Total chunks added: {total_chunks}")

if __name__ == "__main__":
    repair_missing()
