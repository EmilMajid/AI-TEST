import json
import re
import sys
from collections import defaultdict, Counter, deque

sys.stdout.reconfigure(encoding='utf-8')

print("==================================================================", flush=True)
print("DEEP FORENSIC DIAGNOSTIC SUITE: NATIONAL ONTOLOGY (3,000 NODES)", flush=True)
print("==================================================================", flush=True)

NODES_PATH = 'data/ontology/nodes.jsonl'
CLAIMS_PATH = 'data/ontology/claims.jsonl'
EVIDENCE_PATH = 'data/ontology/audit/evidence_registry.jsonl'
EDGES_PATH = 'data/ontology/edges.jsonl'
LINEAGE_PATH = 'data/ontology/audit/node_lineage.jsonl'
CORPUS_PATH = 'data/ontology/corpus_clean.jsonl'

# 1. LOAD DATASETS
nodes = []
with open(NODES_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if line.strip():
            n = json.loads(line)
            n['_line'] = idx
            nodes.append(n)

claims = []
with open(CLAIMS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if line.strip():
            c = json.loads(line)
            c['_line'] = idx
            claims.append(c)

evidence = []
with open(EVIDENCE_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if line.strip():
            e = json.loads(line)
            e['_line'] = idx
            evidence.append(e)

edges = []
with open(EDGES_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if line.strip():
            ed = json.loads(line)
            ed['_line'] = idx
            edges.append(ed)

lineage = []
with open(LINEAGE_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if line.strip():
            l = json.loads(line)
            l['_line'] = idx
            lineage.append(l)

node_dict = {n['id']: n for n in nodes}
claim_dict = {(c.get('claim_id') or c.get('id')): c for c in claims}
evidence_dict = {(e.get('id') or e.get('evidence_id')): e for e in evidence}

print(f"\n--- 1. BASIC COUNTS ---")
print(f"Nodes count: {len(nodes)} (Unique IDs: {len(node_dict)})")
print(f"Claims count: {len(claims)} (Unique IDs: {len(claim_dict)})")
print(f"Evidence count: {len(evidence)} (Unique IDs: {len(evidence_dict)})")
print(f"Edges count: {len(edges)}")
print(f"Lineage records count: {len(lineage)}")

# 2. NODES INTEGRITY
print(f"\n--- 2. NODE INTEGRITY & QUALITY METRICS ---")
# Duplicate IDs
node_id_counts = Counter(n['id'] for n in nodes)
dup_ids = [nid for nid, cnt in node_id_counts.items() if cnt > 1]
print(f"Duplicate Node IDs: {len(dup_ids)}")

# Duplicate canonical labels (case-insensitive)
label_counts = Counter(n['canonical_label'].lower().strip() for n in nodes)
dup_labels = [(lbl, cnt) for lbl, cnt in label_counts.items() if cnt > 1]
print(f"Duplicate Canonical Labels (synonym/collision candidates): {len(dup_labels)}")
if dup_labels:
    print(f"  Top duplicated labels: {dup_labels[:5]}")

# Label lengths & characteristics
label_lens = [len(n['canonical_label']) for n in nodes]
word_counts = [len(n['canonical_label'].split()) for n in nodes]
print(f"Label length (chars): min={min(label_lens)}, max={max(label_lens)}, avg={sum(label_lens)/len(label_lens):.1f}")
print(f"Label word count: min={min(word_counts)}, max={max(word_counts)}, avg={sum(word_counts)/len(word_counts):.1f}")

# Check for potential dirty labels (ending with punctuation, symbols, numbers only, etc.)
dirty_labels = []
for n in nodes:
    lbl = n['canonical_label']
    if re.search(r'[.,:;!?]$', lbl) or len(lbl) < 3 or re.search(r'^\d+$', lbl) or re.search(r'[bcdfghjklmnpqrstvwxyz]{4,}', lbl, re.I):
        dirty_labels.append((n['id'], lbl))
print(f"Potentially dirty/corrupted labels detected: {len(dirty_labels)}")
if dirty_labels:
    print(f"  Samples: {dirty_labels[:5]}")

# Subject and Type distribution
subject_counter = Counter(n.get('subject', 'Unknown') for n in nodes)
print("\nSubject Distribution:")
for s, c in subject_counter.most_common(12):
    print(f"  {s}: {c} nodes ({c/len(nodes)*100:.1f}%)")

type_counter = Counter(n.get('type', 'Unknown') for n in nodes)
print("\nTop 10 Types Distribution:")
for t, c in type_counter.most_common(10):
    print(f"  {t}: {c} nodes ({c/len(nodes)*100:.1f}%)")

grade_counter = Counter(n.get('first_grade_verified', 0) for n in nodes)
print("\nGrade Distribution:")
for g in sorted(grade_counter.keys()):
    print(f"  Grade {g}: {grade_counter[g]} nodes")

# 3. REFERENTIAL INTEGRITY & CLAIMS/EVIDENCE
print(f"\n--- 3. REFERENTIAL INTEGRITY (NODES <-> CLAIMS <-> EVIDENCE) ---")
# Node -> Claim
node_to_claims = defaultdict(list)
for c in claims:
    nid = c.get('node_id')
    node_to_claims[nid].append(c)

orphan_nodes = [n['id'] for n in nodes if n['id'] not in node_to_claims]
print(f"Nodes with ZERO claims: {len(orphan_nodes)}")

# Claim -> Evidence
claim_to_evs = defaultdict(list)
for e in evidence:
    cid = e.get('claim_id')
    claim_to_evs[cid].append(e)

orphan_claims = [cid for cid, c in claim_dict.items() if cid not in claim_to_evs]
print(f"Claims with ZERO evidence records: {len(orphan_claims)}")

# Invalid references
invalid_node_refs = [(c.get('claim_id') or c.get('id')) for c in claims if c.get('node_id') not in node_dict]
invalid_claim_refs = [(e.get('id') or e.get('evidence_id')) for e in evidence if e.get('claim_id') not in claim_dict]
print(f"Claims referencing non-existent nodes: {len(invalid_node_refs)}")
print(f"Evidence referencing non-existent claims: {len(invalid_claim_refs)}")

# 4. EVIDENCE VERBATIM GROUNDING IN CLEAN CORPUS
print(f"\n--- 4. EVIDENCE VERBATIM GROUNDING AUDIT (SAMPLE & EXACT CHECK) ---")
# Sample 100 evidence records and check against corpus_clean.jsonl
sample_evs = evidence[:150]
sample_chunk_indices = {e['chunk_index']: e for e in sample_evs if e.get('chunk_index') is not None}

exact_matches = 0
partial_matches = 0
unmatched = 0

with open(CORPUS_PATH, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if idx in sample_chunk_indices:
            e = sample_chunk_indices[idx]
            c_data = json.loads(line)
            chunk_txt = c_data.get('text', '')
            v_quote = e.get('verbatim_quote', '')
            # Strip extra whitespace for comparison
            clean_q = re.sub(r'\s+', ' ', v_quote).strip()
            clean_c = re.sub(r'\s+', ' ', chunk_txt).strip()
            
            if clean_q in clean_c:
                exact_matches += 1
            elif any(part.strip() in clean_c for part in clean_q.split('.') if len(part.strip()) > 20):
                partial_matches += 1
            else:
                unmatched += 1

print(f"Evidence Grounding Check (Sample of {len(sample_evs)}):")
print(f"  Exact Verbatim Match: {exact_matches}/{len(sample_evs)} ({exact_matches/len(sample_evs)*100:.1f}%)")
print(f"  Partial Sub-clause Match: {partial_matches}/{len(sample_evs)}")
print(f"  Unmatched: {unmatched}/{len(sample_evs)}")

# 5. GRAPH TOPOLOGY & DAG HEALTH
print(f"\n--- 5. GRAPH TOPOLOGY (EDGES & KAHN DAG) ---")
# Check edge references
invalid_edges_src = [e for e in edges if e['source'] not in node_dict]
invalid_edges_tgt = [e for e in edges if e['target'] not in node_dict]
print(f"Edges with invalid source: {len(invalid_edges_src)}")
print(f"Edges with invalid target: {len(invalid_edges_tgt)}")

# Self loops
self_loops = [e for e in edges if e['source'] == e['target']]
print(f"Self-loop edges (u == v): {len(self_loops)}")

# Duplicate edges
edge_pairs = Counter((e['source'], e['target'], e['relation']) for e in edges)
dup_edges = [p for p, cnt in edge_pairs.items() if cnt > 1]
print(f"Duplicate edges: {len(dup_edges)}")

# Degree analysis
in_degree = defaultdict(int)
out_degree = defaultdict(int)
for e in edges:
    out_degree[e['source']] += 1
    in_degree[e['target']] += 1

isolated_nodes = [nid for nid in node_dict if in_degree[nid] == 0 and out_degree[nid] == 0]
print(f"Isolated nodes (0 in-degree, 0 out-degree): {len(isolated_nodes)} ({len(isolated_nodes)/len(nodes)*100:.1f}%)")
print(f"Max out-degree: {max(out_degree.values()) if out_degree else 0}")
print(f"Max in-degree: {max(in_degree.values()) if in_degree else 0}")

# Kahn DAG Cycle Check
adj = defaultdict(list)
kahn_in = defaultdict(int)
for nid in node_dict:
    kahn_in[nid] = 0

for e in edges:
    adj[e['source']].append(e['target'])
    kahn_in[e['target']] += 1

queue = deque([nid for nid in node_dict if kahn_in[nid] == 0])
visited_count = 0
while queue:
    curr = queue.popleft()
    visited_count += 1
    for neighbor in adj[curr]:
        kahn_in[neighbor] -= 1
        if kahn_in[neighbor] == 0:
            queue.append(neighbor)

cycles = len(node_dict) - visited_count
print(f"Kahn Algorithm DAG Cycle Test: Visited={visited_count}/{len(node_dict)}, Cycles={cycles}")
print(f"Acyclicity Status: {'PASS (100% DAG)' if cycles == 0 else 'FAIL (Contains Cycles)'}")

# 6. LINEAGE HEALTH
print(f"\n--- 6. LINEAGE HEALTH ---")
lineage_nodes = set(l.get('node_id') for l in lineage)
untracked_nodes = [nid for nid in node_dict if nid not in lineage_nodes]
print(f"Nodes without lineage records: {len(untracked_nodes)}")
lineage_actions = Counter(l.get('action', 'UNKNOWN') for l in lineage)
print("Lineage action distribution:")
for act, cnt in lineage_actions.most_common():
    print(f"  {act}: {cnt}")

print("\nDiagnostic complete.")
