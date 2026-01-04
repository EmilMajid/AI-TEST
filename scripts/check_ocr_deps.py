import easyocr
import os
from pdf2image import convert_from_path
import sys

def test_easyocr():
    print("Testing EasyOCR...")
    try:
        reader = easyocr.Reader(['az', 'ru', 'en'], gpu=False) # az=Azerbaijani, ru=Russian, en=English
        print("✅ EasyOCR Reader initialized successfully!")
    except Exception as e:
        print(f"❌ EasyOCR initialization failed: {e}")

def test_poppler():
    print("\nTesting Poppler (pdf2image)...")
    # We need a dummy PDF or just check if it fails on search
    try:
        # Just checking if it can be called
        from pdf2image.exceptions import PDFInfoNotInstalledError
        # Try to get info of a non-existent file to see if poppler is found
        try:
            from pdf2image import pdfinfo_from_path
            pdfinfo_from_path("non_existent.pdf")
        except PDFInfoNotInstalledError:
            print("❌ Poppler not found in system PATH.")
        except FileNotFoundError:
            print("✅ Poppler appears to be installed (binary recognized).")
        except Exception as e:
            print(f"Got exception (this is fine if it's not 'NotInstalled'): {type(e).__name__}")
            if "not installed" in str(e).lower():
                print("❌ Poppler not found.")
            else:
                print("✅ Poppler (pdfinfo) is callable.")
    except Exception as e:
        print(f"❌ Poppler test failed: {e}")

if __name__ == "__main__":
    test_easyocr()
    test_poppler()
