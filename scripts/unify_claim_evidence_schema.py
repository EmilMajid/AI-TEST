import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

CLAIMS_PATH = 'data/ontology/claims.jsonl'
EVIDENCE_PATH = 'data/ontology/audit/evidence_registry.jsonl'

with open(CLAIMS_PATH, 'r', encoding='utf-8') as f:
    claims = [json.loads(line) for line in f if line.strip()]

with open(EVIDENCE_PATH, 'r', encoding='utf-8') as f:
    evidence = [json.loads(line) for line in f if line.strip()]

# Build mapping from claim to evidence and vice versa
# For early claims: claim has 'claim_id', 'evidence_id'
ev_by_id = {}
for e in evidence:
    eid = e.get('evidence_id') or e.get('id')
    ev_by_id[eid] = e

unified_claims = []
unified_evidence = []

claim_to_ev = {}
for c in claims:
    cid = c.get('claim_id') or c.get('id')
    nid = c.get('node_id')
    eid = c.get('evidence_id') or f"ev_{nid}"
    
    # Standardize claim object
    new_c = {
        'claim_id': cid,
        'node_id': nid,
        'claim_type': c.get('claim_type', 'DEFINITION'),
        'statement': c.get('statement') or c.get('text', ''),
        'evidence_id': eid
    }
    if 'formal_predicate' in c:
        new_c['formal_predicate'] = c['formal_predicate']
    if 'grade_level' in c:
        new_c['grade_level'] = c['grade_level']
    if 'complexity' in c:
        new_c['complexity'] = c['complexity']
    unified_claims.append(new_c)
    claim_to_ev[cid] = eid

# Match evidence
for e in evidence:
    eid = e.get('evidence_id') or e.get('id')
    nid = e.get('node_id')
    cid = e.get('claim_id')
    if not cid:
        # Search which claim references this evidence
        for uc in unified_claims:
            if uc['evidence_id'] == eid:
                cid = uc['claim_id']
                break
        if not cid:
            cid = f"claim_{nid}"
            
    chunk_idx = e.get('chunk_index')
    if chunk_idx is None and 'chunk_id' in e:
        chunk_idx = e['chunk_id']
        
    new_e = {
        'evidence_id': eid,
        'id': eid, # keep both for backwards compatibility
        'claim_id': cid,
        'node_id': nid,
        'book_id': e.get('book_id', ''),
        'chunk_index': chunk_idx,
        'grade': e.get('grade', 5),
        'verbatim_quote': e.get('verbatim_quote', ''),
        'ocr_quality': e.get('ocr_quality', 'CLEAN'),
        'confidence': e.get('confidence', 1.0)
    }
    unified_evidence.append(new_e)

with open(CLAIMS_PATH, 'w', encoding='utf-8') as f:
    for c in unified_claims:
        f.write(json.dumps(c, ensure_ascii=False) + '\n')

with open(EVIDENCE_PATH, 'w', encoding='utf-8') as f:
    for e in unified_evidence:
        f.write(json.dumps(e, ensure_ascii=False) + '\n')

print(f"Schema unification completed: {len(unified_claims)} claims, {len(unified_evidence)} evidence records.")
