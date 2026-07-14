import json
import os
import glob

main_db_path = 'data/offline_tests.json'
db = json.load(open(main_db_path, encoding='utf8'))

scratch_dir = 'C:/Users/User/.gemini/antigravity/scratch'
# Also check nested data/offline_tests.json from scratch
scratch_db_path = os.path.join(scratch_dir, 'data', 'offline_tests.json')
if os.path.exists(scratch_db_path):
    print('Found scratch db path, merging...')
    scratch_db = json.load(open(scratch_db_path, encoding='utf8'))
    for cat in scratch_db:
        if '4' in cat:
            if cat not in db:
                db[cat] = []
            
            existing_passports = {t.get('passport_id') for t in db[cat]}
            added = 0
            for t in scratch_db[cat]:
                if t.get('passport_id') not in existing_passports:
                    db[cat].append(t)
                    existing_passports.add(t.get('passport_id'))
                    added += 1
            print(f'Merged {added} tests for {cat} from scratch offline_tests.json')

# Merge individual files created directly in scratch/
for file_path in glob.glob(os.path.join(scratch_dir, '*4_t*.json')):
    fname = os.path.basename(file_path).lower()
    
    cat = None
    if 'riyaz' in fname or 'math' in fname:
        cat = 'Riyaziyyat 4'
    elif 'azdili' in fname or 'az4' in fname:
        cat = 'Azərbaycan dili 4'
    elif 'info' in fname:
        cat = 'İnformatika 4'
    elif 'heyat' in fname or 'life' in fname:
        cat = 'Həyat bilgisi 4'
    elif 'tex' in fname:
        cat = 'Texnologiya 4'
    
    if cat:
        try:
            tests = json.load(open(file_path, encoding='utf8'))
            if not isinstance(tests, list):
                continue
            if cat not in db:
                db[cat] = []
            existing_passports = {t.get('passport_id') for t in db[cat]}
            added = 0
            for t in tests:
                # Basic validation
                if 'passport_id' in t and t['passport_id'] not in existing_passports:
                    # check if the topic matches the grade
                    if not t.get('topic'):
                        t['topic'] = 'Mövzusuz'
                    db[cat].append(t)
                    existing_passports.add(t['passport_id'])
                    added += 1
            print(f'Merged {added} tests from {os.path.basename(file_path)} to {cat}')
        except Exception as e:
            print(f'Failed to merge {file_path}: {e}')

with open(main_db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)
print('Merge complete.')
