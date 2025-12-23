"""
RAG Content Extractor - Dərslik məlumatlarını çıxarıb strukturlaşdırır
"""
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import os
import json
import re
from typing import List, Dict, Any
from pathlib import Path

class ContentExtractor:
    """Dərsliklərdən mətn, şəkil və düsturları çıxarır"""
    
    def __init__(self):
        self.math_pattern = re.compile(r'\$(.*?)\$|\\\[(.*?)\\\]')
        self.output_dir = Path("data")  # Changed to 'data' to match unified pipeline
        # self.output_dir.mkdir(exist_ok=True) # Pipeline handles this
    
    def extract_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """PDF fayldan məlumatları çıxarır"""
        text_content = []
        formulas = []
        metadata = {
            "source": os.path.basename(pdf_path),
            "pages": 0
        }
        
        try:
            # Extract text and formulas from PDF
            with pdfplumber.open(pdf_path) as pdf:
                metadata["pages"] = len(pdf.pages)
                
                for page_num, page in enumerate(pdf.pages, 1):
                    # Text extraction
                    text = page.extract_text()
                    if text:
                        text_content.append({
                            "page": page_num,
                            "text": text,
                            "type": "text"
                        })
                        
                        # Formula extraction from text
                        math_blocks = self.math_pattern.findall(text)
                        for match in math_blocks:
                            formula = match[0] or match[1]
                            if formula:
                                formulas.append({
                                    "page": page_num,
                                    "formula": formula,
                                    "type": "latex"
                                })
            
            result = {
                "content": text_content,
                "formulas": formulas,
                "metadata": metadata
            }
            
            return result
            
        except Exception as e:
            print(f"Error extracting {pdf_path}: {str(e)}")
            return {
                "content": [],
                "formulas": [],
                "metadata": metadata,
                "error": str(e)
            }
    
    def chunk_content(self, content: List[Dict], chunk_size: int = 500) -> List[Dict]:
        """Məzmunu kiçik hissələrə bölür (chunking)"""
        chunks = []
        current_chunk = []
        current_length = 0
        chunk_id = 0
        
        for item in content:
            text = item["text"]
            words = text.split()
            
            if current_length + len(words) > chunk_size:
                if current_chunk:
                    chunks.append({
                        "id": chunk_id,
                        "text": " ".join(current_chunk),
                        "page": item["page"],
                        "type": "chunk"
                    })
                    chunk_id += 1
                    current_chunk = []
                    current_length = 0
            
            current_chunk.extend(words)
            current_length += len(words)
        
        # Add last chunk
        if current_chunk:
            chunks.append({
                "id": chunk_id,
                "text": " ".join(current_chunk),
                "page": item["page"],
                "type": "chunk"
            })
        
        return chunks

def process_unified_pipeline():
    """Reads textbooks.json, processes PDFs, and appends to existing chunks"""
    extractor = ContentExtractor()
    
    # Paths
    base_dir = Path(os.getcwd())
    textbooks_json_path = base_dir / "data" / "textbooks.json"
    chunks_jsonl_path = base_dir / "data" / "textbook-chunks.jsonl"
    
    if not textbooks_json_path.exists():
        print(f"Error: {textbooks_json_path} not found")
        return

    # Load existing chunks if valid, or start fresh if corrupted
    existing_chunks = []
    if chunks_jsonl_path.exists():
        print(f"Loading existing data from {chunks_jsonl_path}...")
        try:
            with open(chunks_jsonl_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        existing_chunks.append(json.loads(line))
            print(f"Loaded {len(existing_chunks)} existing chunks (mostly EPUB).")
        except Exception as e:
            print(f"Error reading existing chunks: {e}. Starting fresh.")
    
    # Load textbooks config
    with open(textbooks_json_path, "r", encoding="utf-8") as f:
        textbooks_data = json.load(f)
        
    new_chunks = []
    
    # Iterate over all grades and books
    for grade, books in textbooks_data.items():
        for book in books:
            if book.get("type") == "pdf":
                pdf_rel_path = book.get("path")
                pdf_path = None
                
                # 1. Try contentPath directory first
                if book.get("contentPath"):
                    local_dir = base_dir / book["contentPath"]
                    if local_dir.exists():
                        pdfs = list(local_dir.glob("*.pdf"))
                        if pdfs:
                            pdf_path = pdfs[0]
                
                # 2. Fallback to direct path
                if not pdf_path and pdf_rel_path:
                     clean_path = pdf_rel_path.lstrip("/").lstrip("\\")
                     pdf_path = base_dir / "public" / clean_path
                     if not pdf_path.exists():
                         # Try looking in public/textbooks
                         pdf_path = base_dir / "public" / "textbooks" / clean_path

                if pdf_path and pdf_path.exists():
                    print(f"Processing PDF: {pdf_path.name} (Grade {grade} - {book['subject']})")
                    try:
                        extracted = extractor.extract_pdf(str(pdf_path))
                        # Only proceed if we got content
                        if extracted["content"]:
                            file_chunks = extractor.chunk_content(extracted["content"])
                            
                            for chunk in file_chunks:
                                new_chunks.append({
                                    "grade": int(grade),
                                    "subject": book["subject"],
                                    "book_id": book["id"],
                                    "source": pdf_path.name,
                                    "text": chunk["text"],
                                    "page": chunk["page"],
                                    "type": "pdf_page"
                                })
                            print(f"  -> Extracted {len(file_chunks)} chunks.")
                        else:
                             print(f"  -> No text extracted (Scanned PDF?).")
                             
                    except Exception as e:
                        print(f"Failed to process {pdf_path.name}: {e}")
                else:
                    if book.get("contentPath"):
                         print(f"⚠️ PDF file not found for: {book['title']} (Checked {book['contentPath']} and path)")

    # Combine and Save
    # We filter out existing 'pdf_placeholder' chunks if we have real content now?
    # Actually, keep it simple: just append for now, or maybe replace placeholders.
    # Let's filter out placeholders if we are adding real data.
    
    processed_sources = {c["source"] for c in new_chunks}
    final_chunks = []
    
    # Keep existing chunks unless they are placeholders for a source we just processed
    for c in existing_chunks:
        if c.get("type") == "pdf_placeholder":
            # If we found real content for this book, skip the placeholder
            # Note: Placeholder source might differ slightly, but let's just keep everything for safety unless logical match
            final_chunks.append(c) 
        else:
            final_chunks.append(c)
            
    final_chunks.extend(new_chunks)
    
    print(f"Saving total {len(final_chunks)} chunks (Added {len(new_chunks)} new PDF chunks).")
    
    with open(chunks_jsonl_path, "w", encoding="utf-8") as f:
        for chunk in final_chunks:
            json.dump(chunk, f, ensure_ascii=False)
            f.write("\n")
            
    print("✅ Unified Extraction Complete!")

if __name__ == "__main__":
    process_unified_pipeline()
