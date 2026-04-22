
import sys
import os
import json
import logging

# Add project root to sys.path
sys.path.append(r"c:\Users\User\Downloads\azerbaijanaiplatform\scripts\rag_system")

from ederslik_extractor import EDerslikExtractor
from section_parser import SectionParser
from noise_remover import NoiseRemover

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

TARGET_BOOKS = [
    {"id": "azerbaycan-tarixi-11", "e_derslik_id": "807", "subject": "Azerbaijan History", "grade": 11},
    {"id": "umumi-tarix-11", "e_derslik_id": "808", "subject": "General History", "grade": 11},
    {"id": "edebiyyat-11", "e_derslik_id": "813", "subject": "Literature", "grade": 11},
    {"id": "rus-dili-esas-11", "e_derslik_id": "816", "subject": "Russian Language", "grade": 11}
]

def targeted_ingestion():
    target_jsonl = r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl"
    
    extractor = EDerslikExtractor()
    parser = SectionParser()
    remover = NoiseRemover()
    
    all_new_chunks = []
    
    for book in TARGET_BOOKS:
        logger.info(f"Targeted processing: {book['id']}...")
        pages = extractor.fetch_book(book['e_derslik_id'])
        
        if not pages:
            logger.warning(f"No pages found for {book['id']}")
            continue
            
        full_text = "\n".join([p['text'] for p in pages])
        sections = parser.parse(full_text, subject=book['subject'], is_html=True)
        
        book_chunks = []
        for sec in sections:
            clean_content = remover.remove_noise("\n".join(sec['content']))
            if len(clean_content) < 50: continue
            
            chunk = {
                "book_id": book['id'],
                "subject": book['subject'],
                "grade": book['grade'],
                "chapter": sec['title'],
                "content": clean_content,
                "metadata": {
                    "source": f"e-derslik ID {book['e_derslik_id']}",
                    "level": sec['level']
                }
            }
            book_chunks.append(chunk)
            
        logger.info(f"  [+] Generated {len(book_chunks)} chunks for {book['id']}")
        all_new_chunks.extend(book_chunks)
        
    if all_new_chunks:
        with open(target_jsonl, "a", encoding="utf-8") as f:
            for chunk in all_new_chunks:
                f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
        logger.info(f"SUCCESS: Added {len(all_new_chunks)} high-quality chunks to database.")
    else:
        logger.error("No chunks were generated in targeted mode.")

if __name__ == "__main__":
    targeted_ingestion()
