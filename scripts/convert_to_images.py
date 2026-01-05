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
    pages_data = []
    
    print(f"Checking {book_id} ({len(doc)} pages)...")
    
    for i in range(len(doc)):
        page = doc[i]
        text = page.get_text().strip()
        
        page_info = {"page": i + 1, "text": "", "image_path": ""}
        
        # If no text found, convert to image for OCR
        if not text:
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_path = os.path.join(output_dir, f"page_{i+1}.png")
            pix.save(img_path)
            page_info["image_path"] = f"page_{i+1}.png"
        else:
            page_info["text"] = text
            
        pages_data.append(page_info)
    
    doc.close()
    
    # Save pages metadata (searchable text)
    meta_path = os.path.join(output_dir, "searchable_text.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(pages_data, f, ensure_ascii=False, indent=2)
    
    return pages_data

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_to_images.py <pdf_path> <output_base_dir>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    output_dir = sys.argv[2]
    convert_pdf_to_images(pdf_path, output_dir)
