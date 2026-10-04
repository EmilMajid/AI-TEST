#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
execute_phase2_fixes.py
Phase 2 Master Healing Script (Updated & Complete):
1. K2, K1L, K1O: Intra-grade semantic alignment (root_concept = concept_name = clean_topic)
2. K5: Prevent future-grade prerequisites (root_grade <= current_grade)
3. K7, K8, K9: Strict Bloom normalization and exact duration invariant (10, 10, 15, 20)
4. K10: Grammar questions (Az, Ru, En) assigned grammar skill phrase instead of 'oxuyub-anlama'
5. K11: Literature texts assigned literary analysis '(bədii təhlilini)' instead of '(əsas qaydaları)'
6. K4: Cross-subject leakages validated against curriculum tracks (Təbiət -> Fizika/Kimya is valid)
7. K3, K14, K15, K16: Zero-page, proper ordinal suffix, no 'elmi anlayış:' residues
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

BLOOM_MAP = {
    'bilik': 'Bilik', 'knowledge': 'Bilik', 'знание': 'Bilik', 'xatırlama': 'Bilik',
    'anlama': 'Anlama', 'comprehension': 'Anlama', 'понимание': 'Anlama', 'qavrama': 'Anlama',
    'tətbiq': 'Tətbiq', 'tetbiq': 'Tətbiq', 'application': 'Tətbiq', 'применение': 'Tətbiq',
    'təhlil': 'Təhlil', 'tehlil': 'Təhlil', 'analysis': 'Təhlil', 'анализ': 'Təhlil',
    'dəyərləndirmə': 'Təhlil', 'evaluation': 'Təhlil', 'yaradıcılıq': 'Təhlil', 'yaratmaq': 'Təhlil'
}

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

def az_lower(s):
    return str(s or '').replace('İ', 'i').replace('I', 'ı').lower()

def clean_topic_title(t):
    s = str(t or '').strip()
    s = re.sub(r'^\s*([0-9]+(\.[0-9]+)*)\s*[\.\:\)]\s*', '', s)
    s = re.sub(r'^\s*([IVXLCDM]+)\s*[\.\:\)]\s*', '', s)
    s = re.sub(r'^elmi anlayış:\s*', '', s, flags=re.I)
    return s.strip()

CURRICULUM_TRACKS = {
    'fizika': {'fizika', 'təbiət', 'həyat bilgisi'},
    'kimya': {'kimya', 'təbiət', 'həyat bilgisi'},
    'biologiya': {'biologiya', 'təbiət', 'həyat bilgisi'},
    'təbiət': {'təbiət', 'həyat bilgisi'},
    'coğrafiya': {'coğrafiya', 'təbiət', 'həyat bilgisi'},
    'azərbaycan tarixi': {'azərbaycan tarixi', 'ümumi tarix', 'tarix', 'həyat bilgisi'},
    'ümumi tarix': {'ümumi tarix', 'azərbaycan tarixi', 'tarix', 'həyat bilgisi'},
    'riyaziyyat': {'riyaziyyat', 'həyat bilgisi'},
    'informatika': {'informatika'},
    'həyat bilgisi': {'həyat bilgisi'},
}

print("=== STARTING PHASE 2 KAG SEMANTIC HEALING (COMPREHENSIVE) ===")

target_patterns = [
    'data/grades/grade_*.json',
    'autonomous_kag/active_staging/grade_*.json'
]

stats = {
    'k2_realigned': 0,
    'k5_repaired': 0,
    'k7_k8_synced': 0,
    'k9_normalized': 0,
    'k10_k11_tips_healed': 0,
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
        subj_low = az_lower(subj_clean)
        is_lang = bool(LANG_SUBJ.search(subj))
        is_lit = bool(LIT_SUBJ.search(subj))

        for topic, qs in topics.items():
            if not isinstance(qs, list):
                continue
            clean_topic = clean_topic_title(topic)
            if not clean_topic:
                clean_topic = str(topic).strip()

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

                # --- 1. Bloom Normalization (K9) & Remedial Duration Sync (K7, K8) ---
                raw_bloom = str(q.get('bloom_level') or q.get('bloomLevel') or 'Bilik').strip()
                canonical_bloom = BLOOM_MAP.get(raw_bloom.lower(), 'Bilik')
                if q.get('bloom_level') != canonical_bloom or q.get('bloomLevel') != canonical_bloom:
                    q['bloom_level'] = canonical_bloom
                    q['bloomLevel'] = canonical_bloom
                    stats['k9_normalized'] += 1
                    file_modified = True

                exact_duration = BLOOM_MIN[canonical_bloom]
                if bt.get('remedial_duration_mins') != exact_duration:
                    bt['remedial_duration_mins'] = exact_duration
                    stats['k7_k8_synced'] += 1
                    file_modified = True

                # --- 2. Root Grade Validation (K5: Prevent Future Grade Prerequisite) ---
                raw_rg = bt.get('root_grade')
                try:
                    rg = int(raw_rg) if raw_rg is not None and str(raw_rg).isdigit() else None
                except Exception:
                    rg = None

                if rg is not None and rg > fgrade:
                    rg = fgrade
                    bt['root_grade'] = fgrade
                    bt['is_intra_grade'] = True
                    stats['k5_repaired'] += 1
                    file_modified = True

                # --- 3. K2 / K1L / K1O: Semantic Alignment ---
                is_intra = bt.get('is_intra_grade')
                rc = str(bt.get('root_concept') or '').strip()
                cn = str(bt.get('concept_name') or '').strip()
                rb = str(bt.get('root_book') or '').strip()
                rb_clean = clean_subject(rb)
                rb_low = az_lower(rb_clean)

                # Check curriculum compatibility for inter-grade
                track_compatible = True
                if rg is not None and rg < fgrade and rb:
                    allowed = CURRICULUM_TRACKS.get(subj_low)
                    if allowed is not None:
                        track_compatible = any(a in rb_low for a in allowed)
                    elif is_lang:
                        # Language subject must link to same language
                        track_compatible = (subj_low in rb_low) or (rb_low in subj_low)

                # In literature, or intra-grade, or incompatible cross-subject track, align intra-grade
                if is_lit or is_intra or rg is None or rg == fgrade or not track_compatible:
                    target_concept = clean_topic
                    target_book = f"{subj_clean} {fgrade}"
                    if (rc != target_concept or cn != target_concept or
                        bt.get('root_book') != target_book or bt.get('root_grade') != fgrade or
                        bt.get('is_intra_grade') is not True):
                        bt['root_concept'] = target_concept
                        bt['concept_name'] = target_concept
                        bt['root_book'] = target_book
                        bt['root_grade'] = fgrade
                        bt['is_intra_grade'] = True
                        rg = fgrade
                        stats['k2_realigned'] += 1
                        file_modified = True
                else:
                    # Valid inter-grade prerequisite
                    clean_rc = clean_topic_title(rc)
                    if clean_rc != rc:
                        bt['root_concept'] = clean_rc
                        rc = clean_rc
                        file_modified = True
                    clean_cn = clean_topic_title(cn)
                    if clean_cn != cn:
                        bt['concept_name'] = clean_cn
                        cn = clean_cn
                        file_modified = True

                # --- 4. Parent Action Tip Generation (K10, K11, K3, K14, K15, K16) ---
                curr_rg = bt.get('root_grade') or fgrade
                curr_rb = bt.get('root_book') or f"{subj_clean} {curr_rg}"
                curr_concept = bt.get('root_concept') or clean_topic
                curr_is_intra = bt.get('is_intra_grade', curr_rg == fgrade)

                # Skill Phrase Selection
                is_grammar = is_lang and not is_lit and bool(GRAMMAR.search(full_text))

                if is_lit:
                    rule_suffix = "(bədii təhlilini)"
                    if canonical_bloom == "Bilik":
                        skill_phrase = "ədəbi fakt və məlumatları"
                    elif canonical_bloom == "Anlama":
                        skill_phrase = "oxuyub-anlama və bədii məzmunu qavrama bacarığını"
                    elif canonical_bloom == "Tətbiq":
                        skill_phrase = "bədii təhlil bacarığını"
                    else:
                        skill_phrase = "müqayisəli ədəbi təhlil və analiz bacarığını"
                elif is_lang:
                    rule_suffix = "(əsas qaydaları)"
                    if is_grammar:
                        if canonical_bloom == "Bilik":
                            skill_phrase = "təməl qrammatik qaydaları"
                        elif canonical_bloom == "Anlama":
                            skill_phrase = "qrammatik qaydaları anlama və qavrama bacarığını"
                        elif canonical_bloom == "Tətbiq":
                            skill_phrase = "qrammatik qaydaları nitqdə tətbiq etmə bacarığını"
                        else:
                            skill_phrase = "dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
                    elif 'frazeoloji' in full_text.lower() or 'sinonim' in full_text.lower() or 'antonim' in full_text.lower():
                        skill_phrase = "lüğət ehtiyatı və leksik bacarıqlarını"
                    elif canonical_bloom == "Bilik":
                        skill_phrase = "lüğət ehtiyatı və faktik dil qaydalarını"
                    elif canonical_bloom == "Anlama":
                        skill_phrase = "oxuyub-anlama və mətni qavrama bacarığını"
                    elif canonical_bloom == "Tətbiq":
                        skill_phrase = "praktik tətbiq bacarığını"
                    else:
                        skill_phrase = "mətni və dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
                else:
                    rule_suffix = "(əsas qaydaları)"
                    if canonical_bloom == "Bilik":
                        skill_phrase = "təməl anlayış və faktik bilikləri"
                    elif canonical_bloom == "Anlama":
                        skill_phrase = "mövzunu anlama və qavrama bacarığını"
                    elif canonical_bloom == "Tətbiq":
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

                # Clean zero-page residues
                tip = re.sub(r'\b(?:dərslik\s*)?(?:səh(?:ifə)?|s\.|page)\s*\.?\s*\d+[-–\d]*[:\.]?', '', tip, flags=re.I)
                tip = re.sub(r'\s{2,}', ' ', tip).strip()

                if bt.get('parent_action_tip') != tip:
                    bt['parent_action_tip'] = tip
                    stats['k10_k11_tips_healed'] += 1
                    file_modified = True

    if file_modified:
        if save_json_atomic(fp, data):
            stats['files_saved'] += 1
            print(f"Healed and saved: {fp}")
        else:
            print(f"FAILED to save: {fp}")

print("\n=== PHASE 2 EXECUTION COMPLETE ===")
for k, v in stats.items():
    print(f"  {k}: {v}")
