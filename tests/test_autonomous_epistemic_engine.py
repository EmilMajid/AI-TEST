#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az - Autonomous Epistemic Decision Engine Test Suite (KAG Stage 5)
Verifies:
  1. Automated 3-Tier Proof Filter (CAS, Curriculum Corpus, Empirical Layer)
  2. 4-Status Epistemic Model (PROVEN, SUPPORTED, UNPROVEN, REJECTED)
  3. No human-in-the-loop requirement for routine evaluations
  4. Epistemic Safety: Missing empirical data never escalates to PROVEN hard remediation
  5. Cryptographic package sealing & Zero-byte production insulation
"""

import unittest
import os
import sys
import json
import hashlib
import subprocess

sys.path.insert(0, ".")

from scripts.kag_autonomous_decision_engine import AutonomousKAGEpistemicDecisionEngine

class TestAutonomousEpistemicEngine(unittest.TestCase):

    def test_01_mathematical_dependency_proven_with_formal_cas(self):
        """Verifies that mathematical identity with valid CAS proof reaches PROVEN."""
        candidate = {
            "candidate_id": "TEST-MATH-DEP-01",
            "relation_type": "MATHEMATICAL_DEPENDENCY",
            "subject": "Riyaziyyat",
            "source_id": "math_anlayis_ikideyisenli_xetti_tenlik",
            "target_id": "math_anlayis_kvadrat_tenlik",
            "formal_proof_id": "CAS-M01-DISC-01"
        }
        pkg = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(candidate)
        self.assertEqual(pkg["epistemic_verdict"], "PROVEN")
        self.assertEqual(pkg["production_action"], "PROMOTABLE_TO_ACTIVE_MATHEMATICAL_RULE")
        self.assertEqual(pkg["tier_1_formal"]["tier_1_status"], "VERIFIED")

    def test_02_pedagogical_prerequisite_without_empirical_data_caps_at_supported(self):
        """Pedagogical prerequisite with curriculum evidence but absent empirical data caps at SUPPORTED."""
        candidate = {
            "candidate_id": "TEST-PEDAGOGICAL-SUPPORTED",
            "relation_type": "PEDAGOGICAL_PREREQUISITE",
            "subject": "Riyaziyyat",
            "source_id": "math_anlayis_ikideyisenli_xetti_tenlik",
            "target_id": "math_anlayis_kvadrat_tenlik",
            "formal_proof_id": "CAS-M01-FACT-01",
            "empirical_evaluation_id": "EMP-BKT-SHADOW-2026"
        }
        pkg = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(candidate)
        self.assertEqual(pkg["epistemic_verdict"], "SUPPORTED")
        self.assertEqual(pkg["production_action"], "RECOMMENDED_PREPARATION_NO_HARD_REMEDIATION")
        self.assertIn("Non-blocking recommendation only", pkg["rationale"])

    def test_03_grade_inversion_adversarial_rejected_to_unproven(self):
        """Grade inversion attack (Source Grade 9 claiming prereq of Target Grade 8) yields UNPROVEN."""
        candidate = {
            "candidate_id": "TEST-INVERSION-ATTACK",
            "relation_type": "PEDAGOGICAL_PREREQUISITE",
            "subject": "Riyaziyyat",
            "source_id": "math_anlayis_kvadrat_berabersizlik", # Grade 9
            "target_id": "math_anlayis_kvadrat_tenlik",       # Grade 8
            "formal_proof_id": "CAS-M02-INTERVAL-01"
        }
        pkg = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(candidate)
        self.assertEqual(pkg["epistemic_verdict"], "UNPROVEN")
        self.assertEqual(pkg["production_action"], "NO_VALIDATED_PREREQUISITE_UNKNOWN_GREATER_THAN_WRONG")
        self.assertEqual(pkg["tier_2_curriculum"]["tier_2_status"], "GRADE_ORDER_VIOLATION")

    def test_04_unmapped_topic_adversarial_rejected_to_unproven(self):
        """Invented topic absent from official curriculum corpus yields UNPROVEN (UNKNOWN > WRONG)."""
        candidate = {
            "candidate_id": "TEST-UNMAPPED-ATTACK",
            "relation_type": "PEDAGOGICAL_PREREQUISITE",
            "subject": "Riyaziyyat",
            "source_id": "math_nonexistent_fake_concept_xyz",
            "target_id": "math_anlayis_kvadrat_tenlik",
            "formal_proof_id": "CAS-M01-DISC-01"
        }
        pkg = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(candidate)
        self.assertEqual(pkg["epistemic_verdict"], "UNPROVEN")
        self.assertEqual(pkg["tier_2_curriculum"]["tier_2_status"], "UNMAPPED_TOPIC")
        self.assertEqual(pkg["production_action"], "NO_VALIDATED_PREREQUISITE_UNKNOWN_GREATER_THAN_WRONG")

    def test_05_cross_subject_synergy_cannot_be_proven_remediation(self):
        """Cross-subject synergy can only be SUPPORTED advisory, never PROVEN hard remediation."""
        candidate = {
            "candidate_id": "TEST-CROSS-SYNERGY",
            "relation_type": "CROSS_SUBJECT_SYNERGY",
            "subject": "Riyaziyyat",
            "source_id": "math_anlayis_ikideyisenli_xetti_tenlik",
            "target_id": "math_anlayis_kvadrat_tenlik"
        }
        pkg = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(candidate)
        self.assertEqual(pkg["epistemic_verdict"], "SUPPORTED")
        self.assertEqual(pkg["production_action"], "CROSS_SUBJECT_SYNERGY_ADVISORY_ONLY")

    def test_06_cryptographic_package_sealing_integrity(self):
        """Validates that generated proof packages have valid SHA-256 seals."""
        pilot_path = "reports/autonomous_validation_pilot_report.json"
        self.assertTrue(os.path.exists(pilot_path))
        with open(pilot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        for pkg in data.get("packages", []):
            claimed_sha = pkg.get("package_sha256")
            self.assertIsNotNone(claimed_sha)
            # Reconstruct content without hash
            pkg_copy = dict(pkg)
            del pkg_copy["package_sha256"]
            raw_bytes = json.dumps(pkg_copy, sort_keys=True, ensure_ascii=False).encode("utf-8")
            recomputed = hashlib.sha256(raw_bytes).hexdigest()
            self.assertEqual(claimed_sha, recomputed)

    def test_07_zero_leakage_into_production_guard(self):
        """Ensures candidate IDs do not leak into live production runtime and diff is 0 bytes."""
        res = subprocess.run(
            ["git", "diff", "HEAD", "--", "lib/runtime-kag-guard.ts", "data/grades/"],
            capture_output=True,
            text=True
        )
        self.assertEqual(res.returncode, 0)
        self.assertEqual(res.stdout.strip(), "", "Production code unexpectedly modified!")

        with open("lib/runtime-kag-guard.ts", "r", encoding="utf-8") as f:
            runtime_ts = f.read()
        
        pilot_path = "reports/autonomous_validation_pilot_report.json"
        with open(pilot_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        for pkg in data.get("packages", []):
            cid = pkg.get("candidate_id")
            # If candidate_id is not already an original 21 gold rule, ensure it never leaks
            if cid.startswith("CAND-") or cid.startswith("TEST-"):
                self.assertNotIn(cid, runtime_ts, f"Candidate '{cid}' leaked into live production runtime!")

    def test_08_canonical_21_gold_rules_fully_evaluated_and_supported(self):
        """Verifies that all 21 Canonical Gold Rules are evaluated across 8 subjects and achieve SUPPORTED."""
        EXPECTED_21_GOLD_RULE_IDS = {
            "GOLD-M01", "GOLD-M02", "GOLD-M03", "GOLD-M04", "GOLD-M05",
            "GOLD-A01", "GOLD-A02", "GOLD-A03",
            "GOLD-P01", "GOLD-P02", "GOLD-P03",
            "GOLD-C01", "GOLD-C02",
            "GOLD-B01", "GOLD-B02",
            "GOLD-H01", "GOLD-H02",
            "GOLD-G01", "GOLD-G02",
            "GOLD-I01", "GOLD-I02"
        }
        
        audit_path = "reports/kag_canonical_21_autonomous_evidence_audit.json"
        self.assertTrue(os.path.exists(audit_path), "Master canonical audit report missing!")
        with open(audit_path, "r", encoding="utf-8") as f:
            audit_data = json.load(f)
            
        pkg_dict = {p["candidate_id"]: p for p in audit_data.get("packages", [])}
        
        for gold_id in EXPECTED_21_GOLD_RULE_IDS:
            self.assertIn(gold_id, pkg_dict, f"Gold rule '{gold_id}' was not evaluated!")
            pkg = pkg_dict[gold_id]
            # Must achieve SUPPORTED (curriculum verified, empirical pending)
            self.assertEqual(
                pkg["epistemic_verdict"], 
                "SUPPORTED", 
                f"Gold rule '{gold_id}' unexpected verdict: {pkg['epistemic_verdict']}"
            )
            # Tier 2 curriculum must be VERIFIED
            self.assertEqual(
                pkg["tier_2_curriculum"]["tier_2_status"],
                "VERIFIED",
                f"Gold rule '{gold_id}' curriculum status not VERIFIED: {pkg['tier_2_curriculum']}"
            )
            # Must NOT be PROVEN without empirical data
            self.assertNotEqual(pkg["epistemic_verdict"], "PROVEN")

        # Confirm total canonical gold count
        self.assertEqual(audit_data.get("total_canonical_gold_evaluated"), 21)

if __name__ == "__main__":
    unittest.main()
