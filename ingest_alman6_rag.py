"""
Alman dili 6 — Tam RAG İnteqrasiya Pipeline
NVIDIA Vision API ilə bütün 180 PDF səhifəsini emal edir.
Nəticəni data/textbook-chunks.jsonl-ə əlavə edir.
"""

import fitz
import base64
import json
import time
import os
import sys
from openai import OpenAI

NVIDIA_KEY = "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"
PDF_PATH = "public/textbooks/6/alman-dili/book.pdf"
OUTPUT_JSONL = "data/textbook-chunks.jsonl"
CACHE_FILE = "data/alman6_ocr_cache.json"
VISION_MODEL = "meta/llama-3.2-11b-vision-instruct"
SUBJECT = "Alman dili"
GRADE = "6"
LANGUAGE = "de"
DPI = 150  # Balans: keyfiyyət vs sürət

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_KEY
)

def pdf_page_to_base64(doc, page_idx, dpi=150):
    page = doc[page_idx]
    mat = fitz.Matrix(dpi/72, dpi/72)
    pix = page.get_pixmap(matrix=mat)
    return base64.b64encode(pix.tobytes("png")).decode('utf-8')

def extract_page_text(img_b64, page_num, retries=3):
    """Vision API ilə bir səhifənin mətnini çıxarır"""
    prompt = """Bu Alman dili 6-cı sinif dərslik səhifəsidir.
Bu səhifədəki bütün mətni tam dəqiqliklə oxu.
Lektion başlıqları, altbaşlıqlar, söz siyahıları, cümlələr, qrammatik qaydalar — hamısını yaz.
Şəkil açıqlamaları lazım deyil. Yalnız mətni ver."""
    
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model=VISION_MODEL,
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{img_b64}"}
                        },
                        {"type": "text", "text": prompt}
                    ]
                }],
                temperature=0.1,
                max_tokens=3000
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            err = str(e)
            if '429' in err or 'rate' in err.lower():
                wait = 30 * (attempt + 1)
                print(f"  ⏳ Rate limit. {wait}s gözlənir...")
                time.sleep(wait)
            elif '400' in err or 'image' in err.lower():
                print(f"  ⚠️ Şəkil xətası ({err[:80]}), keçilir...")
                return None
            else:
                print(f"  ❌ Xəta (attempt {attempt+1}): {err[:100]}")
                if attempt < retries - 1:
                    time.sleep(5)
                else:
                    return None
    return None

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_cache(cache):
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def chunk_text(text, page_num, max_chunk=800):
    """Uzun mətni chunk-lara bölür"""
    if len(text) <= max_chunk:
        return [text]
    # Abzaslara görə böl
    paras = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks = []
    current = ""
    for para in paras:
        if len(current) + len(para) + 2 > max_chunk and current:
            chunks.append(current.strip())
            current = para
        else:
            current += "\n\n" + para if current else para
    if current.strip():
        chunks.append(current.strip())
    return chunks if chunks else [text[:max_chunk]]

def main():
    print(f"=== Alman dili 6 — RAG İnteqrasiya Pipeline ===")
    print(f"Model: {VISION_MODEL}")
    print(f"PDF: {PDF_PATH}")
    print()
    
    # Load cache
    cache = load_cache()
    print(f"Cache: {len(cache)} səhifə artıq işlənib")
    
    # Open PDF
    doc = fitz.open(PDF_PATH)
    total_pages = doc.page_count
    print(f"Ümumi səhifə: {total_pages}")
    print()
    
    # Skip cover/blank/colophon pages (1-5 and 177-180 usually blank/cover)
    skip_pages = set([0, 1, 2, 3, 4, 178, 179])  # 0-indexed
    process_pages = [i for i in range(total_pages) if i not in skip_pages]
    
    print(f"Emal ediləcək səhifə sayı: {len(process_pages)}")
    print()
    
    new_chunks = []
    processed = 0
    skipped = 0
    failed = 0
    
    for page_idx in process_pages:
        page_num = page_idx + 1
        cache_key = f"page_{page_num}"
        
        if cache_key in cache:
            print(f"[{page_num:3d}/{total_pages}] ✅ Cache-dən (keçilir)")
            skipped += 1
            # Still add to chunks from cache
            cached_text = cache[cache_key]
            if cached_text and len(cached_text) > 20:
                for i, chunk_text_part in enumerate(chunk_text(cached_text, page_num)):
                    new_chunks.append({
                        "id": f"alman6-p{page_num:03d}-c{i}",
                        "subject": SUBJECT,
                        "grade": GRADE,
                        "source": "alman-dili-6-asas",
                        "page": page_num,
                        "chunk_index": i,
                        "content": chunk_text_part,
                        "language": LANGUAGE
                    })
            continue
        
        print(f"[{page_num:3d}/{total_pages}] 🔄 Emal edilir...", end=" ", flush=True)
        
        # Convert to image
        try:
            img_b64 = pdf_page_to_base64(doc, page_idx, DPI)
        except Exception as e:
            print(f"❌ Şəkil xətası: {e}")
            failed += 1
            continue
        
        # Extract text via Vision API
        text = extract_page_text(img_b64, page_num)
        
        if text and len(text) > 20:
            # Save to cache
            cache[cache_key] = text
            save_cache(cache)
            
            # Create chunks
            for i, chunk_part in enumerate(chunk_text(text, page_num)):
                new_chunks.append({
                    "id": f"alman6-p{page_num:03d}-c{i}",
                    "subject": SUBJECT,
                    "grade": GRADE,
                    "source": "alman-dili-6-asas",
                    "page": page_num,
                    "chunk_index": i,
                    "content": chunk_part,
                    "language": LANGUAGE
                })
            
            processed += 1
            print(f"✅ {len(text)} char → {len(chunk_text(text, page_num))} chunk")
        else:
            print(f"⚠️ Boş/yoxsa keçildi")
            cache[cache_key] = ""
            save_cache(cache)
            failed += 1
        
        # Rate limit: 1.5s between requests
        time.sleep(1.5)
    
    doc.close()
    
    print()
    print("=== Nəticə ===")
    print(f"  İşləndi (yeni): {processed}")
    print(f"  Cache-dən: {skipped}")
    print(f"  Uğursuz: {failed}")
    print(f"  Toplam chunk: {len(new_chunks)}")
    print()
    
    if new_chunks:
        print(f"textbook-chunks.jsonl-ə yazılır...")
        with open(OUTPUT_JSONL, 'a', encoding='utf-8') as f:
            for chunk in new_chunks:
                f.write(json.dumps(chunk, ensure_ascii=False) + '\n')
        print(f"✅ {len(new_chunks)} chunk əlavə edildi!")
    else:
        print("⚠️ Heç bir yeni chunk yoxdur.")

if __name__ == "__main__":
    main()
