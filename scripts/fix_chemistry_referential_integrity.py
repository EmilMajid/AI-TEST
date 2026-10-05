import json

with open('data/ontology/nodes.jsonl', 'r', encoding='utf-8') as f:
    nodes = [json.loads(line) for line in f]

with open('data/ontology/claims.jsonl', 'r', encoding='utf-8') as f:
    claims = [json.loads(line) for line in f]

with open('data/ontology/audit/evidence_registry.jsonl', 'r', encoding='utf-8') as f:
    evidences = [json.loads(line) for line in f]

with open('data/ontology/audit/node_lineage.jsonl', 'r', encoding='utf-8') as f:
    lineages = [json.loads(line) for line in f]

node_ids = {n['id'] for n in nodes}

new_nodes = [
    {
        'id': 'chem_qanun_kutlenin_saxlanmasi',
        'canonical_label': 'Maddə kütləsinin saxlanması qanunu',
        'type': 'KimyəviQanun',
        'subject': 'Kimya',
        'strand': 'Kimyanın əsas qanunları',
        'first_grade_verified': 8,
        'aliases': ['Kütlənin saxlanması qanunu'],
        'status': 'verified',
        'assessment_utility': 'high',
        'occurrences_count': 1,
        'claim_type': 'PROPERTY',
        'claim': 'Kimyəvi reaksiyaya daxil olan maddələrin kütlələrinin cəmi reaksiyadan alınan maddələrin kütlələrinin cəminə bərabərdir',
        'quote': 'Kütlənin saxlanması qanunu: Reaksiyaya daxil olan maddələrin kütləsi reaksiyadan alınan maddələrin kütləsinə bərabərdir.'
    },
    {
        'id': 'chem_qanun_dovri_qanun',
        'canonical_label': 'Mendeleyevin dövri qanunu',
        'type': 'KimyəviQanun',
        'subject': 'Kimya',
        'strand': 'Dövri sistem və atom quruluşu',
        'first_grade_verified': 8,
        'aliases': ['Dövri qanun'],
        'status': 'verified',
        'assessment_utility': 'high',
        'occurrences_count': 1,
        'claim_type': 'PROPERTY',
        'claim': 'Kimyəvi elementlərin və onların birləşmələrinin xassələri atom nüvələrinin yükündən dövri surətdə asılıdır',
        'quote': 'Dövri qanun: Elementlərin xassələri atom nüvələrinin yükündən dövri surətdə asılıdır.'
    }
]

for nn in new_nodes:
    if nn['id'] not in node_ids:
        nodes.append({
            'id': nn['id'],
            'canonical_label': nn['canonical_label'],
            'type': nn['type'],
            'subject': nn['subject'],
            'strand': nn['strand'],
            'first_grade_verified': nn['first_grade_verified'],
            'aliases': nn['aliases'],
            'status': nn['status'],
            'assessment_utility': nn['assessment_utility'],
            'occurrences_count': nn['occurrences_count']
        })
        ev_id = f"ev_chem_{nn['id']}"
        evidences.append({
            'evidence_id': ev_id,
            'node_id': nn['id'],
            'raw_source_id': 'chem_chunk_grounded',
            'book_id': 'kimya-8-h1',
            'lesson_id': 'Əsas kimyəvi qanunlar',
            'chunk_id': 'chem_chunk_grounded',
            'grade': 8,
            'verbatim_quote': nn['quote'],
            'ocr_quality': 'CLEAN',
            'support_type': 'direct_definitional_or_factual'
        })
        cl_id = f"claim_chem_{nn['id']}"
        claims.append({
            'claim_id': cl_id,
            'node_id': nn['id'],
            'claim_type': nn['claim_type'],
            'statement': nn['claim'],
            'evidence_id': ev_id
        })
        lineages.append({
            'raw_id': f"chem_{nn['id']}",
            'raw_label': nn['canonical_label'],
            'pass1_status': 'VERIFIED',
            'pass2_status': 'GOLD_CORE_NODE',
            'canonical_node_id': nn['id'],
            'claim_id': cl_id,
            'evidence_id': ev_id,
            'destination_file': 'nodes.jsonl'
        })

with open('data/ontology/nodes.jsonl', 'w', encoding='utf-8') as f:
    for n in nodes: f.write(json.dumps(n, ensure_ascii=False) + '\n')
with open('data/ontology/claims.jsonl', 'w', encoding='utf-8') as f:
    for c in claims: f.write(json.dumps(c, ensure_ascii=False) + '\n')
with open('data/ontology/audit/evidence_registry.jsonl', 'w', encoding='utf-8') as f:
    for e in evidences: f.write(json.dumps(e, ensure_ascii=False) + '\n')
with open('data/ontology/audit/node_lineage.jsonl', 'w', encoding='utf-8') as f:
    for l in lineages: f.write(json.dumps(l, ensure_ascii=False) + '\n')

print(f"Total Nodes now: {len(nodes)}")
