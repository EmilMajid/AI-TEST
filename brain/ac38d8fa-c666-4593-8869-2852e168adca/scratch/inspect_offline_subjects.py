import json
import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Subjects in offline_tests.json:", sorted(list(data.keys())))
