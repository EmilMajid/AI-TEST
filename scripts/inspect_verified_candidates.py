import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/ontology/pilot_adjudicated_nodes.jsonl', 'r', encoding='utf-8') as f:
    items = [json.loads(line) for line in f]

verified = [it for it in items if it['status'] == 'VERIFIED']

print(f"=== ALL {len(verified)} CANDIDATES IN CURRENT VERIFIED POOL ===")
for idx, v in enumerate(verified, 1):
    orig = v['original_node']
    subj = orig.get('subject_domain')
    nid = orig['id']
    ntype = v['adjudicated_type']
    lbl = orig['label_az'].replace('\n', ' ')
    print(f"{idx:02d}. [{subj}] {nid} | {ntype} | \"{lbl}\"")
