import json
import logging
import os
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))
from rag_system.ederslik_extractor import EDerslikExtractor
from rag_system.rag_cleaner import RAGCleaner

def ingest_phase5():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    # Book IDs to ingest in Phase 5
    books_to_ingest = [
        {"id": "tesviri-incesenet-6", "book_id": 557, "subject": "Təsviri incəsənət"},
        {"id": "alman-dili-6-2", "book_id": 917, "subject": "Alman dili"},
        {"id": "fransiz-dili-6-2", "book_id": 918, "subject": "Fransız dili"},
        {"id": "rus-dili-6-2", "book_id": 563, "subject": "Rus dili"}
    ]

    extractor = EDerslikExtractor()
    cleaner = RAGCleaner()
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    
    total_new_chunks = 0
    
    for book in books_to_ingest:
        logger.info(f"Processing {book['id']} (ID: {book['book_id']})...")
        
        try:
            # Fetch book content
            # EDerslikExtractor.fetch_book usually returns a list of pages/sections
            content = extractor.fetch_book(book['book_id'])
            
            if not content:
                logger.warning(f"No content found for {book['id']}")
                continue
            
            # Simple chunking for XHTML (usually page-based or section-based in fetch_book)
            book_chunks = []
            for i, page in enumerate(content):
                text = page.get('text', '')
                if not text.strip():
                    continue
                
                # Clean text
                clean_text = cleaner.clean(text)
                
                chunk = {
                    "id": f"{book['id']}_{i}",
                    "grade": 6,
                    "subject": book['subject'],
                    "book_id": book['id'],
                    "source": "e-derslik.edu.az",
                    "text": clean_text,
                    "page": page.get('page_num', i + 1),
                    "type": "xhtml_page",
                    "knowledge": []
                }
                book_chunks.append(chunk)
            
            if not book_chunks:
                logger.warning(f"No valid chunks for {book['id']}")
                continue

            # Atomic update in jsonl
            temp_path = output_path.with_suffix(f'.tmp_{book["id"]}')
            replaced_count = 0
            
            with open(output_path, 'r', encoding='utf-8') as f_in, \
                 open(temp_path, 'w', encoding='utf-8') as f_out:
                for line in f_in:
                    if line.strip():
                        item = json.loads(line)
                        # Remove both old ID and potentially mis-mapped IDs
                        if item.get('book_id') == book['id']:
                            replaced_count += 1
                            continue
                        f_out.write(line)
                for chunk in book_chunks:
                    f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            
            os.replace(temp_path, output_path)
            logger.info(f"Integrated {len(book_chunks)} chunks for {book['id']} (removed {replaced_count} old)")
            total_new_chunks += len(book_chunks)
            
        except Exception as e:
            logger.error(f"Failed to ingest {book['id']}: {str(e)}")

    logger.info(f"Phase 5 complete. Total new chunks: {total_new_chunks}")

if __name__ == "__main__":
    ingest_phase5()
