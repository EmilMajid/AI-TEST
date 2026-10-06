import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'

VERB_PATTERNS = [
    r'adlanır\.', r'deyilir\.', r'hesab olunur\.', r'adlandırılır\.',
    r'təyin olunur\.', r'ifadə olunur\.', r'bərabərdir\.',
    r'qanunudur\.', r'teoremidir\.', r'qaydasıdır\.', r'düsturudur\.',
    r'ibarətdir\.', r'növləri vardır\.', r'qrupa ayrılır\.', r'bölünür\.'
]
combined_verbs = '|'.join(VERB_PATTERNS)
p_sent = re.compile(rf'([A-ZƏÖÜİĞÇŞ][^\.!?\n\r]{{20,250}}\s+(?:{combined_verbs}))')

def is_valid_gold_sentence(text, book_id):
    # Check dropped 'ə' encoding
    if any(k in book_id for k in ['azerbaycan', 'edebiyyat', 'informatika', 'riyaziyyat', 'tarix', 'fizika', 'kimya', 'biologiya', 'cografiya', 'tebiet', 'hayat']):
        words = text.split()
        if len(words) >= 8 and 'ə' not in text.lower():
            return False, 'DROPPED_SCHWA'
            
    # Check minimum length
    if len(text) < 30 or len(text) > 280:
        return False, 'LENGTH'
        
    # Check noise
    if re.search(r'[\)•\-]{2,}|=\s*-\s*•|\d{4,}[a-z]{3,}|·\s*,\s*-', text):
        return False, 'OCR_NOISE'
        
    # Check instructional
    if re.search(r'(münasibət\s+bildirin|yada\s+salın|tapşırıq|çalışma|\?|müzakirə|dəftər)', text, re.I):
        return False, 'INSTRUCTIONAL'
        
    return True, 'CLEAN'

clean_samples = []
rejected = 0

with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        c = json.loads(line)
        b_id = c.get('book_id', '')
        txt = c.get('text', '')
        for m in p_sent.finditer(txt):
            s = m.group(1).strip()
            ok, reason = is_valid_gold_sentence(s, b_id)
            if ok:
                clean_samples.append((b_id, idx, s))
            else:
                rejected += 1

print(f"Total valid Gold sentences: {len(clean_samples)}")
print(f"Total rejected sentences: {rejected}")
print("Sample first 10 valid Gold sentences:")
for b, idx, s in clean_samples[:10]:
    print(f"  [{b} #{idx}]: {s}")
