#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys

with open('data/grades/grade_11.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for subj, tops in d.items():
    if 'ingilis' in subj.lower():
        print(f"SUBJ KEY: {subj}")
        for t, qs in tops.items():
            if 'cop29' in t.lower() or 'climate' in t.lower():
                print(f"  TOPIC: {t} (qs: {len(qs)})")
                for q in qs[:3]:
                    print("   Q:", q.get('question'))
                    bt = q.get('backward_trace', {})
                    print("   ROOT BOOK:", bt.get('root_book'))
                    print("   ROOT CONCEPT:", bt.get('root_concept'))
                    print("   CONCEPT NAME:", bt.get('concept_name'))
                    print("   TIP:", bt.get('parent_action_tip'))
                    print("-" * 40)
