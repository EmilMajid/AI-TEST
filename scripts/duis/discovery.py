import os
import json

TEXTBOOKS_JSON = "data/textbooks.json"
BASE_DIR = "public/textbooks"

# Master Subject List from education-data.ts
SUBJECTS_BY_CLASS = {
    "1": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "2": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "3": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "4": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "5": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Təbiət", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "6": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Coğrafiya", "Təbiət", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "7": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "8": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "9": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "10": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Fiziki tərbiyə", "Çağırışaqədərki hazırlıq"],
    "11": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Fiziki tərbiyə", "Çağırışaqədərki hazırlıq"]
}

def discover():
    if not os.path.exists(TEXTBOOKS_JSON):
        return {"error": "textbooks.json not found"}
        
    with open(TEXTBOOKS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    report = {
        "subject_gaps": [],
        "broken_paths": [],
        "orphan_folders": [],
        "info": []
    }
    
    for grade, expected_subjects in SUBJECTS_BY_CLASS.items():
        if grade not in data:
            report["subject_gaps"].append(f"Grade {grade}: Missing in textbooks.json")
            continue
            
        registered_books = data[grade]
        registered_subjects = set(book["subject"] for book in registered_books)
        
        # 1. Subject Gaps (Expected but not in JSON)
        for sub in expected_subjects:
            if sub not in registered_subjects:
                report["subject_gaps"].append(f"Grade {grade}: '{sub}' missing")
        
        # 2. Broken Paths & Casing
        for book in registered_books:
            title = book.get("title", book.get("id"))
            path = book.get("path", "")
            
            # Absolute path check
            if path.startswith("http"):
                continue # Skip external links for now
                
            abs_path = os.path.join(os.getcwd(), "public", path.lstrip("/"))
            if not os.path.exists(abs_path):
                report["broken_paths"].append(f"Grade {grade}: '{title}' invalid path '{path}'")
            
            # ContentPath check
            cp = book.get("contentPath", "")
            if cp:
                abs_cp = os.path.join(os.getcwd(), cp)
                if not os.path.exists(abs_cp):
                    report["broken_paths"].append(f"Grade {grade}: '{title}' invalid contentPath '{cp}'")

    # 3. Orphan Folders (On disk but not in JSON)
    for grade_folder in os.listdir(BASE_DIR):
        grade_path = os.path.join(BASE_DIR, grade_folder)
        if not os.path.isdir(grade_path):
            continue
            
        if grade_folder not in data:
            report["orphan_folders"].append(f"Grade {grade_folder}: Extra grade folder on disk")
            continue
            
        json_content_paths = [book.get("contentPath", "").replace("\\", "/") for book in data[grade_folder]]
        
        for sub_folder in os.listdir(grade_path):
            sub_path = os.path.join(grade_path, sub_folder).replace("\\", "/")
            if os.path.isdir(sub_path):
                # Check if this folder is mentioned in any book's contentPath
                found = False
                for jcp in json_content_paths:
                    if jcp.endswith(sub_folder):
                        found = True
                        break
                if not found:
                    report["orphan_folders"].append(f"Grade {grade_folder}: Orphan folder '{sub_folder}'")

    return report

if __name__ == "__main__":
    import sys
    results = discover()
    print("--- DUİS DISCOVERY REPORT ---")
    
    if results.get("error"):
        print(f"ERROR: {results['error']}")
        sys.exit(1)
        
    for key, items in results.items():
        if key == "info": continue
        print(f"\n[{key.upper()}] ({len(items)})")
        for item in items:
            print(f"  - {item}")
    
    total_issues = sum(len(items) for key, items in results.items() if key != "info")
    print(f"\nTotal Issues Found: {total_issues}")
