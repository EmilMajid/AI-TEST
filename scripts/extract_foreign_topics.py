import pdfplumber
import os

pdfs = [
    {"name": "Alman 5 (2nd)", "path": "public/textbooks/5/alman-dili-5/alman-5.pdf"},
    {"name": "Fransiz 5 (Main)", "path": "public/textbooks/5/fransiz-dili-5/fransiz-5.pdf"},
    {"name": "Rus 5 (Main)", "path": "public/textbooks/5/rus-dili-5/rus-5.pdf"},
    {"name": "Rus 5 (2nd)", "path": "public/textbooks/5/rus-dili-2-5/rus-2-5.pdf"}
]

for pdf in pdfs:
    print(f"\n--- {pdf['name']} ---")
    if not os.path.exists(pdf['path']):
        print(f"File not found: {pdf['path']}")
        continue
    try:
        with pdfplumber.open(pdf['path']) as document:
            # Check first 10 pages for TOC
            for i in range(min(10, len(document.pages))):
                text = document.pages[i].extract_text()
                if text and ("Mündərəcat" in text or "MÜNDƏRİCAT" in text or "Inhalt" in text or "Содержание" in text or "SOMMAIRE" in text):
                    print(f"Found TOC on page {i+1}:")
                    print(text)
                    print("-" * 20)
    except Exception as e:
        print(f"Error reading {pdf['path']}: {e}")
