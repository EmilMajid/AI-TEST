import pdfplumber
import os

pdf_path = "public/textbooks/6/azerbaycan-tarixi/book.pdf"

if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found")
    exit(1)

print(f"Opening {pdf_path}...")
with pdfplumber.open(pdf_path) as pdf:
    # Check pages 3 to 7 (index 2 to 6)
    for i in range(2, 8):
        if i >= len(pdf.pages): break
        
        print(f"\n--- PAGE {i+1} ---")
        page = pdf.pages[i]
        text = page.extract_text()
        if text:
            print(text)
        else:
            print("[No text found on this page - might be an image]")
