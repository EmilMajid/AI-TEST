#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import glob
import os
import re

print("Starting Master Healing of Database Defects across ALL Grades...")

def clean_concept_name(c, topic_name):
    clean_top = re.sub(r'^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*', '', topic_name, flags=re.I).strip()
    c_str = str(c or '').strip()
    
    # If starts with 'Elmi Anlayış:' or is trivial
    if c_str.lower().startswith('elmi anlayış:'):
        extracted = re.sub(r'^elmi anlayış:\s*', '', c_str, flags=re.I).strip().strip("'\"«»")
        # If extracted is short, trivial or a phrase like "Ailə", "Alma", "şagirdlik", return topic
        if len(extracted.split()) <= 2 or len(extracted) < 15 or any(w in extracted.lower() for w in ['ailə', 'alma', 'ata', 'ana', 'qələm', 'dəftər', 'çox sağ olun', 'zəhmət olmasa', 'şagirdlik', 'türk gölü', 'biri', 'alınmaz qala']):
            return clean_top
        return extracted
        
    if not c_str or len(c_str) < 3 or c_str.lower() in ['şagirdlik', 'türk gölü', 'biri', 'alınmaz qala', 'ailə', 'alma']:
        return clean_top
        
    return c_str

def heal_distractor_diagnostics(q):
    dd = q.get('distractor_diagnostics')
    if not isinstance(dd, dict) or len(dd) == 0:
        return
        
    opts = q.get('options', [])
    c_idx = q.get('correctAnswer')
    if c_idx is None: c_idx = q.get('correct_index', 0)
    try: c_idx = int(c_idx)
    except: c_idx = 0
    
    exp = str(q.get('explanation', '') or '')
    
    for opt_idx, opt_val in enumerate(opts):
        letter = chr(65 + opt_idx)
        opt_text = str(opt_val).strip()
        
        if opt_idx == c_idx:
            # Correct option MUST NOT say 'Yanlışdır'
            curr_diag = str(dd.get(letter, ''))
            if 'yanlışdır' in curr_diag.lower() or not curr_diag:
                dd[letter] = f"DÜZGÜNDÜR: '{opt_text}'. Dərslik qayda və elmi meyarlarına tam uyğundur."
            elif not curr_diag.startswith('DÜZGÜNDÜR') and not curr_diag.startswith('DOĞRUDUR'):
                dd[letter] = f"DÜZGÜNDÜR: {curr_diag}"
        else:
            # Incorrect option MUST NOT say 'DÜZGÜNDÜR' or 'DOĞRUDUR'
            curr_diag = str(dd.get(letter, ''))
            if 'düzgündür' in curr_diag.lower() or 'doğrudur' in curr_diag.lower() or not curr_diag:
                dd[letter] = f"Yanlışdır ({opt_text}). Bu variant mövzunun tədris standartına uyğun deyil."

def filter_cross_subject_connections(bt, subj_name):
    cs_list = bt.get('cross_subject_connections')
    if not isinstance(cs_list, list) or len(cs_list) == 0:
        return
        
    low_src = subj_name.lower()
    cleaned = []
    
    for cs in cs_list:
        low_dst = str(cs.get('subject', '') or '').lower()
        # Drop History -> Foreign Language
        if 'tarix' in low_src and any(l in low_dst for l in ['ingilis', 'alman', 'fransız', 'rus']):
            continue
        # Drop Language -> Physics/Chemistry (Mexaniki gərginlik on diet/fresh air)
        if 'dili' in low_src and any(s in low_dst for s in ['fizika', 'kimya']):
            continue
        cleaned.append(cs)
        
    bt['cross_subject_connections'] = cleaned

# Specific fixes for Grade 10 math questions with broken options
GRADE_10_MATH_FIXES = {
    # Topic 1, Q5
    "f(x) = x^2 - 6x + 8": {
        "options": ["$(0; 8)$", "$(8; 0)$", "$(0; -8)$", "$(2; 4)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "$Oy$ oxu ilə kəsişmə nöqtəsində $x = 0$ olur. $f(0) = 0^2 - 6(0) + 8 = 8$. Deməli, kəsişmə nöqtəsi $(0; 8)$-dir. Düzgün cavab A bəndidir."
    },
    # Topic 1, Q12
    "y = 3x - 5 düz xəttinin üzərində": {
        "options": ["$(1; 1)$", "$(2; 3)$", "$(0; 5)$", "$(2; 1)$"],
        "correctAnswer": 3, "correct_index": 3, "answer": "D",
        "explanation": "$x = 2$ olduqda $y = 3(2) - 5 = 1$ olur. Nöqtə $(2; 1)$ tənliyi ödəyir. Düzgün cavab D bəndidir."
    },
    # Topic 3, Q9
    "y = |2x - 6|": {
        "options": ["$(0; 6)$", "$(0; -6)$", "$(3; 0)$", "$(6; 0)$"],
        "correctAnswer": 2, "correct_index": 2, "answer": "C",
        "explanation": "$Ox$ oxu ilə kəsişmədə $y = 0$ olur: $|2x - 6| = 0 \\implies x = 3$. Deməli, kəsişmə nöqtəsi $(3; 0)$-dır. Düzgün cavab C bəndidir."
    },
    # Topic 5, Q5
    "f(x) = \\frac{1}{\\sqrt{x^2 - 9}}": {
        "options": ["$(-\\infty; -3) \\cup (3; +\\infty)$", "$[-3; 3]$", "$(-3; 3)$", "$(-\\infty; -3] \\cup [3; +\\infty)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "Kökaltı ifadə məxrəcdə olduğundan $x^2 - 9 > 0 \\implies (x - 3)(x + 3) > 0 \\implies x \\in (-\\infty; -3) \\cup (3; +\\infty)$. Düzgün cavab A bəndidir."
    },
    # Topic 5, Q11
    "f(x) = \\sqrt{4 - x^2}": {
        "options": ["$(-\\infty; -2] \\cup [2; +\\infty)$", "$(-2; 2)$", "$[-2; 2]$", "$[0; 2]$"],
        "correctAnswer": 2, "correct_index": 2, "answer": "C",
        "explanation": "Kökaltı ifadə mənfi olmamalıdır: $4 - x^2 \\ge 0 \\implies x^2 \\le 4 \\implies [-2; 2]$. Düzgün cavab C bəndidir."
    },
    # Topic 15, Q7
    "y = \\sin x funksiyasının qiymətlər": {
        "options": ["$[-1; 1]$", "$(-1; 1)$", "$[0; 1]$", "$(-\\infty; +\\infty)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "Sinus funksiyasının qiymətlər çoxluğu $[-1; 1]$ parçasıdır. Düzgün cavab A bəndidir."
    },
    # Topic 15, Q14
    "y = 3\\cos x + 4": {
        "options": ["$[-3; 3]$", "$[1; 7]$", "$[-1; 1]$", "$[1; 7]$"],
        "correctAnswer": 1, "correct_index": 1, "answer": "B",
        "explanation": "$-1 \\le \\cos x \\le 1 \\implies -3 \\le 3\\cos x \\le 3 \\implies 1 \\le 3\\cos x + 4 \\le 7$. Qiymətlər çoxluğu $[1; 7]$-dir. Düzgün cavab B bəndidir."
    },
    # Topic 19, Q6
    "Kəsik piramidanın həcmi": {
        "options": ["$V = \\frac{1}{3} h (S_1 + S_2 + \\sqrt{S_1 S_2})$", "$V = h \\sqrt{S_1 S_2}$", "$V = \\frac{1}{2} h (S_1 + S_2)$", "$V = \\frac{1}{3} h (S_1 + S_2)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "Kəsik piramidanın həcmi $V = \\frac{1}{3} h (S_1 + S_2 + \\sqrt{S_1 S_2})$ düsturu ilə hesablanır. Düzgün cavab A bəndidir."
    },
    # Topic 21, Q1
    "y = a^x (a > 0, a \\ne 1) üstlü funksiyasının": {
        "options": ["$D(f) = (-\\infty; +\\infty), E(f) = (0; +\\infty)$", "$D(f) = (0; +\\infty), E(f) = (-\\infty; +\\infty)$", "$D(f) = [0; +\\infty), E(f) = [0; +\\infty)$", "$D(f) = (-\\infty; +\\infty), E(f) = [1; +\\infty)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "Üstlü funksiyanın təyin oblastı bütün həqiqi ədədlər çoxluğu $(-\\infty; +\\infty)$, qiymətlər çoxluğu isə müsbət həqiqi ədədlər $(0; +\\infty)$-dur. Düzgün cavab A bəndidir."
    },
    # Topic 21, Q4
    "y = 2^x funksiyasının qrafiki": {
        "options": ["$(1; 0)$ nöqtəsindən", "$(0; 0)$ koordinat başlanğıcından", "$(0; 1)$ nöqtəsindən", "$(1; 1)$ nöqtəsindən"],
        "correctAnswer": 2, "correct_index": 2, "answer": "C",
        "explanation": "$x = 0$ olduqda $y = 2^0 = 1$ olur. Qrafik $(0; 1)$ nöqtəsindən keçir. Düzgün cavab C bəndidir."
    },
    # Topic 22, Q12
    "y = \\log_a x (a > 0, a \\ne 1) loqarifmik": {
        "options": ["$D(f) = (0; +\\infty), E(f) = (-\\infty; +\\infty)$", "$D(f) = (-\\infty; +\\infty), E(f) = (0; +\\infty)$", "$D(f) = [0; +\\infty), E(f) = [0; +\\infty)$", "$D(f) = (0; +\\infty), E(f) = (0; +\\infty)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "Loqarifmik funksiyanın təyin oblastı $(0; +\\infty)$, qiymətlər çoxluğu $(-\\infty; +\\infty)$-dur. Düzgün cavab A bəndidir."
    },
    # Topic 23, Q4
    "\\log_2 (x - 3) < 2": {
        "options": ["$(3; 7)$", "$(-\\infty; 7)$", "$[0; 7)$", "$(3; +\\infty)$"],
        "correctAnswer": 0, "correct_index": 0, "answer": "A",
        "explanation": "$x - 3 > 0 \\implies x > 3$ və $x - 3 < 2^2 = 4 \\implies x < 7$. Həll aralığı $(3; 7)$-dir. Düzgün cavab A bəndidir."
    },
    # Biologiya 10, Q14 & Q15
    "Klinefelter sindromlu": {
        "options": ["$45$ xromosom", "$47$ xromosom ($XXY$)", "$46$ xromosom", "$48$ xromosom"],
        "correctAnswer": 1, "correct_index": 1, "answer": "B",
        "explanation": "Klinefelter sindromlu xəstələrdə kariotip $47, XXY$ olur. Düzgün cavab B bəndidir."
    },
    "Daun sindromlu": {
        "options": ["$45$ xromosom", "$47$ xromosom (21-ci trisomiya)", "$46$ xromosom", "$48$ xromosom"],
        "correctAnswer": 1, "correct_index": 1, "answer": "B",
        "explanation": "Daun sindromlu şəxslərdə 21-ci cüt üzrə trisomiya nəticəsində cəmi 47 xromosom olur. Düzgün cavab B bəndidir."
    }
}

def heal_target_file(fpath):
    print(f"Processing {fpath}...")
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    stats = {
        "grounding_fixed": 0,
        "concept_name_fixed": 0,
        "diag_fixed": 0,
        "cross_cleaned": 0,
        "math_fixed": 0
    }

    for subj_name, topics in data.items():
        if not isinstance(topics, dict): continue
        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list): continue

            for q in q_list:
                q_txt = str(q.get('question', '') or '')
                bt = q.setdefault('backward_trace', {})
                gr = q.setdefault('grounding', {})

                # 1. Clean grounding canonical_concept
                old_gc = gr.get('canonical_concept')
                new_gc = clean_concept_name(old_gc, topic_name)
                if new_gc != old_gc:
                    gr['canonical_concept'] = new_gc
                    stats["grounding_fixed"] += 1

                # 2. Clean backward_trace concept_name
                old_cn = bt.get('concept_name')
                new_cn = clean_concept_name(old_cn, topic_name)
                if new_cn != old_cn:
                    bt['concept_name'] = new_cn
                    stats["concept_name_fixed"] += 1

                # 3. Clean Distractor Diagnostics
                heal_distractor_diagnostics(q)
                stats["diag_fixed"] += 1

                # 4. Clean Bizarre Cross-Subject Connections
                filter_cross_subject_connections(bt, subj_name)
                stats["cross_cleaned"] += 1

                # 5. Fix Grade 10 Math & Biology Broken Options
                for k_pattern, fix_dict in GRADE_10_MATH_FIXES.items():
                    if k_pattern.lower() in q_txt.lower():
                        q['options'] = fix_dict['options']
                        q['correctAnswer'] = fix_dict['correctAnswer']
                        q['correct_index'] = fix_dict['correct_index']
                        q['answer'] = fix_dict['answer']
                        if 'correct_answer' in q: q['correct_answer'] = fix_dict['answer']
                        q['explanation'] = fix_dict['explanation']
                        heal_distractor_diagnostics(q)
                        stats["math_fixed"] += 1
                        break

    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Done {fpath}: {stats}")
    return stats

def main():
    target_dirs = ['data/grades', 'autonomous_kag/active_staging']
    grand_stats = {
        "grounding_fixed": 0, "concept_name_fixed": 0, "diag_fixed": 0, "cross_cleaned": 0, "math_fixed": 0
    }

    for tdir in target_dirs:
        if not os.path.exists(tdir): continue
        for fpath in sorted(glob.glob(os.path.join(tdir, 'grade_*.json'))):
            if 'grade_other' in fpath: continue
            st = heal_target_file(fpath)
            if tdir == 'data/grades':
                for k in grand_stats: grand_stats[k] += st[k]

    print("\n" + "="*80)
    print("MASTER HEALING COMPLETED ACROSS ALL GRADES!")
    print(f"Total Grounding Canonical Concepts Cleansed: {grand_stats['grounding_fixed']}")
    print(f"Total Concept Names Cleansed: {grand_stats['concept_name_fixed']}")
    print(f"Total Distractor Diagnostics Synchronized: {grand_stats['diag_fixed']}")
    print(f"Total Broken Math / Duplicates Restored: {grand_stats['math_fixed']}")
    print("="*80)

if __name__ == "__main__":
    main()
