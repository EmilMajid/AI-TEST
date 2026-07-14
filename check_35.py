import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Riyaziyyat 5', [])
unmapped = [t for t in tests if t.get('topic') == 'Təyin edilməyib']
print(f"Unmapped count: {len(unmapped)}")
for i, t in enumerate(unmapped[:10]):
    pid = t.get('passport_id') or t.get('id', '')
    q = t.get('question', '')[:60]
    print(f"{i+1}. ID: {pid} | Q: {q}")
