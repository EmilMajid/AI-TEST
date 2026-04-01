import json
import logging
import os
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.append(str(Path(__file__).parent))
from rag_system.rag_cleaner import RAGCleaner
# We'll use fitz directly for PDF extraction as requested for high quality, 
# then pass through the DUIS cleaning pipeline.

def ingest_eng6_pdf():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    book_id = "ingilis-dili-2-6"
    pdf_path = r"c:\Users\User\Downloads\azerbaijanaiplatform\public\textbooks\6\ingilis-dili-2\book.pdf"
    
    if not os.path.exists(pdf_path):
        logger.error(f"PDF not found at {pdf_path}")
        return

    # User requested PDF pages 10 to 114 (inclusive)
    pages_to_extract = list(range(10, 115)) 
    
    import fitz # PyMuPDF
    doc = fitz.open(pdf_path)
    
    cleaner = RAGCleaner()
    extracted_data = []

    for page_num in pages_to_extract:
        if page_num < 1 or page_num > len(doc):
            continue
        
        # 0-indexed in PyMuPDF
        page = doc[page_num - 1]
        text = page.get_text("text") # high quality text extraction
        
        # Apply DUIS cleaning/normalization
        # RAGCleaner usually has clean() method
        clean_text = cleaner.clean(text)
        
        extracted_data.append({
            "page": page_num, 
            "text": clean_text,
            "metadata": {"source_page": page_num}
        })
    doc.close()

    if not extracted_data:
        logger.error("No data extracted.")
        return

    # Create chunks (simple page-based chunking for now, 
    # as standard in the current system for PDFs)
    new_chunks = [
        {
            "id": i,
            "grade": 6,
            "subject": "İngilis dili",
            "book_id": book_id,
            "source": "trims.edu.az",
            "text": item["text"],
            "page": item["page"],
            "type": "pdf_page",
            "knowledge": []
        }
        for i, item in enumerate(extracted_data)
    ]

    # Save to database
    output_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl")
    temp_path = output_path.with_suffix('.tmp_eng6_2')
    replaced_count = 0
    
    with open(output_path, 'r', encoding='utf-8') as f_in, \
         open(temp_path, 'w', encoding='utf-8') as f_out:
        for line in f_in:
            if line.strip():
                item = json.loads(line)
                if item.get('book_id') == book_id:
                    replaced_count += 1
                    continue
                f_out.write(line)
        for chunk in new_chunks:
            f_out.write(json.dumps(chunk, ensure_ascii=False) + "\n")
    
    os.replace(temp_path, output_path)
    logger.info(f"Successfully integrated {len(new_chunks)} chunks for {book_id} (removed {replaced_count} old/dummy entries)")

if __name__ == "__main__":
    ingest_eng6_pdf()
