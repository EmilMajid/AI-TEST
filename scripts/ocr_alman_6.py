import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz # PyMuPDF
import easyocr
import json

pdf_path = 'temp_alman_6.pdf'
reader = easyocr.Reader(['de', 'en']) # German and English

print("Opening PDF and converting pages to images for OCR...")
doc = fitz.open(pdf_path)
results = []

for i in [5, 6, 7]: # Pages 6, 7, 8
    print(f"--- OCRing Page {i+1} ---")
    page = doc.load_page(i)
    pix = page.get_pixmap()
    img_data = pix.tobytes()
    
    # easyocr can read from bytes
    ocr_result = reader.readtext(img_data, detail=0)
    results.extend(ocr_result)
    for line in ocr_result:
        print(line)

doc.close()
