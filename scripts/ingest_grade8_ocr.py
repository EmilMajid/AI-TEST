import os
import sys
import json
import logging
import time
import subprocess
import re
import requests
import locale
from pathlib import Path
import fitz  # PyMuPDF

# Force UTF-8 environment
if sys.platform == "win32":
    import _locale
    _locale._getdefaultlocale = lambda *args: ('en_US', 'utf8')
    
# Ensure stdout/stderr are UTF-8
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add scripts directory to path
sys.path.append(str(Path(__file__).parent))
from llm_utils import call_gemini, get_api_key

def remove_noise_lines(text):
    """Filters out noise and artifact lines."""
    lines = text.split("\n")
    cleaned = []
    for line in lines:
        # If very few cyrillic/latin chars, skip
        if len(re.findall(r"[а-яА-Яa-zA-Z]", line)) < 3:
            continue
        # If too many non-alphabetic chars, skip
        non_alpha = len(re.findall(r"[^\w\sа-яА-Я]", line))
        if len(line) > 0 and (non_alpha / len(line)) > 0.4:
            continue
        cleaned.append(line)
    return "\n".join(cleaned)

def normalize_ocr_text(text, language="az"):
    """Standardizes characters based on OCR common errors."""
    if not text:
        return ""
        
    if language == "ru":
        # Rule 1: yo hyper-correction (ё -> е) except known words
        def replace_yo(match):
            word = match.group(0)
            if word.lower() in ["всё", "ещё", "её", "ёлка", "своё", "моё", "твоё", "своём", "твоём"]:
                return word
            return word.replace("ё", "е").replace("Ё", "Е")
        
        text = re.sub(r'\b\w*[ёЁ]\w*\b', replace_yo, text)

        # Rule 2: Remove accent marks (combining characters)
        text = re.sub(r'[\u0300-\u036f]', '', text)

        # Rule 3: Common OCR artifacts and confusion
        replacements = {
            "дблго": "долго", "гбда": "года", "гдда": "года", "пблка": "полка",
            "значёниями": "значениями", "йи": "и", "языкйи": "языки",
            "гГ": "Г", "чЧ": "Ч", "чЧто": "Что", "осдбую": "особую",
            "Какбй": "Какой", "слдво": "слово", "перевбдится": "переводится",
            "бтвётьте": "ответьте", "клётки": "клетки", "пбнятие": "понятие",
            "вбпросы": "вопросы", "прбчитайте": "прочитайте", "тёкст": "текст"
        }
        for k, v in replacements.items():
            text = text.replace(k, v)
        
        # Aggressive vowel fixes (б -> о when surrounded by cyrillic)
        text = re.sub(r'([а-яА-Я])б([а-яА-Я])', r'\1о\2', text)
            
    return text.strip()

def protect_entities(text):
    """Protects important named entities from corruption."""
    entities = ["Шуша", "Агдам", "Лачын", "Азербайджан", "Гейдар Алиев"]
    # Currently just a placeholder for pass-through or basic regex
    return text

def heal_text_with_llm(raw_text, api_key, language="az"):
    """Uses Gemini (Text) to heal OCR artifacts and return structured JSON."""
    if language == "ru":
        prompt = f"""You are an expert Russian linguist and OCR correction system (Smart Cleaner v3.1).

TASK:
Correct and structure the following OCR text from a Grade 8 textbook.

RULES:
1. FIX spelling/grammar. OCR often confuses 'б' and 'о', 'ё' and 'е'. Correct these based on context.
2. RESTORE sentence structure and paragraph formatting.
3. EXTRACT all exercises, questions, and tests (A, B, C, D) into the 'tasks' list.
4. IDENTIFY important entities (names, locations like 'Шуша', 'Агдам', 'Азербайджан') into 'entities'.
5. DO NOT hallucinate. Use ONLY the provided text.
6. 'ё' RULE: Replace 'ё' with 'е' if it's an accent mark (e.g., клётки -> клетки). Keep real 'ё' (ещё, всё).

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown, no prefixes.
{{
  "clean_text": "Refined and readable text",
  "tasks": ["Task 1 content...", "Task 2..."],
  "entities": ["Location/Person 1", ...]
}}

TEXT TO PROCESS:
{raw_text}"""
    else:
        lang_name = "Azərbaycan" if language == "az" else "İngilis"
        prompt = f"""You are a professional editor. Heal the following distorted OCR text ({lang_name}).
Restore meaning, fix symbols, and preserve structure.

OUTPUT FORMAT (JSON ONLY):
{{
  "clean_text": "...",
  "tasks": [],
  "entities": []
}}

TEXT:
{raw_text}"""
    
    try:
        response = call_gemini(prompt, api_key)
        if response:
            # Extract JSON from potential markdown backticks
            clean_json = response.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
            elif clean_json.startswith("```"):
                clean_json = clean_json[3:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
            
            return json.loads(clean_json.strip())
    except Exception as e:
        logging.error(f"LLM Healing/JSON Parsing Error: {e}")
        return None

def fix_hyphenation(text):
    return re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)

def download_pdf(url, dest_path):
    if dest_path.exists():
        return True
    try:
        print(f"Downloading {url}...")
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        with open(dest_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"Download failed: {e}")
        return False

# Project root is the parent of the scripts/ directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

def process_book(book_id, title, subject, url, lang_ocr, lang_heal):
    logging.info(f"Processing {title} ({book_id})...")
    
    pdf_path = PROJECT_ROOT / "scripts" / "ocr_temp" / f"{book_id}.pdf"
    output_path = PROJECT_ROOT / "data" / "textbook-chunks.jsonl"
    temp_img_dir = PROJECT_ROOT / "scripts" / "ocr_temp" / "hybrid_cache"
    temp_img_dir.mkdir(exist_ok=True, parents=True)
    
    if not download_pdf(url, pdf_path):
        logging.error(f"Failed to download {book_id}")
        return

    tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    api_key = get_api_key("gemini")

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
        logger.info(f"PDF opened: {len(doc)} pages.")

        for i in range(len(doc)):
            page_num = i + 1
            if page_num in processed_pages:
                continue

            logger.info(f"Page {page_num}/{len(doc)}...")
            
            # Step 1: Render Image
            page = doc[i]
            pix = page.get_pixmap(dpi=300)
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
            
            # Step 3: Cleanup & Heal
            raw_text = remove_noise_lines(raw_text)
            raw_text = normalize_ocr_text(raw_text, lang_heal)
            raw_text = protect_entities(raw_text)
            raw_text = fix_hyphenation(raw_text)
            
            healed_data = None
            if len(raw_text.strip()) > 50:
                healed_data = heal_text_with_llm(raw_text, api_key, lang_heal)
            
            if not healed_data:
                healed_data = {
                    "clean_text": raw_text.strip(),
                    "tasks": [],
                    "entities": []
                }

            # Step 4: Save Chunk
            chunk = {
                "id": f"{book_id}_{page_num}",
                "grade": 8,
                "subject": subject,
                "book_id": book_id,
                "title": title,
                "source": url,
                "text": healed_data.get("clean_text", ""),
                "tasks": healed_data.get("tasks", []),
                "entities": healed_data.get("entities", []),
                "page": page_num,
                "type": "pdf_page",
                "metadata": {"ocr_lang": lang_ocr, "healer": "gemini-1.5-pro", "v3_pipeline": True}
            }

            with open(output_path, 'a', encoding='utf-8') as f:
                f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
            # Clean up
            img_path.unlink()
            ocr_text_path.unlink()
            
            time.sleep(1) 

        doc.close()
    except Exception as e:
        logging.error(f"Error processing {book_id}: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    books = [
        {
            "id": "riyaziyyat-8",
            "title": "Riyaziyyat 8",
            "subject": "Riyaziyyat",
            "url": "https://www.trims.edu.az/noduploads/book/quot-riyaziyyat-quot-fanni-uzra-8-ci-sinif-ucun-darslik.pdf",
            "ocr": "aze",
            "heal": "az"
        },
        {
            "id": "rus-dili-8",
            "title": "Rus dili 8 (əsas xarici dil)",
            "subject": "Rus dili",
            "url": "https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-quot-rus-dili-asas-xarici-dil-fanni-uzra-8-ci-sinif-ucun-darslik-1693828461-829.pdf",
            "ocr": "rus",
            "heal": "ru"
        },
        {
            "id": "ingilis-dili-8",
            "title": "İngilis dili 8 (əsas xarici dil)",
            "subject": "Xarici dil",
            "url": "https://www.trims.edu.az/noduploads/book/quot-english-quot-ingilis-dili-asas-xarici-dil-fanni-uzra-8-ci-sinif-ucun-darslik.pdf",
            "ocr": "eng",
            "heal": "en"
        }
    ]

    for b in books:
        process_book(b["id"], b["title"], b["subject"], b["url"], b["ocr"], b["heal"])
