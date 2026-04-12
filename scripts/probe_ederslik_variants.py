import urllib.request
import urllib.error
import time

def probe():
    ids = ["393", "795"]
    variants = [
        "units/unit-{u}/page{p}.xhtml",
        "units/Unit-{u}/page{p}.xhtml",
        "unit-{u}/page{p}.xhtml",
        "Unit-{u}/page{p}.xhtml",
        "units/unit{u}/page{p}.xhtml",
        "units/Unit{u}/page{p}.xhtml",
        "pages/page{p}.xhtml"
    ]
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    for eid in ids:
        print(f"--- Probing ID: {eid} ---")
        found = False
        for var in variants:
            url = f"https://www.e-derslik.edu.az/books/{eid}/" + var.format(u=1, p=1)
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=5) as resp:
                    if resp.status == 200:
                        print(f"  [SUCCESS] Found variant: {var}")
                        found = True
                        break
            except:
                pass
        if not found:
            print(f"  [FAILED] No common variants found for ID {eid}")

if __name__ == "__main__":
    probe()
