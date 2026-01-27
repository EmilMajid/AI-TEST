import os
import json
import re

# CONFIG
EXTRACTED_TOPICS_FILE = os.path.join("scripts", "extracted-topics.json")
TEXTBOOKS_JSON = os.path.join("data", "textbooks.json")

def load_json(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def extract_from_toc_xhtml(grade, subject_dir):
    toc_paths = [
        os.path.join("public", "textbooks", grade, subject_dir, "OEBPS", "toc.xhtml"),
        os.path.join("public", "textbooks", grade, subject_dir, "toc.xhtml"),
        os.path.join("public", "textbooks", grade, subject_dir, "OEBPS", "Text", "toc.xhtml")
    ]
    
    selected_path = None
    for p in toc_paths:
        if os.path.exists(p):
            selected_path = p
            break
            
    if not selected_path:
        return []

    print(f"  -> Processing {subject_dir} (Grade {grade}) from {selected_path}...")
    
    with open(selected_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the main TOC nav or list
    nav_match = re.search(r'<nav[^>]*epub:type="toc"[^>]*>(.*?)</nav>', content, re.DOTALL)
    nav_content = nav_match.group(1) if nav_match else content # Fallback to whole file
    
    # Extract links: <a href="...">Title</a>
    links = re.findall(r'<a[^>]*href="([^"]+)"[^>]*>([^<]+)</a>', nav_content)
    
    if not links:
        links = re.findall(r'<navPoint[^>]*>[\s\S]*?<text>([^<]+)</text>[\s\S]*?<content src="([^"]+)"', nav_content)

    topics = []
    seen = set()
    
    for first, second in links:
        if ".xhtml" in first or ".html" in first or "/" in first:
            href, title = first, second
        else:
            title, href = first, second
            
        clean_title = title.strip()
        clean_title = clean_title.replace("&amp;", "&").replace("&quot;", "\"").replace("&lt;", "<").replace("&gt;", ">")
        
        if len(clean_title) < 3: continue
        if clean_title in seen: continue
        if any(w in clean_title for w in ["Cild", "Dərsliklə necə", "Mündəricat", "Ümumi məlumat"]): continue
        
        seen.add(clean_title)
        href = href.split("#")[0]
        
        topics.append({
            "title": clean_title,
            "page": 1,
            "path": href
        })
        
    return topics

def main():
    textbooks = load_json(TEXTBOOKS_JSON)
    extracted_topics = load_json(EXTRACTED_TOPICS_FILE)
    
    for grade, books in textbooks.items():
        print(f"Processing Class {grade}...")
        for book in books:
            book_id = book.get("id")
            content_path = book.get("contentPath", "")
            print(f"  - Book: {book_id} (path: {content_path})")
            if not content_path: continue
            
            subject_dir = os.path.basename(content_path)

            
            # Re-extract if OEBPS/toc.xhtml exists, regardless of 'type'
            extracted = extract_from_toc_xhtml(grade, subject_dir)
            if extracted:
                print(f"  [FOUND] Real topics in toc.xhtml for {book_id}")
                extracted_topics[book_id] = [
                    {
                        "chapter": "Mövzular",
                        "topics": extracted
                    }
                ]
                print(f"  [SUCCESS] {book_id}: Extracted {len(extracted)} topics.")
            else:
                # If no EPUB TOC, we keep whatever was there or let other scripts handle PDF
                pass

            
    save_json(EXTRACTED_TOPICS_FILE, extracted_topics)

    print("\nEPUB Topic Extraction Complete.")


if __name__ == "__main__":
    main()
