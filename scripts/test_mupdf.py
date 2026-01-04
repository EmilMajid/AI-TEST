import fitz  # PyMuPDF
import sys
import os

def test_extraction(pdf_path):
    print(f"Testing PyMuPDF on: {pdf_path}")
    if not os.path.exists(pdf_path):
        print(f"Error: File not found at {pdf_path}")
        return

    try:
        doc = fitz.open(pdf_path)
        print(f"Total pages: {len(doc)}")
        
        # Test first 5 pages
        for i in range(min(5, len(doc))):
            page = doc[i]
            text = page.get_text()
            print(f"\n--- Page {i+1} ---")
            if text.strip():
                print(f"Extracted {len(text)} characters.")
                print("Snippet:", text.strip()[:200])
            else:
                print("No text extracted (Image-based page).")
        
        doc.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test on known Grade 5 PDFs
    paths = [
        "public/textbooks/5/tebiet-hisse-1/tebiet-5-1.pdf",
        "public/textbooks/5/rus-dili-5/rus-5.pdf"
    ]
    
    for p in paths:
        test_extraction(p)
        print("\n" + "="*50 + "\n")
