import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

NODES_PATH = 'data/ontology/nodes.jsonl'
EVIDENCE_PATH = 'data/ontology/audit/evidence_registry.jsonl'
CORRUPTED_BOOKS = {
    'informatika-5', 'azerbaycan-dili-5-h1', 'azerbaycan-dili-5-h2',
    'riyaziyyat-5-h2', 'riyaziyyat-5-h1', 'azerbaycan-tarixi-5', 'edebiyyat-5'
}

with open(NODES_PATH, 'r', encoding='utf-8') as f:
    nodes = [json.loads(l) for l in f]

with open(EVIDENCE_PATH, 'r', encoding='utf-8') as f:
    evs = [json.loads(l) for l in f]

node_to_book = {e['node_id']: e.get('book_id') for e in evs}

tainted = []
clean = []
for n in nodes:
    bid = node_to_book.get(n['id'], '')
    lbl = n['canonical_label']
    if bid in CORRUPTED_BOOKS or re.search(r'[bcdfghjklmnpqrstvwxyz]{4,}', lbl, re.I):
        tainted.append(n)
    else:
        clean.append(n)

print(f"Total existing nodes: {len(nodes)}")
print(f"Tainted by 7 old books: {len(tainted)}")
print(f"Pristine clean nodes: {len(clean)}")
print("Sample tainted nodes that will be purged and replaced with pristine ones:")
for t in tainted[:10]:
    print(f"  {t['id']}: {t['canonical_label']} (book: {node_to_book.get(t['id'])})")
