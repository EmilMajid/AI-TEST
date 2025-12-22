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
        self.output_dir = Path("extracted_data")
        self.output_dir.mkdir(exist_ok=True)
    
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
            
            # Extract images (optional - requires more processing)
            # images = convert_from_path(pdf_path, dpi=200)
            # for idx, img in enumerate(images):
            #     img_text = pytesseract.image_to_string(img, lang='aze+eng')
            #     if img_text.strip():
            #         text_content.append({
            #             "page": idx + 1,
            #             "text": img_text,
            #             "type": "image_text"
            #         })
            
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
    
    def process_textbook(self, pdf_path: str, grade: int, subject: str) -> str:
        """Dərsliği emal edib JSONL formatında saxlayır"""
        print(f"Processing: {pdf_path}")
        
        # Extract content
        extracted = self.extract_pdf(pdf_path)
        
        # Chunk content
        chunks = self.chunk_content(extracted["content"])
        
        # Prepare output
        output_data = {
            "grade": grade,
            "subject": subject,
            "source": extracted["metadata"]["source"],
            "pages": extracted["metadata"]["pages"],
            "chunks": chunks,
            "formulas": extracted["formulas"]
        }
        
        # Save to JSONL
        output_file = self.output_dir / f"{grade}_{subject}.jsonl"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False)
            f.write("\n")
        
        print(f"Saved to: {output_file}")
    return str(output_file)

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
    chunk_id_counter = len(existing_chunks) + 1
    
    # Iterate over all grades and books
    for grade, books in textbooks_data.items():
        for book in books:
            if book.get("type") == "pdf" and book.get("path"):
                pdf_rel_path = book["path"]
                # Convert absolute-like path "/textbooks/..." to local path "public/textbooks/..."
                # Or use contentPath if available and look for PDF inside
                
                pdf_path = None
                # Try constructing path from contentPath first (more reliable for actual files)
                if book.get("contentPath"):
                    local_dir = base_dir / book["contentPath"]
                    # Find any PDF in this dir
                    if local_dir.exists():
                        pdfs = list(local_dir.glob("*.pdf"))
                        if pdfs:
                            pdf_path = pdfs[0]
                
                # Fallback to 'path'
                if not pdf_path and pdf_rel_path:
                     # Remove leading slash if present
                     clean_path = pdf_rel_path.lstrip("/")
                     pdf_path = base_dir / "public" / clean_path

                if pdf_path and pdf_path.exists():
                    print(f"Processing PDF: {pdf_path.name} (Grade {grade} - {book['subject']})")
                    try:
                        extracted = extractor.extract_pdf(str(pdf_path))
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
                    except Exception as e:
                        print(f"Failed to process {pdf_path.name}: {e}")
                else:
                    print(f"⚠️ PDF file not found for: {book['title']} (Path: {pdf_path})")

    # Combine and Save
    total_chunks = existing_chunks + new_chunks
    print(f"Saving total {len(total_chunks)} chunks (Added {len(new_chunks)} new PDF chunks).")
    
    with open(chunks_jsonl_path, "w", encoding="utf-8") as f:
        for chunk in total_chunks:
            json.dump(chunk, f, ensure_ascii=False)
            f.write("\n")
            
    print("✅ Unified Extraction Complete!")

if __name__ == "__main__":
    process_unified_pipeline()
