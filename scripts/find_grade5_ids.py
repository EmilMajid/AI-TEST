import requests
from bs4 import BeautifulSoup
import concurrent.futures

def check_id(resource_id):
    url = f"https://www.trims.edu.az/site/resource.php?id={resource_id}"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            title_tag = soup.find('title')
            page_text = soup.get_text().lower()
            
            title = title_tag.text.strip() if title_tag else "No Title"
            
            # Print ALL valid pages to see where we are
            if "Resurs" not in title and len(title) > 5: # Filter out empty/generic pages if any
                 print(f"ID {resource_id}: {title}")

            if "həyat bilgisi" in page_text or "hayat bilgisi" in page_text:
                if "5" in title or "5" in page_text:
                    return resource_id, title, "hayat-bilgisi-5"
            
            if "alman" in page_text and ("5" in title or "5" in page_text):
                return resource_id, title, "alman-dili-5"
                
    except:
        pass
    return None

def scan_ids():
    print("Scanning TRIMS IDs 400-500 VERBOSE...")
    found_books = {}
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(check_id, i): i for i in range(400, 500)}
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result:
                res_id, title, key = result
                print(f"!!! MATCH FOUND: ID {res_id} -> {title} ({key})")
                found_books[key] = res_id

    print("\nScan complete.")
    return found_books

if __name__ == "__main__":
    scan_ids()
