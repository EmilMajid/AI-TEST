import json
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("lib/runtime-kag-guard.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Extract all CANONICAL_ONTOLOGY_REGISTRY items that have prereqId
# Pattern: match blocks with "id": "...", ... "prereqId": "..."
nodes_with_prereq = []

# Regex pattern for entries in registry
pattern = re.compile(
    r'\{\s*"id":\s*"([^"]+)",'
    r'.*?"label":\s*"([^"]+)",'
    r'.*?"subject":\s*"([^"]+)",'
    r'.*?"firstGradeVerified":\s*(\d+),'
    r'.*?"prereqId":\s*("([^"]+)"|null),'
    r'.*?"prereqLabel":\s*("([^"]+)"|null)',
    re.DOTALL
)

matches = pattern.findall(text)
print(f"Total regex matched registry nodes: {len(matches)}")

prereq_edges = []
for m in matches:
    target_id = m[0]
    target_label = m[1]
    subject = m[2]
    grade = int(m[3])
    prereq_id = m[5] if m[5] else None
    prereq_label = m[7] if m[7] else None
    
    if prereq_id and prereq_id != "null":
        prereq_edges.append({
            "target_id": target_id,
            "target_label": target_label,
            "subject": subject,
            "target_grade": grade,
            "prereq_id": prereq_id,
            "prereq_label": prereq_label
        })

print(f"Total nodes with EXPLICIT ACTIVE prereqId edges in runtime: {len(prereq_edges)}")
print("\nFirst 10 Actual Prerequisite Edges in lib/runtime-kag-guard.ts:")
for i, edge in enumerate(prereq_edges[:10], 1):
    print(f"[{i}] {edge['subject']} (Gr {edge['target_grade']}): [{edge['prereq_label']} ({edge['prereq_id']})] -> [{edge['target_label']} ({edge['target_id']})]")

# Save all true edges to JSON
with open("reports/runtime_actual_prereq_edges.json", "w", encoding="utf-8") as f:
    json.dump(prereq_edges, f, ensure_ascii=False, indent=2)
print("\nSaved full list of true edges to reports/runtime_actual_prereq_edges.json")
