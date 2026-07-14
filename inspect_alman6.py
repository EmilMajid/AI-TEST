import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Alman dili 6', [])
print(f"Total: {len(tests)} test\n")

# GS 2.1 audit
fmt = {'old_options_dict': 0, 'missing_correctAnswer': 0,
       'invalid_correctAnswer_type': 0, 'missing_passport_id': 0}

for t in tests:
    if isinstance(t.get('options'), dict):
        fmt['old_options_dict'] += 1
    ans = t.get('correctAnswer')
    if ans is None:
        fmt['missing_correctAnswer'] += 1
    elif not isinstance(ans, int):
        fmt['invalid_correctAnswer_type'] += 1
    if not t.get('passport_id'):
        fmt['missing_passport_id'] += 1

print("=== GS 2.1 Format ===")
for k, v in fmt.items():
    print(f"  {'✅' if v == 0 else '❌'} {k}: {v}")

# Sample questions to understand content structure
print("\n=== Sual nümunələri ===")
for i in [0, 15, 30, 50, 80, 120, 160, 200, 250, 300, 340, 359]:
    if i < len(tests):
        t = tests[i]
        q = t.get('question', '')[:100]
        opts = t.get('options', [])
        expl = (t.get('pedagogical_explanation') or '')[:90]
        print(f"[{i:03d}] Q: {q}")
        print(f"       Opts: {opts[:2]}...")
        print(f"       Expl: {expl}")
        print()
