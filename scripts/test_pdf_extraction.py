import pdfplumber
import os
from pathlib import Path

def test_extraction(pdf_path, max_pages=5):
    print(f"Opening PDF: {pdf_path}")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
            pages_to_read = min(len(pdf.pages), max_pages)
            for i in range(pages_to_read):
                print(f"--- Reading Page {i+1} ---")
                page = pdf.pages[i]
                text = page.extract_text()
                if text:
                    print(f"Extracted {len(text)} characters.")
                    print(text[:500] + "...")
                else:
                    print("No text extracted from this page.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_files = [
        r"public\textbooks\6\ingilis-dili\book.pdf",
        r"public\textbooks\6\informatika\book.pdf",
        r"public\textbooks\6\texnologiya\book.pdf",
        r"public\textbooks\6\musiqi\book.pdf"
    ]
    for pdf_file in test_files:
        if os.path.exists(pdf_file):
            print(f"\n===== Testing {pdf_file} =====")
            test_extraction(pdf_file, max_pages=10)
        else:
            print(f"File not found: {pdf_file}")
