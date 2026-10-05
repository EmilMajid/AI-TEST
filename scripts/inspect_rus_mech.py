#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, glob, os, re
from collections import Counter

d = json.load(open('data/grades/grade_10.json', encoding='utf-8'))
subj = [s for s in d if 'rus' in s.lower()]
print("Rus subjects in grade 10:", subj)
for s in subj:
    for t, qs in d[s].items():
        if 'Меч' in t:
            print(f"\n=== {s} -> {t} ({len(qs)} q) ===")
            for i, q in enumerate(qs):
                bt = q.get('backward_trace', {}) or {}
                print(f"Q{i+1} [{q.get('bloom_level') or q.get('bloomLevel')}|{q.get('difficulty')}] {str(q.get('question'))[:70]}")
                print(f"   expl: {str(q.get('explanation'))[:80]}")
                print(f"   rc={bt.get('root_concept')!r} cn={bt.get('concept_name')!r} grade={bt.get('root_grade')} intra={bt.get('is_intra_grade')}")

# Scope: language subjects where root_concept is a different topic title of the same subject (reading-text swap)
print("\n\n=== SCOPE: language topics whose root_concept is ANOTHER topic of same book ===")
lang_re = re.compile(r'dili|rus|ingilis|alman|fransız|ədəbiyyat', re.I)
def strip_num(x): return re.sub(r'^\s*([0-9]+|[IVXLCDM]+)[\.\:\-]\s*', '', str(x or '')).strip().lower()
total = 0; topics_hit = Counter()
for fp in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fp: continue
    g = json.load(open(fp, encoding='utf-8'))
    for s, topics in g.items():
        if not isinstance(topics, dict) or not lang_re.search(s): continue
        titles = {strip_num(t): t for t in topics}
        for t, qs in topics.items():
            if not isinstance(qs, list): continue
            st = strip_num(t)
            for q in qs:
                bt = q.get('backward_trace') or {}
                rc = strip_num(bt.get('root_concept'))
                if rc and rc != st and rc in titles and (bt.get('is_intra_grade') or bt.get('root_grade') in (None, int(re.search(r'\d+', os.path.basename(fp)).group()))):
                    total += 1
                    topics_hit[f"{os.path.basename(fp)} | {s} | {t} -> {bt.get('root_concept')}"] += 1
print("Questions with same-grade sibling-topic swap:", total)
print("Unique topic pairs:", len(topics_hit))
for k, v in topics_hit.most_common(40):
    print(f"  ({v}) {k}")

# Grade suffix check
print("\n=== Ordinal suffix sample ===")
c = Counter()
for fp in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fp: continue
    txt = open(fp, encoding='utf-8').read()
    for m in re.finditer(r'(\d+)-(ci|cı|cu|cü) sinif', txt):
        c[m.group(0)] += 1
for k, v in sorted(c.items(), key=lambda x: int(x[0].split('-')[0])):
    print(f"  {k}: {v}")
