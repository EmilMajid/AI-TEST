import os
import requests
import json
import time
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import sys
import io

# Force UTF-8 for console output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def download_file(url, target_path):
    print(f"Downloading {url} to {target_path}...")
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    try:
        response = requests.get(url, stream=True, timeout=30)
        if response.status_code == 200:
            total_size = int(response.headers.get('content-length', 0))
            block_size = 8192
            downloaded = 0
            
            with open(target_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=block_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            percent = downloaded * 100 / total_size
                            if downloaded % (block_size * 100) == 0:
                                print(f"  Progress: {percent:.1f}%", end='\r')
            print(f"\nSuccessfully downloaded: {target_path}")
            return True
        else:
            print(f"Failed to download {url}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def get_pdf_link_trims(book_title):
    """
    Search Trims for the book and get PDF link
    This is a heuristic search since we don't have direct IDs mapping
    """
    search_url = "https://www.trims.edu.az/site/index.php"
    # Mapping titles to TRIMS search likely terms
    search_terms = {
        "hayat-bilgisi-5": "Həyat bilgisi 5",
        "alman-dili-5": "Alman dili 5"
    }
    
    term = search_terms.get(book_title)
    if not term:
        return None
        
    print(f"Searching TRIMS for: {term}")
    try:
        # Note: TRIMS search might be POST or GET with params. 
        # Simplified approach: We know roughly the resource IDs from manual inspection or previous runs
        # Grade 5 resources are usually around ID 400-500
        
        # Let's try to map known IDs if possible, or search
        # Based on grade 7 exploration, we can try to guess or just use specific known URLs if we had them.
        # Since we don't, let's try a direct look up if we can found them in the list
        pass
    except Exception:
        pass
    return None

def download_grade5_missing():
    # Specific IDs for Grade 5 books based on investigation/pattern
    # These are likely IDs on trims.edu.az. 
    # alman-dili-5 (Ləman Qasımova) -> https://www.trims.edu.az/site/resource.php?id=457 (Example guess)
    # hayat-bilgisi-5 -> https://www.trims.edu.az/site/resource.php?id=451 (from textbooks.json path!)
    
    targets = [
        {
            "id": "hayat-bilgisi-5",
            "url_hint": "https://www.trims.edu.az/site/resource.php?id=451", # From textbooks.json
            "output": "public/textbooks/5/hayat-bilgisi-5/hayat-bilgisi-5.pdf"
        },
        {
            "id": "alman-dili-5",
            "url_hint": "https://www.trims.edu.az/site/resource.php?id=457", # Educated guess based on sequence
            "output": "public/textbooks/5/alman-dili-5-asas/alman-asas-5.pdf"
        }
    ]
    
    for target in targets:
        print(f"\nProcessing {target['id']}...")
        
        # 1. Get the actual PDF URL from the resource page
        resource_url = target['url_hint']
        pdf_url = None
        
        try:
            print(f"Fetching resource page: {resource_url}")
            resp = requests.get(resource_url, timeout=15)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                # Look for download link
                for a in soup.find_all('a', href=True):
                    if 'noduploads' in a['href'] and a['href'].endswith('.pdf'):
                        pdf_url = urljoin(resource_url, a['href'])
                        print(f"Found PDF URL: {pdf_url}")
                        break
            
            if not pdf_url:
                print("Could not find PDF link on page. Trying alternative or skipping.")
                # Fallback for alman-dili if ID 457 is wrong
                if target['id'] == 'alman-dili-5':
                     print("Trying manual search for Alman Dili 5...")
                     # Logic to search if needed, but let's hope 457 is correct or close
                     # Actually, lets verify ID 457 content in next step
        except Exception as e:
            print(f"Error fetching metadata: {e}")
            
        # 2. Download
        if pdf_url:
            download_file(pdf_url, target['output'])
        else:
             print(f"Skipping download for {target['id']} (No URL found)")

if __name__ == "__main__":
    download_grade5_missing()
