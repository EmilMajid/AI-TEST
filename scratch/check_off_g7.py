import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    off = json.load(f)

g7_keys = [k for k in off.keys() if '7' in k]
print(f"Grade 7 keys in offline_tests.json ({len(g7_keys)}):")
for k in g7_keys:
    val = off[k]
    count = len(val) if isinstance(val, dict) else (len(val) if isinstance(val, list) else 0)
    print(f"  '{k}': {count} topics/items")
