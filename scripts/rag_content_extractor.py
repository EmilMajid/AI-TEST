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

def process_all_textbooks(textbooks_dir: str = "textbooks"):
    """Bütün dərslikləri emal edir"""
    extractor = ContentExtractor()
    
    # Example: Process textbooks by grade and subject
    textbook_mapping = {
        "8_fizika.pdf": (8, "fizika"),
        "9_kimya.pdf": (9, "kimya"),
        "10_riyaziyyat.pdf": (10, "riyaziyyat"),
        # Add more mappings
    }
    
    results = []
    textbooks_path = Path(textbooks_dir)
    
    if not textbooks_path.exists():
        print(f"Error: Directory {textbooks_dir} does not exist")
        return results
    
    for pdf_file in textbooks_path.glob("*.pdf"):
        filename = pdf_file.name
        if filename in textbook_mapping:
            grade, subject = textbook_mapping[filename]
            output_path = extractor.process_textbook(str(pdf_file), grade, subject)
            results.append({
                "file": filename,
                "grade": grade,
                "subject": subject,
                "output": output_path
            })
    
    return results

if __name__ == "__main__":
    print("Starting RAG Content Extraction...")
    results = process_all_textbooks()
    print(f"\nProcessed {len(results)} textbooks:")
    for r in results:
        print(f"  - {r['file']} -> {r['output']}")
