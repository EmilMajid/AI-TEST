import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/textbooks.json', 'r', encoding='utf-8') as f:
    tb = json.load(f)

for s in ['Riyaziyyat 7', 'Fizika 7', 'Kimya 7']:
    val = tb.get(s)
    if isinstance(val, dict):
        print(f"[{s}] Keys: {list(val.keys())[:5]}")
    elif isinstance(val, list):
        print(f"[{s}] List of {len(val)} items, first item type: {type(val[0])}")
        if isinstance(val[0], dict):
            print(f"    First item keys: {list(val[0].keys())}")
            print(f"    Sample title: {val[0].get('title') or val[0].get('name')}")
