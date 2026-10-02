#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

with open('data/grades/grade_11.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for subj, tops in d.items():
    if not isinstance(tops, dict): continue
    for t, qs in tops.items():
        if not isinstance(qs, list): continue
        for q in qs:
            if not isinstance(q, dict): continue
            txt = q.get('question', '')
            if any(k in txt for k in ['Carbon Footprint', 'hosted by Azerbaijan in Baku in November 2024', 'Greenhouse Effect', 'Sustainable Development', 'Black Sea']):
                print(f"SUBJ: {subj} | TOPIC: {t}")
                print(f"QUESTION: {txt}")
                print(f"BLOOM: {q.get('bloom_level')} / {q.get('bloomLevel')} | DIFF: {q.get('difficulty')}")
                bt = q.get('backward_trace', {})
                print(f"ROOT BOOK: {bt.get('root_book')}")
                print(f"ROOT CONCEPT: {bt.get('root_concept')}")
                print(f"CONCEPT NAME: {bt.get('concept_name')}")
                print(f"ROOT GRADE: {bt.get('root_grade')}")
                print(f"DURATION: {bt.get('remedial_duration_mins')}")
                print(f"TIP: {bt.get('parent_action_tip')}")
                print(f"EXPLANATION: {q.get('explanation')}")
                print("="*60)
