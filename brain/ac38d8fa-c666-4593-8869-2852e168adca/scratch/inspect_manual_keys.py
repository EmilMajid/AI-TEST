import json

with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Keys:", sorted(list(data.keys())))
