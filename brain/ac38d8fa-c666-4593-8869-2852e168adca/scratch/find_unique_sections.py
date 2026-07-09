import sys
import io
import json
from collections import Counter

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

sections = Counter()
section_pages = {}

with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            if obj.get('book_id') == 'informatika-11':
                sec = obj.get('section')
                page = obj.get('page')
                if sec:
                    sections[sec] += 1
                    if sec not in section_pages:
                        section_pages[sec] = set()
                    if page:
                        section_pages[sec].add(page)
        except Exception as e:
            pass

print("--- Unique Sections in database for 'informatika-11' ---")
for sec, count in sections.most_common():
    pages = sorted(list(section_pages.get(sec, [])))
    print(f"Section: {sec} | Count: {count} | Pages: {pages}")
