#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
heal_semantic_dislocations.py
Heals all semantic dislocations in Informatics across active database and staging:
1. Grade 10: "2.2. Modellərin növləri"
   - root_concept: "Modellərin təsnifatı: maddi (əşyavi) və informasiya modelləri"
   - remedial_topic: "2.2. Modellərin növləri"
   - remedial_book: "İnformatika 10"
2. Grade 10: "2.4. İnformasiya modelinin hazırlanması"
   - root_concept: "İnformasiya modelinin hazırlanması mərhələləri: məsələnin qoyuluşu, formalizasiya, kompüter modeli və eksperiment"
   - remedial_topic: "2.4. İnformasiya modelinin hazırlanması"
   - remedial_book: "İnformatika 10"
3. Grade 10: "2.5. Kompüter modeli"
   - Any question with mismatched root_concept (antivirus, skaner, funksiya) ->
   - root_concept: "İnformasiya modelinin hazırlanması mərhələləri: məsələnin qoyuluşu, formalizasiya, kompüter modeli və eksperiment"
   - remedial_topic: "2.5. Kompüter modeli"
   - remedial_book: "İnformatika 10"
4. Grade 11: "1.4. Süni intellekt və onun inkişaf istiqamətləri (AI, ML, Neyron şəbəkələr, Tyurinq testi)"
   - Q13 (ethics):
   - root_concept: "Süni İntellekt sistemlərinin tətbiqində etik prinsiplər və kibertəhlükəsizlik"
   - remedial_topic: "1.4. Süni intellekt və onun inkişaf istiqamətləri (AI, ML, Neyron şəbəkələr, Tyurinq testi)"
   - remedial_book: "İnformatika 11"
5. Regenerate parent_action_tip with exact Bloom duration lockstep.
Applied to both data/grades/*.json and autonomous_kag/active_staging/*.json.
"""

import json
import glob
import os
import re

def norm(s):
    if not s: return ""
    return str(s).replace('İ', 'i').replace('I', 'i').replace('ı', 'i').replace('ə', 'e').lower()

def generate_tip(bloom, grade, book, topic):
    b = str(bloom or "").lower()
    if 'bilik' in b or 'xatırlama' in b or 'knowledge' in b:
        return f"Övladınızın təməl anlayış və faktik bilikləri möhkəmləndirmək üçün hazırda istifadə etdiyi {grade}-ci sinif {book} dərsliyindəki '{topic}' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
    elif 'anlama' in b or 'comprehension' in b or 'understanding' in b:
        return f"Övladınızın mövzunu anlama və qavrama bacarığını möhkəmləndirmək üçün hazırda istifadə etdiyi {grade}-ci sinif {book} dərsliyindəki '{topic}' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
    elif 'tətbiq' in b or 'tetbiq' in b or 'application' in b:
        return f"Övladınızın praktik tətbiq və məsələ həlli bacarığını möhkəmləndirmək üçün hazırda istifadə etdiyi {grade}-ci sinif {book} dərsliyindəki '{topic}' mövzusunu və nümunə situasiya tapşırıqlarını 15 dəqiqə işləyin."
    else:
        return f"Övladınızın təhlil və məntiqi mühakimə bacarığını inkişaf etdirmək üçün hazırda istifadə etdiyi {grade}-ci sinif {book} dərsliyindəki '{topic}' mövzusunu və dərinləşdirilmiş situasiya tapşırıqlarını 20 dəqiqə təhlil edin."

target_files = glob.glob('data/grades/grade_*.json') + glob.glob('autonomous_kag/active_staging/grade_*.json')

total_healed = 0

for fpath in sorted(set(target_files)):
    if 'other' in fpath: continue
    fname = os.path.basename(fpath)
    
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    file_healed = 0

    for subj_name, topics in data.items():
        if not isinstance(topics, dict): continue
        s_norm = norm(subj_name)
        if 'informatika' not in s_norm: continue

        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list): continue
            t_norm = norm(topic_name)

            for idx, q in enumerate(q_list):
                bt = q.get('backward_trace', {})
                if not isinstance(bt, dict):
                    bt = {}
                    q['backward_trace'] = bt

                rc = str(bt.get('root_concept', '') or '')
                rc_norm = norm(rc)
                bloom = q.get('bloom_level') or q.get('bloomLevel') or 'Anlama'
                grade_num = re.search(r'\d+', subj_name)
                grade_num = grade_num.group(0) if grade_num else "10"

                need_healing = False
                new_rc = ""
                new_rem_t = ""
                new_rem_book = f"İnformatika {grade_num}"

                # Topic 2.2: Modellərin növləri
                if ('2.2' in topic_name) or ('model' in t_norm and 'nov' in t_norm):
                    if any(w in rc_norm for w in ['cinayet', 'kiber', 'fisinq', 'etik', 'dovr']):
                        need_healing = True
                        new_rc = "Modellərin təsnifatı: maddi (əşyavi) və informasiya modelləri"
                        new_rem_t = "2.2. Modellərin növləri"
                        new_rem_book = "İnformatika 10"

                # Topic 2.4: İnformasiya modelinin hazırlanması
                elif ('2.4' in topic_name) or ('model' in t_norm and 'hazirlan' in t_norm):
                    if any(w in rc_norm for w in ['cinayet', 'kiber', 'fisinq', 'etik', 'virus']):
                        need_healing = True
                        new_rc = "İnformasiya modelinin hazırlanması mərhələləri: məsələnin qoyuluşu, formalizasiya, kompüter modeli və eksperiment"
                        new_rem_t = "2.4. İnformasiya modelinin hazırlanması"
                        new_rem_book = "İnformatika 10"

                # Topic 2.5: Kompüter modeli
                elif ('2.5' in topic_name) or ('komputer modeli' in t_norm):
                    if any(w in rc_norm for w in ['antivirus', 'virus', 'skaner', 'funksiya']):
                        need_healing = True
                        new_rc = "İnformasiya modelinin hazırlanması mərhələləri: məsələnin qoyuluşu, formalizasiya, kompüter modeli və eksperiment"
                        new_rem_t = "2.5. Kompüter modeli"
                        new_rem_book = "İnformatika 10"

                # Grade 11: 1.4 Süni intellekt etikası
                elif ('1.4' in topic_name) or ('suni intellekt' in t_norm):
                    if any(w in rc_norm for w in ['fisinq', 'spaminq', 'dos']):
                        need_healing = True
                        new_rc = "Süni İntellekt sistemlərinin tətbiqində etik prinsiplər və kibertəhlükəsizlik"
                        new_rem_t = "1.4. Süni intellekt və onun inkişaf istiqamətləri (AI, ML, Neyron şəbəkələr, Tyurinq testi)"
                        new_rem_book = "İnformatika 11"

                if need_healing:
                    bt['root_concept'] = new_rc
                    bt['remedial_topic'] = new_rem_t
                    bt['remedial_book'] = new_rem_book
                    bt['root_book'] = new_rem_book
                    bt['is_intra_grade'] = True
                    bt['root_grade'] = int(grade_num) if grade_num.isdigit() else 10
                    bt['parent_action_tip'] = generate_tip(bloom, grade_num, new_rem_book, new_rem_t)
                    file_healed += 1
                    total_healed += 1

    if file_healed > 0:
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Healed {file_healed} questions in {fpath}")

print(f"\nTOTAL QUESTIONS HEALED: {total_healed}")
