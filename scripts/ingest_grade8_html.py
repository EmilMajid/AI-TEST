import sys
import os
import json
import logging
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
from html_content_extractor import HTMLContentExtractor

def ingest_grade8_html():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    base_dir = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\public\textbooks\8")
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    extractor = HTMLContentExtractor()
    
    books = [
        {"id": "informatika-8",       "subject": "İnformatika",   "path": "informatika",        "grade": 8},
        {"id": "azerbaycan-dili-8",   "subject": "Azərbaycan dili","path": "azerbaycan-dili",   "grade": 8},
        {"id": "ingilis-dili-8",      "subject": "Xarici dil",    "path": "ingilis-dili",       "grade": 8},
        {"id": "rus-dili-8",          "subject": "Xarici dil",    "path": "rus-dili-esas",      "grade": 8},
        {"id": "rus-dili-ikinci-8",   "subject": "İkinci xarici", "path": "rus-dili-ikinci",    "grade": 8},
        {"id": "fransiz-dili-8",      "subject": "Xarici dil",    "path": "fransiz-dili-esas",  "grade": 8},
        {"id": "fransiz-dili-ikinci-8","subject":"İkinci xarici", "path": "fransiz-dili-ikinci","grade": 8},
        {"id": "alman-dili-8",        "subject": "Xarici dil",    "path": "alman-dili-esas",    "grade": 8},
        {"id": "alman-dili-ikinci-8", "subject": "İkinci xarici", "path": "alman-dili-ikinci",  "grade": 8},
    ]
    
    for book in books:
        book_dir = base_dir / book["path"]
        if not book_dir.exists():
            logger.warning(f"Directory not found for {book['id']}: {book_dir}")
            continue
        
        logger.info(f"Extracting {book['id']} from {book_dir}")
        pages = extractor.extract_with_page_numbers(book_dir, subject=book["subject"])
        
        if not pages:
            logger.warning(f"No content extracted for {book['id']}")
            continue

        new_chunks = [
            {
                "id": i,
                "grade": book["grade"],
                "subject": book["subject"],
                "book_id": book["id"],
                "source": "local_html",
                "text": p["text"],
                "page": p["page"],
                "type": "html_page",
                "knowledge": []
            }
            for i, p in enumerate(pages)
        ]

        # Replace old entries and append new ones atomically
        temp_path = output_path.with_suffix('.tmp')
        replaced_count = 0
        
        with open(output_path, 'r', encoding='utf-8') as f_in, \
             open(temp_path, 'w', encoding='utf-8') as f_out:
            for line in f_in:
                if line.strip():
                    item = json.loads(line)
                    if item.get('book_id') == book['id']:
                        replaced_count += 1
                        continue
                    f_out.write(line)
            for chunk in new_chunks:
                f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
        
        os.replace(temp_path, output_path)
        logger.info(f"  -> {len(new_chunks)} pages for {book['id']} (removed {replaced_count} old)")

    logger.info("Grade 8 HTML ingestion complete!")

if __name__ == "__main__":
    ingest_grade8_html()
