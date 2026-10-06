import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'
book_schwa = {}

with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for line in f:
        c = json.loads(line)
        b = c.get('book_id', '')
        txt = c.get('text', '')
        if b not in book_schwa:
            book_schwa[b] = {'total_chars': 0, 'schwa_count': 0}
        book_schwa[b]['total_chars'] += len(txt)
        book_schwa[b]['schwa_count'] += txt.lower().count('ə')

corrupted_books = []
for b, stats in book_schwa.items():
    if any(k in b for k in ['azerbaycan', 'edebiyyat', 'informatika', 'riyaziyyat', 'tarix', 'fizika', 'kimya', 'biologiya', 'cografiya', 'tebiet', 'hayat']):
        if stats['total_chars'] > 5000:
            ratio = stats['schwa_count'] / stats['total_chars']
            if ratio < 0.02: # Less than 2% 'ə' means font encoding dropped 'ə'
                corrupted_books.append((b, ratio, stats['total_chars']))

print(f"Total books checked with dropped 'ə' encoding: {len(corrupted_books)}")
for b, r, tc in corrupted_books:
    print(f"  DROP FONT: {b} (schwa ratio: {r:.4f}, chars: {tc})")
