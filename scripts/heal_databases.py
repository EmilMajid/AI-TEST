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

EXACT_BLOOM_MAP = {
    "bilik": "Bilik", "knowledge": "Bilik", "xatırlama": "Bilik", "remembering": "Bilik",
    "anlama": "Anlama", "comprehension": "Anlama", "understanding": "Anlama",
    "tətbiq": "Tətbiq", "tətbiqi": "Tətbiq", "application": "Tətbiq", "applying": "Tətbiq",
    "təhlil": "Təhlil", "analiz": "Təhlil", "analysis": "Təhlil", "analyzing": "Təhlil",
    "dəyərləndirmə": "Təhlil", "evaluation": "Təhlil", "evaluating": "Təhlil",
    "yaradıcılıq": "Təhlil", "yaratmaq": "Təhlil", "creation": "Təhlil",
}

HISTORY_TERMS = [
    "iqta", "mülk", "vəqf", "torpaq mülkiyyəti", "eldəniz", "səfəvi", "çaldıran",
    "gülüstan", "türkmənçay", "atabəy", "xəlifə", "hökmdar", "feodal"
]

DISALLOWED_CONCEPT_WORDS = {
    "correct", "incorrect", "true", "false", "answer", "question", "option", "choice",
    "doğru", "düzgün", "səhv", "yanlış", "bənd", "variant", "cavab", "sual", "seçim",
    "a dit", "c'est", "istifadə", "qayda", "elmi", "anlayış", "haqqında", "biri",
    "verilmiş", "aşağıdakı", "hansı", "müəyyən", "uyğundur", "uyğun"
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

def normalize_bloom(raw_bloom):
    cleaned = str(raw_bloom or "Anlama").strip().lower()
    return EXACT_BLOOM_MAP.get(cleaned, "Anlama")

def sanitize_question(q, subj_name, q_grade, topic_title):
    clean_topic = re.sub(r'^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*', '', topic_title, flags=re.I).strip()
    canon_subj = clean_subject_name(subj_name)
    is_lang = bool(re.search(r'dili|ingilis|rus|alman|fransız', canon_subj, flags=re.I))
    
    q_text = str(q.get('question', '') or '').lower()
    exp_text = str(q.get('explanation', '') or '').lower()
    full_text = f"{q_text} {exp_text}"
    
    # 1. Deterministic Bloom & Duration
    raw_b = q.get('bloom_level') or q.get('bloomLevel') or 'Anlama'
    bloom = normalize_bloom(raw_b)
    dur = BLOOM_DURATION.get(bloom, 10)
    q['bloom_level'] = bloom
    q['bloomLevel'] = bloom.lower()
    
    if not isinstance(q.get('backward_trace'), dict):
        q['backward_trace'] = {}
    bt = q['backward_trace']
    bt['remedial_duration_mins'] = dur
    
    root_book = str(bt.get('root_book') or f"{canon_subj} {q_grade}").strip()
    root_concept = str(bt.get('root_concept') or clean_topic).strip()
    concept_name = str(bt.get('concept_name') or clean_topic).strip()
    
    try:
        root_grade = int(bt.get('root_grade') or q_grade)
    except:
        root_grade = q_grade
        
    is_intra = bool(bt.get('is_intra_grade')) or (root_grade == q_grade)
    
    # 2. Fix Double-Grade in Root Book Name
    if re.search(r'\d+\s+\d+$', root_book) or re.match(r'^[a-z]+-[a-z]+-\d+', root_book, re.I) or '11 10' in root_book:
        root_book = f"{canon_subj} {root_grade}"
        
    # 3. Clean Stopword / Sentence Concept Names
    check_cn = re.sub(r'^elmi anlayış:\s*', '', concept_name.lower(), flags=re.I).strip()
    if not check_cn or check_cn in DISALLOWED_CONCEPT_WORDS or len(check_cn) < 3 or check_cn.startswith('correct') or 'alınmaz qalasıdır' in check_cn or len(check_cn) > 50:
        concept_name = clean_topic or "Əsas dərslik anlayışı"
        
    # 4. Cross-Subject Firewall for Language
    if is_lang:
        is_contam = any(ht in concept_name.lower() for ht in HISTORY_TERMS) or any(ht in root_concept.lower() for ht in HISTORY_TERMS)
        if is_contam:
            root_grade = q_grade
            is_intra = True
            root_book = f"{canon_subj} {q_grade}"
            root_concept = clean_topic
            concept_name = clean_topic
            bt['is_root_anchor'] = False
            
    # 5. Grammar vs Reading Strand Firewall
    if is_lang:
        if 'vasitəsiz nitq' in full_text or 'vasitəli nitq' in full_text:
            root_grade = 8 if q_grade >= 8 else q_grade
            is_intra = (root_grade == q_grade)
            root_book = f"{canon_subj} {root_grade}"
            root_concept = "Vasitəsiz və vasitəli nitq"
            concept_name = "Vasitəsiz və vasitəli nitq"
        elif any(syn in full_text for syn in ['budaq cümlə', 'tabeli mürəkkəb', 'tabesiz mürəkkəb', 'sintaktik növü']):
            root_grade = 9 if q_grade >= 9 else 8
            is_intra = (root_grade == q_grade)
            root_book = f"{canon_subj} {root_grade}"
            root_concept = "Tabesiz və tabeli mürəkkəb cümlələr"
            concept_name = "Tabesiz və tabeli mürəkkəb cümlələr"
        elif any(sm in full_text for sm in ['tamamlıq', 'mübtəda', 'xəbər', 'təyin', 'zərflik']):
            root_grade = 8 if q_grade >= 8 else max(1, q_grade - 1)
            is_intra = (root_grade == q_grade)
            root_book = f"{canon_subj} {root_grade}"
            root_concept = "Cümlə üzvləri və sintaktik təhlil"
            concept_name = "Cümlə üzvləri və sintaktik təhlil"
        elif any(fr in full_text for fr in ['frazeoloji', 'sabit söz birləşməsi']):
            root_grade = 6 if q_grade >= 6 else max(1, q_grade - 1)
            is_intra = (root_grade == q_grade)
            root_book = f"{canon_subj} {root_grade}"
            root_concept = "Frazeoloji birləşmələr (Sabit söz birləşmələri)"
            concept_name = "Frazeoloji birləşmələr (Sabit söz birləşmələri)"
        elif "Oqtay Eloğlu" in root_concept or "Nə gözəl səslənir" in root_concept:
            root_grade = q_grade
            is_intra = True
            root_book = f"{canon_subj} {q_grade}"
            root_concept = clean_topic
            concept_name = clean_topic
            
    # 6. Synchronized Parent Action Tip
    clean_rc = re.sub(r'^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*', '', root_concept, flags=re.I)
    clean_rc = re.sub(r'^elmi anlayış:\s*', '', clean_rc, flags=re.I).strip()
    
    if is_lang:
        if any(w in full_text for w in ['sintaktik', 'cümlə', 'nitq']):
            skill_phrase = "sintaktik təhlil və durğu işarələri qaydalarını"
        elif any(w in full_text for w in ['frazeoloji', 'sinonim', 'antonim']):
            skill_phrase = "lüğət ehtiyatı və leksik bacarıqlarını"
        elif bloom == "Bilik":
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
            
    if is_intra or (root_grade == q_grade):
        if dur == 10:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi {q_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
        elif dur == 15:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi {q_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunu və nümunə situasiya tapşırıqlarını 15 dəqiqə işləyin."
        else:
            tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün hazırda istifadə etdiyi {q_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunun dərin suallarını 20 dəqiqə dərindən araşdırın."
    else:
        if dur == 10:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün {root_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' təməl mövzusunu 10 dəqiqə təkrarlayın."
        elif dur == 15:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün {root_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' təməl mövzusunu və 2-3 nümunə situasiya tapşırığını 15 dəqiqə işləyin."
        else:
            tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün {root_grade}-ci sinif {root_book} dərsliyindəki '{clean_rc}' təməl mövzusunu və səbəb-nəticə əlaqələrini 20 dəqiqə dərindən araşdırın."
            
    tip = re.sub(r'\b(?:dərslik\s*)?(?:səh(?:ifə)?|s\.|page)\s*\.?\s*\d+[-–\d]*[:\.]?', '', tip, flags=re.I)
    tip = re.sub(r'\s{2,}', ' ', tip).strip()
    
    bt['root_book'] = root_book
    bt['root_concept'] = root_concept
    bt['concept_name'] = concept_name
    bt['root_grade'] = root_grade
    bt['is_intra_grade'] = is_intra
    bt['parent_action_tip'] = tip
    return q

def process_file(fpath):
    print(f"Processing {fpath}...")
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    g_match = re.search(r'grade_(\d+)', fpath)
    default_grade = int(g_match.group(1)) if g_match else 9
    
    total_q = 0
    modified = 0
    
    for subj_name, topics in data.items():
        if not isinstance(topics, dict): continue
        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list): continue
            for q in q_list:
                total_q += 1
                sanitize_question(q, subj_name, default_grade, topic_name)
                modified += 1
                
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Done {fpath}: {modified}/{total_q} questions healed.")

def main():
    target_dirs = ['data/grades', 'autonomous_kag/active_staging']
    for tdir in target_dirs:
        if not os.path.exists(tdir): continue
        for fpath in sorted(glob.glob(os.path.join(tdir, 'grade_*.json'))):
            process_file(fpath)

if __name__ == '__main__':
    main()
