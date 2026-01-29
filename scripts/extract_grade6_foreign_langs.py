import sys
sys.stdout.reconfigure(encoding='utf-8')

import PyPDF2
import re
import json
import os

def extract_toc_from_pdf(pdf_path, book_id, book_title):
    """
    Extract Table of Contents from PDF by analyzing bookmarks/outline
    """
    print(f"\n{'='*60}")
    print(f"📖 Extracting TOC: {book_title}")
    print(f"{'='*60}")
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Try to get outline (bookmarks)
            outlines = pdf_reader.outline if hasattr(pdf_reader, 'outline') else []
            
            if not outlines:
                print("⚠️  No bookmarks found in PDF. Trying text extraction...")
                return extract_toc_from_text(pdf_reader, book_id, book_title)
            
            topics = []
            current_chapter = None
            
            def process_outline(items, level=0):
                nonlocal current_chapter
                for item in items:
                    if isinstance(item, list):
                        process_outline(item, level + 1)
                    else:
                        title = item.title if hasattr(item, 'title') else str(item)
                        page = pdf_reader.get_destination_page_number(item) + 1 if hasattr(item, 'page') else 0
                        
                        # Detect if this is a chapter or topic
                        is_chapter = any(keyword in title.upper() for keyword in ['UNIT', 'УРОК', 'LEKTION', 'ÉTAPE', 'РАЗДЕЛ'])
                        
                        if is_chapter or level == 0:
                            if current_chapter and current_chapter['topics']:
                                topics.append(current_chapter)
                            current_chapter = {
                                'chapter': title,
                                'topics': []
                            }
                        elif current_chapter:
                            current_chapter['topics'].append({
                                'title': title,
                                'page': page,
                                'path': ''
                            })
            
            process_outline(outlines)
            
            # Add last chapter
            if current_chapter and current_chapter['topics']:
                topics.append(current_chapter)
            
            # If no structured topics, create a flat list
            if not topics:
                topics = [{
                    'chapter': 'Mövzular',
                    'topics': [{'title': item.title, 'page': 1, 'path': ''} for item in outlines if hasattr(item, 'title')]
                }]
            
            print(f"✅ Extracted {sum(len(ch['topics']) for ch in topics)} topics from {len(topics)} chapters")
            return topics
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def extract_toc_from_text(pdf_reader, book_id, book_title):
    """
    Fallback: Extract TOC from first few pages by text analysis
    """
    print("📄 Analyzing first 10 pages for TOC patterns...")
    
    topics = []
    for page_num in range(min(10, len(pdf_reader.pages))):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        
        # Look for numbered topics (e.g., "1. Topic Name", "Урок 1", "Lektion 1")
        patterns = [
            r'(\d+)\.\s+([^\n]+)',  # "1. Topic"
            r'(Урок|Lektion|Unit|Étape)\s+(\d+)[:\.]?\s*([^\n]+)',  # "Урок 1: Topic"
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.MULTILINE)
            if matches:
                for match in matches:
                    topic_text = match[-1] if len(match) > 2 else match[1]
                    if len(topic_text.strip()) > 3:  # Avoid noise
                        topics.append({
                            'title': topic_text.strip(),
                            'page': page_num + 1,
                            'path': ''
                        })
    
    if topics:
        return [{'chapter': 'Mövzular', 'topics': topics}]
    
    print("⚠️  Could not extract TOC automatically")
    return []

# Process all 6 problematic Grade 6 textbooks
textbooks = [
    {
        'id': 'rus-dili-6',
        'title': 'Rus dili 6 (əsas)',
        'path': r'public\textbooks\6\rus-dili\book.pdf'
    },
    {
        'id': 'rus-dili-6-2',
        'title': 'Rus dili 6 (ikinci)',
        'path': r'public\textbooks\6\rus-dili-2\book.pdf'
    },
    {
        'id': 'alman-dili-6',
        'title': 'Alman dili 6 (əsas)',
        'path': r'public\textbooks\6\alman-dili\book.pdf'
    },
    {
        'id': 'alman-dili-6-2',
        'title': 'Alman dili 6 (ikinci)',
        'path': r'public\textbooks\6\alman-dili-2\book.pdf'
    },
    {
        'id': 'fransiz-dili-6',
        'title': 'Fransız dili 6 (əsas)',
        'path': r'public\textbooks\6\fransiz-dili\book.pdf'
    },
    {
        'id': 'fransiz-dili-6-2',
        'title': 'Fransız dili 6 (ikinci)',
        'path': r'public\textbooks\6\fransiz-dili-2\book.pdf'
    }
]

results = {}

for book in textbooks:
    topics = extract_toc_from_pdf(book['path'], book['id'], book['title'])
    if topics:
        results[book['id']] = topics

# Save to extracted-topics.json
try:
    extracted_path = 'scripts/extracted-topics.json'
    existing_data = {}
    if os.path.exists(extracted_path):
        with open(extracted_path, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    
    # Merge new data
    existing_data.update(results)
    
    with open(extracted_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"✅ SUCCESS: Extracted topics saved to {extracted_path}")
    print(f"{'='*60}")
    
    # Summary
    for book_id, topics in results.items():
        total_topics = sum(len(ch['topics']) for ch in topics)
        print(f"  {book_id}: {total_topics} topics")
        
except Exception as e:
    print(f"❌ Error saving: {e}")
