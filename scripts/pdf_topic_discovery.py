import os
import json
import pdfplumber
import re
import time
from pathlib import Path
from llm_utils import generate_text_with_failover

def get_ocr_language(subject_name):
    s = str(subject_name).lower()
    if 'ingilis' in s: return 'eng'
    if 'rus' in s: return 'rus'
    if 'alman' in s: return 'deu'
    if 'fransız' in s: return 'fra'
    return 'aze+eng'

def get_optimal_page_limit(subject_name):
    s = str(subject_name).lower()
    if 'riyaziyyat' in s: return 12
    if 'edebiyyat' in s: return 20
    if 'tarix' in s: return 18
    if 'informatika' in s or 'musiqi' in s: return 10
    return 15

def extract_toc_text(pdf_path, subject_name):
    max_pages = get_optimal_page_limit(subject_name)
    text = ""
    valid_pages = 0
    try:
        with pdfplumber.open(pdf_path) as pdf:
            pages_to_read = min(len(pdf.pages), max_pages)
            for i in range(pages_to_read):
                try:
                    page_text = pdf.pages[i].extract_text()
                    if page_text and len(page_text.strip()) > 50 and "(cid:" not in page_text:
                        text += f"\n--- Page {i+1} ---\n{page_text}"
                        valid_pages += 1
                except:
                    pass
    except Exception as e:
        print(f"Error reading PDF {os.path.basename(pdf_path)}: {e}")
    
    if len(text) < 200:
        return None
    return text

def parse_llm_response(result):
    if not result: return []
    try:
        clean_result = result.strip()
        if clean_result.startswith("```json"): clean_result = clean_result[7:]
        if "```" in clean_result: clean_result = clean_result.split("```")[0]
        return json.loads(clean_result.strip())
    except:
        return []

SUBJECT_PROMPT_TEMPLATES = {
    "riyaziyyat": { "hints": "Bölmələr: Ədədlər, Həndəsə, Cəbr, Statistika.", "predicates": ["TƏSVİR_EDİR", "FORMULU_VAR"] },
    "fizika": { "hints": "Bölmələr: Mexanika, Elektrik, Optika.", "predicates": ["QANUNUDUR", "FORMULU_VAR"] },
    "kimya": { "hints": "Bölmələr: Maddə, Atom, Reaksiya.", "predicates": ["TƏRKİBİNDƏDİR", "REAKSİYASI"] },
    "biologiya": { "hints": "Bölmələr: Hüceyrə, Orqanlar, Ekologiya.", "predicates": ["FUNKSİYASI", "NÖVÜDÜR"] },
    "informatika": { "hints": "Bölmələr: Alqoritm, Proqramlaşdırma, Kompüter.", "predicates": ["PROQRAMDIR", "ALQORİTMİ"] },
    "edebiyyat": { "hints": "Bölmələr: Yazıçılar, Əsərlər, Janrlar.", "predicates": ["YAZIB", "JANRIDIR"] },
    "azerbaycan-dili": { "hints": "Bölmələr: Qrammatika, Nitq hissələri.", "predicates": ["QAYDADIR", "NÖVÜDÜR"] },
    "tarix": { "hints": "Bölmələr: Dövlətlər, Müharibələr, Şəxsiyyətlər.", "predicates": ["BAŞ_VERİB", "TARİXİDİR"] },
    "cografiya": { "hints": "Bölmələr: Materiklər, İqlim, Xəritə.", "predicates": ["YERLƏŞİR", "ƏHATƏ_EDİR"] },
    "ingilis": { "hints": "Units: Grammar, Vocabulary, Reading.", "predicates": ["MEANS", "GRAMMAR_RULE"] },
    "rus": { "hints": "Units: Grammar, Vocabulary.", "predicates": ["MEANS", "GRAMMAR_RULE"] },
    "alman": { "hints": "Units: Grammar, Vocabulary.", "predicates": ["MEANS", "GRAMMAR_RULE"] },
    "fransiz": { "hints": "Units: Grammar, Vocabulary.", "predicates": ["MEANS", "GRAMMAR_RULE"] }
}

def discover_topics_with_llm(text, subject_name):
    s = subject_name.lower()
    subject_key = next((k for k in SUBJECT_PROMPT_TEMPLATES if k in s), "riyaziyyat")
    template = SUBJECT_PROMPT_TEMPLATES[subject_key]
    prompt = f"Extract TOC from this text for {subject_name} as JSON list of chapters with topics titles and page numbers. Text:\n{text}"
    try:
        result = generate_text_with_failover(prompt, provider="gemini")
        return parse_llm_response(result)
    except:
        return []

def main():
    base_dir = Path(os.getcwd())
    textbooks_json_path = base_dir / "data" / "textbooks.json"
    extracted_topics_path = base_dir / "scripts" / "extracted-topics.json"
    
    with open(textbooks_json_path, "r", encoding="utf-8") as f:
        textbooks_data = json.load(f)
    
    extracted_topics = {}
    if extracted_topics_path.exists():
        with open(extracted_topics_path, "r", encoding="utf-8") as f:
            extracted_topics = json.load(f)

    for grade, books in textbooks_data.items():
        for book in books:
            book_id = book.get("id")
            subject = book.get("subject") or book.get("title")
            
            # USE BOOK_ID AS THE STABLE KEY
            class_key = book_id
            
            # Check if book already missing topics after cleanup
            if "topics" in book: continue # Still has topics in textbooks.json

            pdf_path = None
            if book.get("contentPath"):
                local_dir = base_dir / book["contentPath"]
                if local_dir.exists():
                    pdfs = list(local_dir.glob("*.pdf"))
                    if pdfs: pdf_path = pdfs[0]
            
            if not pdf_path and book.get("path"):
                clean_path = book["path"].lstrip("/").lstrip("\\")
                pdf_path = base_dir / "public" / clean_path
                if not pdf_path.exists(): pdf_path = base_dir / "public" / "textbooks" / clean_path

            if pdf_path and pdf_path.exists():
                print(f"Processing PDF for {book_id}: {pdf_path.name}")
                toc_text = extract_toc_text(str(pdf_path), subject)
                if toc_text:
                    discovered = discover_topics_with_llm(toc_text, subject)
                    if discovered:
                        extracted_topics[class_key] = discovered
                        print(f"  ✓ Discovered {len(discovered)} chapters for {class_key}")
                        with open(extracted_topics_path, "w", encoding="utf-8") as f:
                            json.dump(extracted_topics, f, ensure_ascii=False, indent=2)

    print("\nPDF Topic Discovery Complete.")

if __name__ == "__main__":
    main()
