import requests
import json
import os
from pathlib import Path

def download_file(url, target_path):
    if not url: return False
    
    # TRIMS relative links starting with '../noduploads/' 
    # should be translated to 'https://www.trims.edu.az/noduploads/'
    if url.startswith("../"):
        url = "https://www.trims.edu.az/" + url.lstrip("../")
    elif not url.startswith("http"):
        url = "https://www.trims.edu.az/site/" + url.lstrip("./")
    
    try:
        response = requests.get(url, stream=True, timeout=30)
        if response.status_code == 200:
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            with open(target_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def main():
    with open("data/grade9_pdf_links.json", "r", encoding="utf-8") as f:
        links = json.load(f)
    
    # We'll use a mapping to rename files to simpler names
    # and organize them in public/textbooks/9/
    
    print(f"Found {len(links)} links to download.")
    
    for item in links:
        pdf_url = item["pdf_url"]
        if not pdf_url: continue
        
        # Determine subject from filename
        filename = os.path.basename(pdf_url)
        # Simplify filename
        if "fiziki-tarbiya" in filename: subject_id = "fiziki-terbiye-9"
        elif "texnologiya" in filename: subject_id = "texnologiya-9"
        elif "hayat-bilgisi" in filename: subject_id = "hayat-bilgisi-9"
        elif "biologiya" in filename: subject_id = "biologiya-9"
        elif "fizika" in filename: subject_id = "fizika-9"
        elif "tasviri-incasanat" in filename: subject_id = "tesviri-incesenet-9"
        elif "kimya" in filename: subject_id = "kimya-9"
        elif "riyaziyyat" in filename: subject_id = "riyaziyyat-9"
        elif "musiqi" in filename: subject_id = "musiqi-9"
        elif "informatika" in filename: subject_id = "informatika-9"
        elif "adabiyyat" in filename: subject_id = "edebiyyat-9"
        elif "cografiya" in filename: subject_id = "cografiya-9"
        elif "dovlat-dili" in filename: subject_id = "azerbaycan-dili-dovlet-9"
        elif "umumi-tarix" in filename: subject_id = "umumi-tarix-9"
        elif "tadris-dili" in filename: subject_id = "azerbaycan-dili-9"
        elif "azarbaycan-tarixi" in filename: subject_id = "azerbaycan-tarixi-9"
        elif "english" in filename and "asas" in filename: subject_id = "ingilis-dili-9"
        elif "english" in filename and "ikinci" in filename: subject_id = "ingilis-dili-ikinci-9"
        elif "deutsch" in filename and "asas" in filename: subject_id = "alman-dili-9"
        elif "deutsch" in filename and "ikinci" in filename: subject_id = "alman-dili-ikinci-9"
        elif "le-francais" in filename and "asas" in filename: subject_id = "fransiz-dili-9"
        elif "le-francais" in filename and "ikinci" in filename: subject_id = "fransiz-dili-ikinci-9"
        elif "russkij-yazyk" in filename and "asas" in filename: subject_id = "rus-dili-9"
        elif "russkij-yazyk" in filename and "ikinci" in filename: subject_id = "rus-dili-ikinci-9"
        else:
            subject_id = f"unknown-{item['id']}"
            
        target_dir = f"public/textbooks/9/{subject_id}"
        target_path = f"{target_dir}/book.pdf"
        
        print(f"Downloading {subject_id}...")
        if download_file(pdf_url, target_path):
            print(f"  [+] Success: {target_path}")
        else:
            print(f"  [!] Failed: {pdf_url}")

if __name__ == "__main__":
    main()
