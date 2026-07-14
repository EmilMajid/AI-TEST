import json
import glob
import os

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

if 'Ədəbiyyat 6' not in db:
    db['Ədəbiyyat 6'] = []

# Keep old ones, just append
existing_passports = {t.get('passport_id') for t in db['Ədəbiyyat 6'] if t.get('passport_id')}

files = glob.glob(r'C:\Users\User\.gemini\antigravity\scratch\edeb6_*.json')
added = 0

for filepath in files:
    with open(filepath, 'r', encoding='utf8') as f:
        try:
            data = json.load(f)
            tests = data.get('Ədəbiyyat 6', [])
            for t in tests:
                # Add category
                t['cat'] = 'Ədəbiyyat 6'
                if t.get('passport_id') not in existing_passports:
                    db['Ədəbiyyat 6'].append(t)
                    existing_passports.add(t.get('passport_id'))
                    added += 1
        except Exception as e:
            print(f"Error parsing {filepath}: {e}")

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Merged {added} new Ədəbiyyat 6 tests successfully.")
