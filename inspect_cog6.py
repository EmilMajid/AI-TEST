import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Coğrafiya 6', [])
topics = Counter([t.get('topic', 'Unknown') for t in tests])

for topic, count in topics.items():
    print(f'"{topic}" - {count}')
