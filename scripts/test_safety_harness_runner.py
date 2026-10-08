#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az Universal Adversarial Safety Harness & Gold Verification Runner v2.0
Fulfills:
  - Phase 1: Contract Freeze V1 (CF-00.1, CF-00.2, CF-00.3)
  - AUTO-GOLD V1 Dependency Rule Library
  - KAG Universal Remediation & Epistemik Təhlükəsizlik Konstitusiyası (Frozen v1.0)
  - Universal Adversarial Safety Harness V1 (CI/CD Fail-Fast Gate)

Executes 3 Comprehensive Test Suites:
  1. Negative Adversarial Safety Harness (20 tests across 5 subjects & 4 failure classes)
  2. Gold Positive-Control Harness (10 tests proving active gold resolution across 5 subjects)
  3. Mutation Invariant Gate (7 systematic corruptions proving immediate fail-fast)
"""

import os
import sys
import json
import copy

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "scripts"))

from kag_universal_engine import KAGUniversalRemediationEngine

ADVERSARIAL_CORPUS_PATH = os.path.join(BASE_DIR, "data", "ontology", "adversarial_safety_corpus_56.json")
GOLD_POSITIVE_PATH = os.path.join(BASE_DIR, "data", "ontology", "gold_positive_controls.json")

def run_suite_1_negative(engine: KAGUniversalRemediationEngine):
    print("\n" + "=" * 78)
    print("SUITE 1: 56 UNIVERSAL ADVERSARIAL SAFETY HARNESS (14 SUBJECTS X 4 CLASSES)")
    print("Goal: Prove zero false positive leakage across all 14 subjects (UNKNOWN > WRONG)")
    print("=" * 78)

    if not os.path.exists(ADVERSARIAL_CORPUS_PATH):
        print(f"❌ Error: Adversarial corpus not found at {ADVERSARIAL_CORPUS_PATH}")
        sys.exit(1)

    with open(ADVERSARIAL_CORPUS_PATH, "r", encoding="utf-8") as f:
        corpus = json.load(f)

    total = len(corpus)
    passed = 0
    failed = 0
    unexpected_active = 0

    current_subject = None

    for item in corpus:
        subj = item.get("subject", "ÜMUMİ")
        if subj != current_subject:
            current_subject = subj
            print(f"\n--- {current_subject.upper()} ---")

        t_id = item["test_id"]
        t_class = item["class"]
        exp_status = item["expected_status"]
        exp_reason = item["expected_reason"]

        res = engine.evaluate_edge(item)
        act_status = res["status"]
        act_reason = res["reason"]

        if act_status == "ACTIVE":
            unexpected_active += 1
            failed += 1
            print(f"  ❌ [{t_id}] CRITICAL SAFETY BREACH: Candidate unexpectedly became ACTIVE!")
            continue

        status_ok = (act_status == exp_status)
        reason_ok = (act_reason == exp_reason)

        if status_ok and reason_ok:
            passed += 1
            print(f"  ✅ [{t_id}] ({t_class}) -> {act_status} ({act_reason})")
        else:
            failed += 1
            print(f"  ⚠️ [{t_id}] FAIL")
            print(f"      Expected: {exp_status} ({exp_reason})")
            print(f"      Actual:   {act_status} ({act_reason})")

    return {"total": total, "passed": passed, "failed": failed, "active_leaks": unexpected_active}

def run_suite_2_positive(engine: KAGUniversalRemediationEngine):
    print("\n" + "=" * 78)
    print("SUITE 2: GOLD POSITIVE-CONTROL RESOLUTION HARNESS (10 TESTS)")
    print("Goal: Prove verified Gold Class A edges achieve ACTIVE (Zero False Negatives)")
    print("=" * 78)

    if not os.path.exists(GOLD_POSITIVE_PATH):
        print(f"❌ Error: Gold positive controls not found at {GOLD_POSITIVE_PATH}")
        sys.exit(1)

    with open(GOLD_POSITIVE_PATH, "r", encoding="utf-8") as f:
        gold_items = json.load(f)

    total = len(gold_items)
    passed = 0
    failed = 0
    blocked_gold = 0

    current_subject = None

    for item in gold_items:
        subj = item.get("subject", "ÜMUMİ")
        if subj != current_subject:
            current_subject = subj
            print(f"\n--- {current_subject.upper()} ---")

        t_id = item["test_id"]
        exp_status = item["expected_status"]
        exp_reason = item["expected_reason"]

        res = engine.evaluate_edge(item)
        act_status = res["status"]
        act_reason = res["reason"]

        if act_status != "ACTIVE":
            blocked_gold += 1
            failed += 1
            print(f"  ❌ [{t_id}] FALSE NEGATIVE: Verified gold edge was blocked -> {act_status} ({act_reason})")
            continue

        status_ok = (act_status == exp_status)
        reason_ok = (act_reason == exp_reason)

        if status_ok and reason_ok and res.get("remediation_ready"):
            passed += 1
            print(f"  ✅ [{t_id}] ACTIVE & REMEDIATION_READY ({act_reason})")
        else:
            failed += 1
            print(f"  ⚠️ [{t_id}] FAIL")
            print(f"      Expected: {exp_status} ({exp_reason})")
            print(f"      Actual:   {act_status} ({act_reason})")

    return {"total": total, "passed": passed, "failed": failed, "blocked_gold": blocked_gold, "items": gold_items}

def run_suite_3_mutations(engine: KAGUniversalRemediationEngine, gold_items: list):
    print("\n" + "=" * 78)
    print("SUITE 3: MUTATION INVARIANT REGRESSION GATE (7 TESTS)")
    print("Goal: Perturb valid Gold edges by 1 attribute -> Verify immediate fail-fast")
    print("=" * 78)

    gold_m04 = next(x for x in gold_items if x["test_id"] == "GOLD-M04")
    gold_m01 = next(x for x in gold_items if x["test_id"] == "GOLD-M01")
    gold_p01 = next(x for x in gold_items if x["test_id"] == "GOLD-P01")
    gold_b01 = next(x for x in gold_items if x["test_id"] == "GOLD-B01")
    gold_ch01 = next(x for x in gold_items if x["test_id"] == "GOLD-CH01")
    gold_az01 = next(x for x in gold_items if x["test_id"] == "GOLD-AZ01")
    gold_m03 = next(x for x in gold_items if x["test_id"] == "GOLD-M03")

    mutations = [
        {
            "id": "MUT-STRAND-01",
            "desc": "Mutate prerequisite strand to GEOMETRY on GOLD-M04 (Vector Trap)",
            "item": copy.deepcopy(gold_m04),
            "mutator": lambda x: x["candidate_prerequisite"].update({"strand": "3.1_GEOMETRY"}),
            "exp_status": "REJECTED",
            "exp_reason": "STRAND_MISMATCH"
        },
        {
            "id": "MUT-GRADE-02",
            "desc": "Mutate prerequisite grade to 12 (assessment is 11) on GOLD-M01",
            "item": copy.deepcopy(gold_m01),
            "mutator": lambda x: x["candidate_prerequisite"].update({"grade": 12}),
            "exp_status": "REJECTED",
            "exp_reason": "WRONG_GRADE_DIRECTION"
        },
        {
            "id": "MUT-DOMAIN-03",
            "desc": "Mutate prerequisite domain to chemistry on GOLD-P01 (Domain Leak)",
            "item": copy.deepcopy(gold_p01),
            "mutator": lambda x: x["candidate_prerequisite"].update({"domain": "chemistry"}),
            "exp_status": "REJECTED",
            "exp_reason": "DOMAIN_GUARD_VIOLATION"
        },
        {
            "id": "MUT-PROOF-04",
            "desc": "Downgrade proof_class to PROOF_CLASS_C on GOLD-B01",
            "item": copy.deepcopy(gold_b01),
            "mutator": lambda x: x.update({"proof_class": "PROOF_CLASS_C"}),
            "exp_status": "NO_VALIDATED_PREREQUISITE",
            "exp_reason": "PROOF_CLASS_INSUFFICIENT"
        },
        {
            "id": "MUT-EVIDENCE-05",
            "desc": "Strip all evidence artifacts on GOLD-CH01 (Unsubstantiated)",
            "item": copy.deepcopy(gold_ch01),
            "mutator": lambda x: x.update({"evidence": []}),
            "exp_status": "NO_VALIDATED_PREREQUISITE",
            "exp_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE"
        },
        {
            "id": "MUT-ARCHETYPE-06",
            "desc": "Mutate archetype to CONTEXTUAL_CHRONOLOGICAL on GOLD-AZ01",
            "item": copy.deepcopy(gold_az01),
            "mutator": lambda x: x.update({"dependency_archetype": "CONTEXTUAL_CHRONOLOGICAL"}),
            "exp_status": "REJECTED",
            "exp_reason": "CONTEXTUAL_NOT_PREREQUISITE"
        },
        {
            "id": "MUT-CONSTRAINT-07",
            "desc": "Mark operational edge as constraint (is_constraint=True) on GOLD-M03",
            "item": copy.deepcopy(gold_m03),
            "mutator": lambda x: x.update({"is_constraint": True}),
            "exp_status": "REJECTED",
            "exp_reason": "CONSTRAINT_NOT_PREREQUISITE"
        }
    ]

    total = len(mutations)
    passed = 0
    failed = 0
    unexpected_active = 0

    for m in mutations:
        m["mutator"](m["item"])
        res = engine.evaluate_edge(m["item"])
        act_status = res["status"]
        act_reason = res["reason"]

        if act_status == "ACTIVE":
            unexpected_active += 1
            failed += 1
            print(f"  ❌ [{m['id']}] CRITICAL MUTATION BREACH: Mutated candidate remained ACTIVE!")
            continue

        status_ok = (act_status == m["exp_status"])
        reason_ok = (act_reason == m["exp_reason"])

        if status_ok and reason_ok:
            passed += 1
            print(f"  ✅ [{m['id']}] {m['desc']} -> {act_status} ({act_reason})")
        else:
            failed += 1
            print(f"  ⚠️ [{m['id']}] FAIL")
            print(f"      Expected: {m['exp_status']} ({m['exp_reason']})")
            print(f"      Actual:   {act_status} ({act_reason})")

    return {"total": total, "passed": passed, "failed": failed, "active_leaks": unexpected_active}

def run_suite_4_topic_collapse(engine: KAGUniversalRemediationEngine):
    print("\n" + "=" * 78)
    print("SUITE 4: REAL-DATA TOPIC-LEVEL COLLAPSE REGRESSION GATE (5 TESTS)")
    print("Goal: Prove coarse topic groupings never collapse into false prerequisites")
    print("Standard: A Gold Rule MUST NOT be topic-defined; MUST be operation-defined.")
    print("=" * 78)

    collapse_cases = [
        {
            "id": "COLLAPSE-BIO-01",
            "desc": "Biology: Larynx Cartilage Anatomy must NOT inherit Alveolar Gas Exchange",
            "assessment_concept": {
                "concept_id": "bio_larynx_cartilage_anatomy",
                "canonical_name": "Qırtlaq qığırdaqları və səs telləri anatomiyası",
                "domain": "biologiya",
                "strand": "2_INSAN_ORQANIZMI",
                "grade": 8
            },
            "candidate_prerequisite": {
                "concept_id": "bio_gas_exchange_alveoli",
                "canonical_name": "Alveollarda qaz mübadiləsi və diffuziya mexanizmi",
                "domain": "biologiya",
                "strand": "2_INSAN_ORQANIZMI",
                "grade": 8
            },
            "dependency_archetype": "TAXONOMIC_ASSOCIATIVE",
            "proof_class": "NONE",
            "evidence": [],
            "exp_status": "NO_VALIDATED_PREREQUISITE",
            "exp_reason": "TAXONOMIC_NOT_PREREQUISITE"
        },
        {
            "id": "COLLAPSE-BIO-02",
            "desc": "Biology: Blood Groups (AB0) Table must NOT inherit Molecular Erythrocyte Antigens",
            "assessment_concept": {
                "concept_id": "bio_blood_groups_agglutination_table",
                "canonical_name": "Qan qrupları və aqqlütinasiya uyğunluq cədvəli",
                "domain": "biologiya",
                "strand": "2_INSAN_ORQANIZMI",
                "grade": 8
            },
            "candidate_prerequisite": {
                "concept_id": "bio_erythrocyte_surface_antigens_molecular",
                "canonical_name": "Eritrosit aqqlütinogenlərinin molekulyar strukturu",
                "domain": "biologiya",
                "strand": "2_INSAN_ORQANIZMI",
                "grade": 8
            },
            "dependency_archetype": "TAXONOMIC_ASSOCIATIVE",
            "proof_class": "NONE",
            "evidence": [],
            "exp_status": "NO_VALIDATED_PREREQUISITE",
            "exp_reason": "TAXONOMIC_NOT_PREREQUISITE"
        },
        {
            "id": "COLLAPSE-AZ-03",
            "desc": "Azerbaijani: Verbal Predicates Syntax must NOT inherit Broad Word Combinations",
            "assessment_concept": {
                "concept_id": "lang_verbal_predicate_agreement",
                "canonical_name": "Feli xəbər və mübtəda ilə uzlaşması",
                "domain": "azerbaycan_dili",
                "strand": "3_YAZI_VE_DIL_QAYDALARI",
                "grade": 8
            },
            "candidate_prerequisite": {
                "concept_id": "lang_word_combinations_syntax",
                "canonical_name": "Söz birləşmələri sintaksisi",
                "domain": "azerbaycan_dili",
                "strand": "3_YAZI_VE_DIL_QAYDALARI",
                "grade": 8
            },
            "dependency_archetype": "TAXONOMIC_ASSOCIATIVE",
            "proof_class": "NONE",
            "evidence": [],
            "exp_status": "NO_VALIDATED_PREREQUISITE",
            "exp_reason": "TAXONOMIC_NOT_PREREQUISITE"
        },
        {
            "id": "COLLAPSE-MATH-04",
            "desc": "Mathematics: Composite Rational Equations must NOT bypass factoring to Quadratic Roots",
            "assessment_concept": {
                "concept_id": "math_composite_rational_equations",
                "canonical_name": "Kəsrlərin ixtisarı və mürəkkəb rasional tənliklər",
                "domain": "riyaziyyat",
                "strand": "2.1_CEBR",
                "grade": 8
            },
            "candidate_prerequisite": {
                "concept_id": "math_quadratic_equations_roots",
                "canonical_name": "Kvadrat tənliyin köklərinin tapılması",
                "domain": "riyaziyyat",
                "strand": "2.1_CEBR",
                "grade": 8
            },
            "dependency_archetype": "OPERATIONAL",
            "proof_class": "PROOF_CLASS_B",
            "evidence": [{"status": "VERIFIED", "source": "composite_multi_step_curriculum"}],
            "exp_status": "NO_VALIDATED_PREREQUISITE",
            "exp_reason": "PROOF_CLASS_INSUFFICIENT"
        },
        {
            "id": "COLLAPSE-MATH-05",
            "desc": "Mathematics: Polygon Interior Angles Sum must NOT inherit Triangle Angle Sum Derivation",
            "assessment_concept": {
                "concept_id": "math_polygon_interior_angles_sum",
                "canonical_name": "Qabarıq çoxbucaqlının daxili bucaqlarının cəmi düsturu",
                "domain": "riyaziyyat",
                "strand": "3.1_HANDESE",
                "grade": 8
            },
            "candidate_prerequisite": {
                "concept_id": "math_triangle_interior_angles_sum",
                "canonical_name": "Üçbucağın daxili bucaqlarının cəmi teoremi",
                "domain": "riyaziyyat",
                "strand": "3.1_HANDESE",
                "grade": 7
            },
            "dependency_archetype": "CONTEXTUAL_CHRONOLOGICAL",
            "proof_class": "NONE",
            "evidence": [],
            "exp_status": "REJECTED",
            "exp_reason": "CONTEXTUAL_NOT_PREREQUISITE"
        }
    ]

    total = len(collapse_cases)
    passed = 0
    failed = 0
    unexpected_active = 0

    for item in collapse_cases:
        c_id = item["id"]
        c_desc = item["desc"]
        exp_status = item["exp_status"]
        exp_reason = item["exp_reason"]

        res = engine.evaluate_edge(item)
        act_status = res["status"]
        act_reason = res["reason"]

        if act_status == "ACTIVE":
            unexpected_active += 1
            failed += 1
            print(f"  ❌ [{c_id}] CRITICAL SAFETY COLLAPSE: Coarse topic unexpectedly became ACTIVE!")
            continue

        status_ok = (act_status == exp_status)
        reason_ok = (act_reason == exp_reason)

        if status_ok and reason_ok:
            passed += 1
            print(f"  ✅ [{c_id}] {c_desc} -> {act_status} ({act_reason})")
        else:
            failed += 1
            print(f"  ⚠️ [{c_id}] FAIL: {c_desc}")
            print(f"      Expected: {exp_status} ({exp_reason})")
            print(f"      Actual:   {act_status} ({act_reason})")

    return {"total": total, "passed": passed, "failed": failed, "active_leaks": unexpected_active}

def main():
    print("=" * 78)
    print("TESTAI.AZ UNIVERSAL ADVERSARIAL SAFETY & GOLD RESOLUTION HARNESS V2.0")
    print("Standard: RULES ARE DOMAIN-SPECIFIC. PROOF STANDARD IS UNIVERSAL.")
    print("=" * 78)

    engine = KAGUniversalRemediationEngine()

    r1 = run_suite_1_negative(engine)
    r2 = run_suite_2_positive(engine)
    r3 = run_suite_3_mutations(engine, r2["items"])
    r4 = run_suite_4_topic_collapse(engine)

    total_tests = r1["total"] + r2["total"] + r3["total"] + r4["total"]
    total_passed = r1["passed"] + r2["passed"] + r3["passed"] + r4["passed"]
    total_failed = r1["failed"] + r2["failed"] + r3["failed"] + r4["failed"]
    total_active_leaks = r1["active_leaks"] + r3["active_leaks"] + r4["active_leaks"]
    total_blocked_gold = r2["blocked_gold"]

    print("\n" + "=" * 78)
    print("YEKUN HARNESS AUDİT HESABATI:")
    print(f"  1. Negative Adversarial Suite:   {r1['passed']}/{r1['total']} PASS (Active Sızma: {r1['active_leaks']})")
    print(f"  2. Gold Positive Resolution:     {r2['passed']}/{r2['total']} PASS (Bloklanan Gold: {r2['blocked_gold']})")
    print(f"  3. Mutation Invariant Gate:      {r3['passed']}/{r3['total']} PASS (Mutation Sızma: {r3['active_leaks']})")
    print(f"  4. Topic Collapse Gate:          {r4['passed']}/{r4['total']} PASS (Collapse Sızma: {r4['active_leaks']})")
    print("-" * 78)
    print(f"  Ümumi Test Sayı:                 {total_tests}")
    print(f"  Müvəffəqiyyətlə Keçən:          {total_passed}")
    print(f"  Uğursuz (Failed):                {total_failed}")
    print(f"  Qanunsuz ACTIVE Sızması:         {total_active_leaks}")
    print(f"  Bloklanan Həqiqi Gold:           {total_blocked_gold}")
    print("=" * 78)

    if total_active_leaks > 0:
        print("\n🚨 QƏTİ QADAĞA POZULDU: Qanunsuz namizəd ACTIVE statusu aldı! CI/CD DAYANDIRILIR.")
        sys.exit(1)

    if total_blocked_gold > 0:
        print("\n🚨 OVER-BLOCKING XƏTASI: Təsdiqlənmiş Gold əlaqə bloklandı! Liveness pozuldu. CI/CD DAYANDIRILIR.")
        sys.exit(1)

    if total_failed > 0:
        print(f"\n❌ {total_failed} test gözlənilən nəticəni vermədi. CI/CD DAYANDIRILIR.")
        sys.exit(1)

    print(f"\n🎉 BÜTÜN 4 SUITE ({total_passed}/{total_tests} TEST) 100% PRECISION VƏ 100% RECALL İLƏ UĞURLA KEÇDİ.")
    print("1. Epistemik Təhlükəsizlik: TƏSDİQLƏNDİ (0 ACTIVE leakage).")
    print("2. Canlı Gold Həlli:       TƏSDİQLƏNDİ (10/10 Gold Edge ACTIVE və REMEDIATION_READY).")
    print("3. Mutasiya Fail-Fast:     TƏSDİQLƏNDİ (7/7 mutasiya anında bloklandı).")
    print("4. Topic Collapse Gate:    TƏSDİQLƏNDİ (5/5 real mövzu kollapsı bloklandı).")
    sys.exit(0)

if __name__ == "__main__":
    main()
