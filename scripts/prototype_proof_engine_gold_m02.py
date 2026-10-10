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
# ALGORITHM 1: Generalized Interval Method (İntervallar metodu)
# ==============================================================================
def solve_via_interval_method(poly_expr, var, op_str=">"):
    """
    Solves univariate quadratic inequalities using sign evaluation across open intervals.
    Rejects imprecise floating-point representations and handles indeterminate realness.
    """
    p = poly_expr.as_poly(var)
    if p is None or p.degree() != 2 or p.all_coeffs()[0] == 0:
        raise ValueError("InputContractViolation: Expression must be a univariate quadratic polynomial of degree 2 with a != 0.")
    
    if op_str not in (">", ">=", "<", "<="):
        raise ValueError(f"InputContractViolation: Unsupported inequality operator '{op_str}'. Supported operators are '>', '>=', '<', '<='.")
    
    for coeff in p.all_coeffs():
        if isinstance(coeff, float) or isinstance(coeff, sp.Float):
            raise ValueError("InputContractViolation: Inexact float coefficients are prohibited. Use exact integers, sp.Rational, or exact algebraic numbers.")
        if not (coeff.is_number and coeff.is_real and coeff.is_algebraic):
            raise ValueError(f"InputContractViolation: Non-numeric, non-real, or non-algebraic coefficient '{coeff}' detected.")

    coeffs = p.all_coeffs()
    a, b, c = coeffs[0], coeffs[1], coeffs[2]
    D = b**2 - 4*a*c

    # Check for indeterminate discriminant sign (Problem K3)
    try:
        _ = bool(D > 0)
        _ = bool(D == 0)
    except Exception:
        raise ValueError("IndeterminateDiscriminantSign: Discriminant sign cannot be determined deterministically.")
    if D.is_positive is None and D.is_negative is None and D.is_zero is None:
        raise ValueError("IndeterminateDiscriminantSign: Discriminant sign cannot be determined deterministically.")

    roots_set = sp.solve(poly_expr, var)
    
    # Check for indeterminate realness (Problem B4)
    for r in roots_set:
        if r.is_real is None:
            raise ValueError("IndeterminateRootRealness: Root realness cannot be verified deterministically.")
            
    real_roots = sorted([r for r in roots_set if r.is_real])

    # Formal Root Verification & Analytical Completeness Check via FTA (Problem K3)
    for r in real_roots:
        root_eval = sp.simplify(poly_expr.subs(var, r))
        if root_eval != 0:
            raise RuntimeError(f"Interval method root verification failed: {r} evaluated to {root_eval} != 0 in {poly_expr}")

    expected_real_count = 2 if D > 0 else (1 if D == 0 else 0)
    if len(real_roots) != expected_real_count:
        raise RuntimeError(f"Root Completeness Mismatch: Found {len(real_roots)} roots, expected {expected_real_count} by FTA for D={D}")
    
    if len(real_roots) == 0:
        cand_intervals = [(sp.Interval.open(sp.S.NegativeInfinity, sp.S.Infinity), sp.Integer(0))]
    elif len(real_roots) == 1:
        r = real_roots[0]
        cand_intervals = [
            (sp.Interval.open(sp.S.NegativeInfinity, r), r - 1),
            (sp.Interval.open(r, sp.S.Infinity), r + 1)
        ]
    else:
        cand_intervals = [(sp.Interval.open(sp.S.NegativeInfinity, real_roots[0]), real_roots[0] - 1)]
        for i in range(len(real_roots) - 1):
            mid = (real_roots[i] + real_roots[i+1]) / 2
            cand_intervals.append((sp.Interval.open(real_roots[i], real_roots[i+1]), mid))
        cand_intervals.append((sp.Interval.open(real_roots[-1], sp.S.Infinity), real_roots[-1] + 1))
        
    valid_subsets = []
    sampling_log = []
    
    for int_obj, test_pt in cand_intervals:
        val = poly_expr.subs(var, test_pt)
        if op_str == ">":
            is_valid = bool(val > 0)
        elif op_str == ">=":
            is_valid = bool(val >= 0)
        elif op_str == "<":
            is_valid = bool(val < 0)
        elif op_str == "<=":
            is_valid = bool(val <= 0)
            
        sampling_log.append({
            "interval": str(int_obj),
            "test_point": str(test_pt),
            "evaluated_value": str(val),
            "is_valid": is_valid
        })
        if is_valid:
            valid_subsets.append(int_obj)
            
    if op_str in (">=", "<="):
        for r in real_roots:
            valid_subsets.append(sp.FiniteSet(r))
            
    if not valid_subsets:
        solution_set = sp.EmptySet
    else:
        solution_set = sp.Union(*valid_subsets)
        
    return solution_set, real_roots, sampling_log

# ==============================================================================
# ALGORITHM 2: Generalized Parabola Method (Həndəsi / Qrafik üsul)
# ==============================================================================
def solve_via_parabola_method(poly_expr, var, op_str=">"):
    """
    Solves univariate quadratic inequalities using geometric parabola properties.
    Exact closed form across all 8 discriminant, concavity, and operator variations.
    """
    p = poly_expr.as_poly(var)
    if p is None or p.degree() != 2 or p.all_coeffs()[0] == 0:
        raise ValueError("InputContractViolation: Expression must be a univariate quadratic polynomial of degree 2 with a != 0.")
    
    for coeff in p.all_coeffs():
        if isinstance(coeff, float) or isinstance(coeff, sp.Float):
            raise ValueError("InputContractViolation: Inexact float coefficients are prohibited. Use exact integers, sp.Rational, or exact algebraic numbers.")
        if not (coeff.is_number and coeff.is_real and coeff.is_algebraic):
            raise ValueError(f"InputContractViolation: Non-numeric, non-real, or non-algebraic coefficient '{coeff}' detected.")

    if op_str not in (">", ">=", "<", "<="):
        raise ValueError(f"InputContractViolation: Unsupported inequality operator '{op_str}'. Supported operators are '>', '>=', '<', '<='.")

    coeffs = p.all_coeffs()
    a, b, c = coeffs[0], coeffs[1], coeffs[2]
    D = b**2 - 4*a*c

    # Check for indeterminate discriminant sign (Problem K3)
    try:
        _ = bool(D > 0)
        _ = bool(D == 0)
    except Exception:
        raise ValueError("IndeterminateDiscriminantSign: Discriminant sign cannot be determined deterministically.")
    if D.is_positive is None and D.is_negative is None and D.is_zero is None:
        raise ValueError("IndeterminateDiscriminantSign: Discriminant sign cannot be determined deterministically.")

    roots_set = sp.solve(poly_expr, var)
    for r in roots_set:
        if r.is_real is None:
            raise ValueError("IndeterminateRootRealness: Root realness cannot be verified deterministically.")
    
    if D > 0:
        r1 = (-b - sp.sqrt(D)) / (2*a)
        r2 = (-b + sp.sqrt(D)) / (2*a)
        if r1 > r2:
            r1, r2 = r2, r1
            
        if a > 0:
            if op_str == ">":
                solution_set = sp.Union(sp.Interval.open(sp.S.NegativeInfinity, r1), sp.Interval.open(r2, sp.S.Infinity))
            elif op_str == ">=":
                solution_set = sp.Union(sp.Interval(-sp.S.Infinity, r1), sp.Interval(r2, sp.S.Infinity))
            elif op_str == "<":
                solution_set = sp.Interval.open(r1, r2)
            elif op_str == "<=":
                solution_set = sp.Interval(r1, r2)
        else: # a < 0
            if op_str == ">":
                solution_set = sp.Interval.open(r1, r2)
            elif op_str == ">=":
                solution_set = sp.Interval(r1, r2)
            elif op_str == "<":
                solution_set = sp.Union(sp.Interval.open(sp.S.NegativeInfinity, r1), sp.Interval.open(r2, sp.S.Infinity))
            elif op_str == "<=":
                solution_set = sp.Union(sp.Interval(-sp.S.Infinity, r1), sp.Interval(r2, sp.S.Infinity))
    elif D == 0:
        r = -b / (2*a)
        if a > 0:
            if op_str == ">":
                solution_set = sp.Union(sp.Interval.open(sp.S.NegativeInfinity, r), sp.Interval.open(r, sp.S.Infinity))
            elif op_str == ">=":
                solution_set = sp.S.Reals
            elif op_str == "<":
                solution_set = sp.EmptySet
            elif op_str == "<=":
                solution_set = sp.FiniteSet(r)
        else: # a < 0
            if op_str == ">":
                solution_set = sp.EmptySet
            elif op_str == ">=":
                solution_set = sp.FiniteSet(r)
            elif op_str == "<":
                solution_set = sp.Union(sp.Interval.open(sp.S.NegativeInfinity, r), sp.Interval.open(r, sp.S.Infinity))
            elif op_str == "<=":
                solution_set = sp.S.Reals
    else: # D < 0
        if a > 0:
            solution_set = sp.S.Reals if op_str in (">", ">=") else sp.EmptySet
        else: # a < 0
            solution_set = sp.EmptySet if op_str in (">", ">=") else sp.S.Reals
            
    meta = {
        "leading_coeff": str(a),
        "discriminant": str(D),
        "operator": op_str,
        "invokes_interval_sampling": False
    }
    return solution_set, meta

# ==============================================================================
# Stage 4 Automated Pipeline Execution
# ==============================================================================
def run_m02_pipeline():
    x = sp.Symbol('x', real=True)
    base_polynomials = [
        {"name": "D > 0, a > 0", "expr": x**2 - 5*x + 6},
        {"name": "D > 0, a < 0", "expr": -x**2 + 5*x - 6},
        {"name": "D = 0, a > 0", "expr": (x - 2)**2},
        {"name": "D = 0, a < 0", "expr": -(x - 2)**2},
        {"name": "D < 0, a > 0", "expr": x**2 + 1},
        {"name": "D < 0, a < 0", "expr": -x**2 - 1}
    ]
    operators = [">", ">=", "<", "<="]

    test_cases = []
    case_idx = 1
    for p_info in base_polynomials:
        for op in operators:
            test_cases.append({
                "name": f"Case {case_idx}: {p_info['name']} with operator '{op}'",
                "expr": p_info["expr"],
                "op": op
            })
            case_idx += 1
            
    # Include exact radical algebraic number test case
    test_cases.append({
        "name": f"Case {case_idx}: Exact radical Q(sqrt(2)) x^2 - 2 > 0",
        "expr": x**2 - 2,
        "op": ">"
    })

    benchmark_results = []
    all_cases_passed = True

    for case in test_cases:
        e = case["expr"]
        op = case["op"]
        
        if op == ">":
            gt = sp.solve_univariate_inequality(e > 0, x, relational=False)
        elif op == ">=":
            gt = sp.solve_univariate_inequality(e >= 0, x, relational=False)
        elif op == "<":
            gt = sp.solve_univariate_inequality(e < 0, x, relational=False)
        elif op == "<=":
            gt = sp.solve_univariate_inequality(e <= 0, x, relational=False)
            
        int_sol, r_list, s_log = solve_via_interval_method(e, x, op)
        par_sol, p_meta = solve_via_parabola_method(e, x, op)
        
        match_gt_int = bool(int_sol == gt)
        match_gt_par = bool(par_sol == gt)
        match_both = bool(int_sol == par_sol)
        
        passed = match_gt_int and match_gt_par and match_both
        if not passed:
            all_cases_passed = False
            
        benchmark_results.append({
            "case_name": case["name"],
            "expression": str(e),
            "operator": op,
            "ground_truth": str(gt),
            "interval_solution": str(int_sol),
            "parabola_solution": str(par_sol),
            "all_match": passed
        })

    if not all_cases_passed:
        raise RuntimeError("ONE OR MORE EDGE CASES FAILED GENERALIZED SOLVER BENCHMARK!")

    # Multi-Contract Separation (Problem B9, A11, K3, K5)
    contract_quadratic_ineq = {
        "claim_id": "GOLD-M02-ALG-PARABOLA-COUNTEREXAMPLE",
        "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
        "scope": "Univariate quadratic inequalities ax^2 + bx + c {>, >=, <, <=} 0 with exact real algebraic numbers (integers, rationals, square roots) and a != 0",
        "method": "Closed-form Parabola Geometric Method comparison against Interval Sampling Method",
        "verification": {
            "formal_proof_id": "CAS-M02-PARABOLA-01",
            "details": "100% exact symbolic solution set identity across 24-case parametric benchmark matrix with FTA root completeness"
        },
        "evidence_status": "COUNTEREXAMPLE_VERIFIED",
        "prerequisite_status": "REJECTED_ALTERNATIVE_PATHWAY_EXISTS",
        "limitations": "Proves Parabola method is an alternative; refutes that Interval Method is universally necessary for quadratics."
    }
    validate_acceptance_contract(contract_quadratic_ineq)

    contract_interval_scoped = {
        "claim_id": "GOLD-M02-INTERVAL-METHOD-DEPENDENCY",
        "claim_type": "METHOD_OPERATIONAL_DEPENDENCY",
        "scope": "Sign evaluation across real number axis intervals for continuous quadratic polynomials",
        "method": "Interval decomposition, interior point test evaluation, and root completeness verification",
        "verification": {
            "formal_proof_id": "CAS-M02-INTERVAL-01",
            "details": "Exact symbolic verification that interval method produces identical solution sets across 24-case parametric benchmark matrix."
        },
        "evidence_status": "METHOD_DEPENDENCY_DECLARED",
        "prerequisite_status": "METHOD_DEPENDENCY_ONLY",
        "limitations": "Valid for the interval method specifically; does not establish universal necessity for solving quadratic inequalities in general."
    }
    validate_acceptance_contract(contract_interval_scoped)

    contract_topic = {
        "claim_id": "GOLD-M02-TOPIC-PREREQUISITE",
        "claim_type": "PEDAGOGICAL_CURRICULUM_PREREQUISITE",
        "scope": "Secondary mathematics curriculum grade 8 (Number intervals) to grade 9 (Quadratic inequalities)",
        "method": "Tripartite synthesis of formal proof, curriculum standards, and empirical data",
        "verification": {
            "curriculum_source_standard": "AR-MATH-G9-1.2.4",
            "empirical_evaluation_id": "EMP-BKT-SHADOW-2026",
            "details": "Algorithmic alternative (parabola geometric method) demonstrates multiple CAS solution paths, but general curriculum topic prerequisite remains unproven without empirical student trajectory data."
        },
        "evidence_status": "INCONCLUSIVE_MODEL_INCOMPLETE",
        "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
        "limitations": "Curriculum sequence (Grade 8 intervals -> Grade 9 inequalities) does not equal strict pedagogical necessity; pending real student empirical data."
    }
    validate_acceptance_contract(contract_topic)

    channel_1_formal = {
        "channel_name": "FORMAL_PROOF_CHANNEL",
        "target_claim_universal": "STRICT_NECESSITY(İntervallar_metodu -> Kvadrat_bərabərsizlik)",
        "benchmark_cases_evaluated": len(benchmark_results),
        "all_cases_independently_verified": all_cases_passed,
        "benchmark_details": benchmark_results,
        "universal_verdict": "REFUTED_BY_COUNTEREXAMPLE",
        "contracts": [contract_quadratic_ineq, contract_interval_scoped, contract_topic]
    }

    channel_2_curriculum = {
        "channel_name": "CURRICULUM_PROOF_CHANNEL",
        "source_standard": "Riyaziyyat 8: Məzmun standartı 1.2.3: Bərabərsizliklər və ədəd oxunda aralıqlar",
        "target_standard": "Riyaziyyat 9: Məzmun standartı 1.2.4: İkidərəcəli bərabərsizliklərin həlli",
        "curriculum_verdict": "CURRICULUM_SUPPORTED",
        "curriculum_relation_type": "CURRICULUM_SEQUENCE (NOT_STRICT_PREREQUISITE)"
    }

    channel_3_empirical = {
        "channel_name": "EMPIRICAL_PROOF_CHANNEL",
        "bkt_item_response_status": "INSUFFICIENT_REAL_STUDENT_DATA_SHADOW_ONLY",
        "empirical_verdict": "DATA_COLLECTION_PENDING"
    }

    prototype_decision_m02 = {
        "rule_id": "GOLD-M02",
        "source_concept": "İntervallar metodu (math_usul_intervallar)",
        "target_concept": "Kvadrat bərabərsizlik (math_anlayis_kvadrat_berabersizlik)",
        "tripartite_synthesis": {
            "channel_1_formal": channel_1_formal["universal_verdict"],
            "channel_2_curriculum": channel_2_curriculum["curriculum_verdict"],
            "channel_3_empirical": channel_3_empirical["empirical_verdict"]
        },
        "silver_graph_placement_decision": "REGISTERED_AS_SCOPED_ONLY",
        "active_production_remediation": "BLOCKED_FOR_GENERAL_QUADRATIC_INEQUALITIES"
    }

    os.makedirs("reports", exist_ok=True)
    out_file_m02 = "reports/prototype_proof_engine_gold_m02.json"
    with open(out_file_m02, "w", encoding="utf-8") as f:
        json.dump({
            "target_rule": "GOLD-M02",
            "acceptance_contract": contract_topic,
            "acceptance_contracts_all": [contract_quadratic_ineq, contract_interval_scoped, contract_topic],
            "benchmark_results": benchmark_results,
            "channel_1_formal_proof": channel_1_formal,
            "channel_2_curriculum_proof": channel_2_curriculum,
            "channel_3_empirical_proof": channel_3_empirical,
            "prototype_decision": prototype_decision_m02
        }, f, ensure_ascii=False, indent=2)

    return out_file_m02

if __name__ == "__main__":
    p = run_m02_pipeline()
    print(f"GOLD-M02 generalized prototype saved to {p}")
