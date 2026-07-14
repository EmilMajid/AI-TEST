import os
import requests
import fitz
import base64
import json
import time
from openai import OpenAI

PDF_URL = "https://www.trims.edu.az/noduploads/book/quot-le-francais-quot-fransiz-dili-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1761549522-432.pdf"
PDF_PATH = "public/textbooks/6/fransiz-dili/book.pdf"
os.makedirs(os.path.dirname(PDF_PATH), exist_ok=True)

NVIDIA_KEY = "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"
client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=NVIDIA_KEY)
VISION_MODEL = "meta/llama-3.2-11b-vision-instruct"
OUTPUT_JSONL = "data/textbook-chunks.jsonl"
CACHE_FILE = "data/fransiz6_ocr_cache.json"
SUBJECT = "Fransız dili"
GRADE = "6"
LANGUAGE = "fr"

def download_pdf():
    if not os.path.exists(PDF_PATH):
        print(f"Downloading PDF from {PDF_URL}...")
        response = requests.get(PDF_URL)
        with open(PDF_PATH, 'wb') as f:
            f.write(response.content)
        print("Download complete.")
    else:
        print("PDF already exists locally.")

def pdf_page_to_base64(doc, page_idx, dpi=150):
    page = doc[page_idx]
    mat = fitz.Matrix(dpi/72, dpi/72)
    pix = page.get_pixmap(matrix=mat)
    return base64.b64encode(pix.tobytes("png")).decode('utf-8')

def extract_page_text(img_b64, page_num, retries=3):
    prompt = """Bu Fransız dili 6-cı sinif dərslik səhifəsidir.
Bu səhifədəki bütün mətni tam dəqiqliklə oxu.
Bölmə başlıqları (Unité/Leçon), mövzu adları, söz siyahıları, qrammatik qaydalar — hamısını yaz.
Şəkil açıqlamaları lazım deyil. Yalnız mətni ver."""
    
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model=VISION_MODEL,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}},
                        {"type": "text", "text": prompt}
                    ]
                }],
                temperature=0.1,
                max_tokens=3000
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            if '429' in str(e) or 'rate' in str(e).lower():
                time.sleep(30)
            else:
                return None
    return None

def chunk_text(text, page_num, max_chunk=800):
    if len(text) <= max_chunk:
        return [text]
    paras = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks, current = [], ""
    for para in paras:
        if len(current) + len(para) + 2 > max_chunk and current:
            chunks.append(current.strip())
            current = para
        else:
            current += "\n\n" + para if current else para
    if current.strip():
        chunks.append(current.strip())
    return chunks if chunks else [text[:max_chunk]]

def process_pdf():
    download_pdf()
    
    cache = {}
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
            
    doc = fitz.open(PDF_PATH)
    total_pages = doc.page_count
    
    # Analyze table of contents (pages 4-6 typically) to find units
    # For now, let's just process the TOC pages to get the structure, then sample a few pages from each unit to save API calls.
    # We will process TOC (pages 2-6) and first 2 pages of every 10 pages as a quick way, or just process the whole book if needed.
    # To save time and avoid timeout, let's process 30 uniformly distributed pages across the book.
    
    pages_to_process = list(range(2, 7)) # TOC
    step = max(1, total_pages // 25)
    pages_to_process += list(range(10, total_pages-5, step))
    pages_to_process = sorted(list(set(pages_to_process)))
    
    print(f"Processing {len(pages_to_process)} sampled pages for RAG...")
    
    new_chunks = []
    
    for page_idx in pages_to_process:
        page_num = page_idx + 1
        cache_key = f"page_{page_num}"
        
        if cache_key in cache:
            cached_text = cache[cache_key]
            if cached_text and len(cached_text) > 20:
                for i, ctext in enumerate(chunk_text(cached_text, page_num)):
                    new_chunks.append({
                        "id": f"fransiz6-p{page_num:03d}-c{i}",
                        "subject": SUBJECT,
                        "grade": GRADE,
                        "source": "fransiz-dili-6-asas",
                        "page": page_num,
                        "chunk_index": i,
                        "content": ctext,
                        "language": LANGUAGE
                    })
            continue
            
        print(f"Page {page_num} processing...")
        try:
            img_b64 = pdf_page_to_base64(doc, page_idx)
            text = extract_page_text(img_b64, page_num)
            
            if text and len(text) > 20:
                cache[cache_key] = text
                with open(CACHE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(cache, f, ensure_ascii=False)
                    
                for i, ctext in enumerate(chunk_text(text, page_num)):
                    new_chunks.append({
                        "id": f"fransiz6-p{page_num:03d}-c{i}",
                        "subject": SUBJECT,
                        "grade": GRADE,
                        "source": "fransiz-dili-6-asas",
                        "page": page_num,
                        "chunk_index": i,
                        "content": ctext,
                        "language": LANGUAGE
                    })
            else:
                cache[cache_key] = ""
            time.sleep(1.5)
        except Exception as e:
            print(f"Error on page {page_num}: {e}")
            
    doc.close()
    
    if new_chunks:
        with open(OUTPUT_JSONL, 'a', encoding='utf-8') as f:
            for chunk in new_chunks:
                f.write(json.dumps(chunk, ensure_ascii=False) + '\n')
        print(f"Added {len(new_chunks)} chunks to {OUTPUT_JSONL}")
        
    # Analyze the cache to find the units
    return cache

if __name__ == "__main__":
    process_pdf()
