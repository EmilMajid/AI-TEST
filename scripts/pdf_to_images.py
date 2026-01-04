import fitz
import os
import sys

def pdf_to_images(pdf_path, output_dir):
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found")
        return
    
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    print(f"Converting {pdf_path} ({len(doc)} pages)...")
    
    # Just convert the first 3 pages for testing
    for i in range(min(3, len(doc))):
        page = doc[i]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # 2x scale for better OCR
        output_file = os.path.join(output_dir, f"page_{i+1}.png")
        pix.save(output_file)
        print(f"Saved: {output_file}")
    
    doc.close()

if __name__ == "__main__":
    pdf_path = "public/textbooks/5/rus-dili-5/rus-5.pdf"
    output_dir = "scripts/ocr_temp"
    pdf_to_images(pdf_path, output_dir)
