#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open('data/grades/grade_9.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for subj, tops in d.items():
    if not isinstance(tops, dict):
        continue
    for t, qs in tops.items():
        if not isinstance(qs, list):
            continue
        for q in qs:
            txt = q.get('question', '')
            if any(k in txt for k in ['hürkmək', 'Eyvandakı quşlara', 'Biz istəyirik ki', 'Sülh olan yerdə', 'qanad çaldı', 'Ağ göyərçin']):
                if 'hürkmək' in txt or 'Eyvandakı' in txt or 'Biz istəyirik' in txt or 'Sülh olan' in txt or 'qanad çaldı' in txt:
                    print(f"SUBJ: {subj} | TOPIC: {t}")
                    print(f"QUESTION: {txt}")
                    print(f"BLOOM: {q.get('bloom_level')} / {q.get('bloomLevel')} | DIFF: {q.get('difficulty')}")
                    bt = q.get('backward_trace', {})
                    print(f"ROOT BOOK: {bt.get('root_book')}")
                    print(f"ROOT CONCEPT: {bt.get('root_concept')}")
                    print(f"ROOT GRADE: {bt.get('root_grade')}")
                    print(f"DURATION: {bt.get('remedial_duration_mins')}")
                    print(f"TIP: {bt.get('parent_action_tip')}")
                    print("="*60)
