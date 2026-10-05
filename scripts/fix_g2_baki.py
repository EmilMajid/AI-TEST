#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

for p in ['data/grades/grade_2.json', 'autonomous_kag/active_staging/grade_2.json']:
    with open(p, 'r', encoding='utf-8') as f:
        d = json.load(f)
    for k in ['Azərbaycan dili 2 (hissə 2)', 'Azərbaycan dili 2']:
        if k in d and 'Bakı' in d[k]:
            q = d[k]['Bakı'][10]
            bt = q['backward_trace']
            bt['root_concept'] = 'Bakı'
            bt['concept_name'] = 'Bakı'
            bt['parent_action_tip'] = "Övladınızın oxuyub-anlama və mətni qavrama bacarığını möhkəmləndirmək üçün hazırda istifadə etdiyi 2-ci sinif Azərbaycan dili 2 dərsliyindəki 'Bakı' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=2)

print("Fixed Grade 2 successfully!")
