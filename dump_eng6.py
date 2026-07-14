import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('İngilis dili 6', [])
print(f"Total: {len(tests)} test\n")

# Print ALL questions + options to understand content
for i, t in enumerate(tests):
    q = t.get('question', '')
    opts = t.get('options', [])
    ans = t.get('correctAnswer', -1)
    correct_opt = opts[ans] if isinstance(ans, int) and 0 <= ans < len(opts) else '?'
    expl = (t.get('pedagogical_explanation') or '')[:80]
    print(f"[{i:03d}] Q: {q}")
    print(f"       Correct: {correct_opt}")
    print(f"       Expl: {expl}")
    print()
