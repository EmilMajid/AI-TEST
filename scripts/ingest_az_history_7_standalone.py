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

def ingest_az_history_7_standalone():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    book = {
        "id": "azerbaycan-tarixi-7", 
        "url": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-7-ci-sinif-ucun-darslik.pdf", 
        "subject": "Azərbaycan tarixi"
    }

    extractor = ContentExtractor()
    cleaner = RAGCleaner()
    dedicated_output = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\azerbaycan-tarixi-7-chunks.jsonl")
    
    pdf_path = Path(f"scripts/ocr_temp/{book['id']}.pdf")
    
    logger.info(f"Extracting pages to dedicated file: {dedicated_output}")
    
    chunks_count = 0
    try:
        with open(dedicated_output, 'w', encoding='utf-8') as f_out:
            page_gen = extractor.extract_pdf_pages(str(pdf_path), subject=book['subject'])
            for page in page_gen:
                page_data = page.get('page_data', {})
                text = page_data.get('text', '')
                page_num = page_data.get('page', 0)
                if not text.strip(): continue
                
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
                f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
                chunks_count += 1
                if chunks_count % 10 == 0:
                    logger.info(f"Saved {chunks_count} chunks...")
        
        logger.info(f"Successfully finished. Total {chunks_count} chunks saved to {dedicated_output}")
            
    except Exception as e:
        logger.error(f"Error: {e}")

if __name__ == "__main__":
    ingest_az_history_7_standalone()
