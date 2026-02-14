import requests
import re
import json
from concurrent.futures import ThreadPoolExecutor

def check_resource(resource_id):
    url = f"https://www.trims.edu.az/site/resource.php?id={resource_id}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            content = response.text
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            title = title_match.group(1).strip() if title_match else ""
            
            # Grade 9 keywords
            if "9" in title or "doqquz" in title.lower() or "IX" in title:
                # Extract PDF URL
                pdf_match = re.search(r'href=["\'](.*?\.pdf)["\']', content)
                pdf_url = pdf_match.group(1) if pdf_match else None
                
                return {
                    "id": resource_id,
                    "title": title,
                    "pdf_url": pdf_url
                }
    except:
        pass
    return None

def main():
    # We'll check 1800-2000 as many recent books are there
    # and 500-600 for older ones.
    ranges = list(range(1800, 2001)) + list(range(400, 601))
    
    print(f"Scanning {len(ranges)} IDs for Grade 9 textbooks...")
    found = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = [r for r in executor.map(check_resource, ranges) if r]
        found.extend(results)
    
    # Remove duplicates by ID
    unique_found = {item['id']: item for item in found}.values()
    
    with open("data/grade9_extended_discovery.json", "w", encoding="utf-8") as f:
        json.dump(list(unique_found), f, ensure_ascii=False, indent=2)
    
    print(f"Total found Grade 9 resources: {len(unique_found)}")

if __name__ == "__main__":
    main()
