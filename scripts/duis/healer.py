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

def heal():
    if not os.path.exists(TEXTBOOKS_JSON):
        return
        
    with open(TEXTBOOKS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    
    for grade, books in data.items():
        for book in books:
            content_path = book.get("content_path", book.get("contentPath", ""))
            if not content_path:
                continue
            
            abs_cp = os.path.join(os.getcwd(), content_path)
            if not os.path.exists(abs_cp):
                continue
                
            # Auto-detect Type & Path
            # HTML?
            html_entry = os.path.join(abs_cp, "OEBPS", "cover.xhtml")
            if os.path.exists(html_entry):
                new_path = f"/textbooks/{grade}/{os.path.basename(content_path)}/OEBPS/cover.xhtml"
                if book.get("type") != "html" or book.get("path") != new_path:
                    print(f"  [HEAL] {book['id']}: pdf -> html, fixed path")
                    book["type"] = "html"
                    book["path"] = new_path
                    modified = True
                continue
            
            # Sub-HTML (History/Informatika style)?
            sub_folders = [f for f in os.listdir(abs_cp) if os.path.isdir(os.path.join(abs_cp, f))]
            found_sub = False
            for sf in sub_folders:
                basla = os.path.join(abs_cp, sf, "basla.html")
                if os.path.exists(basla):
                    new_path = f"/textbooks/{grade}/{os.path.basename(content_path)}/{sf}/basla.html"
                    if book.get("type") != "html" or book.get("path") != new_path:
                        print(f"  [HEAL] {book['id']}: Fixed subfolder HTML path")
                        book["type"] = "html"
                        book["path"] = new_path
                        modified = True
                    found_sub = True
                    break
            if found_sub: continue
            
            # PDF?
            pdf_path = os.path.join(abs_cp, "book.pdf")
            if os.path.exists(pdf_path):
                new_path = f"/textbooks/{grade}/{os.path.basename(content_path)}/book.pdf"
                if book.get("type") != "pdf" or book.get("path") != new_path:
                    print(f"  [HEAL] {book['id']}: html -> pdf, fixed path")
                    book["type"] = "pdf"
                    book["path"] = new_path
                    modified = True

    if modified:
        with open(TEXTBOOKS_JSON, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("✅ textbooks.json has been auto-healed.")
    else:
        print("No healing needed for existing entries.")

def sync_topics(book_id, topics_data, grade=None):
    """Syncs extracted topics to the platform's central registry (extracted-topics.json)"""
    REGISTRY_PATH = "scripts/extracted-topics.json"
    
    registry = {}
    if os.path.exists(REGISTRY_PATH):
        with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
            registry = json.load(f)
    
    # Format for the API: { "chapter": "...", "topics": [ {title, page, path} ] }
    # DuisExtractor returns a flat list for now or a manual map.
    # We'll group them into a single "Mövzular" chapter if not structured.
    
    formatted_topics = []
    if topics_data.get("type") == "manual" and topics_data.get("map"):
        t_map = topics_data["map"]
        for title in topics_data["topics"]:
            formatted_topics.append({
                "title": title,
                "page": t_map.get(title, 0),
                "path": "MANUAL_RESCUE"
            })
    else:
        for idx, title in enumerate(topics_data.get("topics", [])):
            formatted_topics.append({
                "title": title,
                "page": idx + 1,
                "path": topics_data.get("source", "")
            })

    group = {
        "chapter": "Mövzular",
        "topics": formatted_topics
    }
    
    registry[book_id] = [group]
    
    # Also support grade-suffix key used by API fallback
    if grade:
        registry[f"{book_id}-{grade}"] = [group]

    with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Synchronized topics for {book_id} to {REGISTRY_PATH}")

if __name__ == "__main__":
    heal()
