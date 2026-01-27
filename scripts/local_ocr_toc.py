import fitz  # PyMuPDF
import os
import easyocr

# CONFIG
PDF_PATH = "public/textbooks/6/azerbaycan-tarixi/book.pdf"
OUTPUT_DIR = "scripts/debug_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    print(f"Opening {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)
    
    # Initialize reader for Azerbaijani (az) if possible, or just default to common ones
    # easyocr supports 'az' (Azerbaijani)
    reader = easyocr.Reader(['az', 'en'])

    extracted_lines = []
    
    # Target pages 4, 5, 6 (indices 3, 4, 5)
    for i in [3, 4, 5]:
        print(f"Processing Page {i+1}...")
        page = doc.load_page(i)
        pix = page.get_pixmap()
        img_path = os.path.join(OUTPUT_DIR, f"ocr_page_{i+1}.png")
        pix.save(img_path)
        
        result = reader.readtext(img_path, detail=0)
        extracted_lines.append(f"\n--- Səhifə {i+1} ---")
        extracted_lines.extend(result)

    print("\n--- OCR NƏTİCƏSİ ---")
    print("\n".join(extracted_lines))

if __name__ == "__main__":
    main()
