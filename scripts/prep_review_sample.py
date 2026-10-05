import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load pilot nodes
with open('data/ontology/pilot_nodes.jsonl', 'r', encoding='utf-8') as f:
    nodes = [json.loads(line) for line in f]

# Load pilot evidence
ev_map = {}
with open('data/ontology/audit/pilot_evidence.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        ev = json.loads(line)
        ev_map[ev['node_id']] = ev.get('evidence_records', [{}])[0]

# Pick balanced sample: 15 History, 15 Math, 15 Biology (total 45 sample nodes for review)
by_domain = {'Tarix': [], 'Riyaziyyat': [], 'Biologiya': []}
for n in nodes:
    d = n.get('subject_domain')
    if d in by_domain:
        by_domain[d].append(n)

samples = by_domain['Tarix'][:15] + by_domain['Riyaziyyat'][:15] + by_domain['Biologiya'][:15]

with open('scripts/sample_review_nodes.json', 'w', encoding='utf-8') as f:
    payload = []
    for s in samples:
        nid = s['id']
        ev = ev_map.get(nid, {})
        payload.append({
            'node': s,
            'evidence': ev
        })
    json.dump(payload, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(samples)} review nodes for verification report.")
