import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'
CORRUPTED_BOOKS = {
    'informatika-5', 'azerbaycan-dili-5-h1', 'azerbaycan-dili-5-h2',
    'riyaziyyat-5-h2', 'riyaziyyat-5-h1', 'azerbaycan-tarixi-5', 'edebiyyat-5'
}

VERB_PATTERN = re.compile(r'\s+(?:və\s+ya\s+)?([A-Za-zƏəÖöÜüİiIıĞğÇçŞş\-\s]{3,35})\s+(adlanır|deyilir|hesab olunur|adlandırılır|qanunudur|teoremidir|düsturudur|qaydasıdır)\.$', re.I)

def extract_label_from_sentence(sentence):
    m = VERB_PATTERN.search(sentence)
    if not m:
        return None
    raw = m.group(1).strip()
    words = raw.split()
    # Filter stopwords at the beginning
    stopwords = {'buna', 'belə', 'həmin', 'isə', 'və', 'onda', 'artıq', 'adətən', 'adlanan', 'yeni', 'bir', 'bu'}
    while words and words[0].lower() in stopwords:
        words = words[1:]
    if not words:
        return None
    # Keep up to 3 words
    words = words[-3:]
    label = ' '.join(words)
    # Capitalize first letter
    label = label[0].upper() + label[1:]
    return label

extracted_samples = []

with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        c = json.loads(line)
        b_id = c.get('book_id', '')
        if b_id in CORRUPTED_BOOKS:
            continue
        txt = c.get('text', '')
        sentences = re.findall(r'([A-ZƏÖÜİĞÇŞ][^\.!?\n\r]{20,250}\s+(?:adlanır|deyilir|hesab olunur|adlandırılır|qanunudur|teoremidir|düsturudur|qaydasıdır)\.)', txt)
        for s in sentences:
            if 'ə' in s.lower() and not re.search(r'[\)•\-]{2,}|=\s*-\s*•|\d{4,}[a-z]{3,}|·\s*,\s*-', s):
                lbl = extract_label_from_sentence(s)
                if lbl and len(lbl) >= 3 and len(extracted_samples) < 30:
                    extracted_samples.append((b_id, lbl, s))

print(f"Sample {len(extracted_samples)} extracted labels and statements:")
for b, lbl, s in extracted_samples:
    print(f"  [{b}] -> '{lbl}'")
    print(f"       Claim: {s[:100]}...")
