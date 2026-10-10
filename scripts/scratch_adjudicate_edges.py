import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("data/ontology/gold_manifest_21.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

with open("reports/runtime_actual_prereq_edges.json", "r", encoding="utf-8") as f:
    runtime_edges = json.load(f)

rules = manifest.get("canonical_rules", [])

edge_audit_results = []
match_counts = {"EXACT_EDGE_MATCH": 0, "NODE_EXISTS_NO_EDGE": 0, "NODE_MISSING": 0}

for r in rules:
    rid = r["rule_id"]
    subj = r["subject"]
    src_label = r["source"]
    tgt_label = r["target"]
    c_src = r.get("canonical_source_id")
    c_tgt = r.get("canonical_target_id")
    
    # Search in runtime_edges for an exact edge (source -> target)
    found_edge = None
    for edge in runtime_edges:
        # Check by label or by ID
        tgt_match = (edge["target_label"].lower() == tgt_label.lower()) or (edge["target_id"] == c_tgt)
        src_match = (edge["prereq_label"] and edge["prereq_label"].lower() == src_label.lower()) or (edge["prereq_id"] == c_src)
        
        if tgt_match and src_match:
            found_edge = edge
            break
            
    # Check if target node exists at all in runtime
    target_node_exists = any((edge["target_label"].lower() == tgt_label.lower()) or (edge["target_id"] == c_tgt) for edge in runtime_edges)
    source_node_exists = any((edge["prereq_label"] and edge["prereq_label"].lower() == src_label.lower()) or (edge["prereq_id"] == c_src) for edge in runtime_edges)

    if found_edge:
        status = "EXACT_EDGE_MATCH"
    elif target_node_exists or source_node_exists:
        status = "NODE_EXISTS_NO_EDGE"
    else:
        status = "NODE_MISSING"

    match_counts[status] += 1
    edge_audit_results.append({
        "rule_id": rid,
        "subject": subj,
        "source": src_label,
        "target": tgt_label,
        "target_in_runtime": target_node_exists,
        "source_in_runtime": source_node_exists,
        "status": status,
        "matched_edge_details": found_edge
    })

print("=====================================================================")
print("KAG 21 GOLD RULES vs RUNTIME EXPLICIT PREREQUISITE EDGES AUDIT")
print("=====================================================================\n")
print(f"Summary Counts: {match_counts}\n")
for res in edge_audit_results:
    print(f"[{res['rule_id']}] {res['subject']}: {res['source']} -> {res['target']}")
    print(f"   Status: {res['status']}")
    if res['matched_edge_details']:
        print(f"   Real Edge: [{res['matched_edge_details']['prereq_label']}] -> [{res['matched_edge_details']['target_label']}]")
    print("   ---")

with open("reports/manifest_vs_runtime_edge_adjudication.json", "w", encoding="utf-8") as f:
    json.dump({"summary": match_counts, "results": edge_audit_results}, f, ensure_ascii=False, indent=2)
print("\nSaved detailed edge adjudication to reports/manifest_vs_runtime_edge_adjudication.json")
