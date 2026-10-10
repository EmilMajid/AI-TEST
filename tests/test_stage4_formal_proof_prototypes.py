import unittest
import json
import os
import subprocess
import hashlib
import sympy as sp
import sys

sys.path.insert(0, ".")
from scripts.prototype_proof_engine_gold_m01 import execute_discriminant_pathway, execute_factoring_pathway, run_m01_pipeline
from scripts.prototype_proof_engine_gold_m02 import solve_via_interval_method, solve_via_parabola_method, run_m02_pipeline
from scripts.prototype_proof_engine_gold_p02 import verify_physics_work_energy_identity, run_p02_pipeline
from scripts.kag_formal_acceptance_contract import (
    validate_acceptance_contract,
    AcceptanceContractViolation,
    COMPATIBILITY_MATRIX,
    ALLOWED_CLAIM_TYPES
)

class TestStage4FormalProofPrototypes(unittest.TestCase):
    """
    Stage 4 Exhaustive Acceptance Test Suite (V5.0)
    Implements 3-Level Formal Acceptance Auditing with Zero Side-Effects:
      Level 1: Strict Schema & Type Validation
      Level 2: Full Status Compatibility Matrix, Epistemic Invariants & Proof Registry Verification (K1, K2, P0)
      Level 3: Live CAS Root Completeness, Exact Radical Arithmetic & Physical Guards (K3, K4, K5)
      Level 4: Multi-Contract Conformance & Production Freeze Invariants (K6)
    """

    @classmethod
    def setUpClass(cls):
        """Generates fresh report artifacts deterministically without import-time side-effects."""
        os.makedirs("reports", exist_ok=True)
        cls.p_m01 = run_m01_pipeline()
        cls.p_m02 = run_m02_pipeline()
        cls.p_p02 = run_p02_pipeline()

    # ==========================================================================
    # LEVEL 1: Strict Schema & Type Validation (Problems C1, D2)
    # ==========================================================================
    def test_01_schema_and_strict_typing(self):
        """Verifies that all 8 fields are strictly typed and reject invalid types."""
        base_valid = {
            "claim_id": "GOLD-M01-ALG-COUNTEREXAMPLE",
            "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
            "scope": "Univariate quadratic polynomials with real coefficients",
            "method": "Formal CAS solver pathway comparison",
            "verification": {
                "formal_proof_id": "CAS-M01-DISC-01",
                "details": "Exact symbolic equality verified across test set"
            },
            "evidence_status": "COUNTEREXAMPLE_VERIFIED",
            "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
            "limitations": "Evaluated strictly within tested degree 2 domain"
        }
        self.assertTrue(validate_acceptance_contract(base_valid))

        # 1. Non-string claim_id
        bad_id = base_valid.copy()
        bad_id["claim_id"] = 12345
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(bad_id)

        # 2. Too short scope
        bad_scope = base_valid.copy()
        bad_scope["scope"] = "short"
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(bad_scope)

        # 3. Invalid verification type (neither dict nor structured)
        bad_verif = base_valid.copy()
        bad_verif["verification"] = [1, 2, 3]
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(bad_verif)

        # String verification is also rejected (must be structured dict)
        bad_str_verif = base_valid.copy()
        bad_str_verif["verification"] = "simple string without proof artifact ID"
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(bad_str_verif)

    # ==========================================================================
    # LEVEL 2: Compatibility Matrix, Epistemic Invariants & Deep Registry (K1, K2, K5, P0)
    # ==========================================================================
    def test_02_compatibility_matrix_and_epistemic_invariants(self):
        """Verifies that every claim_type enforces its exact allowed status matrix and deep registry links."""
        for c_type in ALLOWED_CLAIM_TYPES:
            allowed_pairs = COMPATIBILITY_MATRIX[c_type]
            self.assertGreater(len(allowed_pairs), 0, f"Empty compatibility matrix for {c_type}")
            
            for ev_status, prereq_status in allowed_pairs:
                if c_type in {"ALGORITHMIC_UNIVERSAL_NECESSITY", "MATHEMATICAL_DEPENDENCY"}:
                    claim_id = "GOLD-M01-ALG-COUNTEREXAMPLE"
                    verif = {"formal_proof_id": "CAS-M01-DISC-01", "details": "Verified"}
                elif c_type == "METHOD_OPERATIONAL_DEPENDENCY":
                    claim_id = "GOLD-M01-FACTORING-METHOD"
                    verif = {"formal_proof_id": "CAS-M01-FACT-01", "details": "Verified"}
                elif c_type == "PHYSICAL_THEOREM_IDENTITY":
                    claim_id = "GOLD-P02-THEOREM-IDENTITY"
                    verif = {"formal_proof_id": "CAS-P02-WORK-ENERGY-01", "details": "Verified"}
                elif c_type in {"PEDAGOGICAL_CURRICULUM_PREREQUISITE", "PEDAGOGICAL_PREREQUISITE"}:
                    claim_id = "GOLD-M01-TOPIC-PREREQUISITE"
                    verif = {
                        "curriculum_source_standard": "AR-MATH-G8-1.2.5",
                        "empirical_evaluation_id": "EMP-BKT-SHADOW-2026",
                        "details": "Verified"
                    }
                elif c_type in {"CURRICULUM_SEQUENCE", "PEDAGOGICAL_SUPPORT", "CROSS_SUBJECT_SYNERGY"}:
                    claim_id = "GOLD-M01-TOPIC-PREREQUISITE"
                    verif = {
                        "curriculum_source_standard": "AR-MATH-G8-1.2.5",
                        "details": "Verified"
                    }
                elif c_type == "TASK_PREREQUISITE":
                    claim_id = "GOLD-M01-FACTORING-METHOD"
                    verif = {
                        "formal_proof_id": "CAS-M01-FACT-01",
                        "details": "Verified"
                    }
                elif c_type == "EMPIRICAL_ASSOCIATION":
                    claim_id = "GOLD-M01-TOPIC-PREREQUISITE"
                    verif = {
                        "empirical_evaluation_id": "EMP-BKT-SHADOW-2026",
                        "details": "Verified"
                    }
                else:
                    claim_id = "GOLD-M01-TOPIC-PREREQUISITE"
                    verif = {"details": "Default verification"}

                scope_str = "Task: Specific quadratic factoring operation in Q[x]" if c_type == "TASK_PREREQUISITE" else "Standard verified operational domain for test evaluation"
                record = {
                    "claim_id": claim_id,
                    "claim_type": c_type,
                    "scope": scope_str,
                    "method": "Formal algorithm verification pathway",
                    "verification": verif,
                    "evidence_status": ev_status,
                    "prerequisite_status": prereq_status,
                    "limitations": "Scope is strictly limited to verified parameter space"
                }
                self.assertTrue(validate_acceptance_contract(record))

        # Guard P0: Missing formal_proof_id in algorithmic claim raises AcceptanceContractViolation
        missing_proof_attack = {
            "claim_id": "GOLD-M01-ALG-COUNTEREXAMPLE",
            "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
            "scope": "Standard verified operational domain for test evaluation",
            "method": "Formal algorithm verification pathway",
            "verification": {"arbitrary_text": "omitted formal_proof_id"},
            "evidence_status": "COUNTEREXAMPLE_VERIFIED",
            "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(missing_proof_attack)

        # Guard P0: Missing curriculum_source_standard in pedagogical claim raises AcceptanceContractViolation
        missing_curriculum_attack = {
            "claim_id": "GOLD-M01-TOPIC-PREREQUISITE",
            "claim_type": "PEDAGOGICAL_CURRICULUM_PREREQUISITE",
            "scope": "Standard verified operational domain for test evaluation",
            "method": "Formal algorithm verification pathway",
            "verification": {"empirical_evaluation_id": "EMP-BKT-SHADOW-2026"},
            "evidence_status": "INCONCLUSIVE_MODEL_INCOMPLETE",
            "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(missing_curriculum_attack)

        # Guard K1: Pedagogical claim cannot accept REFUTED_BY_COUNTEREXAMPLE
        ped_k1_attack = {
            "claim_id": "GOLD-M01-TOPIC-PREREQUISITE",
            "claim_type": "PEDAGOGICAL_CURRICULUM_PREREQUISITE",
            "scope": "Curriculum topic prerequisite dependency evaluation",
            "method": "Algorithmic CAS counterexample deduction",
            "verification": {
                "curriculum_source_standard": "AR-MATH-G8-1.2.5",
                "empirical_evaluation_id": "EMP-BKT-SHADOW-2026"
            },
            "evidence_status": "REFUTED_BY_COUNTEREXAMPLE",
            "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(ped_k1_attack)

        # Guard K2: Scoped candidate pending completeness cannot be refuted
        scoped_k2_attack = {
            "claim_id": "GOLD-M01-ALG-COUNTEREXAMPLE",
            "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
            "scope": "Standard verified operational domain for test evaluation",
            "method": "Formal algorithm verification pathway",
            "verification": {"formal_proof_id": "CAS-M01-DISC-01"},
            "evidence_status": "REFUTED_BY_COUNTEREXAMPLE",
            "prerequisite_status": "SCOPED_CANDIDATE_PENDING_MODEL_COMPLETENESS",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(scoped_k2_attack)

        # Guard P0: STRICT_NECESSITY_PROVEN is strictly prohibited for pedagogical curriculum claims
        ped_p0_frozen_attack = {
            "claim_id": "GOLD-M01-TOPIC-PREREQUISITE",
            "claim_type": "PEDAGOGICAL_CURRICULUM_PREREQUISITE",
            "scope": "Curriculum topic prerequisite dependency evaluation",
            "method": "Attempting to claim strict necessity without real cohort data",
            "verification": {
                "curriculum_source_standard": "AR-MATH-G8-1.2.5",
                "empirical_evaluation_id": "EMP-BKT-SHADOW-2026"
            },
            "evidence_status": "NECESSITY_PROVEN_WITHIN_FORMAL_MODEL",
            "prerequisite_status": "STRICT_NECESSITY_PROVEN",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(ped_p0_frozen_attack)

        # Guard K5-A: Unregistered proof artifact ID is rejected by validator
        unreg_proof_attack = {
            "claim_id": "GOLD-M01-ALG-COUNTEREXAMPLE",
            "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
            "scope": "Standard verified operational domain for test evaluation",
            "method": "Formal algorithm verification pathway",
            "verification": {
                "formal_proof_id": "CAS-FAKE-NONEXISTENT-99"
            },
            "evidence_status": "COUNTEREXAMPLE_VERIFIED",
            "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(unreg_proof_attack)

        # Guard K5-B: Artifact alignment mismatch is rejected
        misaligned_artifact_attack = {
            "claim_id": "GOLD-M02-ALG-PARABOLA-COUNTEREXAMPLE",
            "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
            "scope": "Standard verified operational domain for test evaluation",
            "method": "Formal algorithm verification pathway",
            "verification": {
                "formal_proof_id": "CAS-M01-DISC-01"  # Belongs to GOLD-M01-ALG-COUNTEREXAMPLE
            },
            "evidence_status": "COUNTEREXAMPLE_VERIFIED",
            "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
            "limitations": "Scope is strictly limited to verified parameter space"
        }
        with self.assertRaises(AcceptanceContractViolation):
            validate_acceptance_contract(misaligned_artifact_attack)

    # ==========================================================================
    # LEVEL 3: M01 Real Root Boundaries & Factoring Completeness (K4)
    # ==========================================================================
    def test_03_gold_m01_real_roots_and_factoring_boundaries(self):
        """GOLD-M01: Real root boundaries and complete root verification of factoring."""
        x = sp.Symbol('x', real=True)

        # Case A: Positive D (two distinct real roots)
        res_pos = execute_discriminant_pathway(x**2 - 5*x + 6, x)
        self.assertTrue(res_pos["real_roots_exist"])
        self.assertEqual(res_pos["discriminant_category"], "POSITIVE_D")
        self.assertEqual(res_pos["algebraic_status"], "ALGEBRAIC_VERIFICATION_PASSED")
        self.assertEqual(res_pos["counterexample_adjudication"], "CONFIRMED_ALGORITHMIC_COUNTEREXAMPLE")

        # Case B: Zero D (single repeated real root)
        res_zero = execute_discriminant_pathway((x - 3)**2, x)
        self.assertTrue(res_zero["real_roots_exist"])
        self.assertEqual(res_zero["discriminant_category"], "ZERO_D")
        self.assertEqual(len(res_zero["roots_found"]), 1)
        self.assertEqual(res_zero["algebraic_status"], "ALGEBRAIC_VERIFICATION_PASSED")

        # Test Case B-2: Factoring completeness for repeated root D=0 (Problem K2, K4)
        res_fact_rep = execute_factoring_pathway((x - 3)**2, x)
        self.assertEqual(res_fact_rep["status"], "METHOD_DEPENDENCY_DECLARED")
        self.assertTrue(res_fact_rep["invokes_linear_equation_solver"])
        self.assertTrue(res_fact_rep["roots_verified"])
        self.assertTrue(res_fact_rep["roots_complete"])
        self.assertEqual(set(res_fact_rep["roots_found"]), {"3"})
        self.assertEqual(len(res_fact_rep["roots_found"]), 2)

        # Case C: Negative D (x^2 + 1 = 0, no real roots in R, exactly 2 complex roots in C)
        res_neg = execute_discriminant_pathway(x**2 + 1, x)
        self.assertFalse(res_neg["real_roots_exist"])
        self.assertEqual(res_neg["real_roots_found"], [])
        self.assertTrue(res_neg["complex_roots_exist"])
        self.assertEqual(len(res_neg["complex_roots_found"]), 2)
        self.assertEqual(res_neg["discriminant_category"], "NEGATIVE_D")
        self.assertEqual(res_neg["algebraic_status"], "NO_REAL_ROOTS_D_NEGATIVE")
        self.assertTrue(res_neg["complex_completeness_proven"])
        self.assertEqual(res_neg["counterexample_adjudication"], "INAPPLICABLE_NO_REAL_SOLUTION")

        # Case D: Factoring pathway on non-factorable quadratic over Q
        res_fact_prime = execute_factoring_pathway(x**2 - 2, x)
        self.assertEqual(res_fact_prime["status"], "METHOD_INAPPLICABLE_CANNOT_FACTOR_OVER_RATIONALS")
        self.assertFalse(res_fact_prime["invokes_linear_equation_solver"])

        # Case E: Factoring pathway on factorable quadratic with completeness verification (K4)
        res_fact_ok = execute_factoring_pathway(x**2 - 5*x + 6, x)
        self.assertEqual(res_fact_ok["status"], "METHOD_DEPENDENCY_DECLARED")
        self.assertTrue(res_fact_ok["invokes_linear_equation_solver"])
        self.assertTrue(res_fact_ok["roots_verified"])
        self.assertTrue(res_fact_ok["roots_complete"])
        self.assertEqual(set(res_fact_ok["roots_found"]), {"2", "3"})

    # ==========================================================================
    # LEVEL 4: M02 Exact Arithmetic, Radicals & Boundary Invariants (K3, P1)
    # ==========================================================================
    def test_04_gold_m02_exact_arithmetic_and_indeterminate_guards(self):
        """GOLD-M02: Rejects inexact floats, unsupported operators, handles exact radicals and 24 combinations."""
        x = sp.Symbol('x', real=True)

        # 1. Float rejection: inexact float coefficients must raise InputContractViolation
        with self.assertRaises(ValueError):
            solve_via_interval_method(1.5 * x**2 - 3*x + 1, x)
        with self.assertRaises(ValueError):
            solve_via_parabola_method(1.5 * x**2 - 3*x + 1, x)

        # 1b. Unsupported operator rejection (Problem P1):
        for bad_op in ["!=", "==", "~=", "INVALID", "", None]:
            with self.assertRaises(ValueError):
                solve_via_interval_method(x**2 - 5*x + 6, x, bad_op)
            with self.assertRaises(ValueError):
                solve_via_parabola_method(x**2 - 5*x + 6, x, bad_op)

        # 2. Exact rational coefficients pass cleanly
        exact_expr = sp.Rational(3, 2) * x**2 - 3*x + 1
        sol_int, _, _ = solve_via_interval_method(exact_expr, x, ">")
        sol_par, _ = solve_via_parabola_method(exact_expr, x, ">")
        gt = sp.solve_univariate_inequality(exact_expr > 0, x, relational=False)
        self.assertEqual(sol_int, gt)
        self.assertEqual(sol_par, gt)

        # 3. Exact radical algebraic numbers (K3: x^2 - 2 > 0 with roots +-sqrt(2))
        radical_expr = x**2 - 2
        sol_int_rad, _, _ = solve_via_interval_method(radical_expr, x, ">")
        sol_par_rad, _ = solve_via_parabola_method(radical_expr, x, ">")
        gt_rad = sp.solve_univariate_inequality(radical_expr > 0, x, relational=False)
        self.assertEqual(sol_int_rad, gt_rad)
        self.assertEqual(sol_par_rad, gt_rad)

        # 4. Exhaustive 24-case parametric benchmark matrix (Problem P1):
        # 3 discriminant categories x 2 concavity directions x 4 operators = 24 combinations
        base_polynomials = [
            x**2 - 5*x + 6,   # D > 0, a > 0
            -x**2 + 5*x - 6,  # D > 0, a < 0
            (x - 2)**2,       # D = 0, a > 0
            -(x - 2)**2,      # D = 0, a < 0
            x**2 + 1,         # D < 0, a > 0
            -x**2 - 1         # D < 0, a < 0
        ]
        operators = [">", ">=", "<", "<="]
        test_cases_24 = [(poly, op) for poly in base_polynomials for op in operators]
        self.assertEqual(len(test_cases_24), 24, "Must contain exactly 24 parametric combinations!")

        for expr, op in test_cases_24:
            s_int, _, _ = solve_via_interval_method(expr, x, op)
            s_par, _ = solve_via_parabola_method(expr, x, op)
            if op == ">":
                gt = sp.solve_univariate_inequality(expr > 0, x, relational=False)
            elif op == ">=":
                gt = sp.solve_univariate_inequality(expr >= 0, x, relational=False)
            elif op == "<":
                gt = sp.solve_univariate_inequality(expr < 0, x, relational=False)
            elif op == "<=":
                gt = sp.solve_univariate_inequality(expr <= 0, x, relational=False)
            self.assertEqual(s_int, gt, f"Interval solver mismatch on {expr} {op} 0")
            self.assertEqual(s_par, gt, f"Parabola solver mismatch on {expr} {op} 0")
            self.assertEqual(s_int, s_par, f"Dual solver discrepancy on {expr} {op} 0")

        # 5. Indeterminate discriminant sign rejection (Problem K3)
        k_sym = sp.Symbol('k', real=True)
        indeterminate_poly = x**2 + k_sym * x + 1
        with self.assertRaises(ValueError):
            solve_via_interval_method(indeterminate_poly, x, ">")
        with self.assertRaises(ValueError):
            solve_via_parabola_method(indeterminate_poly, x, ">")

    # ==========================================================================
    # LEVEL 5: P02 Physics Zero-Acceleration Guards & Deceleration (K5)
    # ==========================================================================
    def test_05_gold_p02_physics_deceleration_and_spec(self):
        """GOLD-P02: Verifies work-energy theorem, deceleration, and a != 0 guard."""
        m = sp.Symbol('m', real=True, positive=True)
        v = sp.Symbol('v', real=True)
        v0 = sp.Symbol('v0', real=True)

        # Test A: General non-zero acceleration
        a_gen = sp.Symbol('a', real=True, nonzero=True)
        res_gen = verify_physics_work_energy_identity(m, v, v0, a_gen)
        self.assertTrue(res_gen["identity_holds"])

        # Test B: Deceleration (a = -3)
        a_neg = sp.Integer(-3)
        res_neg = verify_physics_work_energy_identity(m, v, v0, a_neg)
        self.assertTrue(res_neg["identity_holds"])

        # Test C: Zero Acceleration Guard (K5)
        with self.assertRaises(ValueError):
            verify_physics_work_energy_identity(m, v, v0, 0)
        with self.assertRaises(ValueError):
            verify_physics_work_energy_identity(m, v, v0, sp.Integer(0))

        # Test D: Non-positive mass guard
        with self.assertRaises(ValueError):
            verify_physics_work_energy_identity(0, v, v0, a_gen)

        # Test E: Indeterminate mass guard (generic Symbol without positive=True) (Problem K4)
        m_generic = sp.Symbol('m', real=True)
        with self.assertRaises(ValueError):
            verify_physics_work_energy_identity(m_generic, v, v0, a_gen)

        # Test F: Indeterminate acceleration guard (generic Symbol without nonzero=True) (Problem K4)
        a_generic = sp.Symbol('a', real=True)
        with self.assertRaises(ValueError):
            verify_physics_work_energy_identity(m, v, v0, a_generic)

    # ==========================================================================
    # LEVEL 6: Multi-Contract Report Conformance
    # ==========================================================================
    def test_06_report_multi_contract_conformance(self):
        """Verifies that all 3 generated reports contain valid multi-contracts."""
        for p in [self.p_m01, self.p_m02, self.p_p02]:
            self.assertTrue(os.path.exists(p), f"Report {p} was not generated.")
            with open(p, "r", encoding="utf-8") as f:
                d = json.load(f)
            # Main contract passes validation
            self.assertTrue(validate_acceptance_contract(d["acceptance_contract"]))
            # All sub-contracts pass validation
            for c in d.get("acceptance_contracts_all", []):
                self.assertTrue(validate_acceptance_contract(c))

    # ==========================================================================
    # LEVEL 7: Production Freeze, Staging Integrity & Zero Active Gold (K6)
    # ==========================================================================
    def test_07_production_freeze_and_staging_integrity(self):
        """Verifies candidate staging non-emptiness, git status, and active gold rule invariants."""
        # 1. Mandatory candidate staging non-empty validation (Problem K6)
        staging_path = "reports/offline_candidate_staging.json"
        self.assertTrue(os.path.exists(staging_path), "Mandatory offline candidate staging file is missing!")
        with open(staging_path, "r", encoding="utf-8") as f:
            staging_data = json.load(f)
        
        candidates = staging_data.get("staged_candidates") or staging_data.get("candidates")
        self.assertIsNotNone(candidates, "Staged candidates field missing!")
        self.assertGreater(len(candidates), 0, "Staged candidates list must not be empty!")
        
        for c in candidates:
            self.assertEqual(c.get("production_status"), "INACTIVE", f"Active candidate leaked in staging: {c}")

        self.assertEqual(staging_data.get("new_active_gold_added"), 0, "NEW_ACTIVE_GOLD must be strictly 0!")
        self.assertEqual(staging_data.get("active_gold_rules_count"), 21, "Active gold rules count must be exactly 21!")
        self.assertTrue(staging_data.get("production_frozen"), "Production must be frozen!")

        # 2. Immutable Gold Manifest SHA-256 and rule count
        manifest_path = "data/ontology/gold_manifest_21.json"
        self.assertTrue(os.path.exists(manifest_path))
        with open(manifest_path, "rb") as f:
            manifest_bytes = f.read()
            sha = hashlib.sha256(manifest_bytes).hexdigest()
        self.assertEqual(sha, "8c31c256dd0730070e4f762abf510eefebcf9d773f999ed27a8bf37cc130ab51")
        
        manifest_obj = json.loads(manifest_bytes.decode("utf-8"))
        canonical_rules = manifest_obj.get("canonical_rules", [])
        self.assertEqual(len(canonical_rules), 21)
        self.assertEqual(manifest_obj.get("total_active_gold"), 21)

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
        manifest_rule_ids = {r["rule_id"] for r in canonical_rules}
        self.assertEqual(manifest_rule_ids, EXPECTED_21_GOLD_RULE_IDS, "Active rule IDs mismatch from ratified 21 set!")

        # Policy Engine manifest integrity check
        from scripts.kag_policy_engine import KAGPolicyDecisionEngine
        KAGPolicyDecisionEngine.verify_manifest_integrity(manifest_path)

        # Disjointness between staged candidates and ratified 21 active gold rules
        staged_candidate_ids = {c["candidate_id"] for c in candidates}
        self.assertTrue(
            staged_candidate_ids.isdisjoint(EXPECTED_21_GOLD_RULE_IDS),
            f"Staged candidate IDs overlap with active gold rules: {staged_candidate_ids & EXPECTED_21_GOLD_RULE_IDS}"
        )

        # 3. Production git diff is strictly 0 bytes
        res = subprocess.run(
            ["git", "diff", "HEAD", "--", "lib/runtime-kag-guard.ts", "data/grades/"],
            capture_output=True,
            text=True
        )
        self.assertEqual(res.returncode, 0)
        self.assertEqual(res.stdout.strip(), "", "Production code was unexpectedly modified!")

        # 4. Git status inspection: No production files in lib/ or data/grades/ modified or added (Problem K6)
        status_res = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        )
        self.assertEqual(status_res.returncode, 0)
        for line in status_res.stdout.splitlines():
            line = line.strip()
            if not line:
                continue
            path = line.split()[-1]
            # Ensure no live production code directory is touched
            self.assertFalse(path.startswith("lib/"), f"Production file modified or created: {path}")
            self.assertFalse(path.startswith("data/grades/"), f"Production grades file modified or created: {path}")

        # 5. Direct Live Runtime Guard Inspection (Problem K6):
        # Verify directly from lib/runtime-kag-guard.ts that zero staged candidates leaked into production runtime
        runtime_path = "lib/runtime-kag-guard.ts"
        self.assertTrue(os.path.exists(runtime_path))
        with open(runtime_path, "r", encoding="utf-8") as f:
            runtime_content = f.read()

        for c in candidates:
            cid = c.get("candidate_id")
            self.assertNotIn(cid, runtime_content, f"Staged candidate ID '{cid}' leaked into live production runtime!")

if __name__ == "__main__":
    unittest.main()
