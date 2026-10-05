import json

with open('scripts/universal_audit_summary.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

g2_keys = [k for k in d['key_mismatches'] if k['file'] == 'grade_2.json']
print(f"Total key mismatches in Grade 2: {len(g2_keys)}")
for k in g2_keys[:10]:
    print(f"[{k['subj']} | {k['topic']}] Q{k['q_num']}")
    print(f"  Sual: {k['q_txt']}")
    print(f"  Bazada secilen: {k['cur_letter']}) {k['cur_opt']}")
    print(f"  Izah deyir: {k['exp_letter']}")
    print(f"  Izah: {k['exp']}")
    print("-" * 50)
