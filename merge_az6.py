import json
import os
import glob

# Find all az6_b01_m*.json files that haven't been merged
search_paths = [
    r"C:\Users\User\.gemini\antigravity\scratch\az6_b*.json",
    r"C:\Users\User\.gemini\antigravity\scratch\tests\az6_b*.json",
    r"C:\Users\User\.gemini\antigravity\scratch\az_tests\az6_b*.json",
    r"C:\Users\User\.gemini\antigravity\brain\*\az6_b*.json",
    r"C:\Users\User\.gemini\antigravity\brain\*\scratch\az6_b*.json"
]

files_to_merge = []
for pattern in search_paths:
    for filepath in glob.glob(pattern):
        if not filepath.endswith(".done"):
            files_to_merge.append(filepath)

db_path = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

# find max ID to avoid collisions
max_id = 100000
for subj, tests in db.items():
    for t in tests:
        if isinstance(t.get('id'), int) and t['id'] > max_id:
            max_id = t['id']
        elif isinstance(t.get('id'), str) and t['id'].isdigit() and int(t['id']) > max_id:
            max_id = int(t['id'])

next_id = max_id + 1
merged = 0

for filepath in set(files_to_merge):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf8') as f:
                content = f.read()
                try:
                    data = json.loads(content)
                except json.JSONDecodeError:
                    import re
                    match = re.search(r'\[[\s\S]*\]', content)
                    if match:
                        data = json.loads(match.group(0))
                    else:
                        print(f"Failed to parse {filepath}")
                        continue
                
                questions = data if isinstance(data, list) else data.get('questions', [])
                
                for q in questions:
                    q['id'] = next_id
                    next_id += 1
                    db['Azərbaycan dili 6'].append(q)
                    merged += 1
                    
            print(f"Merged {filepath}")
            os.rename(filepath, filepath + '.done')
        except Exception as e:
            print(f"Error merging {filepath}: {e}")

if merged > 0:
    with open(db_path, 'w', encoding='utf8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"Successfully merged {merged} new tests.")
else:
    print("No new tests merged.")
