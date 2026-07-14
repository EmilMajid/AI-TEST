import json
import re

db = json.load(open('data/offline_tests.json', 'r', encoding='utf8'))
tests = db.get('Texnologiya 5', [])

for code in ['B1F02', 'B2F02', 'B3F02', 'B4F02', 'B5F02']:
    sample = next((t for t in tests if code in t.get('passport_id', '')), None)
    if sample:
        print(f"{code} -> {sample['question'][:60]}")
