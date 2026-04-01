import json
import logging
import os
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))
from rag_system.ederslik_extractor import EDerslikExtractor
from rag_system.rag_cleaner import RAGCleaner
from rag_content_extractor import ContentExtractor

def ingest_g7_phase3():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    # 1. Digital Books (XHTML)
    digital_books = [
        {"id": "ingilis-dili-7", "book_id": 710, "subject": "İngilis dili"},
        {"id": "ingilis-dili-2-7", "book_id": 711, "subject": "İngilis dili"},
        {"id": "fransiz-dili-7", "book_id": 704, "subject": "Fransız dili"},
        {"id": "fransiz-dili-2-7", "book_id": 705, "subject": "Fransız dili"},
        {"id": "alman-dili-7", "book_id": 694, "subject": "Alman dili"},
        {"id": "alman-dili-2-7", "book_id": 695, "subject": "Alman dili"},
        {"id": "musiqi-7", "book_id": 712, "subject": "Musiqi"},
        {"id": "texnologiya-7", "book_id": 719, "subject": "Texnologiya"},
        {"id": "tesviri-incesenet-7", "book_id": 721, "subject": "Təsviri İncəsənət"},
        {"id": "informatika-7", "book_id": 708, "subject": "İnformatika"}
    ]

    # 2. PDF Books
    pdf_books = [
        {
            "id": "azerbaycan-tarixi-7", 
            "url": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-7-ci-sinif-ucun-darslik.pdf", 
            "subject": "Azərbaycan tarixi"
        }
    ]

    extractor_xhtml = EDerslikExtractor()
    extractor_content = ContentExtractor()
    cleaner = RAGCleaner()
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    
    total_new_chunks = 0

    # Process Digital
    for book in digital_books:
        logger.info(f"Processing Digital {book['id']} (ID: {book['book_id']})...")
        try:
            content = extractor_xhtml.fetch_book(book['book_id'])
            if not content: continue
            
            book_chunks = []
            for i, page in enumerate(content):
                text = page.get('text', '')
                if not text.strip(): continue
                clean_text = cleaner.clean(text)
                book_chunks.append({
                    "id": f"{book['id']}_{i}",
                    "grade": 7,
                    "subject": book['subject'],
                    "book_id": book['id'],
                    "source": "e-derslik.edu.az",
                    "text": clean_text,
                    "page": page.get('page_num', i + 1),
                    "type": "xhtml_page",
                    "knowledge": []
                })
            
            if book_chunks:
                total_new_chunks += len(book_chunks)
                _atomic_update(output_path, book['id'], book_chunks)
                logger.info(f"Integrated {len(book_chunks)} chunks for {book['id']}")
        except Exception as e:
            logger.error(f"Failed {book['id']}: {e}")

    # Process PDF
    for book in pdf_books:
        logger.info(f"Processing PDF {book['id']} from {book['url']}...")
        try:
            # We don't have a direct 'download' in ContentExtractor that returns a path, 
            # but we can implement it or assume it's there. 
            # Actually, I'll use requests to download it locally to /tmp first.
            import requests
            pdf_path = Path(f"/tmp/{book['id']}.pdf")
            pdf_path.parent.mkdir(exist_ok=True)
            
            response = requests.get(book['url'], timeout=30)
            with open(pdf_path, 'wb') as f:
                f.write(response.content)
            
            # ContentExtractor.extract_pdf returns a list of dicts with 'text' and 'page'
            pages = extractor_content.extract_pdf(str(pdf_path), subject=book['subject'])
            
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
                total_new_chunks += len(book_chunks)
                _atomic_update(output_path, book['id'], book_chunks)
                logger.info(f"Integrated {len(book_chunks)} chunks for {book['id']}")
        except Exception as e:
            logger.error(f"Failed {book['id']}: {e}")

    logger.info(f"Phase 3 complete. Total new chunks: {total_new_chunks}")

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
    ingest_g7_phase3()
