import json
import os

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# Clear or initialize
db['İngilis dili 4'] = []

for i in range(1, 9):
    file_path = rf"C:\Users\User\.gemini\antigravity\scratch\eng4_unit_{i}_tests.json"
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                tests = json.load(f)
                
                # Make sure the tests have topic set correctly
                for t in tests:
                    t['topic'] = f"Unit {i}"
                
                # Wrap it in the struct
                db['İngilis dili 4'].append({
                    "topic_key": f"Unit {i}",
                    "questions": tests
                })
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("İngilis dili 4 tests merged successfully!")
