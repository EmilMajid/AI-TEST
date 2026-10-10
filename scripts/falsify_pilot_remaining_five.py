"""
KAG Falsification Test for the Remaining Five Pilot Candidates
with Granular Scope and Task-Level Boundary Evaluation

SİTG Standartı & KAG Epistemik Təhlükəsizlik Konstitusiyası (Frozen v1.0)
Xüsusi Rejim: Yalnız oxuma və təcrid olunmuş audit.
İstehsalat toxunulmazlığı: lib/runtime-kag-guard.ts və data/grades/ TOXUNULMAZDIR (0 bayt).
Aktiv qaydalar: NEW_ACTIVE_GOLD = 0 qorunur.

Qalan 5 namizəd:
1. CAND-M01-RATIONAL:  "Rasional ədədlər (6) -> Həqiqi ədədlər (9)"
2. CAND-M01-RADICAL:   "Hesabi kvadrat kök (8) -> Həqiqi ədədlər (9)"
3. CAND-M01-ABSVAL:    "Tam ədədin modulu (6) -> Həqiqi ədədin modulu (9)"
4. CAND-M02-INTERVAL:  "İntervallar üsulu (8) -> Kvadrat bərabərsizliklər (9)"
5. CAND-M03-TRIG-TRI:  "Düzbucaqlı üçbucaq triqonometriyası (8) -> Əsas triqonometrik eyniliklər (9)"

Hər namizəd üçün 4 parametr yoxlanılır:
- Universal Zərurət İddiası (Universal Claim)
- Aşkar Edilən Əks-Nümunələr (Counterexamples)
- Dəqiq Əhatə Dairəsi (Granular Valid Scope: hansı tapşırıq alt-tipi üçün zəruridir)
- Epistemik Hökm: SUPPORTED (Yalnız tövsiyə, sərt bloklama qadağandır)
"""

import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_REPORT = "reports/pilot_falsification_remaining_five_candidates.json"

def evaluate_all_five():
    evaluations = [
        # 1. Rasional ədədlər -> Həqiqi ədədlər
        {
            "candidate_id": "CAND-PILOT-G6-RAT-TO-G9-REAL",
            "relation_name": "Rasional ədədlər (6) -> Həqiqi ədədlər (9)",
            "source_node": "math_anlayis_rasional_ededler",
            "target_node": "math_anlayis_heqiqi_ededler",
            "claimed_universal_necessity": "Bütün həqiqi ədədlər məsələlərini həll etmək üçün 6-cı sinif kəsr və rasional ədəd əməlləri universal önşərtdir.",
            "universal_necessity_proven": False,
            "counterexamples": [
                {
                    "task": "Aşağıdakılardan hansı irrasional ədəddir? Variantlar: A) pi, B) 0, C) 5, D) -2.",
                    "explanation": "Şagird kəsr hesablaması etmədən, sadəcə tərif/simvol biliyi ilə (pi və e-nin irrasional olması faktı) doğru cavabı tapır.",
                    "source_bypassed": True
                }
            ],
            "granular_valid_scope": "Yalnız dövri onluq kəsrlərin adi kəsrə çevrilməsi və rasional-irrasional qarışıq hesablama tapşırıqları alt-tipi üçün zəruridir.",
            "epistemic_status": "SUPPORTED",
            "hard_remediation_permitted": False,
            "pedagogical_verdict": "Mövzu səviyyəsində universal önşərt deyil; dar hesablama alt-tapşırıqları üçün metodik dayaqdır."
        },

        # 2. Hesabi kvadrat kök -> Həqiqi ədədlər
        {
            "candidate_id": "CAND-PILOT-G8-SQRT-TO-G9-REAL",
            "relation_name": "Hesabi kvadrat kök (8) -> Həqiqi ədədlər (9)",
            "source_node": "math_hesabi_kvadrat_kok",
            "target_node": "math_anlayis_heqiqi_ededler",
            "claimed_universal_necessity": "Həqiqi ədədləri tanımaq və təsnif etmək üçün mütləq 8-ci sinif kvadrat kök əməliyyatları bilinməlidir.",
            "universal_necessity_proven": False,
            "counterexamples": [
                {
                    "task": "Rasional (Q) və irrasional (I) ədədlər çoxluqlarının kəsişməsini tapın.",
                    "explanation": "Q n I = boş çoxluq. Həll üçün heç bir kvadrat kök çıxarma və ya radikal hesablama tələb olunmur; yalnız çoxluqlar məntiqi kifayətdir.",
                    "source_bypassed": True
                }
            ],
            "granular_valid_scope": "Yalnız kökaltı irrasional ifadələrin qiymətləndirilməsi (məs: 2 < sqrt(7) < 3) və radikalların müqayisəsi alt-tipi üçün zəruridir.",
            "epistemic_status": "SUPPORTED",
            "hard_remediation_permitted": False,
            "pedagogical_verdict": "Mövzu səviyyəsində universal deyil; radikalların ədədi qiymətləndirilməsi tapşırıqlarında qüvvədədir."
        },

        # 3. Tam ədədin modulu -> Həqiqi ədədin modulu
        {
            "candidate_id": "CAND-PILOT-G6-ABS-TO-G9-ABS",
            "relation_name": "Tam ədədin modulu (6) -> Həqiqi ədədin modulu (9)",
            "source_node": "math_anlayis_tam_eded_modul",
            "target_node": "math_anlayis_ededin_modulu",
            "claimed_universal_necessity": "Dəyişənli modul ifadələrini sadələşdirmək üçün 6-cı sinif tam ədəd modulu universal önşərtdir.",
            "universal_necessity_proven": False,
            "counterexamples": [
                {
                    "task": "x > 5 olduqda |x - 2| ifadəsini modulsuz yazın.",
                    "explanation": "x > 5 olduqda x - 2 > 3 > 0, birbaşa x - 2 kimi açılır. Şagird mənfi ədədin modulunu dəyişdirmə halına heç müraciət etmir.",
                    "source_bypassed": True
                }
            ],
            "granular_valid_scope": "Ədəd oxunda məsafə tərifi və mənfi alt-aralıqda (|a| = -a halında) işarə açılışı tələb edən tapşırıqlar üçün zəruridir.",
            "epistemic_status": "SUPPORTED",
            "hard_remediation_permitted": False,
            "pedagogical_verdict": "Tövsiyəvi metodik bünövrədir; aşkar müsbət dəyişən hallarında məcburi bloklayıcı deyil."
        },

        # 4. İntervallar üsulu -> Kvadrat bərabərsizliklər
        {
            "candidate_id": "CAND-PILOT-G8-INT-TO-G9-QUADINEQ",
            "relation_name": "İntervallar üsulu (8) -> Kvadrat bərabərsizliklər (9)",
            "source_node": "math_usul_intervallar",
            "target_node": "math_anlayis_kvadrat_berabersizlik",
            "claimed_universal_necessity": "Bütün kvadrat bərabərsizlikləri həll etmək üçün intervallar üsulu universal yeganə yoldur.",
            "universal_necessity_proven": False,
            "counterexamples": [
                {
                    "task": "x^2 < 9 bərabərsizliyini həll edin.",
                    "explanation": "|x| < 3 -> -3 < x < 3. İntervallar metodu çəkmədən, birbaşa modul xassəsi və ya parabola eskizi ilə həll edilir.",
                    "source_bypassed": True
                },
                {
                    "task": "x^2 + 5 > 0 bərabərsizliyini həll edin.",
                    "explanation": "Həmişə doğrudur, (-∞; +∞). İntervallara ayırmağa heç bir ehtiyac qalmır.",
                    "source_bypassed": True
                }
            ],
            "granular_valid_scope": "İki fərqli həqiqi kökü olan (D > 0) və işarələrin dəyişməsini tələb edən ümumi üçhədlilər alt-tipi üçün zəruridir.",
            "epistemic_status": "SUPPORTED",
            "hard_remediation_permitted": False,
            "pedagogical_verdict": "Metodik alətdir; xüsusi və aşkar hallarda tətbiqi zəruri deyil."
        },

        # 5. Düzbucaqlı üçbucaq triqonometriyası -> Əsas triqonometrik eyniliklər
        {
            "candidate_id": "CAND-PILOT-G8-TRIGTRI-TO-G9-TRIGID",
            "relation_name": "Düzbucaqlı üçbucaq triqonometriyası (8) -> Əsas triqonometrik eyniliklər (9)",
            "source_node": "math_hendese_duzbucaqli_ucbucaq_triq",
            "target_node": "math_eynilik_triqonometrik",
            "claimed_universal_necessity": "Triqonometrik eynilikləri tətbiq etmək üçün şagird mütləq həndəsi düzbucaqlı üçbucaq tərəflərinin nisbətini bilməlidir.",
            "universal_necessity_proven": False,
            "counterexamples": [
                {
                    "task": "(1 - sin^2 a) / cos^2 a ifadəsini sadələşdirin.",
                    "explanation": "cos^2 a / cos^2 a = 1. Şagird heç bir üçbucaq çəkmədən və katet/hipotenuz nisbətinə baxmadan, sırf cəbri əvəzetmə qaydası ilə həll edir.",
                    "source_bypassed": True
                }
            ],
            "granular_valid_scope": "Triqonometrik funksiyaların həndəsi mənasının çıxarılışı və tərəf-bucaq əlaqəli həndəsi məsələlər alt-tipi üçün zəruridir.",
            "epistemic_status": "SUPPORTED",
            "hard_remediation_permitted": False,
            "pedagogical_verdict": "Konseptual mənşə üçün vacibdir, lakin formal cəbri eyniliklərin sadələşdirilməsində məcburi önşərt kimi şagirdi bloklaya bilməz."
        }
    ]

    report = {
        "report_version": "1.0-REMAINING-FIVE-FALSIFICATION",
        "charter": "KAG Universal Remediation & Epistemic Safety Constitution",
        "total_evaluated": len(evaluations),
        "epistemic_invariants_enforced": {
            "immutable_production_runtime": "lib/runtime-kag-guard.ts 0-byte diff",
            "immutable_grade_ontologies": "data/grades/ 0-byte diff",
            "active_gold_invariant": "NEW_ACTIVE_GOLD = 0 (STRICT HOLD)",
            "task_level_granularity": "Mövzu səviyyəsində ümumiləşdirmə rədd edilir; sübut yalnız dar tapşırıq əhatə dairəsində keçərlidir.",
            "hard_remediation_policy": "Universal zərurəti olmayan heç bir namizəd sərt bərpa yarada bilməz."
        },
        "findings": evaluations
    }

    os.makedirs(os.path.dirname(OUTPUT_REPORT), exist_ok=True)
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("=" * 75)
    print("KAG QALAN 5 NAMİZƏDİN QRANULYAR FALSIFİKASİYA HESABATI")
    print("=" * 75)
    print(f"Hesabat yazıldı: {OUTPUT_REPORT}\n")
    for e in evaluations:
        print(f"Namizəd: {e['relation_name']}")
        print(f" - Universal zərurət: {e['universal_necessity_proven']}")
        print(f" - Əks-nümunə sayı: {len(e['counterexamples'])}")
        print(f" - Dəqiq Əhatə Dairəsi: {e['granular_valid_scope']}")
        print(f" - Epistemik Status: {e['epistemic_status']} (Hard Remediation: {e['hard_remediation_permitted']})")
        print(f" - Hökm: {e['pedagogical_verdict']}\n")
    print("=" * 75)

if __name__ == "__main__":
    evaluate_all_five()
