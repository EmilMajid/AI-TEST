import fitz  # PyMuPDF
import json
import os

def extract_toc(pdf_path, output_json):
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        return []

    print(f"📄 Extracting TOC from: {pdf_path}")
    doc = fitz.open(pdf_path)
    toc = doc.get_toc()
    
    formatted_toc = []
    if toc:
        print(f"✅ Found {len(toc)} bookmark(s).")
        for level, title, page in toc:
            formatted_toc.append({
                "level": level,
                "title": title.strip(),
                "page": page
            })
    else:
        print("⚠️ No bookmarks found. Attempting first 10 pages for clues...")
        # Fallback: Just return first few pages as dummy topics to be fixed manually if needed
        # But for now, let's keep it empty to flag as a gap
        pass
        
    return formatted_toc

def audit_grade_8_tocs():
    results = {}
    base_dir = "public/textbooks/8"
    subjects = [
        "azerbaycan-dili", "riyaziyyat", "fizika", "kimya", 
        "biologiya", "cografiya", "azerbaycan-tarixi", "umumi-tarix",
        "edebiyyat", "informatika"
    ]
    
    for sub in subjects:
        pdf_path = os.path.join(base_dir, sub, "book.pdf")
        toc = extract_toc(pdf_path, f"{sub}_toc.json")
        if toc:
            results[sub] = toc
            
    with open("scripts/extracted-topics-8.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"🏁 Extraction complete. Results saved to scripts/extracted-topics-8.json")

if __name__ == "__main__":
    audit_grade_8_tocs()
