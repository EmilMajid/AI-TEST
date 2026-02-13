import sys
import os
import io
import fitz
import pdfplumber
from PIL import Image
from pathlib import Path

# Add scripts directory to path
sys.path.append(str(Path.cwd() / "scripts"))

# Mock import for llm_utils if missing
try:
    from rag_content_extractor import ContentExtractor
except ImportError:
    print("WARNING: rag_content_extractor not found in path")

def debug_pdf_extraction(pdf_path):
    print(f"DEBUG: Testing extraction for {pdf_path}")
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return

    try:
        extractor = ContentExtractor()
        print("ContentExtractor initialized.")
        
        # Test fitz explicitly
        doc = fitz.open(pdf_path)
        print(f"Fitz opened PDF. Pages: {len(doc)}")
        
        for i in range(min(5, len(doc))):
            page = doc[i]
            text = page.get_text()
            print(f"\n--- Page {i+1} (Fitz) ---")
            print(f"Text length: {len(text)}")
            if len(text) < 50:
                print("Text too short, likely OCR candidate.")
            else:
                print(f"Preview: {text[:100].replace('\n', ' ')}")
                
        # Now try using the extractor method
        print("\n--- Trying ContentExtractor.extract_pdf_pages ---")
        # Use valid subject to trigger specific cleaning rules if any
        generator = extractor.extract_pdf_pages(pdf_path, subject="Xarici dil")
        
        count = 0
        for item in generator:
            page_data = item["page_data"]
            print(f"\nPAGE {page_data['page']}:")
            print(f"  Raw Length: {len(page_data.get('text', ''))}")
            print(f"  OCR Used: {page_data.get('ocr_used')}")
            print(f"  Quality Score: {page_data.get('quality_score')}")
            print(f"  Text Preview (Cleaned): {page_data['text'][:100].replace(chr(10), ' ')}...")
            
            # Test chunking for this page
            chunks = extractor.chunk_content([page_data], subject="Xarici dil", grade=5, book_id="debug_book")
            print(f"  Chunks generated: {len(chunks)}")
            for c in chunks:
                print(f"    - Chunk {c['id']} Score: {c['quality_score']}")
            
            count += 1
            if count >= 3:
                break
                
        if count == 0:
            print("ContentExtractor yielded NO pages.")
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    target_pdf = r"public\textbooks\5\alman-dili-5-asas\alman-asas-5.pdf"
    debug_pdf_extraction(target_pdf)
