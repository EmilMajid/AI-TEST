import sys
from pathlib import Path
import json
import logging

# Ensure we can import from rag_system
scripts_dir = Path(__file__).parent / "rag_system"
sys.path.append(str(scripts_dir))

from ederslik_extractor import EDerslikExtractor

def ingest_math5_part2():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    book_id = "riyaziyyat-5-h2"
    e_derslik_id = "841"
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    
    extractor = EDerslikExtractor()
    logger.info(f"Starting ingestion for {book_id} (e-derslik ID: {e_derslik_id})")
    
    # Fetch all pages
    pages = extractor.fetch_book(e_derslik_id=e_derslik_id)
    
    if not pages:
        logger.error("No pages extracted. Check connection or book ID.")
        return

    # Prepare chunks
    chunks = []
    for i, p in enumerate(pages):
        chunk = {
            "id": i, # Local sequential ID, will be offset if needed by master aggregator
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
    
    # Append to textbook-chunks.jsonl
    with open(output_path, 'a', encoding='utf-8') as f:
        for chunk in chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
    logger.info(f"Successfully integrated {len(chunks)} pages into {output_path}")

if __name__ == "__main__":
    ingest_math5_part2()
