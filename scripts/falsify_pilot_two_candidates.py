"""
KAG Falsification Test for Two Controversial Pilot Candidates

SİTG Standartı & KAG Epistemik Təhlükəsizlik Konstitusiyası (Frozen v1.0)
Xüsusi Rejim: Yalnız oxuma və təcrid olunmuş audit.
İstehsalat toxunulmazlığı: lib/runtime-kag-guard.ts və data/grades/ TOXUNULMAZDIR (0 bayt).
Aktiv qaydalar: NEW_ACTIVE_GOLD = 0 saxlanılır.

Sınaqdan keçirilən 2 mübahisəli namizəd:
1. CAND-M04-LIN-FUNC: "Xətti funksiya (7-ci sinif) -> Ədədi silsilə (9-cu sinif)"
2. CAND-M02-QUAD-EQ:  "Kvadrat tənliklər (8-ci sinif) -> Kvadrat bərabərsizliklər (9-cu sinif)"

Hər iki namizəd üçün 3 meyar yoxlanılır:
- 1. Riyazi/Pedaqoji Zərurət (Necessity Claim): Hədəf anlayışı öyrənmək üçün mənbə mütləqdirmı?
- 2. Kurikulum Sübutu (Curriculum Grounding): Standart və dərslik ardıcıllığı varmı?
- 3. Əks-Nümunələr (Falsification by Counterexamples): Mənbə anlayışı olmadan həll olunan tapşırıqlar varmı?
"""

import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_REPORT = "reports/pilot_falsification_two_candidates.json"

def evaluate_cand_m04_linear_function():
    """
    Namizəd 1: Xətti funksiya (G7) -> Ədədi silsilə (G9)
    """
    candidate_id = "CAND-PILOT-G7-LINFUN-TO-G9-ARITHSEQ"
    source_node = "math_anlayis_xetti_funksiya"
    target_node = "math_silsile_ededi"
    
    # 1. Kurikulum sübutu
    curriculum_grounding = {
        "source_standard": "AR-MATH-G7-2.1.1",
        "source_textbook": "Riyaziyyat 7-ci sinif, Fəsil 2: Xətti funksiya, Səh. 48-68",
        "target_standard": "AR-MATH-G9-1.1.3",
        "target_textbook": "Riyaziyyat 9-cu sinif, Fəsil 4: Ədədi silsilə, Səh. 110-128",
        "curriculum_relation": "Dərslik proqramında əvvəlki sinifdə tədris olunur, lakin fəsil mündəricatında silsilə təmiz arifmetik ardıcıllıq kimi daxil edilir.",
        "curriculum_status": "VERIFIED_AS_SEQUENCE"
    }

    # 2. Riyazi və Pedaqoji Zərurət Təhlili
    # İddia: Şagird silsiləni həll etmək üçün mütləq y = kx + b xətti funksiyasını bilməlidir.
    # Falsifikasiya: Silsilə rekurent arifmetik ardıcıllıqdır: a_{n+1} = a_n + d.
    # Şagird heç bir koordinat müstəvisi, qrafik, arqument-funksiya anlayışı olmadan
    # sırf tam ədədlərin toplanması və vurulması ilə silsilənin bütün 9-cu sinif tələblərini yerinə yetirə bilər.
    counterexamples = [
        {
            "id": "CE-ARITH-01",
            "task": "İlk həddi a_1 = 3, silsilə fərqi d = 4 olan ədədi silsilənin 5-ci həddini tapın.",
            "solving_method_without_source": "Rekurent toplama: a_2=7, a_3=11, a_4=15, a_5=19. Və ya düstur: a_5 = 3 + 4*4 = 19.",
            "requires_linear_function": False,
            "required_prerequisite_instead": "Arifmetik vurma və toplama (5-ci sinif)"
        },
        {
            "id": "CE-ARITH-02",
            "task": "Ədədi silsilədə a_3 = 10, a_7 = 22 olarsa, silsilə fərqi d-ni tapın.",
            "solving_method_without_source": "Fərq düsturu: 4d = a_7 - a_3 = 22 - 10 = 12 -> d = 3.",
            "requires_linear_function": False,
            "required_prerequisite_instead": "Sadə xətti tənlik (6-7-ci sinif), qrafik və ya funksiya deyil"
        }
    ]

    # Yekun Epistemik Qərar
    verdict = {
        "candidate_id": candidate_id,
        "relation_name": "Xətti funksiya (7) -> Ədədi silsilə (9)",
        "claimed_relation_type": "PEDAGOGICAL_PREREQUISITE",
        "mathematical_necessity_proven": False,
        "counterexamples_count": len(counterexamples),
        "falsification_finding": "Ədədi silsilə üçün xətti funksiya zəruri önşərt deyil. Şagird funksiya anlayışı olmadan arifmetik düsturlarla bütün standart məsələləri tam həll edir.",
        "epistemic_status": "SUPPORTED",
        "advisory_classification": "CURRICULUM_SEQUENCE_TOWARDS_ADVANCED_SYNTHESIS",
        "hard_remediation_permitted": False,
        "verdict_rationale": "Dərslikdə ardıcıllıq var, fənlərarası və ya mövzulararası zənginləşdirmə kimi tövsiyə oluna bilər, lakin şagird üçün məcburi bloklayıcı PREREQUISITE deyil.",
        "curriculum_grounding": curriculum_grounding,
        "counterexamples": counterexamples
    }
    return verdict


def evaluate_cand_m02_quadratic_equation():
    """
    Namizəd 2: Kvadrat tənliklər (G8) -> Kvadrat bərabərsizliklər (G9)
    """
    candidate_id = "CAND-PILOT-G8-QUADEQ-TO-G9-QUADINEQ"
    source_node = "math_anlayis_kvadrat_tenlik"
    target_node = "math_anlayis_kvadrat_berabersizlik"

    curriculum_grounding = {
        "source_standard": "AR-MATH-G8-1.2.5",
        "source_textbook": "Riyaziyyat 8-ci sinif, Fəsil 4: Kvadrat tənliklər, Səh. 94-118",
        "target_standard": "AR-MATH-G9-1.2.4",
        "target_textbook": "Riyaziyyat 9-cu sinif, Fəsil 2: Kvadrat bərabərsizliklər, Səh. 38-56",
        "curriculum_relation": "Dərslikdə bərabərsizliklərin həllində intervallar üsulunda köklərin tapılması kvadrat tənliyin həllinə istinad edir.",
        "curriculum_status": "VERIFIED_AS_ALGORITHMIC_METHOD"
    }

    # İddia: Kvadrat bərabərsizliyi həll etmək üçün mütləq kvadrat tənlik kökləri tapılmalıdır.
    # Falsifikasiya:
    # 1. Kökləri olmayan kvadrat bərabərsizliklər (D < 0): Heç bir tənlik kökü olmadan tam kvadratın ayrılması ilə həll olunur.
    # 2. Qrafik üsul: Təpə nöqtəsi ilə parabola eskizi çəkilir, tənlik həll edilmir.
    counterexamples = [
        {
            "id": "CE-QUADINEQ-01",
            "task": "x^2 + 6x + 10 > 0 bərabərsizliyini həll edin.",
            "solving_method_without_source": "Tam kvadrat ayırma: (x + 3)^2 + 1 > 0. Həmişə >= 1 > 0 olduğundan cavab (-∞; +∞). Heç bir tənlik kökü tapılmadı.",
            "requires_quadratic_roots_algorithm": False,
            "required_prerequisite_instead": "Müxtəsər vurma düsturu və tam kvadrat (7-ci sinif)"
        },
        {
            "id": "CE-QUADINEQ-02",
            "task": "(x - 1)^2 <= 0 bərabərsizliyini həll edin.",
            "solving_method_without_source": "Kvadrat mənfi ola bilməz, yalnız sıfır ola bilər: x - 1 = 0 -> x = 1. Diskriminant və ya kvadrat tənlik alqoritmi tələb olunmur.",
            "requires_quadratic_roots_algorithm": False,
            "required_prerequisite_instead": "Kvadratın qeyri-mənfilik xassəsi (6-7-ci sinif)"
        }
    ]

    verdict = {
        "candidate_id": candidate_id,
        "relation_name": "Kvadrat tənliklər (8) -> Kvadrat bərabərsizliklər (9)",
        "claimed_relation_type": "PEDAGOGICAL_PREREQUISITE",
        "mathematical_necessity_proven": False,
        "counterexamples_count": len(counterexamples),
        "falsification_finding": "Kvadrat bərabərsizliklər üçün kvadrat tənlik ümumi halda (D > 0 halında intervallar metodu üçün) çox əlverişli metodik alətdir, lakin mütləq riyazi zərurət deyil (D <= 0 və tam kvadrat hallarında tənliksiz həll olunur).",
        "epistemic_status": "SUPPORTED",
        "advisory_classification": "METHODOLOGICAL_TOOL_RECOMMENDED_NOT_STRICT_NECESSITY",
        "hard_remediation_permitted": False,
        "verdict_rationale": "Dərslikdə əsas üsul kimi öyrədilir, tövsiyə kimi çox güclüdür, lakin universal zərurət olmadığı üçün şagirdə cəzalandırıcı sərt bloklama qoyula bilməz.",
        "curriculum_grounding": curriculum_grounding,
        "counterexamples": counterexamples
    }
    return verdict


def run():
    print("=" * 70)
    print("KAG FALSIFIKASIYA VƏ ƏKS-NÜMUNƏ SINAĞI (2 MÜBAHİSƏLİ NAMİZƏD)")
    print("SİTG Standartı & KAG Epistemik Konstitusiyası (Frozen v1.0)")
    print("=" * 70)

    v1 = evaluate_cand_m04_linear_function()
    v2 = evaluate_cand_m02_quadratic_equation()

    results = [v1, v2]

    report = {
        "report_version": "1.0-FALSIFICATION-EXPERIMENT",
        "charter": "KAG Universal Remediation & Epistemic Constitution",
        "candidates_tested_count": len(results),
        "summary": {
            "PROVEN_NECESSITY": 0,
            "SUPPORTED_AS_RECOMMENDATION": 2,
            "UNPROVEN": 0,
            "REJECTED": 0
        },
        "findings": results
    }

    os.makedirs(os.path.dirname(OUTPUT_REPORT), exist_ok=True)
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"Hesabat yazıldı: {OUTPUT_REPORT}\n")
    for r in results:
        print(f"Namizəd: {r['relation_name']}")
        print(f" - Status: {r['epistemic_status']} ({r['advisory_classification']})")
        print(f" - Riyazi zərurət isbatı: {r['mathematical_necessity_proven']}")
        print(f" - Aşkar edilən əks-nümunələr: {r['counterexamples_count']} ədəd")
        print(f" - Sərt bərpa hüququ (Hard Remediation): {r['hard_remediation_permitted']}")
        print(f" - Nəticə: {r['falsification_finding']}\n")
    print("=" * 70)

if __name__ == "__main__":
    run()
