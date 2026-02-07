import os
import requests
import zipfile
import io
from pathlib import Path

def download_and_extract_poppler():
    poppler_dir = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\poppler")
    poppler_dir.mkdir(parents=True, exist_ok=True)
    
    url = "https://github.com/oschwartz10612/poppler-windows/releases/download/v25.12.0-0/Release-25.12.0-0.zip"
    print(f"Downloading Poppler from {url}...")
    
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
            print("Extracting...")
            zip_ref.extractall(poppler_dir)
            
        print("Done!")
        
        # Verify extraction
        items = list(poppler_dir.rglob("pdftocairo.exe"))
        if items:
            print(f"Found pdftocairo at: {items[0]}")
        else:
            print("pdftocairo.exe not found in extracted files.")
            # List all files for debugging
            for f in poppler_dir.rglob("*"):
                if f.is_file():
                    print(f"File: {f}")
                    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    download_and_extract_poppler()
