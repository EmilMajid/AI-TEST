#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az - KAG Mutation & Negative Conformance Test Suite (Hardened V2.0)
Tests comprehensive adversarial attack vectors against KAGPolicyDecisionEngine V2.0:
  - Unknown/disallowed claim_types (Closed allowlist)
  - Missing, string-typed, and out-of-range grade parameters
  - Scoped status with empty/whitespace boundaries
  - Manifest tampering and unblock token absence
  - Dual-phase evaluation decoupling
"""

import os
import json
import unittest
from scripts.kag_policy_engine import KAGPolicyDecisionEngine, StrictInvariantViolation

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(BASE_DIR, "data", "ontology", "gold_manifest_21.json")

class TestKAGMutationAndNegativeConformance(unittest.TestCase):

    def test_mutation_01_unknown_claim_type_rejected(self):
        """Mutation Attack: Candidate with unknown claim_type 'HEURISTIC_RULE' attempts to activate."""
        candidate = {
            "candidate_id": "ATTACK-01",
            "claim_type": "HEURISTIC_RULE",  # Not in allowlist!
            "source_grade": 8,
            "target_grade": 9,
            "scope_status": "SCOPED",
            "scope_boundary": "Valid subset",
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("CLAIM_TYPE_NOT_PROMOTABLE", str(ctx.exception))

    def test_mutation_02_supported_operation_cannot_activate(self):
        """Mutation Attack: SUPPORTED_OPERATION attempts to set production_status = 'ACTIVE'."""
        candidate = {
            "candidate_id": "ATTACK-02",
            "claim_type": "SUPPORTED_OPERATION",
            "source_grade": 8,
            "target_grade": 9,
            "scope_status": "SCOPED",
            "scope_boundary": "Valid operation",
            "falsification_status": "UNPROVEN",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("CLAIM_TYPE_NOT_PROMOTABLE", str(ctx.exception))

    def test_mutation_03_unscoped_candidate_cannot_activate(self):
        """Mutation Attack: Candidate marked UNSCOPED attempts to activate."""
        candidate = {
            "candidate_id": "ATTACK-03",
            "claim_type": "EPISTEMIC_PREREQUISITE",
            "source_grade": 8,
            "target_grade": 9,
            "scope_status": "UNSCOPED",  # Not SCOPED!
            "scope_boundary": "Broad theory",
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("UNSCOPED_ACTIVATION_BLOCKED", str(ctx.exception))

    def test_mutation_04_whitespace_only_boundary_fails(self):
        """Mutation Attack: Scoped candidate has boundary consisting solely of spaces."""
        candidate = {
            "candidate_id": "ATTACK-04",
            "claim_type": "EPISTEMIC_PREREQUISITE",
            "source_grade": 8,
            "target_grade": 9,
            "scope_status": "SCOPED",
            "scope_boundary": "   \t  \n  ",  # Whitespace only!
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("EMPTY_BOUNDARY_VIOLATION", str(ctx.exception))

    def test_mutation_05_missing_grade_fails(self):
        """Mutation Attack: Candidate with None as source_grade attempts to survive/activate."""
        candidate = {
            "candidate_id": "ATTACK-05",
            "claim_type": "EPISTEMIC_PREREQUISITE",
            "source_grade": None,  # Missing!
            "target_grade": 9,
            "scope_status": "SCOPED",
            "scope_boundary": "Non-empty",
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("GRADE_MISSING", str(ctx.exception))

    def test_mutation_06_string_typed_grade_fails(self):
        """Mutation Attack: Candidate has string '8' instead of integer 8."""
        candidate = {
            "candidate_id": "ATTACK-06",
            "claim_type": "EPISTEMIC_PREREQUISITE",
            "source_grade": "8",  # String type injection!
            "target_grade": 9,
            "scope_status": "SCOPED",
            "scope_boundary": "Non-empty",
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("GRADE_TYPE_ERROR", str(ctx.exception))

    def test_mutation_07_out_of_range_grade_fails(self):
        """Mutation Attack: Candidate with target_grade 14 (out of 1..11 school range)."""
        candidate = {
            "candidate_id": "ATTACK-07",
            "claim_type": "EPISTEMIC_PREREQUISITE",
            "source_grade": 8,
            "target_grade": 14,  # Out of bounds!
            "scope_status": "SCOPED",
            "scope_boundary": "Non-empty",
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        self.assertIn("GRADE_RANGE_ERROR", str(ctx.exception))

    def test_mutation_08_mathematical_constraint_cannot_activate_even_if_rejected(self):
        """Mutation Attack: Constraint marked REJECTED still attempts to set production_status = 'ACTIVE'."""
        candidate = {
            "candidate_id": "ATTACK-08",
            "claim_type": "MATHEMATICAL_CONSTRAINT",
            "source_grade": 8,
            "target_grade": 9,
            "scope_status": "NOT_APPLICABLE",
            "falsification_status": "REJECTED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"  # Illegal promotion!
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(
                candidate, 
                manifest_path=MANIFEST_PATH, 
                unblock_token="CONSTITUTIONAL_RATIFIED_UNBLOCK_V2"
            )
        err = str(ctx.exception)
        self.assertTrue("CLAIM_TYPE_NOT_PROMOTABLE" in err or "ARTICLE 6 VIOLATION" in err)

    def test_mutation_09_unblock_token_required_for_active(self):
        """Mutation Attack: Candidate is perfect in every field, but unblock_token is omitted."""
        candidate = {
            "candidate_id": "ATTACK-09",
            "claim_type": "EPISTEMIC_PREREQUISITE",
            "source_grade": 8,
            "target_grade": 9,
            "scope_status": "SCOPED",
            "scope_boundary": "Strictly defined subset",
            "falsification_status": "FALSIFICATION_SURVIVED",
            "human_validation_status": "VALIDATED",
            "production_status": "ACTIVE"  # Trying to activate without constitutional token!
        }
        with self.assertRaises(StrictInvariantViolation) as ctx:
            KAGPolicyDecisionEngine.evaluate_promotion(candidate, manifest_path=MANIFEST_PATH, unblock_token=None)
        self.assertIn("FREEZE VIOLATION", str(ctx.exception))

    def test_mutation_10_manifest_tampering_detected(self):
        """Mutation Attack: Verifying manifest detection by pointing to a mock tampered manifest."""
        mock_tampered_path = os.path.join(BASE_DIR, "reports", "mock_tampered_manifest.json")
        with open(mock_tampered_path, "w", encoding="utf-8") as f:
            json.dump({"tampered": True}, f)
        
        try:
            with self.assertRaises(StrictInvariantViolation) as ctx:
                KAGPolicyDecisionEngine.verify_manifest_integrity(mock_tampered_path)
            self.assertIn("MANIFEST TAMPERED", str(ctx.exception))
        finally:
            if os.path.exists(mock_tampered_path):
                os.remove(mock_tampered_path)

    def test_mutation_11_manifest_missing_rule_id_fails(self):
        """Mutation Attack: Manifest rule is missing mandatory 'rule_id' field."""
        mock_corrupt_path = os.path.join(BASE_DIR, "reports", "mock_corrupt_manifest.json")
        rules = [{"rule_id": f"G-{i}"} for i in range(20)]
        rules.append({"rule_P01": "G-21"}) # Corrupt key!
        with open(mock_corrupt_path, "w", encoding="utf-8") as f:
            json.dump({"canonical_rules": rules}, f)
        
        try:
            with self.assertRaises(StrictInvariantViolation) as ctx:
                KAGPolicyDecisionEngine.verify_manifest_integrity(mock_corrupt_path)
            err = str(ctx.exception)
            self.assertTrue("MANIFEST TAMPERED" in err or "MANIFEST CORRUPTION" in err)
        finally:
            if os.path.exists(mock_corrupt_path):
                os.remove(mock_corrupt_path)

    def test_mutation_12_manifest_duplicate_rule_id_fails(self):
        """Mutation Attack: Manifest contains duplicate rule_ids."""
        mock_dup_path = os.path.join(BASE_DIR, "reports", "mock_dup_manifest.json")
        rules = [{"rule_id": "G-01"} for _ in range(21)] # All duplicate!
        with open(mock_dup_path, "w", encoding="utf-8") as f:
            json.dump({"canonical_rules": rules}, f)
        
        try:
            with self.assertRaises(StrictInvariantViolation) as ctx:
                KAGPolicyDecisionEngine.verify_manifest_integrity(mock_dup_path)
            err = str(ctx.exception)
            self.assertTrue("MANIFEST TAMPERED" in err or "MANIFEST DUPLICATE" in err)
        finally:
            if os.path.exists(mock_dup_path):
                os.remove(mock_dup_path)

if __name__ == "__main__":
    unittest.main()
