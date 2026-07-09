import json
import uuid

main_db_path = r'data\offline_tests.json'

with open(main_db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# Clear the old "İngilis dili 3"
db['İngilis dili 3'] = []

for i in range(1, 9):
    unit_file = rf'C:\Users\User\.gemini\antigravity\scratch\unit_{i}_tests.json'
    with open(unit_file, 'r', encoding='utf-8') as f:
        unit_data = json.load(f)
        
    for q in unit_data:
        # Some subagents might wrap it differently, ensure flat questions
        if 'question' in q:
            q['passport_id'] = f"3-eng-unit{i}-{uuid.uuid4().hex[:6]}"
            q['category'] = 'İngilis dili 3'
            q['type'] = 'İngilis dili'
            q['topic'] = f'Unit {i}'
            db['İngilis dili 3'].append(q)

with open(main_db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Successfully replaced İngilis dili 3 with {len(db['İngilis dili 3'])} new tests!")
