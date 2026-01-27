import pytesseract
from PIL import Image
import fitz
import os

# CONFIG
PDF_PATH = "public/textbooks/6/azerbaycan-tarixi/book.pdf"
TESS_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if os.path.exists(TESS_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESS_PATH
else:
    print("Warning: Tesseract not found at default path. Pytesseract might fail.")

def main():
    doc = fitz.open(PDF_PATH)
    for i in [3, 4, 5]: # Pages 4, 5, 6
        print(f"\n--- Səhifə {i+1} ---")
        page = doc.load_page(i)
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # Azerbaijani is 'aze', English is 'eng'
        # Try both
        try:
            text = pytesseract.image_to_string(img, lang='aze+eng')
            print(text)
        except Exception as e:
            print(f"OCR Error: {e}")

if __name__ == "__main__":
    main()
