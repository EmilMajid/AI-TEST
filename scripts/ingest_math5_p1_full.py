import sys
from pathlib import Path
import json
import logging

# Ensure we can import from rag_system
scripts_dir = Path(__file__).parent / "rag_system"
sys.path.append(str(scripts_dir))

from ederslik_extractor import EDerslikExtractor

def ingest_math5_part1_full():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    book_id = "riyaziyyat-5-h1"
    e_derslik_id = "840"
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    
    extractor = EDerslikExtractor()
    logger.info(f"Starting FULL digital integration for {book_id} (e-derslik ID: {e_derslik_id})")
    
    # Fetch all pages
    pages = extractor.fetch_book(e_derslik_id=e_derslik_id)
    
    if not pages:
        logger.error("No pages extracted. Check connection or book ID.")
        return

    # Prepare chunks
    chunks = []
    for i, p in enumerate(pages):
        chunk = {
            "id": i,
            "grade": 5,
            "subject": "Riyaziyyat",
            "book_id": book_id,
            "source": "e-derslik.edu.az",
            "text": p["text"],
            "page": p["page"],
            "type": "html_page",
            "knowledge": []
        }
        chunks.append(chunk)
    
    # Integrate into master file (Replacing old riyaziyyat-5-h1 entries)
    temp_master = output_path.with_suffix('.tmp')
    
    replaced_count = 0
    with open(output_path, 'r', encoding='utf-8') as f_in, \
         open(temp_master, 'w', encoding='utf-8') as f_out:
        
        for line in f_in:
            if line.strip():
                item = json.loads(line)
                if item.get('book_id') == book_id:
                    replaced_count += 1
                    continue # Skip old manual entries
                f_out.write(line)
        
        # Append new digital entries
        for chunk in chunks:
            f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
    # Swap files
    output_path.unlink()
    temp_master.rename(output_path)
            
    logger.info(f"Successfully integrated {len(chunks)} digital pages into {output_path} (Removed {replaced_count} old segments)")

if __name__ == "__main__":
    ingest_math5_part1_full()
