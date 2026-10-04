#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
execute_phase3_fixes.py
Phase 3 Master Healing Script:
1. B1: Questions with analysis verbs (təhlil, müqayisə, compare, analyze, etc.) calibrated to 'Təhlil'
2. B2: Questions requiring calculation/math problem solving calibrated to 'Tətbiq'
3. B3: Breaks uniform/mechanical flat Bloom levels across topics, applying natural pedagogical Bloom distribution
4. B4: Synchronizes cognitive difficulty (sadə, orta, çətin) with Bloom level
5. Lockstep sync: Automatically synchronizes remedial_duration_mins (10, 10, 15, 20) and parent_action_tip
Applies to data/grades/*.json and autonomous_kag/active_staging/*.json in lockstep.
"""

import json
import glob
import os
import re
import time

def save_json_atomic(fp, data):
    tmp_fp = fp + '.tmp'
    with open(tmp_fp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    for attempt in range(5):
        try:
            os.replace(tmp_fp, fp)
            return True
        except OSError:
            time.sleep(0.5)
    try:
        if os.path.exists(fp):
            os.remove(fp)
        os.rename(tmp_fp, fp)
        return True
    except Exception as e:
        print(f"Error saving {fp}: {e}")
        return False

ORD = {
    1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü', 5: 'ci',
    6: 'cı', 7: 'ci', 8: 'ci', 9: 'cu', 10: 'cu', 11: 'ci'
}

def get_ord_suffix(g):
    return ORD.get(int(g) if str(g).isdigit() else 1, 'ci')

BLOOM_MIN = {
    'Bilik': 10,
    'Anlama': 10,
    'Tətbiq': 15,
    'Təhlil': 20
}

ANALYSIS_KW = re.compile(
    r'(təhlil|müqayisə|əsaslandır|fərqi nədən ibarət|uyğunluğu müəyyən|münasibət|səbəb-nəticə|'
    r'qanunauyğunluq|hansı fikir doğrudur|hansı mülahizə|nəticə çıxarmaq|'
    r'проанализируй|сравните|сопоставьте|обоснуйте|в чем различие|соответстви|'
    r'analy[sz]e|compare|contrast|justify|infer|relationship)', re.I
)

CALC_KW = re.compile(
    r'(hesabla|nəyə bərabərdir|qiymətini tap|həll edin|neçədir|ifadənin qiymət|neçə faiz|'
    r'вычисли|найдите значение|решите|чему равн|сколько|'
    r'calculate|solve|find the value|how many|how much)', re.I
)

RECALL_KW = re.compile(
    r'(necə adlanır|hansı ildə|kimdir|nə vaxt|tarixdə ilk dəfə|hansı əsrdə|müəllifi kimdir|'
    r'как называется|в каком году|кто автор|кто|'
    r'what is called|which year|who is|who wrote)', re.I
)

GRAMMAR = re.compile(
    r'(cümlə|nitq hissə|isim|sifət|feil|şəkilçi|mübtəda|durğu|orfoqraf|sintaktik|morfoloji|'
    r'sinonim|antonim|omonim|söz birləşmə|zərf|əvəzlik|'
    r'предложени|словообразов|суффикс|приставк|падеж|склонени|спряжени|причасти|деепричасти|'
    r'синоним|антоним|морфолог|синтаксич|орфограф|'
    r'существительн|прилагательн|глагол|наречи|местоимени|частиц|обособлен|подлежащ|сказуем|дополнени|определени|обстоятельств|'
    r'predlojen|slovoobrazov|suffiks|pristavk|padej|skloneni|spryajeni|prichasti|deeprichasti|morfolog|sintaksich|orfograf|'
    r'sushestviteln|prilagateln|glagol|narechi|mestoimeni|chastic|obosoblen|'
    r'\btense\b|grammar|passive voice|plural|\bverb\b|\bnoun\b|adjective|preposition|'
    r'conditional|gerund|infinitive|past simple|present simple)', re.I
)

LANG_SUBJ = re.compile(r'dili|ədəbiyyat|rus|ingilis|alman|fransız|язык|литератур', re.I)
LIT_SUBJ = re.compile(r'ədəbiyyat|литератур', re.I)

def clean_subject(s):
    s = re.sub(r'\s*\([^)]*\)', '', str(s or '')).strip()
    s = re.sub(r'[-_\s]+\d+$', '', s).strip()
    return s

def clean_topic_title(t):
    s = str(t or '').strip()
    s = re.sub(r'^\s*([0-9]+(\.[0-9]+)*)\s*[\.\:\)]\s*', '', s)
    s = re.sub(r'^\s*([IVXLCDM]+)\s*[\.\:\)]\s*', '', s)
    s = re.sub(r'^elmi anlayış:\s*', '', s, flags=re.I)
    return s.strip()

print("=== STARTING PHASE 3 BLOOM & PEDAGOGICAL BALANCING ===")

target_patterns = [
    'data/grades/grade_*.json',
    'autonomous_kag/active_staging/grade_*.json'
]

stats = {
    'b1_healed': 0,
    'b2_healed': 0,
    'b3_topics_rebalanced': 0,
    'diff_aligned': 0,
    'tips_resynced': 0,
    'files_saved': 0
}

all_files = []
for pat in target_patterns:
    for fp in sorted(glob.glob(pat)):
        if 'other' in fp:
            continue
        all_files.append(fp)

all_files = sorted(set(os.path.abspath(f) for f in all_files))

for fp in all_files:
    fname = os.path.basename(fp)
    fgrade_m = re.search(r'\d+', fname)
    if not fgrade_m:
        continue
    fgrade = int(fgrade_m.group())
    file_modified = False

    with open(fp, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for subj, topics in data.items():
        if not isinstance(topics, dict):
            continue
        subj_clean = clean_subject(subj)
        is_lang = bool(LANG_SUBJ.search(subj))
        is_lit = bool(LIT_SUBJ.search(subj))

        for topic, qs in topics.items():
            if not isinstance(qs, list) or len(qs) == 0:
                continue

            clean_topic = clean_topic_title(topic)
            if not clean_topic:
                clean_topic = str(topic).strip()

            # Check if this topic currently has flat/uniform Bloom
            topic_blooms = [str(q.get('bloom_level') or q.get('bloomLevel') or 'Bilik') for q in qs if isinstance(q, dict)]
            is_flat_bloom = (len(set(topic_blooms)) == 1 and len(qs) >= 4)
            if is_flat_bloom:
                stats['b3_topics_rebalanced'] += 1

            for i, q in enumerate(qs):
                if not isinstance(q, dict):
                    continue

                q_text = str(q.get('question') or q.get('q') or '')
                full_text = f"{q_text} {topic}"
                bt = q.get('backward_trace')
                if not isinstance(bt, dict):
                    bt = {}
                    q['backward_trace'] = bt
                    file_modified = True

                curr_bloom = str(q.get('bloom_level') or q.get('bloomLevel') or 'Bilik')
                raw_diff = str(q.get('difficulty') or '').lower()

                # --- Step 1: Determine Pedagogically Accurate Bloom ---
                new_bloom = curr_bloom

                # B1: Analysis verbs must be Təhlil
                if ANALYSIS_KW.search(q_text) and curr_bloom in ('Bilik', 'Anlama'):
                    new_bloom = 'Təhlil'
                    stats['b1_healed'] += 1
                # B2: Math/calculation keywords must be Tətbiq
                elif CALC_KW.search(q_text) and curr_bloom == 'Bilik':
                    new_bloom = 'Tətbiq'
                    stats['b2_healed'] += 1
                # B3: Rebalance flat topics
                elif is_flat_bloom:
                    if ANALYSIS_KW.search(q_text):
                        new_bloom = 'Təhlil'
                    elif CALC_KW.search(q_text):
                        new_bloom = 'Tətbiq'
                    elif RECALL_KW.search(q_text):
                        new_bloom = 'Bilik'
                    else:
                        # Graduated pedagogical distribution
                        ratio = i / max(1, len(qs) - 1)
                        if raw_diff in ('asan', 'sadə', 'простой') or ratio < 0.33:
                            new_bloom = 'Bilik' if ('adlanır' in q_text or 'nədir' in q_text or 'kimdir' in q_text) else 'Anlama'
                        elif raw_diff in ('orta', 'средний') or ratio < 0.67:
                            new_bloom = 'Tətbiq'
                        else:
                            new_bloom = 'Təhlil'

                # Standardize difficulty
                target_diff = raw_diff
                if new_bloom == 'Bilik':
                    target_diff = 'sadə'
                elif new_bloom == 'Anlama':
                    target_diff = 'sadə' if raw_diff in ('asan', 'sadə', 'простой') else 'orta'
                elif new_bloom == 'Tətbiq':
                    target_diff = 'orta'
                elif new_bloom == 'Təhlil':
                    target_diff = 'çətin'

                if q.get('difficulty') != target_diff:
                    q['difficulty'] = target_diff
                    stats['diff_aligned'] += 1
                    file_modified = True

                if curr_bloom != new_bloom or q.get('bloom_level') != new_bloom or q.get('bloomLevel') != new_bloom:
                    q['bloom_level'] = new_bloom
                    q['bloomLevel'] = new_bloom
                    file_modified = True

                # --- Step 2: Duration & Tip Lockstep Sync ---
                exact_duration = BLOOM_MIN[new_bloom]
                if bt.get('remedial_duration_mins') != exact_duration:
                    bt['remedial_duration_mins'] = exact_duration
                    file_modified = True

                curr_rg = bt.get('root_grade') or fgrade
                curr_rb = bt.get('root_book') or f"{subj_clean} {curr_rg}"
                curr_concept = bt.get('root_concept') or clean_topic
                curr_is_intra = bt.get('is_intra_grade', curr_rg == fgrade)

                # Skill phrase selection
                is_grammar = is_lang and not is_lit and bool(GRAMMAR.search(full_text))

                if is_lit:
                    rule_suffix = "(bədii təhlilini)"
                    if new_bloom == "Bilik":
                        skill_phrase = "ədəbi fakt və məlumatları"
                    elif new_bloom == "Anlama":
                        skill_phrase = "oxuyub-anlama və bədii məzmunu qavrama bacarığını"
                    elif new_bloom == "Tətbiq":
                        skill_phrase = "bədii təhlil bacarığını"
                    else:
                        skill_phrase = "müqayisəli ədəbi təhlil və analiz bacarığını"
                elif is_lang:
                    rule_suffix = "(əsas qaydaları)"
                    if is_grammar:
                        if new_bloom == "Bilik":
                            skill_phrase = "təməl qrammatik qaydaları"
                        elif new_bloom == "Anlama":
                            skill_phrase = "qrammatik qaydaları anlama və qavrama bacarığını"
                        elif new_bloom == "Tətbiq":
                            skill_phrase = "qrammatik qaydaları nitqdə tətbiq etmə bacarığını"
                        else:
                            skill_phrase = "dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
                    elif 'frazeoloji' in full_text.lower() or 'sinonim' in full_text.lower() or 'antonim' in full_text.lower():
                        skill_phrase = "lüğət ehtiyatı və leksik bacarıqlarını"
                    elif new_bloom == "Bilik":
                        skill_phrase = "lüğət ehtiyatı və faktik dil qaydalarını"
                    elif new_bloom == "Anlama":
                        skill_phrase = "oxuyub-anlama və mətni qavrama bacarığını"
                    elif new_bloom == "Tətbiq":
                        skill_phrase = "praktik tətbiq bacarığını"
                    else:
                        skill_phrase = "mətni və dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
                else:
                    rule_suffix = "(əsas qaydaları)"
                    if new_bloom == "Bilik":
                        skill_phrase = "təməl anlayış və faktik bilikləri"
                    elif new_bloom == "Anlama":
                        skill_phrase = "mövzunu anlama və qavrama bacarığını"
                    elif new_bloom == "Tətbiq":
                        skill_phrase = "praktik tətbiq və məsələ həlli bacarığını"
                    else:
                        skill_phrase = "müqayisəli təhlil və elmi analiz bacarığını"

                q_suff = get_ord_suffix(fgrade)
                root_suff = get_ord_suffix(curr_rg)

                if curr_is_intra or curr_rg == fgrade:
                    if exact_duration == 10:
                        tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi {fgrade}-{q_suff} sinif {curr_rb} dərsliyindəki '{curr_concept}' mövzusunu {rule_suffix} 10 dəqiqə nəzərdən keçirməsi kifayətdir."
                    elif exact_duration == 15:
                        tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi {fgrade}-{q_suff} sinif {curr_rb} dərsliyindəki '{curr_concept}' mövzusunu və nümunə situasiya tapşırıqlarını 15 dəqiqə işləyin."
                    else:
                        tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün hazırda istifadə etdiyi {fgrade}-{q_suff} sinif {curr_rb} dərsliyindəki '{curr_concept}' mövzusunun dərin suallarını 20 dəqiqə dərindən araşdırın."
                else:
                    if exact_duration == 10:
                        tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün {curr_rg}-{root_suff} sinif {curr_rb} dərsliyindəki '{curr_concept}' təməl mövzusunu 10 dəqiqə təkrarlayın."
                    elif exact_duration == 15:
                        tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün {curr_rg}-{root_suff} sinif {curr_rb} dərsliyindəki '{curr_concept}' təməl mövzusunu və 2-3 nümunə situasiya tapşırığını 15 dəqiqə işləyin."
                    else:
                        tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün {curr_rg}-{root_suff} sinif {curr_rb} dərsliyindəki '{curr_concept}' təməl mövzusunu və səbəb-nəticə əlaqələrini 20 dəqiqə dərindən araşdırın."

                tip = re.sub(r'\b(?:dərslik\s*)?(?:səh(?:ifə)?|s\.|page)\s*\.?\s*\d+[-–\d]*[:\.]?', '', tip, flags=re.I)
                tip = re.sub(r'\s{2,}', ' ', tip).strip()

                if bt.get('parent_action_tip') != tip:
                    bt['parent_action_tip'] = tip
                    stats['tips_resynced'] += 1
                    file_modified = True

    if file_modified:
        if save_json_atomic(fp, data):
            stats['files_saved'] += 1
            print(f"Healed and saved: {fp}")
        else:
            print(f"FAILED to save: {fp}")

print("\n=== PHASE 3 EXECUTION COMPLETE ===")
for k, v in stats.items():
    print(f"  {k}: {v}")
