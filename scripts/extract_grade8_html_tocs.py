import os
import json
from bs4 import BeautifulSoup

def extract_html_toc(toc_path):
    if not os.path.exists(toc_path):
        return []
    
    with open(toc_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    
    topics = []
    # Simplified extraction from toc.xhtml structure
    nav_ol = soup.find("nav", {"epub:type": "toc"})
    if nav_ol:
        items = nav_ol.find_all("li")
        for item in items:
            link = item.find("a")
            if link:
                title = link.get_text(strip=True)
                href = link.get("href")
                # Skip cover and empty info
                if "cover" in href.lower() or not title:
                    continue
                topics.append(title)
                
    return topics

def restore_grade_8_html_topics():
    base_dir = "public/textbooks/8"
    subjects = [
        "azerbaycan-dili", "edebiyyat", "riyaziyyat", "fizika", 
        "kimya", "biologiya", "cografiya", "azerbaycan-tarixi", 
        "umumi-tarix", "ingilis-dili", "informatika"
    ]
    
    all_extracted = {}
    for sub in subjects:
        toc_path = os.path.join(base_dir, sub, "OEBPS", "toc.xhtml")
        print(f"🔍 Checking {sub}...")
        topics = extract_html_toc(toc_path)
        if topics:
            print(f"✅ Found {len(topics)} topics.")
            all_extracted[sub] = topics
        else:
            print(f"⚠️ No topics found for {sub}.")
            
    with open("scripts/extracted-topics-8-html.json", "w", encoding="utf-8") as f:
        json.dump(all_extracted, f, ensure_ascii=False, indent=2)
    
    print("🏁 HTML Topic Extraction complete.")

if __name__ == "__main__":
    restore_grade_8_html_topics()
