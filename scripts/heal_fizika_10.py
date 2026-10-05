#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re

BLOOM_DURATION = {
    "Bilik": 10,
    "Anlama": 10,
    "Tətbiq": 15,
    "Təhlil": 20,
}

PHYSICS_STEM_MAPPINGS = {
    # Molecular Physics & Thermodynamics (10th grade specific) -> Intra-grade or Grade 8 foundation
    "mayelərin səthi gərilməsi və kapilyarlıq": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Mayelərin səthi gərilməsi və kapilyarlıq"},
    "havanın rütubətliliyi": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Havanın rütubətliliyi"},
    "doyan və doymayan buxar": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Doyan və doymayan buxar. Buxarlanma və qaynama"},
    "ideal qazın hal tənliyi": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "İdeal qazın hal tənliyi və qaz qanunları"},
    "mkt-nin əsas müddəaları": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "MKT-nin əsas müddəaları və təcrübi əsasları"},
    "temperatur və onun fiziki mənası": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Temperatur və onun fiziki mənası. Mütləq temperatur"},
    "maddə miqdarı, molyar kütlə": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Maddə miqdarı, molyar kütlə və Avaqadro sabiti"},
    "bərk cisimlərin quruluşu": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Bərk cisimlərin quruluşu və xassələri"},
    "daxili enerji və onun dəyişmə üsulları": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Daxili enerji və onun dəyişmə üsulları"},
    "termodinamikada qazın gördüyü iş": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Termodinamikada qazın gördüyü iş və İstilik miqdarı"},
    "termodinamikanın i qanunu": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Termodinamikanın I qanunu və izoprosesslərə tətbiqi"},
    "termodinamikanın ii qanunu": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Termodinamikanın II qanunu, İstilik mühərrikləri və Karno tsikli"},
    # Sound waves is genuinely Grade 9 mechanical waves!
    "səs dalğaları": {"book": "Fizika 9", "grade": 9, "intra": False, "concept": "Mexaniki dalğalar və səs dalğaları"},
    # Kinematics beginning -> Grade 7 or Grade 10 intra
    "mexaniki hərəkət və onun təsviri": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Mexaniki hərəkət və onun təsviri"},
    "yol və yerdəyişmə": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Yol və yerdəyişmə"},
    "mexaniki hərəkətin nisbiliyi": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Mexaniki hərəkətin nisbiliyi"},
    # Dynamics & Forces -> Grade 7/8 or Grade 10 intra
    "sürtünmə qüvvəsi": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Sürtünmə qüvvəsi"},
    "cisimlərin tarazlıq şərtləri və qüvvə momenti": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Cisimlərin tarazlıq şərtləri və Qüvvə momenti"},
    "yaylı və riyazi rəqqaslar": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Yaylı və riyazi rəqqaslar"},
    "harmonik rəqslərdə enerji çevrilmələri": {"book": "Fizika 10", "grade": 10, "intra": True, "concept": "Harmonik rəqslərdə enerji çevrilmələri və Rezonans hadisəsi"}
}

def clean_concept_name(c):
    c = re.sub(r'^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*', '', str(c or ''), flags=re.I)
    c = re.sub(r'^elmi anlayış:\s*', '', c, flags=re.I)
    c = re.sub(r'[\$"]', '', c).strip()
    return c

def generate_parent_tip(root_book, root_grade, root_concept, bloom, dur, is_intra):
    clean_rc = clean_concept_name(root_concept)
    if bloom == "Bilik":
        skill_phrase = "təməl anlayış və faktik bilikləri"
    elif bloom == "Anlama":
        skill_phrase = "mövzunu anlama və qavrama bacarığını"
    elif bloom == "Tətbiq":
        skill_phrase = "praktik tətbiq və məsələ həlli bacarığını"
    else:
        skill_phrase = "müqayisəli təhlil və elmi analiz bacarığını"

    if is_intra or (root_grade == 10):
        if dur == 10:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi 10-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
        elif dur == 15:
            tip = f"Övladınızın {skill_phrase} möhkəmləndirmək üçün hazırda istifadə etdiyi 10-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunu və nümunə situasiya tapşırıqlarını 15 dəqiqə işləyin."
        else:
            tip = f"Övladınızın {skill_phrase} inkişaf etdirməsi üçün hazırda istifadə etdiyi 10-ci sinif {root_book} dərsliyindəki '{clean_rc}' mövzusunun dərin suallarını 20 dəqiqə dərindən araşdırın."
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

def heal_fizika_10(file_path):
    print(f"Healing Fizika 10 in {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    fiz = data.get("Fizika 10", {})
    if not fiz:
        print(f"No Fizika 10 found in {file_path}")
        return

    healed_count = 0
    key_fixed_count = 0

    for topic_name, q_list in fiz.items():
        t_clean = clean_concept_name(topic_name).lower()
        
        # Match topic mapping rule
        matched_rule = None
        for k_term, rule in PHYSICS_STEM_MAPPINGS.items():
            if k_term in t_clean or t_clean in k_term:
                matched_rule = rule
                break

        for idx, q in enumerate(q_list, 1):
            q_txt = str(q.get("question", ""))
            bt = q.setdefault("backward_trace", {})

            # 1. SPECIFIC FIX: Topic 39, Question 13 (Laplas təzyiqi düsturu)
            if "39" in topic_name and "Laplas" in q_txt:
                q["options"] = [
                    '$p_L = 2\\sigma R$',
                    '$p_L = \\frac{\\sigma}{R}$',
                    '$p_L = \\frac{2\\sigma}{R}$',
                    '$p_L = \\frac{4\\sigma}{R}$'
                ]
                q["correctAnswer"] = 2
                q["correct_index"] = 2
                q["answer"] = "C"
                q["correct_answer"] = "C"
                q["explanation"] = "Sferik maye səthi altında Laplas təzyiqi $p_L = \\frac{2\\sigma}{R}$-dir. İki səthi olan nazik sabun qovuğunda isə $p_L = \\frac{4\\sigma}{R}$ olur. Sual ümumi sferik maye səthini soruşduğu üçün doğru cavab C bəndidir."
                key_fixed_count += 1
                print(f"  Fixed Laplas key in {topic_name} Q{idx} -> Option C (index 2)")

            # 2. SPECIFIC FIX: Topic 39, Question 14 (LaTeX formatting in explanation)
            if "39" in topic_name and ("3.65" in q_txt or "çərçivəyə təsir edən" in q_txt):
                q["explanation"] = "$\\sigma = \\frac{F}{l} = \\frac{3.65 \\cdot 10^{-3}}{0.05} = 0.073\\text{ N/m}$ (təmiz su üçün). Doğru cavab D bəndidir."

            # 3. Clean Distractor Steals in concept_name & root_concept
            cn = str(bt.get("concept_name", ""))
            rc = str(bt.get("root_concept", ""))

            # If concept_name or root_concept has unrelated physics concepts
            bad_leak_terms = [
                "arximed qüvvəsi", "qüvvə momenti", "lorens qüvvəsi", "müstəqil qaz boşalması",
                "işığın yayılma sürəti", "metalların müqavimətinin", "q=deltau"
            ]
            has_bad_leak = any(bl in cn.lower() or bl in rc.lower() for bl in bad_leak_terms)

            # Fix concept_name
            if has_bad_leak or not cn or len(cn) > 60 or cn.startswith("Elmi Anlayış: $"):
                cn = clean_concept_name(topic_name)
                bt["concept_name"] = cn

            # Apply matched rule or topic fallback
            if matched_rule:
                bt["root_book"] = matched_rule["book"]
                bt["root_grade"] = matched_rule["grade"]
                bt["root_concept"] = matched_rule["concept"]
                bt["is_intra_grade"] = matched_rule["intra"]
            else:
                # Default to intra-grade Fizika 10
                bt["root_book"] = "Fizika 10"
                bt["root_grade"] = 10
                bt["root_concept"] = clean_concept_name(topic_name)
                bt["is_intra_grade"] = True

            # Bloom & Duration Lockstep
            raw_b = str(q.get("bloom_level") or q.get("bloomLevel") or "Anlama").strip().capitalize()
            if raw_b not in BLOOM_DURATION:
                raw_b = "Anlama"
            q["bloom_level"] = raw_b
            q["bloomLevel"] = raw_b.lower()
            dur = BLOOM_DURATION[raw_b]
            bt["remedial_duration_mins"] = dur

            # Regenerate synchronized parent action tip
            tip = generate_parent_tip(
                bt["root_book"],
                bt["root_grade"],
                bt["root_concept"],
                raw_b,
                dur,
                bt["is_intra_grade"]
            )
            bt["parent_action_tip"] = tip
            healed_count += 1

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Finished {file_path}: {healed_count} questions healed, {key_fixed_count} keys fixed.")

def main():
    targets = [
        "data/grades/grade_10.json",
        "autonomous_kag/active_staging/grade_10.json"
    ]
    for target in targets:
        heal_fizika_10(target)

if __name__ == "__main__":
    main()
