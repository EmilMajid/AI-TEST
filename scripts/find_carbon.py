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
            if 'Carbon Footprint' in txt or 'greenhouse' in txt.lower() or 'cop29' in txt.lower() or 'sustainable development' in txt.lower():
                print(f"SUBJ: {subj} | TOPIC: {t}")
                print(f"Q: {txt}")
                bt = q.get('backward_trace', {})
                print("ROOT BOOK:", bt.get('root_book'))
                print("ROOT CONCEPT:", bt.get('root_concept'))
                print("CONCEPT NAME:", bt.get('concept_name'))
                print("ROOT GRADE:", bt.get('root_grade'))
                print("TIP:", bt.get('parent_action_tip'))
                print("="*60)
