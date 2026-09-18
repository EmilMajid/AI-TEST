import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/textbooks.json', 'r', encoding='utf-8') as f:
    tb = json.load(f)

r_topics = tb['Riyaziyyat 7']['topics']
print(f"Riyaziyyat 7 textbook topics count: {len(r_topics)}")
first_t = r_topics[0]
print(f"First topic keys: {list(first_t.keys())}")
print(f"Title: {first_t.get('title')}")
print(f"Content length: {len(first_t.get('content', ''))}")
print(f"Content preview: {first_t.get('content', '')[:200]}")
