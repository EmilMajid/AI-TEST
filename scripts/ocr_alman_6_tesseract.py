import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz # PyMuPDF
import pytesseract
from PIL import Image
import io

pdf_path = 'temp_alman_6.pdf'

print("Opening PDF and converting pages to images for Tesseract OCR...")
doc = fitz.open(pdf_path)

for i in [5, 6, 7]: # Pages 6, 7, 8
    print(f"--- OCRing Page {i+1} ---")
    page = doc.load_page(i)
    pix = page.get_pixmap()
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data))
    
    # German language for tesseract
    text = pytesseract.image_to_string(img, lang='deu+aze+eng')
    print(text)

doc.close()
