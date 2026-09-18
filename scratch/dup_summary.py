import sys
import json
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

with open('data/grades/grade_7.json', 'r', encoding='utf-8') as f:
    d7 = json.load(f)

dup_by_subj = Counter()
for s, topics in d7.items():
    for t, qs in topics.items():
        for q_idx, q in enumerate(qs):
            opts = q.get('options', [])
            clean_opts = [str(o).strip().lower() for o in opts]
            if len(set(clean_opts)) < len(opts):
                dup_by_subj[s] += 1

for s, cnt in dup_by_subj.most_common():
    print(f"{s}: {cnt} duplicate options questions")
