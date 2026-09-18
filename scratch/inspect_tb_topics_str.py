import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/textbooks.json', 'r', encoding='utf-8') as f:
    tb = json.load(f)

r_topics = tb['Riyaziyyat 7']['topics']
print(r_topics[:5])
