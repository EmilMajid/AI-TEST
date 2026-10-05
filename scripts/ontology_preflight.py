import json, sys, re, collections
sys.stdout.reconfigure(encoding='utf-8')

# 1. Corpus stats
by_grade = collections.Counter(); by_subj = collections.Counter(); low_q = 0; no_q = 0; total = 0; chars = 0
with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try: c = json.loads(line)
        except Exception: continue
        total += 1
        by_grade[c.get('grade')] += 1
        by_subj[(c.get('grade'), c.get('subject'))] += 1
        chars += len(c.get('text') or '')
        qv = c.get('quality')
        if qv is None: no_q += 1
        elif qv < 0.7 or (c.get('corruption_ratio') or 0) > 0.1: low_q += 1
print('CHUNKS', total, 'CHARS', chars, 'LOWQ', low_q, 'NO_QUALITY_FIELD', no_q)
print('BY_GRADE', sorted(by_grade.items(), key=lambda x: str(x[0])))
print('SUBJ_COUNT', len(by_subj))

# 2. Regression check: explicit "Doğru cavab X" vs answer key after last healing
L = ['A','B','C','D','E']
contra = 0; samples = []
for g in range(1, 12):
    d = json.load(open(f'data/grades/grade_{g}.json', encoding='utf-8'))
    for s, ts in d.items():
        if not isinstance(ts, dict): continue
        for t, qs in ts.items():
            if not isinstance(qs, list): continue
            for i, q in enumerate(qs):
                if not isinstance(q, dict): continue
                m = re.search(r'Doğru cavab\s+([A-E])\b', str(q.get('explanation','')))
                if m and q.get('answer') in L and m.group(1) != q.get('answer'):
                    contra += 1
                    if len(samples) < 8: samples.append((g, s, t, i+1, m.group(1), q.get('answer'), str(q.get('question'))[:70]))
print('EXPLICIT_CONTRADICTIONS', contra)
for x in samples: print('  ', x)
