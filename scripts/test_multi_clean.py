import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
print("Testing multi-pattern clean extraction...", flush=True)

CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'

# Definition sentence patterns
VERB_PATTERNS = [
    r'adlanır\.', r'deyilir\.', r'hesab olunur\.', r'adlandırılır\.',
    r'təyin olunur\.', r'ifadə olunur\.', r'bərabərdir\.',
    r'qanunudur\.', r'teoremidir\.', r'qaydasıdır\.', r'düsturudur\.',
    r'ibarətdir\.', r'növləri vardır\.', r'qrupa ayrılır\.', r'bölünür\.'
]
combined_verbs = '|'.join(VERB_PATTERNS)
p_sent = re.compile(rf'([A-ZƏÖÜİĞÇŞ][^\.!?\n\r]{{20,250}}\s+(?:{combined_verbs}))')

def is_clean_az_text(text):
    # Check vowels
    vowels = len(re.findall(r'[aeəioöuüıAEƏİOÖUÜI]', text))
    letters = len(re.findall(r'[a-zA-ZƏəÖöÜüİiIıĞğÇçŞş]', text))
    if letters == 0:
        return False
    vowel_ratio = vowels / letters
    # Healthy Azerbaijani text has ~40% vowels; corrupted OCR text missing 'ə' drops below 30%
    if vowel_ratio < 0.35:
        return False
    # No unnatural consonant clusters
    if re.search(r'[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}', text):
        return False
    # No noise symbols
    if re.search(r'[\)•\-]{2,}|=\s*-\s*•|\d{4,}[a-z]{3,}|·\s*,\s*-', text):
        return False
    return True

clean_count = 0
corrupted_count = 0
samples = []

with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        c = json.loads(line)
        txt = c.get('text', '')
        for m in p_sent.finditer(txt):
            s = m.group(1).strip()
            if is_clean_az_text(s):
                clean_count += 1
                if len(samples) < 10:
                    samples.append((c.get('book_id'), s))
            else:
                corrupted_count += 1

print(f"Total matching sentences: {clean_count + corrupted_count}", flush=True)
print(f"Clean (CLEAN OCR): {clean_count}", flush=True)
print(f"Corrupted (Filtered out): {corrupted_count}", flush=True)
print("Samples of CLEAN extractions:", flush=True)
for b, s in samples:
    print(f"  [{b}]: {s}", flush=True)
