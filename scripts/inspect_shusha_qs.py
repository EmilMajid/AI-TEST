#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

with open('data/grades/grade_9.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for subj, tops in d.items():
    if not isinstance(tops, dict): continue
    for t, qs in tops.items():
        if '25' in t or 'Şuşa' in t or 'yaşayış məskəni' in t:
            print(f"TOPIC: {t} (qs: {len(qs)})")
            for q in qs:
                txt = q.get('question', '')
                if any(w in txt for w in ['Şuşa qədim', 'fəxri adla', 'Vasitəsiz nitqli', 'spesifik mədəniyyət', 'Pənahəli xanın']):
                    print("Q:", txt)
                    print("BLOOM:", q.get('bloom_level'), "|", q.get('bloomLevel'), "| DIFF:", q.get('difficulty'))
                    bt = q.get('backward_trace', {})
                    print("ROOT BOOK:", bt.get('root_book'))
                    print("ROOT CONCEPT:", bt.get('root_concept'))
                    print("CONCEPT NAME:", bt.get('concept_name'))
                    print("DURATION:", bt.get('remedial_duration_mins'))
                    print("TIP:", bt.get('parent_action_tip'))
                    print("="*60)
