import requests
import os
from pathlib import Path

def download_tessdata(lang):
    url = f"https://github.com/tesseract-ocr/tessdata/raw/main/{lang}.traineddata"
    dest = Path(f"scripts/ocr_temp/tessdata/{lang}.traineddata")
    dest.parent.mkdir(parents=True, exist_ok=True)
    
    if dest.exists():
        print(f"{lang}.traineddata already exists.")
        return

    print(f"Downloading {lang}.traineddata...")
    try:
        response = requests.get(url, stream=True, timeout=60)
        response.raise_for_status()
        with open(dest, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded {lang}.traineddata")
    except Exception as e:
        print(f"Failed to download {lang}.traineddata: {e}")

langs = ["aze", "rus", "eng"]
for l in langs:
    download_tessdata(l)
