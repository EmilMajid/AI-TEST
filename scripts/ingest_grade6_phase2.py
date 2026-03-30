import sys
import json
import logging
import os
from pathlib import Path

# Add scripts_dir to sys.path to access rag_system modules
scripts_dir = Path(__file__).parent / "rag_system"
sys.path.append(str(scripts_dir))

from ederslik_extractor import EDerslikExtractor

def ingest_grade6_phase2():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    books = [
        {"id": "tebiet-6-h1", "e_derslik_id": "780", "subject": "Təbiət"},
        {"id": "tebiet-6-h2", "e_derslik_id": "781", "subject": "Təbiət"},
        {"id": "edebiyyat-6", "e_derslik_id": "911", "subject": "Ədəbiyyat"},
        {"id": "cografiya-6-h1", "e_derslik_id": "859", "subject": "Coğrafiya"},
        {"id": "cografiya-6-h2", "e_derslik_id": "860", "subject": "Coğrafiya"},
    ]
    
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    extractor = EDerslikExtractor()
    
    for book in books:
        logger.info(f"Starting ingestion for {book['id']} (ID: {book['e_derslik_id']})")
        
        pages = extractor.fetch_book(e_derslik_id=book['e_derslik_id'])
        
        if not pages:
            logger.error(f"No pages extracted for {book['id']}. Skipping.")
            continue

        new_chunks = [
            {
                "id": i,
                "grade": 6,
                "subject": book["subject"],
                "book_id": book["id"],
                "source": "e-derslik.edu.az",
                "text": p["text"],
                "page": p["page"],
                "type": "html_page",
                "knowledge": [],
                "metadata": {"has_images": len(p.get("images", [])) > 0}
            }
            for i, p in enumerate(pages)
        ]

        # Atomically update database
        temp_path = output_path.with_suffix('.tmp_g6_p2')
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
        logger.info(f"Done: {len(new_chunks)} pages for {book['id']} (removed {replaced_count} old/dummy entries)")

if __name__ == "__main__":
    ingest_grade6_phase2()
