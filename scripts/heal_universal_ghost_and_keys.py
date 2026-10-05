#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import glob
import os
import re

BLOOM_DURATION = {
    "Bilik": 10,
    "Anlama": 10,
    "Tətbiq": 15,
    "Təhlil": 20,
}

def clean_subject_name(subj_str):
    s = re.sub(r'\s*\([^)]*\)', '', str(subj_str or '')).strip()
    s = re.sub(r'[-_\s]+\d+$', '', s).strip()
    s = re.sub(r'[-_]', ' ', s)
    words = s.split()
    if words:
        words[0] = words[0].capitalize()
        for i in range(1, len(words)):
            w = words[i].lower()
            if w in ["dili", "tarixi", "bilgisi"]:
                words[i] = w
            else:
                words[i] = words[i].capitalize()
        return " ".join(words)
    return s

def clean_concept_name(c):
    c = re.sub(r'^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*', '', str(c or ''), flags=re.I)
    c = re.sub(r'^elmi anlayış:\s*', '', c, flags=re.I)
    c = re.sub(r'[\$"]', '', c).strip()
    return c

def generate_parent_tip(root_book, root_grade, current_grade, root_concept, bloom, dur, is_intra, is_lang):
    clean_rc = clean_concept_name(root_concept)
    
    if is_lang:
        if bloom == "Bilik":
            skill_phrase = "lüğət ehtiyatı və faktik dil qaydalarını"
        elif bloom == "Anlama":
            skill_phrase = "oxuyub-anlama və mətni qavrama bacarığını"
        elif bloom == "Tətbiq":
            skill_phrase = "qrammatik qaydaları nitqdə tətbiq etmə bacarığını"
        else:
            skill_phrase = "mətni və dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
    else:
        if bloom == "Bilik":
            skill_phrase = "təməl anlayış və faktik bilikləri"
        elif bloom == "Anlama":
            skill_phrase = "mövzunu anlama və qavrama bacarığını"
        elif bloom == "Tətbiq":
            skill_phrase = "praktik tətbiq və məsələ həlli bacarığını"
        else:
            skill_phrase = "müqayisəli təhlil və elmi analiz bacarığını"

    if is_intra or (root_grade == current_grade):
        if dur == 10:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi {current_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
        elif dur == 15:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi {current_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunu və nümunə situasiya tapşırıqlarını 15 dəqiqə işləyin."
        else:
            tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün hazırda istifadə etdiyi {current_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunun dərin suallarını 20 dəqiqə dərindən araşdırın."
    else:
        if dur == 10:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün {root_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' təməl mövzusunu 10 dəqiqə təkrarlayın."
        elif dur == 15:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün {root_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' təməl mövzusunu və 2-3 nümunə situasiya tapşırığını 15 dəqiqə işləyin."
        else:
            tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün {root_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' təməl mövzusunu və səbəb-nəticə əlaqələrini 20 dəqiqə dərindən araşdırın."

    tip = re.sub(r'\b(?:dərslik\s*)?(?:səh(?:ifə)?|s\.|page)\s*\.?\s*\d+[-–\d]*[:\.]?', '', tip, flags=re.I)
    tip = re.sub(r'\s{2,}', ' ', tip).strip()
    return tip

def heal_file(file_path):
    print(f"\nProcessing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    g_match = re.search(r'grade_(\d+)', file_path)
    current_grade = int(g_match.group(1)) if g_match else 1

    ghost_fixed = 0
    distractor_fixed = 0
    key_fixed = 0
    total_q = 0

    for subj_name, topics in data.items():
        if not isinstance(topics, dict): continue
        canon_subj = clean_subject_name(subj_name)
        is_lang = bool(re.search(r'dili|ingilis|rus|alman|fransız', canon_subj, flags=re.I))

        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list): continue
            clean_topic = clean_concept_name(topic_name)

            for idx, q in enumerate(q_list):
                total_q += 1
                q_txt = str(q.get('question', '') or '')
                opts = q.get('options', [])
                if not isinstance(opts, list) or len(opts) < 2: continue

                c_idx = q.get('correctAnswer')
                if c_idx is None:
                    c_idx = q.get('correct_index', 0)
                try:
                    c_idx = int(c_idx)
                except:
                    c_idx = 0

                exp = str(q.get('explanation', '') or '')
                bt = q.setdefault('backward_trace', {})
                cn = str(bt.get('concept_name', '') or '')
                rc = str(bt.get('root_concept', '') or '')
                rb = str(bt.get('root_book', '') or '')
                rg = bt.get('root_grade')

                # A. FIX GHOST GRADE HALLUCINATIONS
                # Condition: root_grade < current_grade AND root_concept is verbatim/almost identical to current topic
                is_verbatim_ghost = False
                if rg and rg < current_grade:
                    clean_rc_norm = clean_concept_name(rc).lower().replace(' ', '')
                    clean_top_norm = clean_topic.lower().replace(' ', '')
                    if clean_rc_norm == clean_top_norm or clean_top_norm in clean_rc_norm or clean_rc_norm in clean_top_norm:
                        if len(clean_top_norm) >= 5:
                            is_verbatim_ghost = True

                if is_verbatim_ghost:
                    bt['root_grade'] = current_grade
                    bt['root_book'] = f"{canon_subj} {current_grade}"
                    bt['root_concept'] = clean_topic
                    bt['is_intra_grade'] = True
                    ghost_fixed += 1

                # B. FIX DISTRACTOR STEALS
                # If concept_name is stolen from a wrong option
                is_stolen = False
                for o_idx, opt in enumerate(opts):
                    if o_idx != c_idx:
                        opt_str = clean_concept_name(opt).lower()
                        if len(opt_str) > 8 and opt_str == clean_concept_name(cn).lower():
                            is_stolen = True
                            break
                if is_stolen or not cn or len(cn) > 60 or cn.startswith("Elmi Anlayış: $"):
                    cn = clean_topic
                    bt['concept_name'] = clean_topic
                    distractor_fixed += 1

                # C. SPECIFIC ANSWER KEY CONFLICT RESOLUTION
                # Pattern: "Doğru cavab A variantıdır" / "Düzgün cavab B bəndidir"
                rx_variant = re.search(r'(?:[Dd]oğru|[Dd]üzgün)\s+cavab\s*[\'":\-]?\s*([A-Ea-e])\s+(?:variantı|bəndi|variantıdır|bəndidir)\b', exp)
                if rx_variant:
                    exp_letter = rx_variant.group(1).upper()
                    target_idx = ord(exp_letter) - 65
                    if 0 <= target_idx < len(opts) and target_idx != c_idx:
                        # Reconcile key to match explanation's explicit letter
                        q['correctAnswer'] = target_idx
                        q['correct_index'] = target_idx
                        q['answer'] = exp_letter
                        q['correct_answer'] = exp_letter
                        key_fixed += 1
                        c_idx = target_idx

                # D. Bloom Duration & Synchronized Tip Regeneration
                raw_b = str(q.get("bloom_level") or q.get("bloomLevel") or "Anlama").strip().capitalize()
                if raw_b not in BLOOM_DURATION:
                    raw_b = "Anlama"
                q["bloom_level"] = raw_b
                q["bloomLevel"] = raw_b.lower()
                dur = BLOOM_DURATION[raw_b]
                bt["remedial_duration_mins"] = dur

                final_rb = str(bt.get("root_book") or f"{canon_subj} {current_grade}")
                final_rg = int(bt.get("root_grade") or current_grade)
                final_rc = str(bt.get("root_concept") or clean_topic)
                final_intra = bool(bt.get("is_intra_grade")) or (final_rg == current_grade)

                tip = generate_parent_tip(
                    final_rb,
                    final_rg,
                    current_grade,
                    final_rc,
                    raw_b,
                    dur,
                    final_intra,
                    is_lang
                )
                bt["parent_action_tip"] = tip

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Finished {file_path}: {ghost_fixed} ghost grades healed, {distractor_fixed} distractor steals healed, {key_fixed} keys reconciled (Total qs: {total_q})")
    return {"ghost": ghost_fixed, "distractor": distractor_fixed, "keys": key_fixed, "total": total_q}

def main():
    target_dirs = ['data/grades', 'autonomous_kag/active_staging']
    grand_stats = {"ghost": 0, "distractor": 0, "keys": 0, "total": 0}

    for tdir in target_dirs:
        if not os.path.exists(tdir): continue
        for fpath in sorted(glob.glob(os.path.join(tdir, 'grade_*.json'))):
            if 'grade_other' in fpath: continue
            st = heal_file(fpath)
            if tdir == 'data/grades':
                grand_stats["ghost"] += st["ghost"]
                grand_stats["distractor"] += st["distractor"]
                grand_stats["keys"] += st["keys"]
                grand_stats["total"] += st["total"]

    print("\n" + "="*80)
    print("UNIVERSAL HEALING COMPLETED!")
    print(f"Total Questions Processed: {grand_stats['total']}")
    print(f"Total Ghost Grade Hallucinations Fixed: {grand_stats['ghost']}")
    print(f"Total Distractor Steals Fixed: {grand_stats['distractor']}")
    print(f"Total Answer Keys Reconciled: {grand_stats['keys']}")
    print("="*80)

if __name__ == "__main__":
    main()
