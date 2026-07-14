import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('İnformatika 6', [])
print(f"Total: {len(tests)}")

for i, t in enumerate(tests):
    print(f"[{i}] {t.get('topic')}: {t.get('question', '')[:100]}")
