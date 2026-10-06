import json
import re
import sys
import datetime

sys.stdout.reconfigure(encoding='utf-8')
print("Testing fast linear extraction...", flush=True)

CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'
p_sent = re.compile(r'([A-ZƏÖÜİĞÇŞ][^\.!?\n\r]{25,250}\s+(?:adlanır|deyilir|hesab olunur|qanunudur|teoremidir|adlandırılır)\.)')

count = 0
matches = []
with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        c = json.loads(line)
        txt = c.get('text', '')
        for m in p_sent.finditer(txt):
            s = m.group(1).strip()
            count += 1
            if len(matches) < 5:
                matches.append(s)

print(f"Total matching definition sentences found across entire corpus: {count}", flush=True)
for s in matches:
    print(f"  Sample: {s}", flush=True)
