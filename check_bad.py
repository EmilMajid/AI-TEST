import json

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for k, v in db.items():
    if k == 'Riyaziyyat 3':
        for idx, item in enumerate(v):
            qs = item.get('questions', []) if 'questions' in item else [item]
            for q in qs:
                if '2x-4' in str(q) or 'x-y' in str(q):
                    topic = item.get("topic", q.get("topic"))
                    print(f"Found bad question in Riyaziyyat 3! Topic: {topic}")
                    print(f"Question: {q.get('question')[:50]}...")
