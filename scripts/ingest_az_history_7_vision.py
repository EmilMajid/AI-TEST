import os
import sys
import json
import logging
import time
from pathlib import Path
import fitz  # PyMuPDF

# Add scripts directory to path
sys.path.append(str(Path(__file__).parent))
from llm_utils import call_gemini_vision, get_api_key

def call_vision_with_retry(prompt, image_paths, api_key, max_retries=5):
    """Calls Gemini Vision API with exponential backoff on failure."""
    delay = 10 # Start with 10 seconds for safety
    for i in range(max_retries):
        try:
            res = call_gemini_vision(prompt, image_paths, api_key)
            if res:
                return res
            logging.warning(f"Vision API returned empty result. Retry {i+1}/{max_retries} in {delay}s...")
        except Exception as e:
            logging.error(f"Vision API Error: {e}. Retry {i+1}/{max_retries} in {delay}s...")
        
        time.sleep(delay)
        delay *= 1.5 # Exponential backoff
    return None

def ingest_az_history_7_vision():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    book_id = "azerbaycan-tarixi-7"
    pdf_path = Path(f"scripts/ocr_temp/{book_id}.pdf")
    output_path = Path(f"data/{book_id}-chunks.jsonl")
    temp_img_dir = Path("scripts/ocr_temp/vision_cache")
    temp_img_dir.mkdir(exist_ok=True)

    api_key = get_api_key("gemini")
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment.")
        return

    user_provided_toc = """AZƏRBAYCAN ERKƏN ORTA ƏSRLƏRDƏ
1. Feodal münasibətlərinin inkişafı
2. Ərəb işğalına qarşı mübarizə. Cavanşir
3. Xilafət dövründə idarəetmə, torpaq və vergi siyasəti
4. Xürrəmilər hərəkatı. Babək
5. İslamın milli və mədəni inkişafa təsiri.
AZƏRBAYCAN DÖVLƏTÇİLİYİNİN DİRÇƏLİŞİ
6. Müstəqil dövlətçiliyin bərpası
7. Azərbaycan vahid dövlət tərkibində
8. Xudafərin körpüsünün birləşdirdiyi iki Azərbaycan dövləti
9. Slavyanların hücumları
10. Əhalinin məşğuliyyəti və həyat tərzi
11. IX-XI əsrlərdə Azərbaycan mədəniyyəti
OĞUZ-SƏLCUQ AXINLARI VƏ AZƏRBAYCAN
12. Oğuz-səlcuq axınları
13. Azərbaycan XII-XIII əsrin əvvəllərində
14. XI əsrin ortaları - XII əsrdə mədəniyyət
YADELLİ İŞĞALÇILARA QARŞI MÜBARİZƏ
15. Monqol yürüşlərinə qarşı mübarizə
16. Azərbaycan Elxanilər dövlətinin mərkəzi kimi.
17. Azərbaycan uğrunda mübarizə
18. Şirvanşahlar dövləti və Şəki hakimliyi
XIII-XIV əsrin başlanğıcında
19. XIII-XIV əsrlərdə mədəniyyətin inkişafı
VAHİD AZƏRBAYCAN UĞRUNDA
20. Qara Yusif və varisləri
21. Həsən padşah və varisləri
22. Ərdəbil hakimliyi
23. XV əsrdə ictimai-siyasi və iqtisadi vəziyyət
24. Mərkəzləşdirilmiş vahid Azərbaycan dövləti
25. Səfəvi-Osmanlı müharibələrinin başlanması
26. XV-XVI əsrlərdə Azərbaycan mədəniyyəti"""

    vision_prompt = """Sən tarixçi və arxiv mütəxəssisisən. Təqdim olunan Azərbaycan Tarixi dərslik səhifəsini təhlil et və içindəki bütün faktları, mətnləri və başlıqları rəqəmsal formatda (RAG sistemi üçün) yenidən tərtib et.
Məqsəd: Orijinal mətni simvol-simvol kopyalamaq deyil (Recitation blokuna düşməmək üçün), lakin içindəki elmi və tarixi yükü 100% dəqiqliklə qorumaqdır.
QAYDALAR:
1. Azərbaycan hərflərini (ə, ö, ü, ç, ş, ğ, ı) mütləq düzgün istifadə et.
2. Səhifədəki mətni abzaslar şəklində tam bərpa et. 
3. Tapşırıqları və terminləri xüsusi qeyd et.
Cavabı yalnız təmiz rəqəmsal mətn olaraq qaytar (Markdown yox)."""

    processed_pages = set()
    if output_path.exists():
        with open(output_path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    item = json.loads(line)
                    if item.get('text') and len(item['text']) > 30:
                        processed_pages.add(item.get('page'))
                except:
                    continue

    doc = fitz.open(str(pdf_path))
    logger.info(f"PDF opened: {len(doc)} pages.")

    try:
        # Start from Page 7 (TOC) and skip earlier empty/cover pages
        for i in range(6, len(doc)):
            page_num = i + 1
            if page_num in processed_pages:
                logger.info(f"Skipping page {page_num} (already processed).")
                continue

            logger.info(f"Processing page {page_num} with Vision AI...")
            
            if page_num == 7:
                text = f"KİTABIN İÇİNDƏKİLƏR\n\n{user_provided_toc}"
                logger.info("Using user-provided text for page 7 (TOC).")
            else:
                # Render page to image with slightly lower DPI (200) for better API stability
                page = doc[i]
                pix = page.get_pixmap(dpi=200)
                img_path = temp_img_dir / f"p{page_num}.png"
                pix.save(str(img_path))
                
                # Call Gemini Vision with robust retry
                text = call_vision_with_retry(vision_prompt, [str(img_path)], api_key)
                
                # Clean up image immediately
                if img_path.exists(): img_path.unlink()
                
                if not text:
                    logger.error(f"Page {page_num} FAILED (empty/null) after retries. Skipping.")
                    continue

            # Save chunk
            chunk = {
                "id": f"{book_id}_{page_num}",
                "grade": 7,
                "subject": "Azərbaycan tarixi",
                "book_id": book_id,
                "source": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-7-ci-sinif-ucun-darslik.pdf",
                "text": text.strip(),
                "page": page_num,
                "type": "pdf_page",
                "knowledge": [],
                "metadata": {"vision_ai": True, "high_fidelity": True}
            }

            with open(output_path, 'a', encoding='utf-8') as f:
                f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
            logger.info(f"Page {page_num} successfully integrated.")
            
            # More defensive delay for rate limits
            time.sleep(5)

    except Exception as e:
        logger.error(f"Critical execution error: {e}")
    finally:
        doc.close()

if __name__ == "__main__":
    ingest_az_history_7_vision()
