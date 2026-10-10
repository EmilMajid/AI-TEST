import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("reports/dangling_prereq_references.json", "r", encoding="utf-8") as f:
    dangling_data = json.load(f)

refs = dangling_data["dangling_references"]

triage_list = []

for idx, r in enumerate(refs, 1):
    t_id = r["target_node_id"]
    t_lbl = r.get("target_label", "")
    t_subj = r.get("target_subject", "")
    t_gr = r.get("target_grade")
    m_id = r.get("missing_prereq_id", "")
    p_lbl = r.get("prereq_label_claimed", "")

    # Analyze root cause pattern
    t_lbl_low = t_lbl.lower() if t_lbl else ""
    p_lbl_low = p_lbl.lower() if p_lbl else ""

    cause = "UNCLASSIFIED_OCR_ARTIFACT"
    recommendation = "CURRICULUM_EXPERT_REVIEW_REQUIRED"

    if len(t_lbl_low) <= 4 or len(p_lbl_low) <= 4:
        cause = "OCR_TOKEN_TRUNCATION"  # E.g., 'larda', 'rma', 'vvə', 'şmə'
        recommendation = "FLAG_FOR_CORRUPTED_TOKEN_REMOVAL"
    elif t_lbl_low.endswith("lər") and t_lbl_low[:-3] in p_lbl_low:
        cause = "PLURAL_SINGULAR_VARIATION"
        recommendation = "RESOLVE_CANONICAL_LEMMA_AFTER_VERIFICATION"
    elif t_lbl_low.endswith("lar") and t_lbl_low[:-3] in p_lbl_low:
        cause = "PLURAL_SINGULAR_VARIATION"
        recommendation = "RESOLVE_CANONICAL_LEMMA_AFTER_VERIFICATION"
    elif t_lbl_low.startswith("auto_") or m_id.startswith("auto_"):
        cause = "SYNTHETIC_GENERATION_DANGLING_ID"
        recommendation = "VERIFY_AGAINST_SOURCE_TEXTBOOK_CHAPTER"
    else:
        cause = "MISSING_REGISTRY_IDENTIFIER"
        recommendation = "INSPECT_ORIGINAL_ONTOLOGY_IMPORT_LOGS"

    triage_list.append({
        "triage_id": f"DTR-{idx:02d}",
        "target_node_id": t_id,
        "target_label": t_lbl,
        "target_subject": t_subj,
        "target_grade": t_gr,
        "missing_prereq_id": m_id,
        "prereq_label_claimed": p_lbl,
        "suspected_root_cause": cause,
        "triage_recommendation": recommendation,
        "investigation_status": "OPEN_INVESTIGATION_LOCKED_READONLY"
    })

output_file = "reports/dangling_prereqs_deep_triage.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump({
        "triage_registry_title": "KAG 46 Dangling Prerequisite References - Deep Root Cause Triage",
        "total_dangling_references": len(triage_list),
        "policy": "DO_NOT_AUTO_MUTATE_CANONICAL_REGISTRY (UNKNOWN > WRONG)",
        "triage_records": triage_list
    }, f, ensure_ascii=False, indent=2)

print(f"Generated deep triage registry with {len(triage_list)} entries at {output_file}")
