import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'
CORRUPTED_BOOKS = {
    'informatika-5', 'azerbaycan-dili-5-h1', 'azerbaycan-dili-5-h2',
    'riyaziyyat-5-h2', 'riyaziyyat-5-h1', 'azerbaycan-tarixi-5', 'edebiyyat-5'
}

VERB_PATTERNS = [
    r'adlanır\.', r'deyilir\.', r'hesab olunur\.', r'adlandırılır\.',
    r'təyin olunur\.', r'ifadə olunur\.', r'bərabərdir\.',
    r'qanunudur\.', r'teoremidir\.', r'qaydasıdır\.', r'düsturudur\.',
    r'ibarətdir\.', r'növləri vardır\.', r'qrupa ayrılır\.', r'bölünür\.'
]
combined_verbs = '|'.join(VERB_PATTERNS)
p_sent = re.compile(rf'([A-ZƏÖÜİĞÇŞ][^\.!?\n\r]{{20,250}}\s+(?:{combined_verbs}))')

count = 0
books_distribution = {}

with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        c = json.loads(line)
        b_id = c.get('book_id', '')
        if b_id in CORRUPTED_BOOKS:
            continue
        txt = c.get('text', '')
        for m in p_sent.finditer(txt):
            s = m.group(1).strip()
            # Must have clean schwa and no noise
            if 'ə' in s.lower() and not re.search(r'[\)•\-]{2,}|=\s*-\s*•|\d{4,}[a-z]{3,}|·\s*,\s*-', s):
                count += 1
                subj = b_id.split('-')[0]
                books_distribution[subj] = books_distribution.get(subj, 0) + 1

print(f"Total pristine candidates in the 197 clean books: {count}")
print("Distribution across subjects:")
for s, c in sorted(books_distribution.items(), key=lambda x: x[1], reverse=True):
    print(f"  {s}: {c}")
