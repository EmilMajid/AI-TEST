import requests
import re
from concurrent.futures import ThreadPoolExecutor
import time

def check_resource(resource_id):
    url = f"https://www.trims.edu.az/site/resource.php?id={resource_id}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            content = response.text
            # Check for title
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            title = title_match.group(1) if title_match else "No Title"
            
            # Check for Grade 5 keywords
            if "5" in title or "beş" in title.lower() or "V" in title:
                # Check for Hayat Bilgisi
                if "həyat" in title.lower() or "hayat" in title.lower():
                    print(f"[FOUND] ID {resource_id}: {title}")
                    
                    # Check for PDF
                    if ".pdf" in content:
                        print(f"  -> PDF link found in ID {resource_id}!")
                        # Extract match
                        pdf_match = re.search(r'href=["\'](.*?.pdf)["\']', content)
                        if pdf_match:
                            print(f"  -> PDF URL: {pdf_match.group(1)}")
                    return resource_id
    except Exception as e:
        pass
    return None

def main():
    print("Scanning TRIMS for 'Hayat Bilgisi 5' (Range 400-600)...")
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(check_resource, range(400, 600)))
    
    print("Scan complete.")

if __name__ == "__main__":
    main()
