import json
import re
from collections import Counter

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('İngilis dili 6', [])
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
    if expl and re.search(r'\b[A-D]\s+variantı\b|\bCavab\s+[A-D]\b', expl, re.IGNORECASE):
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
print("  ✅ Format tam qüsursuzdur!" if all_ok else "  ⚠️ Format problemləri var!")

# All expected topics
ALL_TOPICS = [
    # UNIT 1
    "UNIT 1 - Places in Town",
    "UNIT 1 - There is/are",
    "UNIT 1 - Prepositions of Place",
    "UNIT 1 - Adverbs of Frequency",
    # UNIT 2
    "UNIT 2 - Food",
    "UNIT 2 - Can for Permission",
    "UNIT 2 - Cooking",
    "UNIT 2 - Making Suggestions and Responding",
    "UNIT 2 - Subject and Object Pronouns",
    "UNIT 2 - Review",
    # UNIT 3
    "UNIT 3 - On Holiday",
    "UNIT 3 - Past Simple of be",
    "UNIT 3 - There was/were",
    "UNIT 3 - Facilities, People and Activities",
    # UNIT 4
    "UNIT 4 - Story Verbs",
    "UNIT 4 - Past Simple of Regular Verbs (Affirmative)",
    "UNIT 4 - Time Expressions",
    "UNIT 4 - Past Simple of Irregular Verbs",
    "UNIT 4 - Review",
    # UNIT 5
    "UNIT 5 - Transport",
    "UNIT 5 - Past Simple Questions and Answers",
    "UNIT 5 - Transport Verbs",
    "UNIT 5 - Could for Ability in the Past",
    # UNIT 6
    "UNIT 6 - Personality Adjectives",
    "UNIT 6 - Past Continuous (Affirmative and Negative)",
    "UNIT 6 - Feelings",
    "UNIT 6 - Past Continuous (Questions and Answers)",
    "UNIT 6 - Review",
    # UNIT 7
    "UNIT 7 - Innovation Verbs",
    "UNIT 7 - Past Continuous and Past Simple",
    "UNIT 7 - Technology",
    "UNIT 7 - Possessive Pronouns",
    # UNIT 8
    "UNIT 8 - Nature",
    "UNIT 8 - Verbs to Express Likes, Wants and Needs",
    "UNIT 8 - The Weather",
    "UNIT 8 - Connectors",
    "UNIT 8 - Review",
]

print(f"\n=== MÖVZU UYĞUNLUQ YOXLAMası (37 mövzu) ===")
covered = 0
for t in ALL_TOPICS:
    c = topics.get(t, 0)
    if c >= 15:
        status = '✅'
        covered += 1
    elif c > 0:
        status = f'⚠️ ({c}/15)'
    else:
        status = '❌ 0'
    print(f"  {status} {t}: {c}")

other = {k: v for k, v in topics.items() if k not in ALL_TOPICS}
if other:
    print('\n=== Digər/Naməlum mövzular ===')
    for k, v in other.items():
        print(f'  "{k}": {v}')

print(f"\nTamamlanmış mövzular: {covered}/{len(ALL_TOPICS)}")
print(f"Ümumi cəm: {len(tests)} test")
