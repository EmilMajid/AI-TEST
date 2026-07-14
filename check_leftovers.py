import json

db = json.load(open('data/offline_tests.json', 'r', encoding='utf8'))

for subj in ['İnformatika 5', 'Azərbaycan dili 5']:
    tests = db.get(subj, [])
    for t in tests:
        if str(t.get('topic', '')).startswith('05-'):
            q = str(t.get('question', ''))[:60]
            print(f"{subj} -> Topic: {t.get('topic')} | Q: {q}")
