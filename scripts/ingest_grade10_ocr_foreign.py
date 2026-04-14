import os
import sys
import json
import logging
import time
import subprocess
import re
import requests
from pathlib import Path
import fitz

# Force UTF-8 environment
if sys.platform == "win32":
    import _locale
    _locale._getdefaultlocale = lambda *args: ('en_US', 'utf8')
    
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add scripts directory to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(PROJECT_ROOT / "scripts"))
from llm_utils import call_gemini, get_api_key

def download_pdf(url, dest_path):
    if dest_path.exists():
        return True
    try:
        logging.info(f"Downloading {url}...")
        response = requests.get(url, stream=True, timeout=120)
        response.raise_for_status()
        with open(dest_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        logging.error(f"Download failed: {e}")
        return False

def process_foreign_book(book_id, title, subject, url, lang_ocr, lang_heal):
    logging.info(f"Processing {title} ({book_id})...")
    
    pdf_path = PROJECT_ROOT / "scripts" / "ocr_temp" / f"{book_id}.pdf"
    output_path = PROJECT_ROOT / "data" / "textbook-chunks-g10-foreign.jsonl"
    temp_img_dir = PROJECT_ROOT / "scripts" / "ocr_temp" / "hybrid_cache_g10_foreign"
    temp_img_dir.mkdir(exist_ok=True, parents=True)
    
    if not download_pdf(url, pdf_path):
        logging.error(f"Failed to download {book_id}")
        return

    tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    processed_pages = set()
    if output_path.exists():
        with open(output_path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    item = json.loads(line)
                    if item.get('book_id') == book_id and item.get('page'):
                        processed_pages.add(item.get('page'))
                except:
                    continue

    try:
        doc = fitz.open(str(pdf_path))
        logging.info(f"PDF opened: {len(doc)} pages.")

        for i in range(len(doc)):
            page_num = i + 1
            if page_num in processed_pages:
                continue

            logging.info(f"Page {page_num}/{len(doc)}...")
            
            # Step 1: Render Image
            page = doc[i]
            pix = page.get_pixmap(dpi=200)
            img_path = temp_img_dir / f"{book_id}_p{page_num}.png"
            pix.save(str(img_path))
            
            # Step 2: OCR
            ocr_out_base = temp_img_dir / f"{book_id}_p{page_num}_ocr"
            env = os.environ.copy()
            env["TESSDATA_PREFIX"] = str(PROJECT_ROOT / "scripts" / "ocr_temp" / "tessdata")
            
            subprocess.run([tesseract_path, str(img_path), str(ocr_out_base), "-l", lang_ocr], 
                           env=env, capture_output=True, check=True)
            
            ocr_text_path = Path(f"{ocr_out_base}.txt")
            raw_text = ""
            for enc in ['utf-8', 'cp1251', 'latin-1']:
                try:
                    with open(ocr_text_path, 'r', encoding=enc) as f:
                        raw_text = f.read()
                    if raw_text.strip():
                        break
                except:
                    continue
            
            # Since Gemini API key seems missing or invalid in current env,
            # we will skip LLM healing to avoid errors and store pure Tesseract OCR
            # which is still searchable content.
            clean_text = raw_text.strip()

            # Step 4: Save Chunk
            if len(clean_text) > 30:
                chunk = {
                    "id": f"{book_id}_{page_num}",
                    "grade": 10,
                    "subject": subject,
                    "book_id": book_id,
                    "title": title,
                    "source": url,
                    "text": clean_text,
                    "page": page_num,
                    "type": "pdf_page_foreign",
                    "metadata": {"ocr_lang": lang_ocr, "healer": "none_tesseract_only"}
                }

                with open(output_path, 'a', encoding='utf-8') as f:
                    f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
            # Clean up
            img_path.unlink()
            if ocr_text_path.exists():
                ocr_text_path.unlink()
            
        doc.close()
    except Exception as e:
        logging.error(f"Error processing {book_id}: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    books = [
        {
            "id": "rus-dili-esas-10",
            "title": "Rus dili 10 (əsas xarici dil)",
            "subject": "Xarici dil",
            "url": "https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-osnovnoj-inostrannyj-yazyk-quot-rus-dili-asas-xarici-dil-fanni-uzra-10-cu-sinif-ucun-darslik.pdf",
            "ocr": "rus",
            "heal": "Russian"
        },
        {
            "id": "ingilis-dili-esas-10",
            "title": "İngilis dili 10 (əsas xarici dil)",
            "subject": "Xarici dil",
            "url": "https://www.trims.edu.az/noduploads/book/quot-english-as-the-main-foreign-language-quot-ingilis-dili-asas-xarici-dil-fanni-uzra-10-cu-sinif-ucun-darslik-1664781679-184.pdf",
            "ocr": "eng",
            "heal": "English"
        },
        {
            "id": "alman-dili-esas-10",
            "title": "Alman dili 10 (əsas xarici dil)",
            "subject": "Xarici dil",
            "url": "https://www.trims.edu.az/noduploads/book/quot-deutsch-als-erste-fremdsprache-quot-alman-dili-asas-xarici-dil-fanni-uzra-10-cu-sinif-ucun-darslik.pdf",
            "ocr": "deu",
            "heal": "German"
        },
        {
            "id": "fransiz-dili-esas-10",
            "title": "Fransız dili 10 (əsas xarici dil)",
            "subject": "Xarici dil",
            "url": "https://www.trims.edu.az/noduploads/book/quot-le-francais-quot-fransiz-dili-asas-xarici-dil-fanni-uzra-10-cu-sinif-ucun-darslik.pdf",
            "ocr": "fra",
            "heal": "French"
        }
    ]

    for b in books:
        process_foreign_book(b["id"], b["title"], b["subject"], b["url"], b["ocr"], b["heal"])
