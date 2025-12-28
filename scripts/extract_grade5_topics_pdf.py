import json
import pdfplumber
import re
import os

DATA_PATH = 'data/textbooks.json'
PUBLIC_DIR = 'public'

def extract_topics_from_pdf(file_path):
    if not os.path.exists(file_path):
        return None
    
    try:
        topics = []
        with pdfplumber.open(file_path) as pdf:
            # Check first 15 pages
            num_pages = min(len(pdf.pages), 15)
            
            # Find TOC start
            toc_content = ""
            for i in range(num_pages):
                page = pdf.pages[i]
                text = page.extract_text()
                if not text: continue
                toc_content += text + "\n"
        
        # Split into lines
        lines = [line.strip() for line in toc_content.split('\n') if len(line.strip()) > 5]
        
        # Heuristics to find TOC section
        start_keywords = ['MÜNDƏRİCAT', 'İÇİNDƏKİLƏR', 'CONTENTS']
        start_index = -1
        
        for idx, line in enumerate(lines):
            if any(keyword in line.upper() for keyword in start_keywords):
                start_index = idx
                break
        
        if start_index == -1:
            start_index = 0 # Fallback
            
        # Extract topics
        # Regex patterns
        patterns = [
            r'^(?:Mövzu|§)?\s*\d+\.\s+(.+?)(?:\.{3,}|\s+\d+$|$)', # 1. Topic or Mövzu 1. Topic
            r'^[IVX]+\.\s+(.+?)(?:\.{3,}|\s+\d+$|$)', # Roman numerals
        ]
        
        for i in range(start_index, len(lines)):
            line = lines[i]
            
            # Stop conditions
            if re.search(r'Buraxılış məlumatı|Ümumtəhsil məktəbləri', line, re.IGNORECASE):
                break
                
            for pattern in patterns:
                match = re.match(pattern, line)
                if match:
                    topic = match.group(1).strip()
                    # Clean cleaning dots/numbers at end if regex missed it
                    topic = re.sub(r'\.{3,}.*$', '', topic)
                    topic = re.sub(r'\s+\d+$', '', topic)
                    
                    if 5 < len(topic) < 100:
                        topics.append(topic)
                        break
        
        if len(topics) > 3:
            return "\n".join(topics)
        return None

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def main():
    print("🔍 Starting Python Topic Extraction for Grade 5 PDFs...")
    
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    grade5 = data.get("5", [])
    updated_count = 0
    
    # Working books to skip (based on user feedback)
    working_ids = ['edebiyyat-5', 'azerbaycan-tarixi-5', 'informatika-5']
    
    for book in grade5:
        if book['id'] in working_ids:
            continue
            
        # Only process PDFs
        if book.get('type') != 'pdf':
            continue
            
        # Skip if already has detailed topics
        current_topics = book.get('topics', '')
        if len(current_topics) > 50 and current_topics != 'Mövzular':
            continue
            
        print(f"Processing: {book.get('title')} ({book['id']})...")
        
        # Construct path
        rel_path = book['path'].lstrip('/')
        full_path = os.path.join(PUBLIC_DIR, rel_path)
        
        topics = extract_topics_from_pdf(full_path)
        
        if topics:
            book['topics'] = topics
            print(f"  ✅ Extracted {len(topics.split(chr(10)))} topics.")
            updated_count += 1
        else:
            print(f"  ⚠️ Could not extract topics. Keeping default.")
            
    if updated_count > 0:
        with open(DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n✅ Updated {updated_count} textbooks with extracted topics.")
    else:
        print("\nNo changes made.")

if __name__ == "__main__":
    main()
