import os
import requests
import re
from bs4 import BeautifulSoup
from pathlib import Path
import json

from urllib.parse import urljoin

def download_file(url, target_path):
    print(f"Downloading {url} to {target_path}...")
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    try:
        response = requests.get(url, stream=True, timeout=30)
        if response.status_code == 200:
            with open(target_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Success: {target_path}")
            return True
        else:
            print(f"Failed to download {url}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def get_pdf_link(resource_id):
    base_url = "https://www.trims.edu.az/site/resource.php"
    url = f"{base_url}?id={resource_id}"
    try:
        response = requests.get(url, timeout=20)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            # Look for "PDF yüklə" link
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href']
                text = link.text.strip()
                if 'PDF yüklə' in text or 'noduploads/book' in href:
                    if href.endswith('.pdf'):
                        return urljoin(url, href)
    except Exception as e:
        print(f"Error fetching resource {resource_id}: {e}")
    return None

def main():
    resources = {
        "azerbaycan-tarixi-7": "227",
        "fiziki-terbiye-7": "237",
        "musiqi-7": "1474",
        "informatika-7": "1481",
        "tesviri-incesenet-7": "1485",
        "texnologiya-7": "1492",
        "azerbaycan-dili-7": "1501",
        "umumi-tarix-7": "1506",
        "azerbaycan-dili-dovlet-7": "1507",
        "edebiyyat-7": "1513",
        "riyaziyyat-7": "1539",
        "biologiya-7-h1": "1759",
        "biologiya-7-h2": "1760",
        "cografiya-7-h1": "1765",
        "cografiya-7-h2": "1766",
        "fizika-7-h1": "1768",
        "fizika-7-h2": "1769",
        "kimya-7-h1": "1773",
        "kimya-7-h2": "1774"
    }

    base_dir = Path("public/textbooks/7")
    
    for book_id, res_id in resources.items():
        pdf_url = get_pdf_link(res_id)
        if pdf_url:
            if not pdf_url.startswith('http'):
                pdf_url = "https://www.trims.edu.az" + pdf_url
            
            target_file = base_dir / book_id / "book.pdf"
            if target_file.exists():
                print(f"Skipping {book_id}, already exists.")
                continue
            
            download_file(pdf_url, str(target_file))
        else:
            print(f"No PDF link found for {book_id} (ID: {res_id})")

if __name__ == "__main__":
    main()
