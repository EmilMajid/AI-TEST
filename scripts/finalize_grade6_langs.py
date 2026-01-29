import sys
sys.stdout.reconfigure(encoding='utf-8')

import PyPDF2
import re
import json
import os
import requests

def download_pdf(url, save_path):
    """Download PDF from URL"""
    print(f"📥 Downloading PDF from {url}...")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"✅ Downloaded to {save_path}")
        return True
    except Exception as e:
        print(f"❌ Download failed: {e}")
        return False

def extract_toc_from_pages(pdf_path, start_page, end_page):
    """Extract TOC from specific pages"""
    print(f"📖 Extracting TOC from pages {start_page}-{end_page}...")
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            topics = []
            
            for page_num in range(start_page - 1, min(end_page, len(pdf_reader.pages))):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                
                # Look for Lektion patterns (German)
                lektion_pattern = r'(Lektion\s+\d+)[:\.]?\s*([^\n]+)'
                matches = re.findall(lektion_pattern, text, re.MULTILINE)
                
                for match in matches:
                    topic_title = f"{match[0]}. {match[1].strip()}"
                    if len(topic_title) > 10:  # Avoid noise
                        topics.append({
                            'title': topic_title,
                            'page': page_num + 1,
                            'path': ''
                        })
                
                # Look for DOSSIER patterns (French)
                dossier_pattern = r'(DOSSIER\s+\d+)[:\.]?\s*([^\n]+)'
                matches = re.findall(dossier_pattern, text, re.MULTILINE)
                
                for match in matches:
                    topic_title = f"{match[0]}. {match[1].strip()}"
                    if len(topic_title) > 10:
                        topics.append({
                            'title': topic_title,
                            'page': page_num + 1,
                            'path': ''
                        })
                
                # Look for Leçon patterns (French)
                lecon_pattern = r'(Leçon\s+\d+)\s*/\s*([^\n]+)'
                matches = re.findall(lecon_pattern, text, re.MULTILINE)
                
                for match in matches:
                    topic_title = f"{match[0]} / {match[1].strip()}"
                    if len(topic_title) > 10:
                        topics.append({
                            'title': topic_title,
                            'page': page_num + 1,
                            'path': ''
                        })
            
            print(f"✅ Extracted {len(topics)} topics")
            return topics
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

# Process the 3 remaining textbooks
textbooks = [
    {
        'id': 'alman-dili-6',
        'title': 'Alman dili 6 (əsas)',
        'url': 'https://www.trims.edu.az/noduploads/book/quot-alman-dili-quot-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1631279917-903.pdf',
        'pages': (6, 8),
        'temp_file': 'temp_alman_6.pdf'
    },
    {
        'id': 'fransiz-dili-6',
        'title': 'Fransız dili 6 (əsas)',
        'url': 'https://www.trims.edu.az/noduploads/book/quot-le-francais-quot-fransiz-dili-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1761549522-432.pdf',
        'pages': (6, 10),
        'temp_file': 'temp_fransiz_6.pdf'
    }
]

results = {}

for book in textbooks:
    print(f"\n{'='*60}")
    print(f"Processing: {book['title']}")
    print(f"{'='*60}")
    
    # Download PDF
    if download_pdf(book['url'], book['temp_file']):
        # Extract TOC
        topics = extract_toc_from_pages(book['temp_file'], book['pages'][0], book['pages'][1])
        
        if topics:
            results[book['id']] = [{
                'chapter': 'Mövzular',
                'topics': topics
            }]
        
        # Clean up temp file
        try:
            os.remove(book['temp_file'])
        except:
            pass

# Add manual data for Fransız dili 6 (ikinci)
results['fransiz-dili-6-2'] = [
    {
        'chapter': 'Étape I Bonjour les amis !',
        'topics': [
            {'title': 'Leçon 1 Bonne rentrée !', 'page': 1, 'path': ''},
            {'title': 'Leçon 2 Qui suis-je ?', 'page': 1, 'path': ''},
            {'title': 'Leçon 3 Mon prof,ce héros', 'page': 1, 'path': ''},
            {'title': 'Je révise', 'page': 1, 'path': ''}
        ]
    },
    {
        'chapter': 'Étape II J\'aime ça !',
        'topics': [
            {'title': 'Leçon 1 C\'est la récré !', 'page': 1, 'path': ''},
            {'title': 'Leçon 2 J\'aime les animaux', 'page': 1, 'path': ''},
            {'title': 'Leçon 3 Qu\'est-ce que tu fais ?', 'page': 1, 'path': ''},
            {'title': 'Je révise', 'page': 1, 'path': ''}
        ]
    },
    {
        'chapter': 'Étape III Ma ville',
        'topics': [
            {'title': 'Leçon 1 C\'est où ça ?', 'page': 1, 'path': ''},
            {'title': 'Leçon 2 Dans mon quartier, il y a', 'page': 1, 'path': ''},
            {'title': 'Leçon 3 Et voilà ma chambre', 'page': 1, 'path': ''},
            {'title': 'Je révise', 'page': 1, 'path': ''}
        ]
    },
    {
        'chapter': 'Étape IV Ça va mieux !',
        'topics': [
            {'title': 'Leçon 1 Je mange bien !', 'page': 1, 'path': ''},
            {'title': 'Leçon 2 Merci, Docteur !', 'page': 1, 'path': ''},
            {'title': 'Leçon 3 Mes règles d\'hygiène', 'page': 1, 'path': ''},
            {'title': 'Je révise', 'page': 1, 'path': ''}
        ]
    },
    {
        'chapter': 'Étape V On va célébrer !',
        'topics': [
            {'title': 'Leçon 1 C\'est la fête !', 'page': 1, 'path': ''},
            {'title': 'Leçon 2 C\'est très gentil !', 'page': 1, 'path': ''},
            {'title': 'Leçon 3 Célébrons ensemble !', 'page': 1, 'path': ''},
            {'title': 'Je révise', 'page': 1, 'path': ''}
        ]
    },
    {
        'chapter': 'Étape VI Vivement les vacances vertes !',
        'topics': [
            {'title': 'Leçon 1 La France, c\'est ici !', 'page': 1, 'path': ''},
            {'title': 'Leçon 2 Vacances nature', 'page': 1, 'path': ''},
            {'title': 'Leçon 3 Je protège la nature', 'page': 1, 'path': ''},
            {'title': 'Je révise', 'page': 1, 'path': ''}
        ]
    }
]

# Save to manual-topics.json (higher priority than extracted)
try:
    manual_path = 'scripts/manual-topics.json'
    existing_data = {}
    if os.path.exists(manual_path):
        with open(manual_path, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    
    # Merge new data
    existing_data.update(results)
    
    with open(manual_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"✅ SUCCESS: Topics saved to {manual_path}")
    print(f"{'='*60}")
    
    # Summary
    for book_id, topic_groups in results.items():
        total_topics = sum(len(group['topics']) for group in topic_groups)
        print(f"  {book_id}: {total_topics} topics")
        
except Exception as e:
    print(f"❌ Error saving: {e}")
