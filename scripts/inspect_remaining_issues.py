import json

with open('scripts/universal_audit_summary.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("--- REMAINING 4 DISTRACTOR STEALS ---")
for ds in d['distractor_steals']:
    print(f"[{ds['file']} | {ds['subj']} | {ds['topic']}] Q{ds['q_num']}")
    print(f"  Stolen opt: '{ds['stolen_opt']}' -> Concept: '{ds['cn']}'")

print("\n--- REMAINING 2 BROKEN LATEX ---")
for bl in d['broken_latex']:
    print(f"[{bl['file']} | {bl['subj']} | {bl['topic']}] Q{bl['q_num']}")
    print(f"  Broken: {bl['broken']}")
