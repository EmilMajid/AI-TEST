import json
import sys
import io
from collections import Counter

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

counts = Counter()

with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            if obj.get('book_id') == 'informatika-11':
                sec = obj.get('section')
                if sec:
                    counts[sec] += 1
        except:
            pass

print("--- Chunks per Topic count ---")
for topic, count in sorted(counts.items()):
    print(f"Topic: {topic} | Chunks: {count}")
