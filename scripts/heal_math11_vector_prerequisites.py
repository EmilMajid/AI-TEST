#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Remediation Engine: Grade 11 Mathematics Prerequisite Restitution (SİTG Standard)
Fixes the upstream heuristic collapse where 16 Grade 11 Algebra & Calculus topics
(458 questions total across active staging and bundled grades) were falsely mapped
to 9th Grade 'Vektor anlayışı, kollinear və bərabər vektorlar'.

Restores authentic, curriculum-grounded prerequisites:
- Function compositions & inverses -> Grade 10: Qrafiklərin çevrilmələri, mürəkkəb və tərs funksiya
- Polynomial divisions / factors / remainder -> Grade 7/11 polynomial roots
- Limits & Continuity -> Grade 10/11 function limit antecedents
- Derivatives -> Grade 11: Funksiyanın limiti və limitlər haqqında teoremlər
- Complex numbers -> Grade 9: Həqiqi ədədlər və onlar üzərində əməllər
"""

import os
import sys
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRADE_11_JSON = os.path.join(BASE_DIR, "data", "grades", "grade_11.json")
STAGING_11_JSON = os.path.join(BASE_DIR, "autonomous_kag", "active_staging", "grade_11.json")

REPAIR_MAPPING = {
    "Mürəkkəb və tərs funksiyalar": {
        "root_grade": 10,
        "root_book": "Riyaziyyat 10",
        "root_concept": "Qrafiklərin çevrilmələri, mürəkkəb və tərs funksiya",
        "is_intra_grade": False,
        "domain_note": "Funksiyaların kompozisiyası f(g(x)) və tərs funksiyalar 10-cu sinifdə tədris olunur."
    },
    "Çoxhədlinin çoxhədliyə bölünməsi": {
        "root_grade": 7,
        "root_book": "Riyaziyyat 7",
        "root_concept": "Çoxhədlinin çoxhədliyə vurulması",
        "is_intra_grade": False,
        "domain_note": "Çoxhədlilər üzərində əməllərin və bölmə alqoritminin təməli 7-ci sinifdə qoyulur."
    },
    "Rasional köklərin tapılması": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Çoxhədlinin çoxhədliyə bölünməsi",
        "is_intra_grade": True,
        "domain_note": "Rasional köklərin tapılması çoxhədlinin bölünməsi qaydasına əsaslanır."
    },
    "Qalıq haqqında teorem": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Çoxhədlinin çoxhədliyə bölünməsi",
        "is_intra_grade": True,
        "domain_note": "Bezu teoremi çoxhədlinin ikihədliyə bölünməsi prosesində qalığın tapılması qaydasıdır."
    },
    "Çoxhədlinin vuruqları haqqında teorem": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Qalıq haqqında teorem",
        "is_intra_grade": True,
        "domain_note": "Vuruqlar haqqında teorem birbaşa qalıq haqqında Bezu teoreminin nəticəsidir."
    },
    "Kompleks ədədlər haqqında": {
        "root_grade": 9,
        "root_book": "Riyaziyyat 9",
        "root_concept": "Həqiqi ədədlər və onlar üzərində əməllər",
        "is_intra_grade": False,
        "domain_note": "Kompleks ədədlər çoxluğu həqiqi ədədlər sisteminin genişlənməsidir."
    },
    "Cəbrin əsas teoremi": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Kompleks ədədlər haqqında",
        "is_intra_grade": True,
        "domain_note": "Cəbrin əsas teoremi çoxhədlinin kompleks ədədlər meydanında n kökünün olduğunu müəyyən edir."
    },
    "Çoxhədli funksiya": {
        "root_grade": 10,
        "root_book": "Riyaziyyat 10",
        "root_concept": "Funksiya və onun verilmə üsulları",
        "is_intra_grade": False,
        "domain_note": "Polinomial funksiyaların xassələri 10-cu sinif funksiya anlayışına əsaslanır."
    },
    "Rasional funksiya": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Çoxhədli funksiya",
        "is_intra_grade": True,
        "domain_note": "Rasional funksiya iki çoxhədlinin nisbəti kimi təyin edilir."
    },
    "Funksiyanın limiti və limitlər haqqında teoremlər": {
        "root_grade": 10,
        "root_book": "Riyaziyyat 10",
        "root_concept": "Funksiya və onun verilmə üsulları",
        "is_intra_grade": False,
        "domain_note": "Limit anlayışı arqumentin və funksiyanın qiymətlərinin dəyişmə analizinə əsaslanır."
    },
    "Görkəmli limitlər və sonsuzluqda limit": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Funksiyanın limiti və limitlər haqqında teoremlər",
        "is_intra_grade": True,
        "domain_note": "Görkəmli limitlər limit haqqında ümumi teoremlərin xüsusi hallarıdır."
    },
    "Funksiyanın kəsilməzliyi və kəsilmə nöqtələri": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Funksiyanın limiti və limitlər haqqında teoremlər",
        "is_intra_grade": True,
        "domain_note": "Kəsilməzlik nöqtədəki limitin funksiyanın həmin nöqtədəki qiymətinə bərabərliyi ilə təyin olunur."
    },
    "Əsas elementar funksiyaların xassələri və qrafikləri": {
        "root_grade": 10,
        "root_book": "Riyaziyyat 10",
        "root_concept": "Funksiyaların xassələri, tək və cüt funksiyalar",
        "is_intra_grade": False,
        "domain_note": "Elementar funksiyaların qrafikləri və xassələri 10-cu sinif funksiya bünövrəsinə söykənir."
    },
    "Loqarifmik və üstlü tənlik və bərabərsizliklərin tətbiqi": {
        "root_grade": 10,
        "root_book": "Riyaziyyat 10",
        "root_concept": "Üstlü və loqarifmik tənliklər və bərabərsizliklər",
        "is_intra_grade": False,
        "domain_note": "Tətbiqi tənlik və bərabərsizliklər 10-cu sinifdə öyrənilən təməl qaydalara əsaslanır."
    },
    "Fəsil üzrə ümumiləşdirici tapşırıqlar": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Funksiyanın limiti və limitlər haqqında teoremlər",
        "is_intra_grade": True,
        "domain_note": "Fəsil üzrə ümumiləşdirmə limit və kəsilməzlik təməlinə əsaslanır."
    },
    "Törəmə anlayışı, törəmənin həndəsi və fiziki mənası": {
        "root_grade": 11,
        "root_book": "Riyaziyyat 11",
        "root_concept": "Funksiyanın limiti və limitlər haqqında teoremlər",
        "is_intra_grade": True,
        "domain_note": "Törəmə funksiya artımının arqument artımına nisbətinin limiti kimi təyin olunur."
    }
}

def get_grade_str(g: int) -> str:
    suffixes = {1: "-ci", 2: "-ci", 3: "-cü", 4: "-cü", 5: "-ci", 6: "-cı", 7: "-ci", 8: "-ci", 9: "-cu", 10: "-cu", 11: "-ci"}
    return f"{g}{suffixes.get(g, '-ci')} sinif"

def generate_sitg_tip(bloom_level: str, root_grade: int, root_book: str, root_concept: str, is_intra: bool):
    b = str(bloom_level).lower().strip()
    if any(k in b for k in ["təhlil", "analiz", "evaluation", "dəyərləndirmə"]):
        dur = 20
        action = f"'{root_concept}' mövzusuna aid dərinləşdirilmiş və situasiya tapşırıqlarını 20 dəqiqə təhlil edin."
    elif any(k in b for k in ["tətbiq", "application"]):
        dur = 15
        action = f"'{root_concept}' mövzusuna aid məsələ və misal həlli tapşırıqlarını 15 dəqiqə işləyin."
    elif any(k in b for k in ["bilik", "knowledge", "xatırlama"]):
        dur = 10
        action = f"'{root_concept}' mövzusunun təməl qayda və təriflərini 10 dəqiqə təkrarlayın."
    else:  # Anlama / Comprehension / Default
        dur = 10
        action = f"'{root_concept}' mövzusunun əsas məzmun və məntiqini 10 dəqiqə nəzərdən keçirin."

    g_str = get_grade_str(root_grade)
    if is_intra:
        tip = f"Övladınızın hazırda tədris olunan mövzu üzrə qavrayışını möhkəmləndirmək üçün {g_str} {root_book} dərsliyindəki {action}"
    else:
        tip = f"Övladınızın təməl bilik və bacarıqlarını möhkəmləndirmək üçün {g_str} {root_book} dərsliyindəki {action}"

    return dur, tip

def heal_file(file_path: str, apply_changes: bool = False):
    if not os.path.exists(file_path):
        print(f"⚠️ Fayl tapılmadı: {file_path}")
        return 0

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    riy = data.get("Riyaziyyat 11", {})
    if not riy:
        print(f"⚠️ 'Riyaziyyat 11' bölməsi tapılmadı: {file_path}")
        return 0

    healed_count = 0
    topic_stats = {}

    for topic_name, q_list in riy.items():
        if topic_name not in REPAIR_MAPPING:
            continue

        target_info = REPAIR_MAPPING[topic_name]

        for q in q_list:
            if not isinstance(q, dict):
                continue

            bt = q.setdefault("backward_trace", {})
            current_root = str(bt.get("root_concept", ""))

            # Update all questions in the affected topics to guarantee correct roots and tips
            bloom = q.get("bloom_level", q.get("bloom", "Anlama"))
            dur, tip = generate_sitg_tip(
                bloom_level=bloom,
                root_grade=target_info["root_grade"],
                root_book=target_info["root_book"],
                root_concept=target_info["root_concept"],
                is_intra=target_info["is_intra_grade"]
            )

            bt["root_grade"] = target_info["root_grade"]
            bt["root_book"] = target_info["root_book"]
            bt["root_concept"] = target_info["root_concept"]
            bt["is_intra_grade"] = target_info["is_intra_grade"]
            bt["is_root_anchor"] = (target_info["root_grade"] == 1)
            bt["remedial_duration_mins"] = dur
            bt["parent_action_tip"] = tip

            healed_count += 1
            topic_stats[topic_name] = topic_stats.get(topic_name, 0) + 1

    print(f"\n📂 Fayl: {file_path}")
    print(f"   Düzəliş edilən ümumi sual sayı: {healed_count}")
    for t, c in topic_stats.items():
        dest = REPAIR_MAPPING[t]
        print(f"   - {t} ({c} sual) -> {dest['root_book']}: '{dest['root_concept']}'")

    if apply_changes and healed_count > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("   ✅ Dəyişikliklər uğurla yadda saxlanıldı.")

    return healed_count

def main():
    apply_mode = "--apply" in sys.argv
    print("=" * 70)
    print("SİTG STANDARTI: 11-Cİ SİNİF RİYAZİYYAT KÖK SƏBƏB BƏRPA VASİTƏSİ")
    print(f"Rejim: {'TƏTBİQ (APPLY)' if apply_mode else 'QURU TEST (DRY RUN)'}")
    print("=" * 70)

    c1 = heal_file(GRADE_11_JSON, apply_changes=apply_mode)
    c2 = heal_file(STAGING_11_JSON, apply_changes=apply_mode)

    print("\n" + "=" * 70)
    print(f"Yekun: data/grades: {c1} sual, active_staging: {c2} sual bərpa edildi.")
    print("=" * 70)

if __name__ == "__main__":
    main()
