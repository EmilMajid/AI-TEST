import json

with open('scripts/forensic_findings.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("--- REMAINING GROUNDING (25 total) ---")
for g in d['grounding_anomalies'][:10]:
    print(f"[{g['file']} | {g['subj']} | {g['topic']}] Q{g['q_num']}: '{g['canonical_concept']}'")

print("\n--- REMAINING DIAGNOSTIC MISMATCHES (42 total) ---")
for dm in d['distractor_diag_mismatches'][:10]:
    print(f"[{dm['file']} | {dm['subj']} | {dm['topic']}] Q{dm['q_num']}: Key={dm['correct_index']} Diag={dm['diag_key']} ('{dm['diag_val']}')")
