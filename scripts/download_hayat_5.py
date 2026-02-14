import requests
import os
from pathlib import Path

def download_file(url, dest_path):
    print(f"Downloading {url} to {dest_path}...")
    dest_path = Path(dest_path)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        with open(dest_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("Download successful.")
        return True
    except Exception as e:
        print(f"Download failed: {e}")
        return False

if __name__ == "__main__":
    url = "https://www.trims.edu.az/noduploads/book/quot-hayat-bilgisi-quot-fanni-uzra-5-ci-sinif-ucun-darslik-1596631155-827.pdf"
    dest = "public/textbooks/5/hayat-bilgisi-5/hayat-bilgisi-5.pdf"
    download_file(url, dest)
