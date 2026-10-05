import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/ontology/nodes.jsonl', 'r', encoding='utf-8') as f:
    nodes = [json.loads(line) for line in f]

with open('data/ontology/edges.jsonl', 'r', encoding='utf-8') as f:
    edges = [json.loads(line) for line in f]

print(f"Total Canonical Nodes: {len(nodes)}")
print(f"Total Edges: {len(edges)}")

# Build lookup table for TypeScript
ts_nodes = {}
for n in nodes:
    ts_nodes[n['id']] = {
        'id': n['id'],
        'label': n['canonical_label'],
        'type': n['type'],
        'subject': n['subject'],
        'grade': n['first_grade_verified']
    }

ts_prereqs = {}
ts_distractors = {}

for e in edges:
    rel = e['relation']
    src = e['source']
    tgt = e['target']
    if rel == 'PREREQUISITE_OF':
        # src is prerequisite of tgt
        if tgt not in ts_prereqs: ts_prereqs[tgt] = []
        ts_prereqs[tgt].append(src)
    elif rel == 'CONTRASTS_WITH':
        if src not in ts_distractors: ts_distractors[src] = []
        ts_distractors[src].append(tgt)
        if tgt not in ts_distractors: ts_distractors[tgt] = []
        ts_distractors[tgt].append(src)

print(f"Nodes with prerequisites: {len(ts_prereqs)}")
print(f"Nodes with distractor contrast pairs: {len(ts_distractors)}")

print("Sample resolution:")
sample_q = "Çaldıran döyüşünün nəticəsi olaraq hansı hadisə baş vermişdir?"
for nid, n in ts_nodes.items():
    if any(token in sample_q.lower() for token in n['label'].lower().split()):
        print("Matched:", nid, "->", n['label'])
