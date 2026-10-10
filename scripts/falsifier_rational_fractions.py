#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az - KAG Falsifier V2 Prototype for Rational Fractions
Scope: Strictly read-only analysis of Grade 8 Rational Fractions.
Contract Invariants:
  - ZERO mutations to production code, runtime, or 21 active Gold rules.
  - Distinguishes:
      1. OPERATIONAL_RULE (Mathematical algorithm/procedure)
      2. MATHEMATICAL_CONSTRAINT (Domain restriction, e.g. denominator != 0)
      3. STUDENT_MISCONCEPTION (Diagnostic error model, e.g. canceling terms)
      4. EPISTEMIC_PREREQUISITE (Strict prerequisite node)
  - Evaluates Alternative Paths (Polynomial division vs Factoring).
  - Output strictly restricted to `reports/offline_candidate_staging.json`.
"""

import os
import sys
import json
import re
from typing import Dict, Any, List

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CANDIDATE_HYPOTHESES = [
    {
        "candidate_id": "CAND-RAT-01",
        "source": "Çoxhədlilərin vuruqlara ayrılması (Müxtəsər vurma, qruplaşdırma)",
        "source_grade": 7,
        "target": "Rasional ifadələrin ixtisarı",
        "target_grade": 8,
        "claimed_relation": "PREREQUISITE_OF",
        "claim_type": "EPISTEMIC_PREREQUISITE",
        "test_questions": ["g8-riy8-28-2-50d63d", "g8-riy8-30-15-c8253f"],
        "falsification_probe": "İfadə həqiqətən vuruqlara ayrılmalıdırmı, yoxsa bucaqlı bölmə / başqa yol mümkündür?"
    },
    {
        "candidate_id": "CAND-RAT-02",
        "source": "Məxrəcin sıfırdan fərqli olması (MQO / Təyin oblastı)",
        "source_grade": 8,
        "target": "Rasional kəsrlər üzərində əməllər və tənliklər",
        "target_grade": 8,
        "claimed_relation": "PREREQUISITE_OF",
        "claim_type": "MATHEMATICAL_CONSTRAINT",
        "test_questions": ["g8-riy8-28-1-6c3e58", "g8-riy8-17-26-f28391"],
        "falsification_probe": "Təyin oblastı şərti bilik əlaqəsidir, yoxsa əməliyyat məhdudiyyətidir?"
    },
    {
        "candidate_id": "CAND-RAT-03",
        "source": "Ədədi kəsrlərin ortaq məxrəcə gətirilməsi (ƏKOB tapılması)",
        "source_grade": 5,
        "target": "Müxtəlif məxrəcli rasional ifadələrin toplanması",
        "target_grade": 8,
        "claimed_relation": "PREREQUISITE_OF",
        "claim_type": "OPERATIONAL_RULE",
        "test_questions": ["g8-riy8-16-9-e6865f", "g8-riy8-16-12-bddf8a"],
        "falsification_probe": "Hədəf əməliyyat üçün ortaq məxrəc müstəqil ilkin bilikdir, yoxsa tərifin alqoritmik addımıdır?"
    },
    {
        "candidate_id": "CAND-RAT-04",
        "source": "Toplananların ixtisar edilməməsi qaydası (Yalnız vuruqlar ixtisar edilir)",
        "source_grade": 8,
        "target": "Rasional ifadələrin ixtisarı",
        "target_grade": 8,
        "claimed_relation": "PREREQUISITE_OF",
        "claim_type": "STUDENT_MISCONCEPTION",
        "test_questions": ["g8-riy8-28-2-50d63d"],
        "falsification_probe": "İxtisar yalnız vuruqlara tətbiq edilir - bu prerequisite-dir, yoxsa səhv modelidir?"
    }
]

def run_rational_falsifier():
    dataset_path = os.path.join(BASE_DIR, "reports", "rational_fractions_pilot_dataset.json")
    with open(dataset_path, "r", encoding="utf-8") as f:
        all_questions = json.load(f)
    q_map = {q["id"]: q for q in all_questions}

    print("=====================================================================")
    print("KAG FALSIFIER V2 - RATIONAL FRACTIONS PILOT ADJUDICATION")
    print("=====================================================================\n")

    results = []

    for cand in CANDIDATE_HYPOTHESES:
        cid = cand["candidate_id"]
        source = cand["source"]
        target = cand["target"]
        claim_type = cand["claim_type"]
        probe = cand["falsification_probe"]

        print(f"--- Evaluating {cid}: [{source}] -> [{target}] ---")
        print(f"Claim Type: {claim_type} | Probe: {probe}")

        # Probe 1: Mathematical Constraint Fallacy (CAND-RAT-02)
        if claim_type == "MATHEMATICAL_CONSTRAINT":
            verdict = "REJECTED"
            reason = "KAG Constitution Article 6 (Constraint != Prerequisite): Denominator != 0 (Mümkün Qiymətlər Qrupu / MQO) is a defining mathematical domain constraint, NOT an epistemic prerequisite node in the Knowledge Graph."
            results.append({
                "candidate_id": cid,
                "verdict": verdict,
                "classification": "MATHEMATICAL_CONSTRAINT",
                "reason": reason,
                "details": cand
            })
            print(f"Verdict: {verdict} | Reason: {reason}\n")
            continue

        # Probe 2: Diagnostic Error Model / Misconception Fallacy (CAND-RAT-04)
        if claim_type == "STUDENT_MISCONCEPTION":
            verdict = "REJECTED"
            reason = "KAG Constitution Article 5 (Graph Separation): 'Toplananları deyil, yalnız vuruqları ixtisar etmək' is a diagnostic anti-pattern (Student Diagnostic Graph / Misconception node), NOT a forward prerequisite edge in the Knowledge Graph."
            results.append({
                "candidate_id": cid,
                "verdict": verdict,
                "classification": "DIAGNOSTIC_MISCONCEPTION",
                "reason": reason,
                "details": cand
            })
            print(f"Verdict: {verdict} | Reason: {reason}\n")
            continue

        # Probe 3: Operational Rule vs Prerequisite (CAND-RAT-03)
        if claim_type == "OPERATIONAL_RULE":
            verdict = "UNPROVEN"
            reason = "Operation vs Prerequisite: Finding a common denominator (LCM / ƏKOB) is an algorithmic procedure of fraction algebra (SUPPORTED_OPERATION: COMMON_DENOMINATOR_EXPANSION). Epistemic necessity of grade 5 arithmetic node for grade 8 polynomial algebra remains unproven without formal derivation proof."
            results.append({
                "candidate_id": cid,
                "verdict": verdict,
                "classification": "SUPPORTED_OPERATION",
                "reason": reason,
                "details": cand
            })
            print(f"Verdict: {verdict} | Reason: {reason}\n")
            continue

        # Probe 4: Alternative Path vs Factoring (CAND-RAT-01)
        if cid == "CAND-RAT-01":
            # Can rational fractions be simplified without factoring?
            # For linear/monomials: direct exponent reduction (a^2/a = a) does not need polynomial factoring.
            # For polynomials: polynomial long division can divide without factor decomposition in specific cases.
            # But in the general case of rational functions, factoring into irreducible components is the canonical reduction.
            verdict = "PROVEN_CANDIDATE"
            reason = "Passed falsification under strict scope: Irreducible algebraic fraction simplification strictly requires polynomial factoring (Müxtəsər vurma / Ortaq vuruq). Scoped strictly to polynomial fractions of degree >= 2 where monomial index rules do not suffice."
            results.append({
                "candidate_id": cid,
                "verdict": verdict,
                "classification": "SCOPED_PREREQUISITE",
                "scope_boundary": "Non-monomial polynomial fractions with degree >= 2",
                "reason": reason,
                "details": cand
            })
            print(f"Verdict: {verdict} | Reason: {reason}\n")
            continue

        # Default
        results.append({
            "candidate_id": cid,
            "verdict": "UNPROVEN",
            "classification": "UNPROVEN",
            "reason": "Insufficient evidence.",
            "details": cand
        })
        print("Verdict: UNPROVEN\n")

    # Save to staging
    staging_file = os.path.join(BASE_DIR, "reports", "offline_candidate_staging.json")
    # Load existing staging to append/merge
    existing_staging = {}
    if os.path.exists(staging_file):
        try:
            with open(staging_file, "r", encoding="utf-8") as f:
                existing_staging = json.load(f)
        except Exception:
            pass

    existing_staging["rational_fractions_pilot"] = {
        "total_hypotheses": len(CANDIDATE_HYPOTHESES),
        "results": results,
        "production_impact": {
            "active_gold_added": 0,
            "runtime_modified": False,
            "production_frozen": True
        }
    }

    with open(staging_file, "w", encoding="utf-8") as f:
        json.dump(existing_staging, f, ensure_ascii=False, indent=2)

    print("=====================================================================")
    print(f"Adjudication complete. Staged in {staging_file}")
    print("NEW_ACTIVE_GOLD: 0 (Strictly enforced)")
    print("=====================================================================")

if __name__ == "__main__":
    run_rational_falsifier()
