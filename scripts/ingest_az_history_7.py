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

def ingest_az_history_7():
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
    
    logger.info(f"Downloading PDF from {book['url']}...")
    pdf_path = Path(f"scripts/ocr_temp/{book['id']}.pdf")
    pdf_path.parent.mkdir(exist_ok=True)
    
    response = requests.get(book['url'], timeout=60)
    with open(pdf_path, 'wb') as f:
        f.write(response.content)
    
    logger.info(f"Extracting pages (this may take time)...")
    # extract_pdf is a heavy operation
    pages = extractor.extract_pdf(str(pdf_path), subject=book['subject'])
    
    book_chunks = []
    for page in pages:
        text = page.get('text', '')
        if not text.strip(): continue
        clean_text = cleaner.clean(text)
        book_chunks.append({
            "id": f"{book['id']}_{page.get('page', 0)}",
            "grade": 7,
            "subject": book['subject'],
            "book_id": book['id'],
            "source": book['url'],
            "text": clean_text,
            "page": page.get('page', 0),
            "type": "pdf_page",
            "knowledge": []
        })
    
    if book_chunks:
        logger.info(f"Saving {len(book_chunks)} chunks to {output_path}...")
        _atomic_update(output_path, book['id'], book_chunks)
        logger.info(f"Successfully integrated {book['id']}")
    else:
        logger.error(f"No content extracted for {book['id']}")

def _atomic_update(output_path, book_id, new_chunks):
    temp_path = output_path.with_suffix(f'.tmp_{book_id}')
    with open(output_path, 'r', encoding='utf-8') as f_in, \
         open(temp_path, 'w', encoding='utf-8') as f_out:
        for line in f_in:
            if line.strip():
                item = json.loads(line)
                if item.get('book_id') == book_id: continue
                f_out.write(line)
        for chunk in new_chunks:
            f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
    os.replace(temp_path, output_path)

if __name__ == "__main__":
    ingest_az_history_7()
