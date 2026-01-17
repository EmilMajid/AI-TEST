import os
import json
import pdfplumber
import re
from pathlib import Path
from llm_utils import generate_text_with_failover

def extract_toc_text(pdf_path, max_pages=10):
    """Extracts text from the first few pages of a PDF to find the TOC."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            pages_to_read = min(len(pdf.pages), max_pages)
            for i in range(pages_to_read):
                page_text = pdf.pages[i].extract_text()
                if page_text:
                    text += f"\n--- Page {i+1} ---\n{page_text}"
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
    print(f"Extracted {len(text)} characters from {pdf_path}")
    if len(text) < 100:
        print(f"WARNING: Very little text extracted ({len(text)} chars). Check if PDF is scanned/images.")
    return text

def discover_topics_with_llm(text, subject_name):
    """Uses LLM to identify chapters and topics from extracted text."""
    print(f"Sending prompt to LLM for subject: {subject_name}...")
    prompt = f"""
    Sən Azərbaycan dərslikləri üzrə mütəxəssissən. 
    Aşağıda '{subject_name}' dərsliyinin ilk səhifələrindən çıxarılmış mətn verilmişdir.
    Bu mətndən dərslikdəki "Məzmun" (Table of Contents) hissəsini tap və mövzuları strukturlaşdırılmış JSON formatında qaytar.

    Qaydalar:
    1. Yalnız JSON qaytar.
    2. Format belə olmalıdır: 
       [
         {{
           "chapter": "Bölmənin adı",
           "topics": [
             {{ "title": "Mövzu 1", "page": 10 }},
             {{ "title": "Mövzu 2", "page": 12 }}
           ]
         }}
       ]
    3. Əgər konkret səhifə nömrəsi yoxdursa, 'page' üçün 1 yaz.
    4. Əgər məzmun tapılmasa, [{{ "chapter": "Mövzular", "topics": [] }}] qaytar.
    5. Mövzu adlarını təmiz və düzgün Azərbaycan (və ya dərslik hansı dildədirsə, o dildə) dilində saxla.

    Mətn:
    {text}
    """
    
    result = generate_text_with_failover(prompt, provider="gemini")
    if not result:
        print("LLM Error: No response received.")
        return []
    
    print(f"LLM Response length: {len(result)}")
    try:
        # Clean markdown
        clean_result = result.strip()
        if clean_result.startswith("```json"):
            clean_result = clean_result[7:]
        if "```" in clean_result:
            clean_result = clean_result.split("```")[0]
        
        data = json.loads(clean_result.strip())
        print(f"Successfully parsed JSON. Found {len(data)} chapters.")
        return data
    except Exception as e:
        print(f"Error parsing LLM response: {e}")
        return []

def main():
    base_dir = Path(os.getcwd())
    textbooks_json_path = base_dir / "data" / "textbooks.json"
    extracted_topics_path = base_dir / "scripts" / "extracted-topics.json"
    
    if not textbooks_json_path.exists():
        print(f"Error: {textbooks_json_path} not found")
        return

    with open(textbooks_json_path, "r", encoding="utf-8") as f:
        textbooks_data = json.load(f)
        
    # Load existing extracted topics
    extracted_topics = {}
    if extracted_topics_path.exists():
        with open(extracted_topics_path, "r", encoding="utf-8") as f:
            try:
                extracted_topics = json.load(f)
            except:
                extracted_topics = {}

    for grade, books in textbooks_data.items():
        # Specifically targeting Grade 6 as they are mostly PDF
        if grade != "6":
            continue
            
        for book in books:
            book_id = book.get("id")
            subject = book.get("subject") or book.get("title")
            
            # Use classKey structure: subjectDir-classLevel
            # dirName logic from verify_topics.js
            dir_name = os.path.basename(book.get("contentPath") or "")
            class_key = f"{dir_name}-{grade}"
            
            # Skip if already in extracted_topics with real data
            if class_key in extracted_topics and len(extracted_topics[class_key]) > 0:
                print(f"Skipping {class_key} (already exists)")
                continue

            # Find PDF Path
            pdf_path = None
            if book.get("contentPath"):
                local_dir = base_dir / book["contentPath"]
                if local_dir.exists():
                    pdfs = list(local_dir.glob("*.pdf"))
                    if pdfs:
                        pdf_path = pdfs[0]
            
            if not pdf_path and book.get("path"):
                clean_path = book["path"].lstrip("/").lstrip("\\")
                pdf_path = base_dir / "public" / clean_path
                if not pdf_path.exists():
                     pdf_path = base_dir / "public" / "textbooks" / clean_path

            if pdf_path and pdf_path.exists():
                print(f"Processing PDF for TOC discovery: {pdf_path.name} ({class_key})")
                toc_text = extract_toc_text(str(pdf_path))
                if toc_text:
                    discovered = discover_topics_with_llm(toc_text, subject)
                    if discovered:
                        extracted_topics[class_key] = discovered
                        print(f"  ✓ Discovered {len(discovered)} chapters for {class_key}")
                        
                        # Save incrementally
                        with open(extracted_topics_path, "w", encoding="utf-8") as f:
                            json.dump(extracted_topics, f, ensure_ascii=False, indent=2)
                    else:
                        print(f"  ⚠ No topics discovered for {class_key}")
                else:
                    print(f"  ⚠ No text extracted for {class_key}")
            else:
                print(f"  ⚠ PDF not found for {class_key}")

    print("\n✅ PDF Topic Discovery Complete!")

if __name__ == "__main__":
    main()
