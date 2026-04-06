import os
import requests

def download_aze_model():
    url = "https://github.com/tesseract-ocr/tessdata/raw/main/aze.traineddata"
    output_dir = "scripts/ocr_temp/tessdata"
    output_path = os.path.join(output_dir, "aze.traineddata")
    
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Downloading aze.traineddata from {url}...")
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded to {output_path}")
    except Exception as e:
        print(f"Error downloading: {e}")

if __name__ == "__main__":
    download_aze_model()
