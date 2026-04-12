import fitz
import requests
import subprocess
import os

print("PyMuPDF (fitz) version:", fitz.__version__)
print("Requests version:", requests.__version__)

tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(tesseract_path):
    print("Tesseract found at:", tesseract_path)
    res = subprocess.run([tesseract_path, "--version"], capture_output=True, text=True)
    print(res.stdout)
else:
    print("Tesseract NOT found at:", tesseract_path)

tessdata_dir = os.path.abspath("scripts/ocr_temp/tessdata")
if os.path.exists(tessdata_dir):
    print("Tessdata dir found at:", tessdata_dir)
    print("Files:", os.listdir(tessdata_dir))
else:
    print("Tessdata dir NOT found at:", tessdata_dir)
