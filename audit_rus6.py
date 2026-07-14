import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

# Find correct key
keys = [k for k in db.keys() if 'rus' in k.lower() and '6' in k]
print("Keys found:", keys)

tests = []
for key in keys:
    tests.extend(db.get(key, []))
    
print(f"Total: {len(tests)} test\n")

# Topic distribution
topics = Counter([t.get('topic', 'Unknown') for t in tests])
print("=== Mövcud mövzu bölgüsü ===")
for t, c in sorted(topics.items(), key=lambda x: -x[1]):
    print(f'  "{t}": {c}')

# GS 2.1 format audit
format_issues = {
    'old_options_dict': 0,
    'missing_correctAnswer': 0,
    'invalid_correctAnswer_type': 0,
    'explanation_with_variant_letter': 0,
    'missing_passport_id': 0
}

for t in tests:
    if isinstance(t.get('options'), dict):
        format_issues['old_options_dict'] += 1
    ans = t.get('correctAnswer')
    if ans is None:
        format_issues['missing_correctAnswer'] += 1
    elif not isinstance(ans, int):
        format_issues['invalid_correctAnswer_type'] += 1
    expl = t.get('pedagogical_explanation') or t.get('explanation', '')
    if expl and re.search(r'\b[A-D]\s+вариант\b|\b[A-D]\s+variantı\b', expl, re.IGNORECASE):
        format_issues['explanation_with_variant_letter'] += 1
    if not t.get('passport_id'):
        format_issues['missing_passport_id'] += 1

print("\n=== Gold Standart 2.1 Format Audit ===")
all_ok = True
for issue, count in format_issues.items():
    icon = '✅' if count == 0 else '❌'
    if count > 0:
        all_ok = False
    print(f"  {icon} {issue}: {count}")

print("\n=== Sual Nümunələri (Məzmun Analizi) ===")
for i in range(0, min(len(tests), 735), 40):
    t = tests[i]
    q = t.get('question', '')[:100]
    expl = (t.get('pedagogical_explanation') or t.get('explanation', ''))[:80]
    print(f"[{i}] {t.get('topic')} \n Q: {q}\n Expl: {expl}\n")

