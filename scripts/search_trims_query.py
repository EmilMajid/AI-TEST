import requests
import re

def search_trims(query):
    url = f"https://www.trims.edu.az/site/search.php?q={query}"
    print(f"Searching TRIMS for: {query}")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            content = response.text
            # Look for resource links
            matches = re.findall(r'resource\.php\?id=(\d+)', content)
            unique_ids = sorted(list(set(matches)))
            print(f"Found potential resource IDs: {unique_ids}")
            
            for rid in unique_ids:
                # Get detail
                res_url = f"https://www.trims.edu.az/site/resource.php?id={rid}"
                res_resp = requests.get(res_url, timeout=5)
                if res_resp.status_code == 200:
                    title_match = re.search(r'<title>(.*?)</title>', res_resp.text, re.IGNORECASE)
                    title = title_match.group(1) if title_match else "No Title"
                    print(f"  ID {rid}: {title}")
                    if ".pdf" in res_resp.text:
                         pdf_match = re.search(r'href=["\'](.*?.pdf)["\']', res_resp.text)
                         if pdf_match:
                             print(f"    -> PDF: {pdf_match.group(1)}")
        else:
            print(f"Search failed: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_trims("Həyat+bilgisi+5")
    print("-" * 30)
    search_trims("Hayat+bilgisi+5")
