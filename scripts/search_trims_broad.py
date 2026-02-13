import requests
import re

def search_trims_broad(query):
    # Try different search terms
    terms = ["Həyat+Bilgisi", "Hayat+Bilgisi", "Həyat+Bilgisi+5", "V+sinif+Həyat"]
    
    found_urls = set()
    
    for term in terms:
        url = f"https://www.trims.edu.az/site/search.php?q={term}"
        print(f"Searching: {term}")
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                ids = re.findall(r'resource\.php\?id=(\d+)', resp.text)
                for rid in ids:
                    detail_url = f"https://www.trims.edu.az/site/resource.php?id={rid}"
                    if detail_url not in found_urls:
                        found_urls.add(detail_url)
                        d_resp = requests.get(detail_url, timeout=5)
                        if d_resp.status_code == 200:
                            title_match = re.search(r'<title>(.*?)</title>', d_resp.text, re.IGNORECASE)
                            title = title_match.group(1) if title_match else "Unknown"
                            print(f"  FOUND ID {rid}: {title}")
                            if ".pdf" in d_resp.text:
                                pdf = re.search(r'href=["\'](.*?.pdf)["\']', d_resp.text)
                                if pdf: print(f"    -> PDF: {pdf.group(1)}")
        except: pass

if __name__ == "__main__":
    search_trims_broad("Həyat")
