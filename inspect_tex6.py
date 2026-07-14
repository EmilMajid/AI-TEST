import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Texnologiya 6', [])

# Print all questions to understand the content
for i, t in enumerate(tests):
    q = t.get('question', '')[:100]
    print(f"[{i:03d}] {q}")
