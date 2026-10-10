import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("reports/quadratic_inequalities_pilot_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

gr9_items = [d for d in data if d["grade"] == 9]
print(f"Grade 9 matches: {len(gr9_items)}")

# Print topics in Grade 9
topics = {}
for q in gr9_items:
    t = q["topic"]
    topics[t] = topics.get(t, 0) + 1
print("Grade 9 Topics:")
for t, c in topics.items():
    print(f"  - {t}: {c} questions")

print("\n--- SAMPLE GRADE 9 ACTUAL INEQUALITIES ---")
for i, q in enumerate(gr9_items[:8], 1):
    print(f"\n[{i}] ID: {q['id']} | Topic: {q['topic']}")
    print(f"Q: {q['question']}")
    print(f"Expl: {q['explanation'][:200]}")
