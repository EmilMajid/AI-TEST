import json
import os
from pathlib import Path

def generate_g9_json():
    project_root = Path(__file__).parent.parent
    base_path = project_root / "public" / "textbooks" / "9"
    textbooks_json = project_root / "data" / "textbooks.json"
    
    books = []
    
    # Subject mapping for titles and subjects
    mapping = {
        "fiziki-terbiye-9": ("Fiziki tərbiyə 9", "Fiziki tərbiyə"),
        "texnologiya-9": ("Texnologiya 9", "Texnologiya"),
        "hayat-bilgisi-9": ("Həyat bilgisi 9", "Həyat bilgisi"),
        "biologiya-9": ("Biologiya 9", "Biologiya"),
        "fizika-9": ("Fizika 9", "Fizika"),
        "tesviri-incesenet-9": ("Təsviri İncəsənət 9", "Təsviri İncəsənət"),
        "kimya-9": ("Kimya 9", "Kimya"),
        "riyaziyyat-9": ("Riyaziyyat 9", "Riyaziyyat"),
        "musiqi-9": ("Musiqi 9", "Musiqi"),
        "informatika-9": ("İnformatika 9", "İnformatika"),
        "edebiyyat-9": ("Ədəbiyyat 9", "Ədəbiyyat"),
        "cografiya-9": ("Coğrafiya 9", "Coğrafiya"),
        "azerbaycan-dili-dovlet-9": ("Azərbaycan dili 9 (Dövlət dili)", "Azərbaycan dili"),
        "umumi-tarix-9": ("Ümumi tarix 9", "Ümumi tarix"),
        "azerbaycan-dili-9": ("Azərbaycan dili 9", "Azərbaycan dili"),
        "azerbaycan-tarixi-9": ("Azərbaycan tarixi 9", "Azərbaycan tarixi"),
        "ingilis-dili-9": ("İngilis dili 9 (əsas xarici dil)", "Xarici dil"),
        "ingilis-dili-ikinci-9": ("İngilis dili 9 (ikinci xarici dil)", "İkinci xarici dil"),
        "alman-dili-9": ("Alman dili 9 (əsas xarici dil)", "Xarici dil"),
        "alman-dili-ikinci-9": ("Alman dili 9 (ikinci xarici dil)", "İkinci xarici dil"),
        "fransiz-dili-9": ("Fransız dili 9 (əsas xarici dil)", "Xarici dil"),
        "fransiz-dili-ikinci-9": ("Fransız dili 9 (ikinci xarici dil)", "İkinci xarici dil"),
        "rus-dili-9": ("Rus dili 9 (əsas xarici dil)", "Xarici dil"),
        "rus-dili-ikinci-9": ("Rus dili 9 (ikinci xarici dil)", "İkinci xarici dil"),
    }
    
    for book_id, (title, subject) in mapping.items():
        book_dir = base_path / book_id
        if book_dir.exists():
            books.append({
                "id": book_id,
                "title": title,
                "subject": subject,
                "type": "pdf",
                "path": f"/textbooks/9/{book_id}/book.pdf",
                "contentPath": f"public/textbooks/9/{book_id}"
            })
    
    # Load textbooks.json
    with open(textbooks_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    data["9"] = books
    
    with open(textbooks_json, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully added {len(books)} Grade 9 books to textbooks.json")

if __name__ == "__main__":
    generate_g9_json()
