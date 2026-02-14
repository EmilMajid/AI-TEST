import requests
import re
import json
from concurrent.futures import ThreadPoolExecutor

resource_ids = [
    517, 996, 1001, 1017, 1023, 1031, 1037, 1047, 1076, 
    1854, 1856, 1864, 1876, 1882, 1886, 1915,
    1921, 1901, 1925, 1953, 1952, 1884, 1954, 1923
]

def get_pdf_link(resource_id):
    url = f"https://www.trims.edu.az/site/resource.php?id={resource_id}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            content = response.text
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            title = title_match.group(1).strip() if title_match else f"ID {resource_id}"
            
            # Look for href ending in .pdf
            pdf_match = re.search(r'href=["\'](.*?\.pdf)["\']', content)
            pdf_url = pdf_match.group(1) if pdf_match else None
            
            return {
                "id": resource_id,
                "title": title,
                "pdf_url": pdf_url
            }
    except Exception as e:
        print(f"Error fetching ID {resource_id}: {e}")
    return None

def main():
    print(f"Fetching PDF links for {len(resource_ids)} resources...")
    results = []
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = [r for r in executor.map(get_pdf_link, resource_ids) if r]
    
    with open("data/grade9_pdf_links.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"Done. Saved to data/grade9_pdf_links.json")
    for r in results:
        print(f"ID {r['id']}: {r['title']} -> {r['pdf_url']}")

if __name__ == "__main__":
    main()
