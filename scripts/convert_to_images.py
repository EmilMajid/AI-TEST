import fitz
import os
import json
import sys

def convert_pdf_to_images(pdf_path, output_base_dir):
    """Converts only pages that have no searchable text."""
    if not os.path.exists(pdf_path):
        return []
    
    book_id = os.path.basename(os.path.dirname(pdf_path))
    output_dir = os.path.join(output_base_dir, book_id)
    os.makedirs(output_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    image_paths = []
    
    print(f"Checking {book_id} ({len(doc)} pages)...")
    
    for i in range(len(doc)):
        page = doc[i]
        text = page.get_text().strip()
        
        # If no text found, convert to image for OCR
        if not text:
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_path = os.path.join(output_dir, f"page_{i+1}.png")
            pix.save(img_path)
            image_paths.append(img_path)
    
    doc.close()
    return image_paths

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_to_images.py <pdf_path> <output_base_dir>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    output_dir = sys.argv[2]
    convert_pdf_to_images(pdf_path, output_dir)
