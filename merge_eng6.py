import json
import glob

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

if 'İngilis dili 6' not in db:
    db['İngilis dili 6'] = []

existing_passports = {t.get('passport_id') for t in db['İngilis dili 6'] if t.get('passport_id')}

files = glob.glob(r'C:\Users\User\.gemini\antigravity\scratch\eng6_*.json') + \
        glob.glob(r'C:\Users\User\.gemini\antigravity\brain\*\scratch\eng6_*.json')
        
added = 0

for filepath in files:
    with open(filepath, 'r', encoding='utf8') as f:
        try:
            data = json.load(f)
            tests = data.get('İngilis dili 6', [])
            for t in tests:
                if 'id' in t and 'passport_id' not in t:
                    t['passport_id'] = t.pop('id')
                
                t['cat'] = 'İngilis dili 6'
                if t.get('passport_id') not in existing_passports:
                    db['İngilis dili 6'].append(t)
                    existing_passports.add(t.get('passport_id'))
                    added += 1
        except Exception as e:
            print(f"Error parsing {filepath}: {e}")

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Merged {added} new İngilis dili 6 tests successfully.")
