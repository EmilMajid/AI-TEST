#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az - Semantic Scoping & Audit of Rational Fraction Questions (243 items)
Classifies each item:
  - IN_SCOPE: Pure algebraic rational fractions (polynomial numerators/denominators, simplification, common denominator, operations)
  - OUT_OF_SCOPE: Radicals, irrational expressions, Vieta formula exercises with 1/x1+1/x2, function domains of general types
  - NEEDS_REVIEW: Ambiguous or compound questions
"""

import os
import sys
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def audit_semantic_scoping():
    in_path = os.path.join(BASE_DIR, "reports", "rational_fractions_pilot_dataset.json")
    with open(in_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    audited_items = []
    scope_counts = {"IN_SCOPE": 0, "OUT_OF_SCOPE": 0, "NEEDS_REVIEW": 0}

    for item in data:
        qid = item["id"]
        grade = item["grade"]
        topic = item["topic"]
        q_text = item["question"]
        expl = item["explanation"]
        full_text = f"{topic} {q_text} {expl}".lower()

        # Detection rules
        # 1. Clear OUT_OF_SCOPE cases:
        if grade == 9 and any(k in full_text for k in ["irrasional", "kökaltı", "\\sqrt", "irrasionallıqdan azad"]):
            verdict = "OUT_OF_SCOPE"
            reason = "Grade 9 radical/irrational expression, not pure polynomial rational fraction"
        elif "viyet" in full_text:
            verdict = "OUT_OF_SCOPE"
            reason = "Quadratic equation Vieta relation (1/x1 + 1/x2), focus is root theory, not fraction operations"
        elif grade in [10, 11] and any(k in full_text for k in ["funksiya", "loqarifm", "qüvvət üstlü", "törəmə"]):
            verdict = "OUT_OF_SCOPE"
            reason = "Advanced functional/transcendental domain question outside foundational algebraic fraction operations"
        elif any(k in topic.lower() for k in ["hesabi kvadrat kök", "pifaqor", "həqiqi ədədlər"]):
            verdict = "OUT_OF_SCOPE"
            reason = "Arithmetic root or geometry context"
        # 2. Clear IN_SCOPE cases:
        elif any(k in topic.lower() for k in [
            "rasional ifadələr", "rasional ifadələrin əsas xassəsi", 
            "rasional ifadələrin toplanması", "rasional ifadələrin vurulması", 
            "rasional ifadələr üzərində əməllər", "rasional tənliklər"
        ]):
            verdict = "IN_SCOPE"
            reason = "Grade 8 foundational algebraic rational fraction topic"
        # 3. Text-based detection for remaining Grade 8 items:
        elif grade == 8 and any(k in full_text for k in ["kəsri ixtisar", "məxrəc", "ortaq məxrəc", "surət və məxrəc"]):
            verdict = "IN_SCOPE"
            reason = "Grade 8 operational fraction task"
        else:
            verdict = "NEEDS_REVIEW"
            reason = "Mixed context or ambiguous scope boundary"

        scope_counts[verdict] += 1
        audited_items.append({
            "id": qid,
            "grade": grade,
            "topic": topic,
            "question_snippet": q_text[:100],
            "scope_verdict": verdict,
            "scope_reason": reason
        })

    print(f"Total Audited: {len(audited_items)}")
    print(f"Scope Counts: {scope_counts}")

    out_override = os.environ.get("KAG_OUTPUT_OVERRIDE")
    out_path = out_override if out_override else os.path.join(BASE_DIR, "reports", "rational_fractions_scoped_audit.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_items": len(audited_items),
            "summary": scope_counts,
            "items": audited_items
        }, f, ensure_ascii=False, indent=2)
    print(f"Saved full scoped audit to {out_path}")

if __name__ == "__main__":
    audit_semantic_scoping()
