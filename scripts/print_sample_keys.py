import json

with open('scripts/universal_audit_summary.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("--- SAMPLE KEY MISMATCHES ---")
for km in d['key_mismatches'][:8]:
    print(f"[{km['file']} | {km['subj']} | {km['topic']}] Q{km['q_num']}")
    print(f"  Sual: {km['q_txt']}")
    print(f"  Bazada secilen: {km['cur_letter']}) {km['cur_opt']}")
    print(f"  Izah deyir: {km['exp_letter']}")
    print(f"  Izah: {km['exp']}")
    print("-" * 50)

print("\n--- SAMPLE GHOST GRADE MAPPINGS ---")
for gg in d['ghost_grade_concepts'][:6]:
    print(f"[{gg['file']} | {gg['subj']} | {gg['topic']}] Q{gg['q_num']}")
    print(f"  Cari sinif: {gg['current_grade']} | Kok kitab: {gg['root_book']} | Kok movzu: '{gg['rc']}'")
    print("-" * 50)
