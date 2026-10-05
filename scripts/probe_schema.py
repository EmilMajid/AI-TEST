#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, glob
from collections import Counter
keys = Counter(); btkeys = Counter(); samples = {}
for fp in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fp: continue
    g = json.load(open(fp, encoding='utf-8'))
    for s, topics in g.items():
        if not isinstance(topics, dict): continue
        for t, qs in topics.items():
            if not isinstance(qs, list): continue
            for q in qs:
                if not isinstance(q, dict): continue
                for k in q: keys[k] += 1
                for k in (q.get('backward_trace') or {}): btkeys[k] += 1
                if 'opt' not in samples and q.get('options'):
                    samples['opt'] = q
print("Question keys:", keys.most_common())
print("\nbacktrace keys:", btkeys.most_common())
q = samples.get('opt')
if q:
    out = {k: v for k, v in q.items() if k != 'backward_trace'}
    print("\nSAMPLE:", json.dumps(out, ensure_ascii=False, indent=1)[:2500])
    print("\nBT:", json.dumps(q.get('backward_trace'), ensure_ascii=False, indent=1)[:2000])
