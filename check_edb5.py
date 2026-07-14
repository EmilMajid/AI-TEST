import json

db = json.load(open('data/offline_tests.json', encoding='utf8'))
tests = db.get('Ədəbiyyat 5', [])
unmapped = [t for t in tests if t.get('topic') == 'Təyin edilməyib']
for i, t in enumerate(unmapped[:10]):
    print(f"Q: {t.get('question', '')[:60]}")
    print(f"A: {t.get('explanation', '')[:60]}")
    print('-'*40)
