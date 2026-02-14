import requests
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

def check_resource(resource_id):
    url = f"https://www.trims.edu.az/site/resource.php?id={resource_id}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            content = response.text
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            title = title_match.group(1) if title_match else "No Title"
            
            # Grade 9 keywords: "9", "doqquz", "IX"
            if "9" in title or "doqquz" in title.lower() or "IX" in title:
                # Exclude Teacher's books if possible, or mark them
                res = {
                    "id": resource_id,
                    "title": title.strip(),
                    "url": url,
                    "pdf_url": None
                }
                
                pdf_match = re.search(r'href=["\'](.*?\.pdf)["\']', content)
                if pdf_match:
                    res["pdf_url"] = pdf_match.group(1)
                
                return res
    except:
        pass
    return None

def main():
    print("Scanning TRIMS for Grade 9 textbooks (Range 1000-1500)...")
    
    found_books = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(check_resource, range(1000, 1500)))
        for r in results:
            if r:
                found_books.append(r)
                print(f"[FOUND] ID {r['id']}: {r['title']}")
                if r['pdf_url']:
                    print(f"  -> PDF: {r['pdf_url']}")

    # Save results
    with open("data/grade9_discovery.json", "w", encoding="utf-8") as f:
        import json
        json.dump(found_books, f, ensure_ascii=False, indent=2)
    
    print(f"\nScan complete. Found {len(found_books)} entries. Results saved to data/grade9_discovery.json")

if __name__ == "__main__":
    main()
