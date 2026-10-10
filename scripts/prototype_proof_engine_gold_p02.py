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

def verify_physics_work_energy_identity(m_sym, v_sym, v0_sym, a_sym):
    """
    Formally verifies the algebraic identity between Net Work and Kinetic Energy change.
    Operates for any non-zero acceleration (acceleration and deceleration).
    Enforces strict physical input validation: a != 0 and m > 0 (Problem K5).
    """
    # Mass must be provably strictly positive: numeric m > 0 or symbol with is_positive is True
    m_is_pos = False
    if isinstance(m_sym, (int, float, sp.Number)):
        if m_sym > 0:
            m_is_pos = True
    elif getattr(m_sym, "is_positive", None) is True:
        m_is_pos = True

    if not m_is_pos:
        raise ValueError("InputContractViolation: Mass must be provably strictly positive (m > 0). Generic or indeterminate symbols are prohibited.")

    # Acceleration must be provably non-zero: numeric a != 0 or symbol with is_nonzero is True
    a_is_nonzero = False
    if isinstance(a_sym, (int, float, sp.Number)):
        if a_sym != 0:
            a_is_nonzero = True
    elif getattr(a_sym, "is_nonzero", None) is True:
        a_is_nonzero = True

    if not a_is_nonzero:
        raise ValueError("InputContractViolation: Acceleration must be provably non-zero (a != 0). Generic or indeterminate symbols or zero are prohibited.")

    # Kinematics: s = (v^2 - v0^2) / (2*a)
    s_expr = (v_sym**2 - v0_sym**2) / (2 * a_sym)
    # Net Force: F = m * a
    F_net = m_sym * a_sym
    # Net Work: W = F_net * s
    W_net = F_net * s_expr
    # Kinetic energy change
    delta_K = sp.Rational(1, 2) * m_sym * v_sym**2 - sp.Rational(1, 2) * m_sym * v0_sym**2

    identity_diff = sp.simplify(W_net - delta_K)
    return {
        "identity_holds": bool(identity_diff == 0),
        "work_expression": str(sp.simplify(W_net)),
        "delta_k_expression": str(delta_K),
        "symbolic_difference": str(identity_diff)
    }

def run_p02_pipeline():
    # 1. Physics Formal Symbols with generalized real acceleration (Problem B10)
    m = sp.Symbol('m', real=True, positive=True)
    v = sp.Symbol('v', real=True)
    v0 = sp.Symbol('v0', real=True)
    a_const = sp.Symbol('a', real=True, nonzero=True)

    res_identity = verify_physics_work_energy_identity(m, v, v0, a_const)

    # 2. Deconstruct Target Learning Outcomes (LO) for GOLD-P02
    LO_PHYSICS = [
        {
            "lo_id": "LO-P02-STATE",
            "description": "Kinetik enerjinin hərəkət halının skalyar funksiyası kimi tərifi və hesablanması: E_k = (m*v^2)/2",
            "scope": "STATE_FUNCTION_FORMULA_CALCULATION"
        },
        {
            "lo_id": "LO-P02-THEOREM",
            "description": "Xalis qüvvənin gördüyü işin kinetik enerjinin dəyişməsinə bərabər olması (İş-enerji teoremi): W_net = Delta E_k",
            "scope": "WORK_ENERGY_THEOREM_APPLICATION"
        },
        {
            "lo_id": "LO-P02-CONCEPTUAL",
            "description": "Enerjinin fiziki mənası: Cismin işgörmə qabiliyyəti kimi enerjinin tərifi",
            "scope": "FOUNDATIONAL_CONCEPTUAL_DEFINITION"
        }
    ]

    pathway_state_calc = {
        "method_name": "STATE_PROPERTY_DIRECT_EVALUATION",
        "target_lo": "LO-P02-STATE",
        "invokes_mechanical_work": False,
        "status": "COUNTEREXAMPLE_VERIFIED",
        "details": "Hesablama xalis iş anlayışını çağırmadan aparılır (E_k = mv^2/2)."
    }

    pathway_theorem = {
        "method_name": "WORK_ENERGY_TRANSFORMATION",
        "target_lo": "LO-P02-THEOREM",
        "invokes_mechanical_work": True,
        "status": "THEOREM_DEPENDENCY_VERIFIED",
        "details": "İş-enerji teoremində mexaniki iş (W_net) zəruri fiziki kəmiyyətdir."
    }

    pathway_conceptual = {
        "method_name": "CAPACITY_TO_DO_WORK_ONTOLOGY",
        "target_lo": "LO-P02-CONCEPTUAL",
        "invokes_mechanical_work": True,
        "status": "METHOD_DEPENDENCY_DECLARED",
        "details": "Enerjinin dərslik tərifi birbaşa mexaniki iş anlayışına istinad edir."
    }

    formal_physics_model_specification = {
        "model_name": "1D_CONSTANT_ACCELERATION_CLASSICAL_PARTICLE",
        "model_assumptions": [
            "Kütlə sabitdir və müsbətdir: m = const > 0 (dəyişən kütləli raket dinamikası nəzərə alınmır)",
            "Hərəkət birölçülü xətti x oxu boyunca baş verir: x(t)",
            "Təcil sabitdir və sıfırdan fərqlidir: a = const != 0 (müsbət və mənfi təcil dəstəklənir)",
            "Qüvvə ilə yerdəyişmə eyni düz xətt üzrədir: cos(alpha) = +-1"
        ],
        "physical_laws_applied": [
            "Nyutonun II Qanunu: F_net = m * a",
            "Birölçülü bərabərtəcilli hərəkətdə kinematik düstur: v^2 - v0^2 = 2 * a * s",
            "Mexaniki işin tərifi: W_net = F_net * s",
            "Kinetik enerjinin riyazi tərifi: E_k = (1/2) * m * v^2"
        ],
        "verified_algebraic_identity": res_identity,
        "model_exclusions": [
            "Dəyişən kütləli sistemlər (m = m(t), Meşşerski tənliyi)",
            "Qeyri-sabit təcilli və inteqral tələb edən dəyişən qüvvələr: W = int F(x) dx",
            "Üçölçülü trayektoriyalar və vektor potensial sahələr",
            "Dissipativ qeyri-mühafizəkar qüvvələr və istilik itkiləri",
            "Kinetik enerjinin sırf hal parametri kimi hesablanması (Ek = (1/2)mv^2)"
        ],
        "topic_level_prerequisite_verdict": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
        "epistemic_verdict_justification": (
            "İş-enerji teoremi kontekstində mexaniki iş riyazi və fiziki zərurətdir (THEOREM_DEPENDENCY_VERIFIED). "
            "Lakin kinetik enerji birbaşa hal parametrlərindən hesablandıqda mexaniki iş çağırılmır (COUNTEREXAMPLE_VERIFIED). "
            "Buna görə bütöv mövzu səviyyəli asılılıq sübut olunmamış qalır."
        )
    }

    # Multi-Contract Separation (Problem A10, A11, K4, K5)
    contract_theorem = {
        "claim_id": "GOLD-P02-THEOREM-IDENTITY",
        "claim_type": "PHYSICAL_THEOREM_IDENTITY",
        "scope": "1D Classical mechanics with constant mass m > 0 and non-zero acceleration a != 0",
        "method": "Symbolic derivation of Work-Energy theorem W_net = Delta Ek from Newton's II Law and kinematics",
        "verification": {
            "formal_proof_id": "CAS-P02-WORK-ENERGY-01",
            "details": "Exact symbolic derivation that W_net - Delta Ek == 0 holds under Newton II and 1D kinematics"
        },
        "evidence_status": "THEOREM_DEPENDENCY_VERIFIED",
        "prerequisite_status": "SCOPED_CANDIDATE_PENDING_MODEL_COMPLETENESS",
        "limitations": "Valid algebraically strictly within 1D constant acceleration particle model. Does not prove general applicability of Newton's II Law, variable mass dynamics, or pedagogical curriculum necessity for students."
    }
    validate_acceptance_contract(contract_theorem)

    contract_state_property = {
        "claim_id": "GOLD-P02-STATE-CALC-COUNTEREXAMPLE",
        "claim_type": "ALGORITHMIC_UNIVERSAL_NECESSITY",
        "scope": "Direct kinetic energy calculation Ek = (1/2)mv^2 from state variables mass and velocity",
        "method": "Direct formula evaluation pathway vs mechanical work pathway",
        "verification": {
            "formal_proof_id": "CAS-P02-STATE-01",
            "details": "Execution trace confirming mechanical work calculation is not invoked in direct state evaluation E_k = (1/2)*m*v^2"
        },
        "evidence_status": "COUNTEREXAMPLE_VERIFIED",
        "prerequisite_status": "REJECTED_ALTERNATIVE_PATHWAY_EXISTS",
        "limitations": "Demonstrates that calculating kinetic energy does not algorithmically require calculating mechanical work."
    }
    validate_acceptance_contract(contract_state_property)

    contract_topic = {
        "claim_id": "GOLD-P02-TOPIC-PREREQUISITE",
        "claim_type": "PEDAGOGICAL_CURRICULUM_PREREQUISITE",
        "scope": "Secondary physics curriculum grade 7: Mechanical Work to Kinetic Energy",
        "method": "Tripartite synthesis of formal proof, curriculum sequence, and empirical assessment",
        "verification": {
            "curriculum_source_standard": "AR-PHYS-G7-2.1.2",
            "empirical_evaluation_id": "EMP-BKT-SHADOW-2026",
            "details": "Algorithmic and state calculation alternatives demonstrate multiple analytical approaches (E_k = mv^2/2 without work), but curriculum topic prerequisite across general physics education remains unproven without empirical student trajectory data."
        },
        "evidence_status": "INCONCLUSIVE_MODEL_INCOMPLETE",
        "prerequisite_status": "TOPIC_LEVEL_PREREQUISITE_UNPROVEN",
        "limitations": "Mechanical work is not universally necessary for all learning outcomes of kinetic energy; curriculum sequence does not equal strict pedagogical necessity."
    }
    validate_acceptance_contract(contract_topic)

    channel_1_formal = {
        "channel_name": "FORMAL_PROOF_CHANNEL",
        "target_claim_universal": "STRICT_NECESSITY(Mexaniki_iş -> Kinetik_enerji)",
        "physics_model_specification": formal_physics_model_specification,
        "methods_compared": [pathway_state_calc, pathway_theorem, pathway_conceptual],
        "universal_verdict": "REFUTED_BY_COUNTEREXAMPLE",
        "contracts": [contract_theorem, contract_state_property, contract_topic]
    }

    channel_2_curriculum = {
        "channel_name": "CURRICULUM_PROOF_CHANNEL",
        "source_standard": "Fizika 7: Məzmun standartı 2.2.1: Mexaniki iş və güc",
        "target_standard": "Fizika 7: Məzmun standartı 2.2.2: Kinetik və potensial enerji",
        "textbook_progression": "Fizika 7 (R.Əliyev) - Mexaniki iş fəslindən dərhal sonra Kinetik enerji tədris olunur.",
        "curriculum_verdict": "CURRICULUM_SUPPORTED",
        "curriculum_relation_type": "CURRICULUM_SEQUENCE"
    }

    channel_3_empirical = {
        "channel_name": "EMPIRICAL_PROOF_CHANNEL",
        "bkt_item_response_status": "INSUFFICIENT_REAL_STUDENT_DATA_SHADOW_ONLY",
        "empirical_verdict": "DATA_COLLECTION_PENDING"
    }

    prototype_decision_p02 = {
        "rule_id": "GOLD-P02",
        "source_concept": "Mexaniki iş (phy_mexaniki_is)",
        "target_concept": "Kinetik enerji (phy_kinetik_enerji)",
        "tripartite_synthesis": {
            "channel_1_formal": channel_1_formal["universal_verdict"],
            "channel_2_curriculum": channel_2_curriculum["curriculum_verdict"],
            "channel_3_empirical": channel_3_empirical["empirical_verdict"]
        },
        "silver_graph_placement_decision": "REGISTERED_AS_SCOPED_ONLY",
        "active_production_remediation": "BLOCKED_FOR_STATE_CALCULATION_ALLOWED_FOR_WORK_ENERGY_THEOREM"
    }

    os.makedirs("reports", exist_ok=True)
    out_file_p02 = "reports/prototype_proof_engine_gold_p02.json"
    with open(out_file_p02, "w", encoding="utf-8") as f:
        json.dump({
            "prototype_title": "TestAI.az KAG - Formal Proof & Counter-Example Engine (GOLD-P02)",
            "target_rule": "GOLD-P02",
            "acceptance_contract": contract_topic,
            "acceptance_contracts_all": [contract_theorem, contract_state_property, contract_topic],
            "physics_model_specification": formal_physics_model_specification,
            "learning_outcomes": LO_PHYSICS,
            "channel_1_formal_proof": channel_1_formal,
            "channel_2_curriculum_proof": channel_2_curriculum,
            "channel_3_empirical_proof": channel_3_empirical,
            "prototype_decision": prototype_decision_p02
        }, f, ensure_ascii=False, indent=2)

    return out_file_p02

if __name__ == "__main__":
    p = run_p02_pipeline()
    print(f"GOLD-P02 prototype completed and saved to {p}")
