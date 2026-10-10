"""
Test Suite for KAG Epistemic Taxonomy and Final Acceptance Contract

Verifies:
1. SUPPORTED cannot mutate into TASK_PREREQUISITE or PROVEN remediation.
2. CURRICULUM_SEQUENCE and PEDAGOGICAL_SUPPORT cannot trigger hard remediation.
3. CROSS_SUBJECT_SYNERGY cannot enter remediation chain.
4. TASK_PREREQUISITE mandates granular task scope and formal proof to achieve PROVEN.
5. Incomplete evidence yields UNPROVEN (UNKNOWN > WRONG).
6. Contract and Decision Engine agreement (zero divergence).
7. Zero mutation on live production files (lib/runtime-kag-guard.ts, data/grades/).
"""

import unittest
import os
import subprocess
from scripts.kag_formal_acceptance_contract import (
    validate_acceptance_contract,
    AcceptanceContractViolation,
    ALLOWED_RELATION_TYPES
)
from scripts.kag_autonomous_decision_engine import AutonomousKAGEpistemicDecisionEngine


class TestKagEpistemicTaxonomyAcceptance(unittest.TestCase):

    def setUp(self):
        self.mock_registry = AutonomousKAGEpistemicDecisionEngine.load_proof_registry()

    def test_01_supported_cannot_become_hard_remediation(self):
        """SUPPORTED verdict can never be marked PROVEN or permit hard remediation."""
        bad_record = {
            "claim_id": "TEST-CLAIM-01",
            "claim_type": "PEDAGOGICAL_SUPPORT",
            "scope": "General curriculum sequence for testing",
            "method": "Curriculum standards comparison method",
            "verification": {"curriculum_source_standard": "AR-MATH-G7-1.2.4"},
            "evidence_status": "CURRICULUM_EVIDENCE_VERIFIED",
            "prerequisite_status": "PROVEN",  # VIOLATION: PEDAGOGICAL_SUPPORT cannot be PROVEN
            "limitations": "Advisory support only, not strict algorithmic necessity."
        }
        with self.assertRaises(AcceptanceContractViolation) as ctx:
            validate_acceptance_contract(bad_record)
        self.assertTrue("Scope Invariant Violation" in str(ctx.exception) or "Epistemic Invariant Violation" in str(ctx.exception))

    def test_02_curriculum_sequence_cannot_be_proven_remediation(self):
        """CURRICULUM_SEQUENCE can never be marked PROVEN remediation."""
        bad_record = {
            "claim_id": "TEST-CLAIM-02",
            "claim_type": "CURRICULUM_SEQUENCE",
            "scope": "Curriculum chapter progression testing",
            "method": "National textbook table of contents alignment",
            "verification": {"curriculum_source_standard": "AR-MATH-G7-1.2.4"},
            "evidence_status": "CURRICULUM_EVIDENCE_VERIFIED",
            "prerequisite_status": "PROVEN",
            "limitations": "Subject sequence only, not algorithmic necessity."
        }
        with self.assertRaises(AcceptanceContractViolation) as ctx:
            validate_acceptance_contract(bad_record)
        self.assertTrue("Scope Invariant Violation" in str(ctx.exception) or "Epistemic Invariant Violation" in str(ctx.exception))

    def test_03_cross_subject_synergy_strictly_prohibited_from_remediation(self):
        """CROSS_SUBJECT_SYNERGY cannot enter remediation chain as PROVEN."""
        bad_record = {
            "claim_id": "TEST-CLAIM-03",
            "claim_type": "CROSS_SUBJECT_SYNERGY",
            "scope": "Math vector to Physics force concept synergy",
            "method": "Interdisciplinary conceptual mapping",
            "verification": {"curriculum_source_standard": "AR-MATH-G9-2.2.1"},
            "evidence_status": "CURRICULUM_EVIDENCE_VERIFIED",
            "prerequisite_status": "PROVEN",
            "limitations": "Cross-subject synergy advisory only."
        }
        with self.assertRaises(AcceptanceContractViolation) as ctx:
            validate_acceptance_contract(bad_record)
        self.assertTrue("Scope Invariant Violation" in str(ctx.exception) or "Epistemic Invariant Violation" in str(ctx.exception))

    def test_04_task_prerequisite_mandates_formal_proof_and_task_scope(self):
        """TASK_PREREQUISITE PROVEN mandates both formal proof artifact and granular task scope."""
        # Case A: Missing formal proof
        bad_record_no_proof = {
            "claim_id": "TEST-CLAIM-04A",
            "claim_type": "TASK_PREREQUISITE",
            "scope": "Specific linear factoring task operation in Q[x]",
            "method": "Symbolic factoring decomposition algorithm",
            "verification": {},  # Missing formal_proof_id
            "evidence_status": "ALGEBRAIC_VERIFICATION_PASSED",
            "prerequisite_status": "PROVEN",
            "limitations": "Factorable quadratics only."
        }
        with self.assertRaises(AcceptanceContractViolation) as ctx:
            validate_acceptance_contract(bad_record_no_proof)
        self.assertTrue("Task Prerequisite Guard" in str(ctx.exception) or "Missing Proof Artifact" in str(ctx.exception))

        # Case B: Proof present but missing granular task scope (monolithic topic scope)
        bad_record_bad_scope = {
            "claim_id": "TEST-CLAIM-04B",
            "claim_type": "TASK_PREREQUISITE",
            "scope": "Monolithic broad chapter coverage across whole curriculum",
            "method": "Linear factor decomposition over Q[x]",
            "verification": {"formal_proof_id": "CAS-M01-FACT-01"},
            "evidence_status": "ALGEBRAIC_VERIFICATION_PASSED",
            "prerequisite_status": "PROVEN",
            "limitations": "Valid only under rational factors."
        }
        with self.assertRaises(AcceptanceContractViolation) as ctx:
            validate_acceptance_contract(bad_record_bad_scope)
        self.assertIn("Task Prerequisite Guard", str(ctx.exception))

        # Case C: Valid granular task scope and valid registered proof
        good_record = {
            "claim_id": "GOLD-M01-FACTORING-METHOD",
            "claim_type": "TASK_PREREQUISITE",
            "scope": "Specific quadratic factoring task operation in Q[x]",
            "method": "Linear Factor Decomposition over Q[x]",
            "verification": {"formal_proof_id": "CAS-M01-FACT-01"},
            "evidence_status": "ALGEBRAIC_VERIFICATION_PASSED",
            "prerequisite_status": "PROVEN",
            "limitations": "Valid only under rational factors."
        }
        self.assertTrue(validate_acceptance_contract(good_record))

    def test_05_incomplete_evidence_yields_unproven(self):
        """Candidate with incomplete evidence yields UNPROVEN under Decision Engine."""
        incomplete_cand = {
            "candidate_id": "TEST-CAND-INCOMPLETE",
            "relation_type": "CURRICULUM_SEQUENCE",
            "subject": "Riyaziyyat",
            "source_id": "nonexistent_source_node",
            "target_id": "math_anlayis_kvadrat_tenlik"
        }
        res = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(incomplete_cand)
        self.assertEqual(res["epistemic_verdict"], "UNPROVEN")
        self.assertEqual(res["production_action"], "NO_VALIDATED_PREREQUISITE_UNKNOWN_GREATER_THAN_WRONG")

    def test_06_decision_engine_and_contract_agreement(self):
        """Verifies that Decision Engine output matches Acceptance Contract validation."""
        # 1. Valid curriculum sequence candidate
        valid_cand = {
            "candidate_id": "GOLD-M01",
            "relation_type": "CURRICULUM_SEQUENCE",
            "subject": "Riyaziyyat",
            "source_id": "math_anlayis_ikideyisenli_xetti_tenlik",
            "target_id": "math_anlayis_kvadrat_tenlik"
        }
        res = AutonomousKAGEpistemicDecisionEngine.adjudicate_candidate(valid_cand)
        self.assertEqual(res["epistemic_verdict"], "SUPPORTED")

        # Check corresponding contract record
        contract_record = {
            "claim_id": "TEST-AGREEMENT-01",
            "claim_type": "CURRICULUM_SEQUENCE",
            "scope": "Linear equation sequence to quadratic equations",
            "method": "AR National Curriculum Standards Mapping",
            "verification": {"curriculum_source_standard": "AR-MATH-G7-1.2.4"},
            "evidence_status": "CURRICULUM_EVIDENCE_VERIFIED",
            "prerequisite_status": res["epistemic_verdict"],  # Must match SUPPORTED
            "limitations": "Textbook sequence only, non-blocking."
        }
        self.assertTrue(validate_acceptance_contract(contract_record))

    def test_07_production_zero_diff_invariant(self):
        """Ensures lib/runtime-kag-guard.ts and data/grades/ remain 0-byte diff."""
        git_res = subprocess.run(
            ["git", "diff", "HEAD", "--", "lib/runtime-kag-guard.ts", "data/grades/"],
            capture_output=True,
            text=True
        )
        self.assertEqual(git_res.returncode, 0)
        self.assertEqual(git_res.stdout.strip(), "", "Production files were modified!")


if __name__ == "__main__":
    unittest.main()
