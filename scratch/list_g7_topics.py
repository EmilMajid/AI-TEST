import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

for s, topics in d7.items():
    print(f"{s}: {len(topics)} topics")
print(f"Total: {sum(len(t) for t in d7.values())}")
