import json
with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)
tests = db.get('İngilisdili6', []) or db.get('İngilis dili 6', [])
print(f"Total: {len(tests)}\n")
for i in [0, 15, 30, 60, 90, 120, 150, 180, 210, 250, 280, 310, 329]:
    if i < len(tests):
        t = tests[i]
        q = t.get('question', '')[:90]
        expl = (t.get('pedagogical_explanation') or '')[:70]
        print(f"[{i}] Q: {q}")
        print(f"     expl: {expl}")
        print()
