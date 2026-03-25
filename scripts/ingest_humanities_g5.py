import sys
from pathlib import Path
import json
import logging

# Ensure we can import from rag_system
scripts_dir = Path(__file__).parent / "rag_system"
sys.path.append(str(scripts_dir))

from ederslik_extractor import EDerslikExtractor

def ingest_humanities_grade5():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    books_to_ingest = [
        {"id": "azerbaycan-tarixi-5", "e_derslik_id": "844"},
        {"id": "edebiyyat-5", "e_derslik_id": "845"}
    ]
    
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    extractor = EDerslikExtractor()
    
    for book in books_to_ingest:
        logger.info(f"Starting digital ingestion for {book['id']} (ID: {book['e_derslik_id']})")
        
        pages = extractor.fetch_book(e_derslik_id=book['e_derslik_id'])
        
        if not pages:
            logger.error(f"No pages extracted for {book['id']}. Skipping.")
            continue

        # Prepare chunks
        new_chunks = []
        for i, p in enumerate(pages):
            chunk = {
                "id": i,
                "grade": 5,
                "subject": "Azərbaycan tarixi" if "tarixi" in book['id'] else "Ədəbiyyat",
                "book_id": book['id'],
                "source": "e-derslik.edu.az",
                "text": p["text"],
                "page": p["page"],
                "type": "html_page",
                "knowledge": []
            }
            new_chunks.append(chunk)

        # Integrate into master file (Replacing old entries for this book)
        temp_master = output_path.with_suffix('.tmp')
        replaced_count = 0
        
        with open(output_path, 'r', encoding='utf-8') as f_in, \
             open(temp_master, 'w', encoding='utf-8') as f_out:
            
            for line in f_in:
                if line.strip():
                    item = json.loads(line)
                    if item.get('book_id') == book['id']:
                        replaced_count += 1
                        continue # Skip old entries
                    f_out.write(line)
            
            # Append new digital entries
            for chunk in new_chunks:
                f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
                
        # Swap files
        output_path.unlink()
        temp_master.rename(output_path)
                
        logger.info(f"Integrated {len(new_chunks)} digital pages for {book['id']} (Removed {replaced_count} old segments)")

if __name__ == "__main__":
    ingest_humanities_grade5()
