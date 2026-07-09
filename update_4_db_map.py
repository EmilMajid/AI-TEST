import json
import re
import difflib

# Load manual topics
with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
    manual = json.load(f)

# Load db
db_path = 'data/offline_tests.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

subject_map = {
    'Azərbaycan dili 4': ['azerbaycan-dili-4-h1', 'azerbaycan-dili-4-h2'],
    'Riyaziyyat 4': ['riyaziyyat-4-h1', 'riyaziyyat-4-h2'],
    'Texnologiya 4': ['texnologiya-4'],
    'İnformatika 4': ['informatika-4'],
    'Həyat bilgisi 4': ['hayat-bilgisi-4']
}

for db_subject, manual_keys in subject_map.items():
    if db_subject not in db:
        continue
        
    official_topics = []
    for m_key in manual_keys:
        if m_key in manual:
            for group in manual[m_key]:
                for t in group['topics']:
                    official_topics.append(t['title'])
                    
    if not official_topics:
        continue
        
    official_topics_lower = {t.lower(): t for t in official_topics}
    
    mapped_count = 0
    fallback_count = 0
    
    for item in db[db_subject]:
        old_topic = item.get('topic_key') or item.get('topic') or ""
        old_topic_clean = re.sub(r'^\d+\.\s*', '', old_topic).strip().lower()
        
        match = None
        # Exact match
        if old_topic_clean in official_topics_lower:
            match = official_topics_lower[old_topic_clean]
        else:
            # Fuzzy match
            matches = difflib.get_close_matches(old_topic_clean, official_topics_lower.keys(), n=1, cutoff=0.5)
            if matches:
                match = official_topics_lower[matches[0]]
            else:
                # Substring match
                for ot_lower, ot_real in official_topics_lower.items():
                    if ot_lower in old_topic_clean or old_topic_clean in ot_lower:
                        match = ot_real
                        break
        
        if match:
            mapped_count += 1
            item['topic_key'] = match
            if 'questions' in item:
                for q in item['questions']:
                    q['topic'] = match
        else:
            fallback_count += 1
            # Fallback to the first topic or generic
            item['topic_key'] = official_topics[0]
            if 'questions' in item:
                for q in item['questions']:
                    q['topic'] = official_topics[0]
                    
    print(f"[{db_subject}] Mapped: {mapped_count}, Fallback: {fallback_count} to {len(official_topics)} official topics.")

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Offline tests updated successfully!")
