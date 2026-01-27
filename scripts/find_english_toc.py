import pdfplumber
import os

pdf_path = "public/textbooks/5/ingilis-dili-5/english-5.pdf"

print(f"Opening {pdf_path}...")
with pdfplumber.open(pdf_path) as pdf:
    # Check first 10 pages for "Contents" or "TOC" or "Units"
    for i in range(0, min(10, len(pdf.pages))):
        print(f"\n--- PAGE {i+1} ---")
        text = pdf.pages[i].extract_text()
        if text:
            print(text[:200])
        else:
            print("[Image Page]")
