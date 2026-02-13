import json
from pathlib import Path
import sys
import io

# Force UTF-8 for console output on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def check_grade5_pdfs():
    base_dir = Path("public/textbooks/5")
    
    with open("data/textbooks.json", encoding="utf-8") as f:
        data = json.load(f)
    
    pdf_books = [b for b in data.get("5", []) if b.get("type") == "pdf"]
    
    print("=" * 70)
    print("GRADE 5 PDF AVAILABILITY CHECK")
    print("=" * 70)
    print()
    
    found_count = 0
    missing_count = 0
    
    for book in pdf_books:
        book_id = book["id"]
        title = book["title"]
        content_path = Path(book["contentPath"])
        
        pdf_files = list(content_path.glob("**/*.pdf"))
        
        if pdf_files:
            status = "[OK] FOUND"
            found_count += 1
            print(f"{status:15} | {book_id:30} | {len(pdf_files)} file(s)")
            for pdf in pdf_files:
                print(f"                └─ {pdf.name}")
        else:
            status = "[X] MISSING"
            missing_count += 1
            print(f"{status:15} | {book_id:30} | No PDF files")
    
    print()
    print("=" * 70)
    print(f"Summary: {found_count} found, {missing_count} missing")
    print("=" * 70)

if __name__ == "__main__":
    check_grade5_pdfs()
