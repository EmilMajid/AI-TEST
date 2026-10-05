import json

with open('scripts/quotes_and_cross_audit.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("--- SAMPLE QUOTE HIJACKING (21,862 total) ---")
for qi in d['quote_issues'][:10]:
    print(f"[{qi['file']} | {qi['subj']} | {qi['topic']}] Q{qi['q_num']}")
    print(f"  Concept Name: '{qi['cn']}' (Extracted: '{qi['extracted']}')")
    print(f"  Question: {qi['q_txt']}")
    print("-" * 50)

print("\n--- SAMPLE BIZARRE CROSS CONNECTIONS (87 total) ---")
for bc in d['bizarre_cross'][:10]:
    print(f"[{bc['file']} | {bc['subj']} | {bc['topic']}] Q{bc['q_num']}")
    print(f"  Type: {bc['type']}")
    print(f"  Target: {bc['target']}")
    print(f"  Facet: {bc['facet']}")
    print(f"  Question: {bc['q_txt']}")
    print("-" * 50)
