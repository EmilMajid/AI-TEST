import json
import sys
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

with open('data/ontology/pilot_nodes.jsonl', 'r', encoding='utf-8') as f:
    nodes = [json.loads(line) for line in f]

print("Total pilot nodes:", len(nodes))
print("By subject domain:", Counter(n['subject_domain'] for n in nodes))
print("By type:", Counter(n['type'] for n in nodes))
print("\nSample 5 nodes:")
for n in nodes[:5]:
    print(f"[{n['subject_domain']} - {n['type']}] {n['id']} -> {n['label_az']}")
    print(f"  Claim/Def: {n['canonical_definition'][:90]}...")
