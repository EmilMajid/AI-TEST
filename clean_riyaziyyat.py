import json
import os

filepath = 'data/offline_tests.json'
with open(filepath, 'r', encoding='utf-8') as f:
    db = json.load(f)

if 'Riyaziyyat 3' in db:
    original_count = len(db['Riyaziyyat 3'])
    # Filter out items that have no 'topic' and no 'topic_key'
    # For nested items, also check
    cleaned_items = []
    for item in db['Riyaziyyat 3']:
        if 'questions' in item and isinstance(item['questions'], list):
            # Nested questions
            valid_qs = []
            for q in item['questions']:
                t = q.get('topic', item.get('topic_key', ''))
                if t and str(t).strip() != '' and str(t).strip() != 'Unknown':
                    valid_qs.append(q)
            if valid_qs:
                item['questions'] = valid_qs
                cleaned_items.append(item)
        else:
            # Direct question
            t = item.get('topic', '')
            if t and str(t).strip() != '' and str(t).strip() != 'Unknown':
                cleaned_items.append(item)
    
    db['Riyaziyyat 3'] = cleaned_items
    new_count = len(db['Riyaziyyat 3'])
    removed = original_count - new_count
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
        
    print(f"Cleaned Riyaziyyat 3. Removed {removed} items without topics. Remaining: {new_count}")
else:
    print("Riyaziyyat 3 not found in db.")
