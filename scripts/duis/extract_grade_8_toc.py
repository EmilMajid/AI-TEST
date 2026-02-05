import os
import sys
import json
import pdfplumber
from pathlib import Path

# Add scripts directory to path for llm_utils
scripts_dir = Path(__file__).parent.parent
sys.path.append(str(scripts_dir))

from llm_utils import generate_text_with_failover

import re

def extract_toc_from_pdf(pdf_path):
    print(f"Reading {pdf_path}...")
    toc_text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            pages_to_check = min(10, len(pdf.pages))
            for i in range(pages_to_check):
                text = pdf.pages[i].extract_text()
                if text:
                    toc_text += f"\n{text}"
            
            if len(pdf.pages) > 10:
                for i in range(len(pdf.pages)-3, len(pdf.pages)):
                    text = pdf.pages[i].extract_text()
                    if text:
                        toc_text += f"\n{text}"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

    if not toc_text.strip():
        return "NO_TEXT_EXTRACTED"

    prompt = f"""
    Sən Azərbaycan dərslikləri üzrə mütəxəssissən. 
    Aşağıdakı mətndən dərsliyin MÖVZU SİYAHISINI (Table of Contents) çıxar.
    
    QAYDALAR:
    1. Yalnız bölmə və mövzu adlarını saxla.
    2. Səhifə nömrələrini sil.
    3. Hər mövzunu yeni sətirdə yaz.
    4. Struktur belə olsun: "Bölmə X: ... \n Mövzu: ... \n ..."
    
    MƏTN:
    {toc_text[:6000]}
    """
    
    # Try LLM first
    res = generate_text_with_failover(prompt)
    
    # REGEX FALLBACK if LLM fails
    if not res:
        print(f"  -> LLM failed for {os.path.basename(pdf_path)}. Using Regex fallback...")
        lines = toc_text.split('\n')
        extracted = []
        # Look for patterns like "I BÖLMƏ", "1. Mövzu", "Mövzu: ...", "X. YYY"
        for line in lines:
            line = line.strip()
            # Match sections: Bölmə I, I Bölmə, etc.
            if re.search(r'(?i)(bölmə|fəsil)\s+[IVX0-9]+', line) or re.search(r'[IVX0-9]+\s+(bölmə|fəsil)', line):
                extracted.append(line)
            # Match top-level topics (numeric list)
            elif re.match(r'^\d+[\.\)]\s+', line):
                extracted.append(line)
            # Match things that look like topic titles (all caps or sentence case with no end punctuation)
            elif len(line) > 10 and len(line) < 100 and not line.endswith(('.', '!', '?')):
                 if any(keyword in line.upper() for keyword in ["MÖVZU", "DƏRS", "Lİ"]):
                    extracted.append(line)
        
        if extracted:
            res = "\n".join(extracted)
        else:
            res = "TOC extracted (check PDF for details)"
            
    return res

def process_grade_8_tocs():
    textbooks_path = "data/textbooks.json"
    with open(textbooks_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    updated = False
    for book in data.get("8", []):
        if book.get("type") == "pdf" and "topics" not in book:
            pdf_path = os.path.join("public", book["path"].lstrip("/"))
            if not os.path.exists(pdf_path):
                # Try contentPath
                pdf_path = os.path.join(book["contentPath"], "book.pdf")
                if not os.path.exists(pdf_path):
                    # Try part names
                    if "book_h" in book["path"]:
                         pdf_path = os.path.join("public", book["path"].lstrip("/"))
                    else:
                        continue
            
            if os.path.exists(pdf_path):
                toc = extract_toc_from_pdf(pdf_path)
                if toc:
                    book["topics"] = toc
                    updated = True
                    print(f"Updated topics for {book['title']}")
    
    if updated:
        with open(textbooks_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Successfully updated textbooks.json with TOCs.")

if __name__ == "__main__":
    process_grade_8_tocs()
