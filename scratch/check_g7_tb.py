import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/textbooks.json', 'r', encoding='utf-8') as f:
    tb = json.load(f)

print(f"Textbook keys with '7':")
for k in tb.keys():
    if '7' in k:
        print(f"  {k}")
