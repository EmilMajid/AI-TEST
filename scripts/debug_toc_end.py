import pdfplumber
import os

pdf_path = "public/textbooks/6/azerbaycan-tarixi/book.pdf"

with pdfplumber.open(pdf_path) as pdf:
    total = len(pdf.pages)
    print(f"Total pages: {total}")
    # Check last 5 pages
    for i in range(total-6, total):
        print(f"\n--- PAGE {i+1} ---")
        page = pdf.pages[i]
        text = page.extract_text()
        if text:
            print(text)
        else:
            print("[Empty or image]")
