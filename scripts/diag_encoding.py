import os
import subprocess
from pathlib import Path
import fitz

pdf_url = "https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-quot-rus-dili-asas-xarici-dil-fanni-uzra-8-ci-sinif-ucun-darslik-1693828461-829.pdf"
book_id = "rus-dili-8"
tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
tessdata_dir = os.path.abspath(r"c:\Users\User\Downloads\azerbaijanaiplatform\scripts\ocr_temp\tessdata")

def diag_ocr():
    temp_dir = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\scripts\ocr_temp\diag")
    temp_dir.mkdir(exist_ok=True, parents=True)
    
    pdf_path = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\scripts\ocr_temp\rus-dili-8.pdf")
    if not pdf_path.exists():
        print("PDF not found. Please run ingest script first or download it.")
        return

    doc = fitz.open(str(pdf_path))
    page = doc[0] # Page 1
    pix = page.get_pixmap(dpi=300)
    img_path = temp_dir / "test_p1.png"
    pix.save(str(img_path))
    
    ocr_out_base = temp_dir / "test_p1_ocr"
    env = os.environ.copy()
    env["TESSDATA_PREFIX"] = tessdata_dir
    
    print(f"Running Tesseract on {img_path}...")
    result = subprocess.run([tesseract_path, str(img_path), str(ocr_out_base), "-l", "rus"], 
                           env=env, capture_output=True)
    
    ocr_text_path = Path(f"{ocr_out_base}.txt")
    
    # Check bytes
    with open(ocr_text_path, 'rb') as f:
        content = f.read()
        print(f"File size: {len(content)} bytes")
        print(f"First 20 bytes (hex): {content[:20].hex()}")

    # Try reading as different encodings
    for enc in ['utf-8', 'cp1251', 'utf-16']:
        try:
            text = content.decode(enc)
            print(f"\n--- Encoding: {enc} (first 100 chars) ---")
            print(text[:100])
        except Exception as e:
            print(f"Failed to read as {enc}: {e}")

if __name__ == "__main__":
    diag_ocr()
