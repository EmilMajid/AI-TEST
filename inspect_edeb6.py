import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Ədəbiyyat 6', [])
print(f'Total Ədəbiyyat 6 tests: {len(tests)}')

topics = Counter([t.get('topic', 'Unknown') for t in tests])
print('\nTopics:')
for topic, count in topics.items():
    print(f'  "{topic}" - {count}')

print('\nFirst question of first 5 tests:')
for i, t in enumerate(tests[:5]):
    print(f"  [{i}] {t.get('question', '')[:100]}")
