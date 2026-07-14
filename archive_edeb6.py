import json

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ədəbiyyat 6', [])
renamed = 0

for t in tests:
    # All 315 tests have the same wrong topic - archive them all
    t['topic'] = '[Arxiv] Xətalı Köhnə Generasiya'
    renamed += 1

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f'Archived {renamed} tests from Ədəbiyyat 6.')
