import os
import json
import sys
import sympy as sp

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    from scripts.kag_formal_acceptance_contract import validate_acceptance_contract
except ImportError:
    from kag_formal_acceptance_contract import validate_acceptance_contract

# ==============================================================================
# METHOD 1: Discriminant Formula (Closed-form Evaluation)
# ==============================================================================
def execute_discriminant_pathway(expression, var):
    """
    Solves ax^2 + bx + c = 0 via quadratic radical formula over Real numbers R.
    Explicitly discriminates between D > 0, D = 0, and D < 0.
    Verifies roots by algebraic substitution and checks if linear solver was invoked.
    """
    p = expression.as_poly(var)
    if p is None or p.degree() != 2 or p.all_coeffs()[0] == 0:
        raise ValueError("InputContractViolation: Expression must be a quadratic polynomial of degree 2 with a != 0.")
    for coeff in p.all_coeffs():
        if not (coeff.is_number and coeff.is_real):
            raise ValueError(f"InputContractViolation: Non-numeric or non-real coefficient '{coeff}' detected.")

    coeffs = p.all_coeffs()
    a, b, c = coeffs[0], coeffs[1], coeffs[2]
    
    D = b**2 - 4*a*c

    if D < 0:
        # In R, no real roots exist. In C, by the Fundamental Theorem of Algebra (FTA),
        # there exist exactly two complex conjugate roots: (-b +- i*sqrt(|D|)) / (2*a).
        r1_c = (-b - sp.I * sp.sqrt(-D)) / (2*a)
        r2_c = (-b + sp.I * sp.sqrt(-D)) / (2*a)
        return {
            "method_name": "QUADRATIC_FORMULA_DISCRIMINANT",
            "discriminant": str(D),
            "discriminant_category": "NEGATIVE_D",
            "real_roots_exist": False,
            "real_roots_found": [],
            "complex_roots_exist": True,
            "complex_roots_found": [str(r1_c), str(r2_c)],
            "roots_found": [],
            "algebraic_verification_passed": False,
            "algebraic_status": "NO_REAL_ROOTS_D_NEGATIVE",
            "complex_completeness_proven": True,
            "invokes_linear_equation_solver": False,
            "counterexample_adjudication": "INAPPLICABLE_NO_REAL_SOLUTION"
        }
    elif D == 0:
        r = -b / (2*a)
        roots = [r]
    else: # D > 0
        r1 = (-b - sp.sqrt(D)) / (2*a)
        r2 = (-b + sp.sqrt(D)) / (2*a)
        roots = [r1, r2]

    # Symbolic algebraic check: Does substituting roots into polynomial yield 0?
    all_roots_valid = all(sp.simplify(expression.subs(var, r)) == 0 for r in roots)
    if not all_roots_valid:
        raise RuntimeError("Discriminant roots failed algebraic verification!")
        
    algebraic_status = "ALGEBRAIC_VERIFICATION_PASSED"
    return {
        "method_name": "QUADRATIC_FORMULA_DISCRIMINANT",
        "discriminant": str(D),
        "discriminant_category": "ZERO_D" if D == 0 else "POSITIVE_D",
        "real_roots_exist": True,
        "roots_found": [str(r) for r in roots],
        "algebraic_verification_passed": True,
        "algebraic_status": algebraic_status,
        "invokes_linear_equation_solver": False,
        "counterexample_adjudication": "CONFIRMED_ALGORITHMIC_COUNTEREXAMPLE",
        "counterexample_status": "COUNTEREXAMPLE_VERIFIED",
        "status": algebraic_status
    }

# ==============================================================================
# METHOD 2: Factoring & Zero Product Property
# ==============================================================================
def execute_factoring_pathway(expression, var):
    """
    Attempts to factor ax^2 + bx + c over Rationals into linear components.
    Declares scope boundary when factoring is inapplicable.
    """
    p = expression.as_poly(var)
    if p is None or p.degree() != 2 or p.all_coeffs()[0] == 0:
        raise ValueError("InputContractViolation: Expression must be a quadratic polynomial of degree 2 with a != 0.")
    for coeff in p.all_coeffs():
        if not (coeff.is_number and coeff.is_real):
            raise ValueError(f"InputContractViolation: Non-numeric or non-real coefficient '{coeff}' detected.")

    factored = sp.factor(expression)
    coeff_const, factor_pairs = sp.factor_list(expression)
    linear_factors = []
    for base, mult in factor_pairs:
        bp = base.as_poly(var)
        if bp is not None and bp.degree() == 1:
            for _ in range(mult):
                linear_factors.append(base)
    
    # If expression cannot be factored into linear terms over rationals
    if len(linear_factors) < 2:
        return {
            "method_name": "FACTORING_AND_ZERO_PRODUCT",
            "factored_expression": str(factored),
            "linear_factors_extracted": [],
            "linear_equations_solved": [],
            "roots_found": [],
            "invokes_linear_equation_solver": False,
            "status": "METHOD_INAPPLICABLE_CANNOT_FACTOR_OVER_RATIONALS"
        }

    roots_from_linear = []
    for lf in linear_factors:
        sol = sp.solve(lf, var)
        roots_from_linear.extend(sol)

    # Formal Root Verification & Analytical Completeness Proof (Problem K2)
    verified_roots = []
    for r in roots_from_linear:
        val = sp.simplify(expression.subs(var, r))
        if val != 0:
            raise RuntimeError(f"Factoring verification failure: Root {r} evaluated to {val} != 0 in {expression}")
        verified_roots.append(r)

    # Completeness Proof via Polynomial Reconstruction & Fundamental Theorem of Algebra:
    # If degree is 2:
    #   Case A (D > 0): 2 distinct roots r1, r2 such that a*(x - r1)*(x - r2) == P(x).
    #   Case B (D = 0): 1 repeated root r0 (multiplicity 2) such that a*(x - r0)^2 == P(x).
    # By FTA, P(x) has exactly 2 roots in C counted with multiplicity; matching reconstruction proves completeness.
    a_lead = p.all_coeffs()[0]
    distinct_roots = list(set(verified_roots))
    if len(distinct_roots) == 2:
        r1, r2 = distinct_roots[0], distinct_roots[1]
        reconstructed = sp.simplify(a_lead * (var - r1) * (var - r2))
        poly_diff = sp.simplify(reconstructed - expression)
        algebraic_completeness_proven = bool(poly_diff == 0)
    elif len(distinct_roots) == 1:
        r0 = distinct_roots[0]
        reconstructed = sp.simplify(a_lead * (var - r0)**2)
        poly_diff = sp.simplify(reconstructed - expression)
        algebraic_completeness_proven = bool(poly_diff == 0)
    else:
        algebraic_completeness_proven = False

    return {
        "method_name": "FACTORING_AND_ZERO_PRODUCT",
        "factored_expression": str(factored),
        "linear_factors_extracted": [str(lf) for lf in linear_factors],
        "linear_equations_solved": [f"{lf} = 0" for lf in linear_factors],
        "roots_found": [str(r) for r in verified_roots],
        "roots_verified": True,
        "roots_complete": algebraic_completeness_proven,
        "algebraic_completeness_proof": "FTA_POLYNOMIAL_RECONSTRUCTION_IDENTITY: a*(x-r1)*(x-r2) == P(x)",
        "invokes_linear_equation_solver": True,
        "status": "METHOD_DEPENDENCY_DECLARED"
    }

# ==============================================================================
# Stage 4 Automated Pipeline Execution
# ==============================================================================
def run_m01_pipeline():
    x = sp.Symbol('x', real=True)
    poly = x**2 - 5*x + 6

    res_disc = execute_discriminant_pathway(poly, x)
    res_fact = execute_factoring_pathway(poly, x)

    # 1. Multi-Contract Separation (Problem A11, K2, K5)
    contract_algorithmic = {
        "claim_id": "GOLD-M01-ALG-COUNTEREXAMPLE",
        "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
        "scope": "Univariate quadratic equations ax^2 + bx + c = 0 with real numeric a != 0 and D >= 0",
        "method": "Closed-form Quadratic Formula pathway comparison vs linear solver requirement",
        "verification": {
            "formal_proof_id": "CAS-M01-DISC-01",
            "details": "Exact symbolic CAS root substitution P(r) == 0 without invoking linear equation solving"
        },
        "evidence_status": "COUNTEREXAMPLE_VERIFIED",
        "prerequisite_status": "REJECTED_ALTERNATIVE_PATHWAY_EXISTS",
        "limitations": "Refutes the universal claim that every quadratic solution algorithm must invoke a linear solver."
    }
    validate_acceptance_contract(contract_algorithmic)

    contract_factoring = {
        "claim_id": "GOLD-M01-FACTORING-METHOD",
        "claim_type": "METHOD_OPERATIONAL_DEPENDENCY",
        "scope": "Factoring and Zero Product Property method on factorable quadratics in Q[x]",
        "method": "Linear factor extraction and zero-product linear equation solving",
        "verification": {
            "formal_proof_id": "CAS-M01-FACT-01",
            "details": "Linear factor decomposition over Q[x], zero-product solving, root substitution, and FTA polynomial reconstruction a*(x-r1)*(x-r2) == P(x)"
        },
        "evidence_status": "METHOD_DEPENDENCY_DECLARED",
        "prerequisite_status": "METHOD_DEPENDENCY_ONLY",
        "limitations": "Applies strictly to factoring method; inapplicable to non-factorable quadratics."
    }
    validate_acceptance_contract(contract_factoring)

    contract_topic = {
        "claim_id": "GOLD-M01-TOPIC-PREREQUISITE",
        "claim_type": "PEDAGOGICAL_CURRICULUM_PREREQUISITE",
        "scope": "Secondary mathematics curriculum grade 7 (Linear Equations) to grade 8 (Quadratic Equations)",
        "method": "Tripartite synthesis of formal proof, curriculum standards, and empirical data",
        "verification": {
            "curriculum_source_standard": "AR-MATH-G8-1.2.5",
            "empirical_evaluation_id": "EMP-BKT-SHADOW-2026",
            "details": "Algorithmic alternative (quadratic formula) demonstrates multiple CAS solution paths, but pedagogical scaffolding across general student cohort remains unproven without empirical student trajectory data."
        },
        "evidence_status": "INCONCLUSIVE_MODEL_INCOMPLETE",
        "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
        "limitations": "Topic-level necessity across general quadratics remains unproven; curriculum sequence does not equal strict necessity."
    }
    validate_acceptance_contract(contract_topic)

    channel_1_formal = {
        "channel_name": "FORMAL_PROOF_CHANNEL",
        "target_claim_universal": "STRICT_NECESSITY(Xətti_tənlik -> Kvadrat_tənlik)",
        "exemplar_tested": "x^2 - 5*x + 6 = 0",
        "pathways_executed": [res_disc, res_fact],
        "universal_verdict": "REFUTED_BY_COUNTEREXAMPLE",
        "contracts": [contract_algorithmic, contract_factoring, contract_topic]
    }

    channel_2_curriculum = {
        "channel_name": "CURRICULUM_PROOF_CHANNEL",
        "source_standard": "Riyaziyyat 7: Məzmun Standartı 1.2.4: Xətti tənliklər",
        "target_standard": "Riyaziyyat 8: Məzmun Standartı 1.2.5: Kvadrat tənliklər",
        "curriculum_verdict": "CURRICULUM_SUPPORTED",
        "curriculum_relation_type": "CURRICULUM_SEQUENCE (NOT_STRICT_PREREQUISITE)"
    }

    channel_3_empirical = {
        "channel_name": "EMPIRICAL_PROOF_CHANNEL",
        "bkt_item_response_status": "INSUFFICIENT_REAL_STUDENT_DATA_SHADOW_ONLY",
        "empirical_verdict": "DATA_COLLECTION_PENDING"
    }

    prototype_decision = {
        "rule_id": "GOLD-M01",
        "source_concept": "Xətti tənlik (math_anlayis_ikideyisenli_xetti_tenlik)",
        "target_concept": "Kvadrat tənlik (math_anlayis_kvadrat_tenlik)",
        "tripartite_synthesis": {
            "channel_1_formal": channel_1_formal["universal_verdict"],
            "channel_2_curriculum": channel_2_curriculum["curriculum_verdict"],
            "channel_3_empirical": channel_3_empirical["empirical_verdict"]
        },
        "silver_graph_placement_decision": "REGISTERED_AS_SCOPED_ONLY",
        "active_production_remediation": "BLOCKED_FOR_GENERAL_QUADRATICS_ALLOWED_FOR_FACTORING_ONLY"
    }

    os.makedirs("reports", exist_ok=True)
    out_path = "reports/prototype_proof_engine_gold_m01.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "target_rule": "GOLD-M01",
            "acceptance_contract": contract_topic,
            "acceptance_contracts_all": [contract_algorithmic, contract_factoring, contract_topic],
            "channel_1_formal_proof": channel_1_formal,
            "channel_2_curriculum_proof": channel_2_curriculum,
            "channel_3_empirical_proof": channel_3_empirical,
            "prototype_decision": prototype_decision
        }, f, ensure_ascii=False, indent=2)

    return out_path

if __name__ == "__main__":
    p = run_m01_pipeline()
    print(f"GOLD-M01 verified prototype saved to {p}")
