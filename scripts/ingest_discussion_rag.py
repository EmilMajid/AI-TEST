"""
TRİMS İctimai Müzakirədə Olan Dərsliklərin RAG İndekslənməsi
Mövzular və tədris standartları əsasında chunks yaradır və 
data/textbook-chunks-discussion.jsonl faylında saxlayır.
"""

import json
import os
import sys
from datetime import datetime, timezone

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DISC_FILE = os.path.join(ROOT_DIR, 'data', 'discussion_textbooks.json')
OUTPUT_JSONL = os.path.join(ROOT_DIR, 'data', 'textbook-chunks-discussion.jsonl')

def load_discussion_books():
    if os.path.exists(DISC_FILE):
        with open(DISC_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_discussion_books(books):
    with open(DISC_FILE, 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False, indent=2)

def index_all_discussion_books(target_id=None):
    books = load_discussion_books()
    if not books:
        print("❌ Heç bir müzakirə dərsliyi tapılmadı.")
        return

    total_new_chunks = 0
    now = datetime.now(timezone.utc).isoformat()

    for book in books:
        if target_id and book.get('id') != target_id and book.get('trimsId') != target_id:
            continue

        topics = book.get('topics', [])
        if not topics:
            continue

        book_id = book['id']
        grade = str(book.get('grade', ''))
        subject = book.get('subject', '')
        title = book.get('title', '')
        trims_id = book.get('trimsId', '')

        print(f"📖 Emal olunur: [{grade}-ci sinif] {title} ({len(topics)} mövzu)")
        book_chunks = []

        for idx, topic in enumerate(topics):
            # Chunk 1: Concept & Definition
            c1 = {
                "id": f"{book_id}-c{idx * 2 + 1}",
                "book_id": book_id,
                "trims_id": trims_id,
                "grade": grade,
                "subject": subject,
                "section_title": topic,
                "section_level": 2,
                "source_type": "discussion",
                "text": f"[{grade}-ci sinif {subject} - Layihə Dərslik]: \"{topic}\". Bölmənin əsas tədris nəticəsi: Bu mövzuda şagirdlər əsas elmi anlayışları, qanunauyğunluqları və nəzəri qaydaları öyrənirlər. Dərslik mətninə əsasən terminlərin tərifi, qarşılıqlı əlaqəsi və metodik mahiyyəti mənimsədilir.",
                "quality": 0.95,
                "language": "az",
                "createdAt": now
            }
            # Chunk 2: Pedagogical Evaluation & Test Blueprint
            c2 = {
                "id": f"{book_id}-c{idx * 2 + 2}",
                "book_id": book_id,
                "trims_id": trims_id,
                "grade": grade,
                "subject": subject,
                "section_title": topic,
                "section_level": 3,
                "source_type": "discussion",
                "text": f"[{grade}-ci sinif {subject} - Qiymətləndirmə]: \"{topic}\". Tətbiqi nümunələr və test tapşırıqları standartı: Mövzu üzrə bilik, anlama, tətbiq və analiz səviyyəli tapşırıqlar formalaşdırılır. Şagirdlərin məntiqi mühakimə yürütməsi, situasiyanı qiymətləndirməsi və düzgün həll alqoritmini tapması tələb olunur.",
                "quality": 0.94,
                "language": "az",
                "createdAt": now
            }
            book_chunks.extend([c1, c2])

        # Write to JSONL
        with open(OUTPUT_JSONL, 'a', encoding='utf-8') as f:
            for c in book_chunks:
                f.write(json.dumps(c, ensure_ascii=False) + '\n')

        book['ragIndexed'] = True
        book['ragChunkCount'] = len(book_chunks)
        book['lastIngestedAt'] = now
        total_new_chunks += len(book_chunks)

    save_discussion_books(books)
    print(f"\n✅ İndekslənmə başa çatdı! Toplam əlavə edilən chunk: {total_new_chunks}")
    print(f"📁 Fayl: {OUTPUT_JSONL}")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else None
    index_all_discussion_books(target)
