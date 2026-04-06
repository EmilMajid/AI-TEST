import os
import sys
import json
import logging
import time
import subprocess
import re
from pathlib import Path
import fitz  # PyMuPDF

# Add scripts directory to path
sys.path.append(str(Path(__file__).parent))
from llm_utils import call_gemini, get_api_key

def heal_text_with_llm(raw_text, api_key):
    """Uses Gemini (Text) to heal OCR artifacts without falling into Recitation blocks."""
    prompt = f"""Sən peşəkar arxiv redaktorusan. Aşağıdakı mətn Azərbaycan Tarixi 7 dərsliginin OCR (təhrif olunmuş) variantıdır. 
Xahiş edirəm onu orijinal mənasına, tarixi terminlərinə və Azərbaycan dili qaydalarına uyğun (ə, ö, ü və s. bərpası ilə) təmizlə. 

QAYDALAR:
1. Sətir sonundakı tireləri (hyphenation) birləşdir.
2. OCR-ın səhv tanıdığı (məs: 'mirza' -> 'mirzə', 'sanca' -> 'səncə') sözləri düzəlt.
3. Strukturlaşdırılmış abzasları qoru.
4. Yalnız təmiz mətn qaytar.

MƏTN:
{raw_text}"""
    
    try:
        return call_gemini(prompt, api_key)
    except Exception as e:
        logging.error(f"LLM Healing Error: {e}")
        return None

def fix_hyphenation(text):
    """User-suggested regex for basic hyphen cleanup."""
    return re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

def ingest_az_history_7_hybrid():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    book_id = "azerbaycan-tarixi-7"
    pdf_path = Path(f"scripts/ocr_temp/{book_id}.pdf")
    output_path = Path(f"data/{book_id}-chunks.jsonl")
    temp_img_dir = Path("scripts/ocr_temp/hybrid_cache")
    temp_img_dir.mkdir(exist_ok=True)
    
    tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    api_key = get_api_key("gemini")

    processed_pages = set()
    if output_path.exists():
        with open(output_path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    item = json.loads(line)
                    if item.get('page'):
                        processed_pages.add(item.get('page'))
                except:
                    continue

    doc = fitz.open(str(pdf_path))
    logger.info(f"Hybrid Ingestion: PDF opened ({len(doc)} pages).")

    try:
        # Start from Page 8 (P7 handled manually already)
        for i in range(7, len(doc)):
            page_num = i + 1
            if page_num in processed_pages:
                logger.info(f"Skipping page {page_num}.")
                continue

            logger.info(f"--- Processing Page {page_num} (Hybrid) ---")
            
            # Step 1: Render Image
            page = doc[i]
            pix = page.get_pixmap(dpi=300)
            img_path = temp_img_dir / f"p{page_num}.png"
            pix.save(str(img_path))
            
            # Step 2: Tesseract OCR (Raw)
            ocr_out_base = temp_img_dir / f"p{page_num}_ocr"
            
            env = os.environ.copy()
            env["TESSDATA_PREFIX"] = os.path.abspath("scripts/ocr_temp/tessdata")
            
            subprocess.run([tesseract_path, str(img_path), str(ocr_out_base), "-l", "aze"], 
                           env=env, capture_output=True, check=True)
            
            ocr_text_path = Path(f"{ocr_out_base}.txt")
            with open(ocr_text_path, 'r', encoding='utf-8') as f:
                raw_text = f.read()
            
            # Step 3: Cleanup & Heal
            raw_text = fix_hyphenation(raw_text)
            healed_text = heal_text_with_llm(raw_text, api_key)
            
            if not healed_text:
                logger.warning(f"Page {page_num} healing failed. Using raw text.")
                healed_text = raw_text

            # Step 4: Save Chunk
            chunk = {
                "id": f"{book_id}_{page_num}",
                "grade": 7,
                "subject": "Azərbaycan tarixi",
                "book_id": book_id,
                "source": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-7-ci-sinif-ucun-darslik.pdf",
                "text": healed_text.strip(),
                "page": page_num,
                "type": "pdf_page",
                "knowledge": [],
                "metadata": {"hybrid_mode": True, "tesseract": "aze", "healer": "gemini-1.5-pro"}
            }

            with open(output_path, 'a', encoding='utf-8') as f:
                f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
            logger.info(f"Page {page_num} integrated successfully.")
            
            # Clean up temp files
            img_path.unlink()
            ocr_text_path.unlink()
            
            time.sleep(2) # Be kind to API

    except Exception as e:
        logger.error(f"Critical Hybrid Error: {e}")
    finally:
        doc.close()

if __name__ == "__main__":
    ingest_az_history_7_hybrid()
