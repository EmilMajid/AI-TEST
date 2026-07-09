import json

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for k, v in db.items():
    for idx, item in enumerate(v):
        qs = item.get('questions', []) if 'questions' in item else [item]
        for q in qs:
            q_str = str(q)
            if '2x-4' in q_str or 'x-y' in q_str:
                topic = item.get("topic", q.get("topic"))
                print(f"Found bad question in category: {k}! Topic: {topic}")
                print(f"Question: {q.get('question')[:50]}...")
