import json
with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Coğrafiya 6', [])
print(f'Total tests: {len(tests)}')

for i in range(0, min(len(tests), 180), 15):
    t = tests[i]
    print(f"Test {i} [{t.get('passport_id')}]: {t.get('question')[:100]}...")
