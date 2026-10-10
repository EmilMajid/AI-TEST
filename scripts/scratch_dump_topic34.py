import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("reports/quadratic_inequalities_pilot_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

topic34 = [d for d in data if "34. Kvadrat bərabərsizliklər" in d["topic"]]
print(f"Total questions in Topic 34: {len(topic34)}")

for i, q in enumerate(topic34, 1):
    print(f"[{i}] ID: {q['id']}")
    print(f"    Q: {q['question']}")
    print(f"    Expl: {q['explanation']}")
    print("-" * 50)
