import json
import logging
import os
import sys
import requests
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))
from rag_content_extractor import ContentExtractor
from rag_system.rag_cleaner import RAGCleaner

def ingest_az_history_7_incremental():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    book = {
        "id": "azerbaycan-tarixi-7", 
        "url": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-7-ci-sinif-ucun-darslik.pdf", 
        "subject": "Azərbaycan tarixi"
    }

    extractor = ContentExtractor()
    cleaner = RAGCleaner()
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    
    pdf_path = Path(f"scripts/ocr_temp/{book['id']}.pdf")
    pdf_path.parent.mkdir(exist_ok=True)
    
    if not pdf_path.exists():
        logger.info(f"Downloading PDF from {book['url']}...")
        response = requests.get(book['url'], timeout=60)
        with open(pdf_path, 'wb') as f:
            f.write(response.content)
    
    # We will use extract_pdf_pages (generator) to save incrementally
    logger.info(f"Extracting pages incrementally...")
    
    book_chunks = []
    # ContentExtractor initialized in parent
    # extract_pdf_pages(pdf_path, subject, skip_pages)
    
    try:
        page_gen = extractor.extract_pdf_pages(str(pdf_path), subject=book['subject'])
        for page in page_gen:
            text = page.get('text', '')
            page_num = page.get('page', 0)
            if not text.strip(): 
                continue
            
            clean_text = cleaner.clean(text)
            chunk = {
                "id": f"{book['id']}_{page_num}",
                "grade": 7,
                "subject": book['subject'],
                "book_id": book['id'],
                "source": book['url'],
                "text": clean_text,
                "page": page_num,
                "type": "pdf_page",
                "knowledge": []
            }
            book_chunks.append(chunk)
            
            # Save every 5 pages to minimize rewrite overhead while keeping progress
            if len(book_chunks) % 5 == 0:
                logger.info(f"Intermediate save: {len(book_chunks)} pages processed...")
                _update_db(output_path, book['id'], book_chunks)
        
        # Final save
        if book_chunks:
            _update_db(output_path, book['id'], book_chunks)
            logger.info(f"Successfully integrated {len(book_chunks)} chunks for {book['id']}")
            
    except Exception as e:
        logger.error(f"Error during incremental ingestion: {e}")
        # Save what we have if possible
        if book_chunks:
            _update_db(output_path, book['id'], book_chunks)

def _update_db(output_path, book_id, chunks):
    """
    Updates the database with the current collected chunks for this book.
    Replaces existing ones for this book_id with the new list.
    """
    temp_path = output_path.with_suffix(f'.tmp_inc_{book_id}')
    
    with open(output_path, 'r', encoding='utf-8') as f_in, \
         open(temp_path, 'w', encoding='utf-8') as f_out:
        for line in f_in:
            if line.strip():
                item = json.loads(line)
                if item.get('book_id') == book_id:
                    continue
                f_out.write(line)
        for chunk in chunks:
            f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
    
    os.replace(temp_path, output_path)

if __name__ == "__main__":
    ingest_az_history_7_incremental()
