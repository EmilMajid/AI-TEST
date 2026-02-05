import pytesseract
import sys
from pathlib import Path

print("Pytesseract installed:", True)
try:
    version = pytesseract.get_tesseract_version()
    print(f"Tesseract version: {version}")
    print("STATUS: OK")
except Exception as e:
    print(f"Tesseract engine not found in PATH: {e}")
    
    # Confirmed path
    tesseract_bin = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    local_tessdata = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\tessdata")
    
    if Path(tesseract_bin).exists():
        print(f"Verified tesseract at: {tesseract_bin}")
        pytesseract.pytesseract.tesseract_cmd = tesseract_bin
        
        config = f'--psm 3 --oem 3'
        if local_tessdata.exists():
            config += f' --tessdata-dir "{local_tessdata}"'
            print(f"Using local tessdata: {local_tessdata}")
            
        try:
            # List languages to verify tessdata-dir works
            langs = pytesseract.get_languages(config=config)
            print(f"Available languages: {langs}")
            if 'aze' in langs:
                print("STATUS: SUCCESS_AZE_FOUND")
            else:
                print("STATUS: SUCCESS_BUT_AZE_MISSING")
            found = True
        except Exception as e:
            print(f"Execution failed with config: {e}")
                
    if not found:
        print("STATUS: NOT_FOUND")
