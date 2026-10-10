import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

reg_path = "reports/gold_rules_pedagogical_evidence_registry.json"
with open(reg_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Epistemic refinement addressing Expert Stage 3 Critique
SPECIAL_SCRUTINY_NOTES = {
    "GOLD-P01": {
        "rule_id": "GOLD-P01",
        "scrutiny_alert": "BOUNDARY_DEPENDENT_PRELIMINARY_HYPOTHESIS",
        "epistemic_qualification": "Nyutonun II qanunu (F = ma) ümumi tədrisdə qüvvə və təcilin mütənasibliyi kimi təcrübi yolla təqdim edilə bilər. I qanun (ətalət və inersial sistemlər) fəlsəfi/konseptual əsasdır, lakin şagirdin sırf hesablama bacarığı üçün universal zərurət olub-olmaması insan ekspert paneli tərəfindən ayrıca qiymətləndirilməlidir."
    },
    "GOLD-P03": {
        "rule_id": "GOLD-P03",
        "scrutiny_alert": "BOUNDARY_DEPENDENT_PRELIMINARY_HYPOTHESIS",
        "epistemic_qualification": "Elektrik sahəsinin intensivliyi ümumi halda sınaq yükünə təsir edən qüvvə vasitəsilə (E = F/q) təyin olunur. Kulon qanunundan zəruri asılılıq yalnız 'nöqtəvi yükün yaratdığı sahənin intensivliyi' (E = kq/r^2) öyrənmə nəticəsi üçün keçərlidir. Bütün intensivlik mövzusu üçün universal zərurət deyil."
    },
    "GOLD-B02": {
        "rule_id": "GOLD-B02",
        "scrutiny_alert": "BOUNDARY_DEPENDENT_PRELIMINARY_HYPOTHESIS",
        "epistemic_qualification": "Meyoz bölünmə qametogenez və xromosom sayının reduksiyası kimi müstəqil tədris edilə bilər. Mitozun fazaları faydalı hazırlıq və müqayisə bazası olsa da, meyozun konseptual dərki üçün universal zərurət olub-olmaması şübhəlidir."
    },
    "GOLD-G01": {
        "rule_id": "GOLD-G01",
        "scrutiny_alert": "DIRECTIONALITY_VERIFIED_INTERNAL_CORE",
        "epistemic_qualification": "Məntiqi istiqamət: Mənbə = Yerin daxili quruluşu (mantiya, astenosfer qatı), Hədəf = Litosfer tavaları və onların hərəkəti. İstiqamət məntiqidir (daxili qat quruluşu tavaların hərəkətinin səbəbidir), lakin tavalar nəzəriyyəsinin müstəqil təsvir oluna bilməsi araşdırılmalıdır."
    }
}

for rule in data["rules"]:
    rid = rule["rule_id"]
    
    # 1. Decouple candidate hypothesis from authoritative adjudication
    c4 = rule.get("condition_4_epistemic_necessity_evaluation", {})
    old_tier = c4.get("epistemic_necessity_tier", "UNCLASSIFIED")
    
    # Rename to explicit hypothesis
    c4["candidate_classification_hypothesis"] = f"{old_tier}_PRELIMINARY_HYPOTHESIS"
    c4["hypothesis_origin"] = "AUTOMATED_CURRICULUM_HEURISTIC_ANALYSIS"
    
    # Independent Evidence Corroboration Field
    rule["condition_3_pedagogical_validation"]["evidence_corroboration_status"] = "CURRICULUM_TOPIC_AND_TEXTBOOK_MAPPED"
    
    # Independent Panel Decision Field
    c4["panel_adjudication_status"] = "UNADJUDICATED_AWAITING_INDEPENDENT_HUMAN_PANEL"
    
    # Attach scrutiny note if applicable
    if rid in SPECIAL_SCRUTINY_NOTES:
        c4["expert_audit_scrutiny_note"] = SPECIAL_SCRUTINY_NOTES[rid]
    else:
        c4["expert_audit_scrutiny_note"] = None

    rule["condition_4_epistemic_necessity_evaluation"] = c4

data["epistemic_governance"] = {
    "principle": "DECOUPLED_STATUSES: Hypothesis != Proof != Panel Adjudication",
    "production_status": "HOLD_ZERO_ACTIVE_GOLD",
    "unadjudicated_count": len(data["rules"])
}

with open(reg_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Refactored {reg_path} with strictly decoupled hypothesis, corroboration, and panel adjudication fields.")
