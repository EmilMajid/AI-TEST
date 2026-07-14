import json
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('İnformatika 6', [])
print(f"Total tests found for İnformatika 6: {len(tests)}\n")

topics = Counter([t.get('topic', 'Unknown') for t in tests])

print("=== Mövzu bölgüsü ===")
for t, c in sorted(topics.items(), key=lambda x: -x[1]):
    print(f'  "{t}": {c}')

# Check Gold Standart 2.1 compliance
format_issues = {
    'old_options_dict': 0,
    'missing_correctAnswer': 0,
    'invalid_correctAnswer_type': 0,
    'explanation_with_A_variant': 0,
    'missing_passport_id': 0
}

import re
for t in tests:
    # Check options format
    if isinstance(t.get('options'), dict):
        format_issues['old_options_dict'] += 1
    
    ans = t.get('correctAnswer')
    if ans is None and 'correct_answer' not in t:
        format_issues['missing_correctAnswer'] += 1
    elif ans is not None and not isinstance(ans, int):
        format_issues['invalid_correctAnswer_type'] += 1
        
    expl = t.get('pedagogical_explanation') or t.get('explanation', '')
    if expl:
        if re.search(r'\b[A-D]\s+variantı\b', expl, re.IGNORECASE) or re.search(r'Cavab\s+[A-D]\b', expl, re.IGNORECASE):
            format_issues['explanation_with_A_variant'] += 1
            
    if not t.get('passport_id'):
        format_issues['missing_passport_id'] += 1

print("\n=== Gold Standart 2.1 Audit ===")
for issue, count in format_issues.items():
    print(f"  {issue}: {count}")
