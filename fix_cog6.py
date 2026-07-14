import json
import random

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

for subject in ['Coğrafiya 6']:
    tests = db.get(subject, [])
    fixed = 0
    for t in tests:
        if 'Arxiv' in t.get('topic', ''):
            continue # Don't bother fixing archived bad tests
        
        # If options is a dict, convert it to a shuffled list
        options_val = t.get('options')
        if isinstance(options_val, dict):
            correct_key = t.get('correct_answer')
            if not correct_key:
                continue
            
            correct_text = options_val.get(correct_key, '')
            
            # Extract all option texts
            opt_list = list(options_val.values())
            
            # Shuffle them
            random.shuffle(opt_list)
            
            # Find the new index of the correct answer
            try:
                new_correct_index = opt_list.index(correct_text)
            except ValueError:
                new_correct_index = 0
            
            t['options'] = opt_list
            t['correctAnswer'] = new_correct_index
            
            if 'correct_answer' in t:
                del t['correct_answer']
                
            fixed += 1

print(f"Fixed {fixed} tests in {subject}")

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)
