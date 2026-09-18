import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/math_79_dups.json', 'r', encoding='utf-8') as f:
    dups = json.load(f)

for i, item in enumerate(dups):
    print(f"{i}: [{item['topic']}] Q#{item['q_idx']} - Q: {item['question']}")
    print(f"   Expl: {item['explanation']}")
