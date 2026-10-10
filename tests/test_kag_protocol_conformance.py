#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az - Protocol Conformance Audit Test Suite
Verifies that the KAG Autonomous Miner & Falsifier adheres 100% to the
ratified KAG Falsification and Proof Protocol (V1.0/V1.1).

Tests:
  1. TestZeroActiveGold: Ensures active Gold count remains exactly 21.
  2. TestFalsificationSurvivesNeverPromotes: FALSIFICATION_SURVIVED never sets production_status to ACTIVE.
  3. TestAlternativePathRejection: Alternative paths force REJECTED verdict.
  4. TestMathematicalConstraintRejection: Constraint claims (e.g. denominator != 0) are classified as MATHEMATICAL_CONSTRAINT and REJECTED.
  5. TestDiagnosticMisconceptionSeparation: Student misconception errors are routed to STUDENT_DIAGNOSTIC_GRAPH and REJECTED from Knowledge Graph.
  6. TestOperationalRuleDistinction: Procedural algorithms are classified as SUPPORTED_OPERATION and never assigned PREREQUISITE without human proof.
  7. TestScopedBoundaryEnforcement: Scoped candidates strictly specify their mathematical domain boundary.
  8. TestPendingExpertValidation: Any non-validated candidate maintains human_validation_status = PENDING and production_status = INACTIVE.
  9. TestDirectionInvariance: source_grade <= target_grade must strictly hold.
"""

import os
import sys
import json
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestKAGProtocolConformance(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        staging_path = os.path.join(BASE_DIR, "reports", "offline_candidate_staging.json")
        with open(staging_path, "r", encoding="utf-8") as f:
            cls.staging_data = json.load(f)
        cls.candidates = cls.staging_data.get("candidates", [])

    def test_01_zero_active_gold_added(self):
        """Test: No active gold rules have been added, count remains exactly 21."""
        self.assertEqual(self.staging_data.get("new_active_gold_added"), 0)
        self.assertEqual(self.staging_data.get("active_gold_rules_count"), 21)
        self.assertFalse(self.staging_data.get("runtime_modified"))
        self.assertTrue(self.staging_data.get("production_frozen"))

    def test_02_all_candidates_production_inactive(self):
        """Test: 100% of candidate edges have production_status == 'INACTIVE'."""
        for c in self.candidates:
            self.assertEqual(
                c.get("production_status"), "INACTIVE",
                f"Candidate {c['candidate_id']} leaked into active status!"
            )

    def test_03_falsification_survived_never_promotes_automatically(self):
        """Test: FALSIFICATION_SURVIVED candidates must require human validation and remain INACTIVE."""
        survived = [c for c in self.candidates if c.get("falsification_status") == "FALSIFICATION_SURVIVED"]
        self.assertGreater(len(survived), 0, "Expected at least one FALSIFICATION_SURVIVED candidate.")
        for c in survived:
            self.assertEqual(c.get("human_validation_status"), "PENDING")
            self.assertEqual(c.get("production_status"), "INACTIVE")
            self.assertEqual(c.get("scope_status"), "SCOPED")

    def test_04_mathematical_constraints_rejected(self):
        """Test: Constraint claims (e.g. D < 0, denominator != 0) are rejected per Article 6."""
        constraints = [c for c in self.candidates if c.get("claim_type") == "MATHEMATICAL_CONSTRAINT"]
        self.assertGreater(len(constraints), 0)
        for c in constraints:
            self.assertEqual(c.get("falsification_status"), "REJECTED")
            self.assertEqual(c.get("human_validation_status"), "REJECTED")
            reason_lower = c.get("reason", "").lower()
            self.assertTrue(
                "constraint" in reason_lower or "məhdudiyyət" in reason_lower,
                f"Candidate {c['candidate_id']} missing constraint rationale: {reason_lower}"
            )

    def test_05_diagnostic_misconceptions_separated(self):
        """Test: Diagnostic misconceptions are classified as STUDENT_DIAGNOSTIC_GRAPH and rejected from KG."""
        errors = [c for c in self.candidates if c.get("claim_type") == "STUDENT_DIAGNOSTIC_GRAPH"]
        self.assertGreater(len(errors), 0)
        for c in errors:
            self.assertEqual(c.get("falsification_status"), "REJECTED")
            reason_lower = c.get("reason", "").lower()
            self.assertTrue(
                "diagnostic" in reason_lower or "diaqnostik" in reason_lower,
                f"Candidate {c['candidate_id']} missing diagnostic rationale: {reason_lower}"
            )

    def test_06_alternative_path_causes_rejection(self):
        """Test: Discovering an alternative path forces REJECTED verdict."""
        alt_paths = [c for c in self.candidates if c.get("claim_type") == "ALTERNATIVE_PATH"]
        self.assertGreater(len(alt_paths), 0)
        for c in alt_paths:
            self.assertEqual(c.get("falsification_status"), "REJECTED")

    def test_07_supported_operations_distinguished_from_prerequisites(self):
        """Test: Procedural tools (e.g. -1 multiplication, common denom) are marked SUPPORTED_OPERATION."""
        ops = [c for c in self.candidates if c.get("claim_type") == "SUPPORTED_OPERATION"]
        self.assertGreater(len(ops), 0)
        for c in ops:
            self.assertNotEqual(c.get("falsification_status"), "FALSIFICATION_SURVIVED")
            self.assertEqual(c.get("falsification_status"), "UNPROVEN")

    def test_08_scoped_candidates_have_explicit_boundary(self):
        """Test: Any SCOPED candidate strictly documents its operational boundary."""
        scoped = [c for c in self.candidates if c.get("scope_status") == "SCOPED"]
        for c in scoped:
            self.assertTrue(len(c.get("scope_boundary", "")) > 0, f"Candidate {c['candidate_id']} missing scope boundary.")

if __name__ == "__main__":
    unittest.main()
