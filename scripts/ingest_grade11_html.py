import os
import sys
import json
import logging
from pathlib import Path

# Add scripts and rag_system to path
SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPTS_DIR.parent
sys.path.append(str(SCRIPTS_DIR))
sys.path.append(str(SCRIPTS_DIR / "rag_system"))

try:
    from ederslik_extractor import EDerslikExtractor
    from section_parser import SectionParser
    from noise_remover import NoiseRemover
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("grade11_ingestion.log", encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

def main():
    textbooks_json = PROJECT_ROOT / "data" / "textbooks.json"
    target_jsonl = PROJECT_ROOT / "data" / "textbook-chunks.jsonl"
    temp_jsonl = PROJECT_ROOT / "data" / "textbook-chunks_temp.jsonl"
    
    ederslik_extractor = EDerslikExtractor()
    section_parser = SectionParser()
    noise_remover = NoiseRemover()

    # 1. Load Config
    if not textbooks_json.exists():
        logger.error(f"Config not found: {textbooks_json}")
        return

    with open(textbooks_json, "r", encoding="utf-8") as f:
        all_data = json.load(f)
    grade11_books = all_data.get("11", [])
    
    # 2. Setup Atomic Write (Skip existing Grade 11 books if running again)
    existing_ids = set()
    if target_jsonl.exists():
        logger.info(f"[*] Analyzing existing chunks in {target_jsonl.name}...")
        with open(target_jsonl, "r", encoding="utf-8") as f_in, \
             open(temp_jsonl, "w", encoding="utf-8") as f_out:
            for line in f_in:
                try:
                    c = json.loads(line)
                    if str(c.get("grade")) == "11":
                        existing_ids.add(c.get("book_id"))
                    f_out.write(line)
                except:
                    f_out.write(line)
    else:
        # Create empty temp file if target doesn't exist
        open(temp_jsonl, "w").close()

    # 3. Ingest Grade 11 HTML Books
    html_books = [b for b in grade11_books if b.get("type") == "ederslik_html" and b["id"] not in existing_ids]
    logger.info(f"[*] Found {len(html_books)} NEW HTML books to ingest for Grade 11.")

    # Setup Tesseract for Fallback
    import pytesseract
    TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(TESSERACT_PATH):
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
        logger.info(f"[*] Tesseract fallback available at {TESSERACT_PATH}")
    else:
        logger.warning("[!] Tesseract NOT found. OCR fallback will be disabled.")

    total_chunks = 0
    for i, book in enumerate(html_books, 1):
        book_id = book['id']
        logger.info(f"[{i}/{len(html_books)}] Processing {book['title']} ({book_id})...")
        
        try:
            # A. Fetch from e-derslik
            pages = ederslik_extractor.fetch_book(book['e_derslik_id'])
            
            # B. OCR Fallback if text-poor
            text_content = "\n".join([p['text'] for p in pages if p['text'].strip()])
            if len(text_content.strip()) < 1000: # Heuristic: if less than 1KB text in the whole book
                logger.info(f"  [!] Book {book_id} appears to be image-based. Triggering OCR Fallback...")
                import requests
                from PIL import Image
                import io
                
                ocr_pages = []
                # Fallback: probe common image paths if no XHTML text was found
                # We try multiple patterns because e-derslik is inconsistent
                img_patterns = [
                    "https://www.e-derslik.edu.az/books/{bid}/units/unit-{u}/assets/img/{p}.jpg",
                    "https://www.e-derslik.edu.az/books/{bid}/assets/img/{p}.jpg",
                    "https://www.e-derslik.edu.az/books/{bid}/img/{p}.jpg"
                ]
                
                for pattern in img_patterns:
                    if ocr_pages: break
                    for u in range(1, 4):
                        if ocr_pages: break
                        for p in range(1, 250):
                            img_url = pattern.format(bid=book['e_derslik_id'], u=u, p=p)
                            try:
                                resp = requests.get(img_url, timeout=5)
                                if resp.status_code == 200:
                                    img = Image.open(io.BytesIO(resp.content))
                                    text = pytesseract.image_to_string(img, lang='aze+eng')
                                    if text.strip():
                                        ocr_pages.append({"text": text})
                                        if p % 10 == 0:
                                            logger.info(f"    [OCR] {book_id} -> {len(ocr_pages)} pages found so far...")
                                else:
                                    # If page 1 fails in this pattern, try next pattern or unit
                                    if p == 1: break 
                                    if p > 5: break 
                            except:
                                break
                        if not ocr_pages and u > 1: break
                
                if ocr_pages:
                    pages = ocr_pages
                    text_content = "\n".join([p['text'] for p in pages])
            
            if not pages or not text_content.strip():
                logger.warning(f"  [!] No content found for {book_id}")
                continue
            
            # C. Clean & Parse
            # Grade 11 books are HTML/OCR, so we use is_html=True for better parsing with marked headers
            # We DON'T call noise_remover on the full text to avoid deleting potential headers that repeat as footers
            sections = section_parser.parse(text_content, subject=book['subject'], is_html=True)
            
            if not sections:
                logger.warning(f"  [!] No sections parsed for {book_id}")
                continue
 
            # D. Save Chunks
            book_chunks = []
            for j, sec in enumerate(sections):
                chunk_text = "\n".join(sec['content'])
                # Apply noise removal to the chunk content now
                final_content = noise_remover.remove_noise(chunk_text)
                if len(final_content.strip()) < 50: continue

                chunk = {
                    "id": f"{book_id}_{j}",
                    "grade": "11",
                    "subject": book['subject'],
                    "book_id": book_id,
                    "title": book['title'],
                    "section": sec['title'],
                    "text": final_content,
                    "source": f"https://e-derslik.edu.az/player/index3.php?book_id={book['e_derslik_id']}",
                    "type": "html_section",
                    "metadata": {"version": "v1.2", "source_type": "ederslik_html_ocr_optimized"}
                }
                book_chunks.append(chunk)

            with open(temp_jsonl, "a", encoding="utf-8") as f:
                for chunk in book_chunks:
                    f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
            total_chunks += len(book_chunks)
            logger.info(f"  [+] Saved {len(book_chunks)} chunks for {book_id}")

        except Exception as e:
            logger.error(f"  [!] Error processing {book_id}: {e}")

    # 4. Finalize Atomic Write
    try:
        if os.path.exists(target_jsonl):
            os.remove(target_jsonl)
        os.rename(temp_jsonl, target_jsonl)
        logger.info(f"[*] SUCCESSFULLY integrated Grade 11. Total new chunks: {total_chunks}")
    except Exception as e:
        logger.error(f"[*] Failed to finalize file write: {e}")

if __name__ == "__main__":
    main()
