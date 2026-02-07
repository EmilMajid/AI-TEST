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
        
        if local_tessdata.exists():
            import os
            os.environ['TESSDATA_PREFIX'] = str(local_tessdata)
            print(f"Set TESSDATA_PREFIX to: {local_tessdata}")
            
        try:
            # Simple config
            config = '--psm 3 --oem 3'
            # List languages to verify TESSDATA_PREFIX works
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
