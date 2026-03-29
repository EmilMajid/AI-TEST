import sys
import json
import logging
import os
from pathlib import Path

# Add scripts_dir to sys.path to access rag_system modules
scripts_dir = Path(__file__).parent / "rag_system"
sys.path.append(str(scripts_dir))

from ederslik_extractor import EDerslikExtractor

def update_textbooks_json():
    json_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for book in data.get('5', []):
        if book['id'] == 'tesviri-incesenet-5':
            book['type'] = 'ederslik_html'
            book['e_derslik_id'] = '455'
            break
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def ingest_tesviri_grade5():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    update_textbooks_json()
    logger.info("Updated textbooks.json to set tesviri-incesenet-5 type to ederslik_html (455).")
    
    book = {"id": "tesviri-incesenet-5", "e_derslik_id": "455", "subject": "Təsviri İncəsənət"}
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    extractor = EDerslikExtractor()
    
    logger.info(f"Starting ingestion for {book['id']} (e-derslik ID: {book['e_derslik_id']})")
    
    pages = extractor.fetch_book(e_derslik_id=book['e_derslik_id'])
    
    if not pages:
        logger.error(f"No pages extracted for {book['id']}. Skipping.")
        return

    new_chunks = [
        {
            "id": i,
            "grade": 5,
            "subject": book["subject"],
            "book_id": book["id"],
            "source": "e-derslik.edu.az",
            "text": p["text"],
            "page": p["page"],
            "type": "html_page",
            "knowledge": []
        }
        for i, p in enumerate(pages)
    ]

    # Replace old entries if any exist
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
    logger.info(f"Done: {len(new_chunks)} pages for {book['id']} (removed {replaced_count} old)")

if __name__ == "__main__":
    ingest_tesviri_grade5()
