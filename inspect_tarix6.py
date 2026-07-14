import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

# Check all keys that might be "Ümumi tarix 6"
all_keys = [k for k in db.keys() if 'tarix' in k.lower() or 'tarix' in k]
print('Fənn açarları:', all_keys)

for key in all_keys:
    tests = db.get(key, [])
    print(f'\n{key}: {len(tests)} test')
    topics = Counter([t.get('topic', 'Unknown') for t in tests])
    for topic, count in sorted(topics.items(), key=lambda x: -x[1]):
        print(f'  "{topic}" - {count}')
