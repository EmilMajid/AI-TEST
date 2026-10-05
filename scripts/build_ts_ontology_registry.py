import json

with open('data/ontology/nodes.jsonl', 'r', encoding='utf-8') as f:
    nodes = [json.loads(line) for line in f]

with open('data/ontology/edges.jsonl', 'r', encoding='utf-8') as f:
    edges = [json.loads(line) for line in f]

node_map = {n['id']: n for n in nodes}

prereq_map = {}
distractor_map = {}

for e in edges:
    if e['relation'] == 'PREREQUISITE_OF':
        prereq_map[e['target']] = e['source']
    elif e['relation'] == 'CONTRASTS_WITH':
        distractor_map[e['source']] = e['target']
        distractor_map[e['target']] = e['source']

items = []
for n in nodes:
    nid = n['id']
    lbl = n['canonical_label']
    stem = lbl.lower().replace(' döyüşü', '').replace(' sülhü', '').replace(' müqaviləsi', '').replace(' teoremi', '').replace(' qanunu', '').replace(' prosesi', '').replace(' düsturu', '').replace(' xəstəliyi', '').strip()
    prereq_id = prereq_map.get(nid)
    prereq_lbl = node_map[prereq_id]['canonical_label'] if prereq_id else None
    dist_id = distractor_map.get(nid)
    dist_lbl = node_map[dist_id]['canonical_label'] if dist_id else None
    
    items.append({
        'id': nid,
        'stem': stem,
        'aliases': n.get('aliases', []),
        'label': lbl,
        'type': n['type'],
        'subject': n['subject'],
        'firstGradeVerified': n['first_grade_verified'],
        'prereqId': prereq_id,
        'prereqLabel': prereq_lbl,
        'distId': dist_id,
        'distLabel': dist_lbl
    })

print(f"Generated {len(items)} registry items.")

ts_lines = []
ts_lines.append("\n// ============================================================================")
ts_lines.append("// CANONICAL ONTOLOGY REGISTRY & RESOLVER (SİTG Gold Core v5.0)")
ts_lines.append("// ============================================================================\n")
ts_lines.append("export interface CanonicalOntologyMatch {")
ts_lines.append("  id: string")
ts_lines.append("  label: string")
ts_lines.append("  type: string")
ts_lines.append("  subject: string")
ts_lines.append("  firstGradeVerified: number")
ts_lines.append("  prerequisiteId?: string")
ts_lines.append("  prerequisiteLabel?: string")
ts_lines.append("  distractorId?: string")
ts_lines.append("  distractorLabel?: string")
ts_lines.append("}\n")
ts_lines.append("const CANONICAL_ONTOLOGY_REGISTRY = " + json.dumps(items, ensure_ascii=False, indent=2) + ";\n")
ts_lines.append("""export function resolveCanonicalOntologyNode(text: string, subject?: string): CanonicalOntologyMatch | null {
  if (!text) return null
  const lowText = text.toLowerCase()
  
  for (const item of CANONICAL_ONTOLOGY_REGISTRY) {
    const candidates = [item.stem, ...(item.aliases || []).map((a: string) => a.toLowerCase().trim())]
    if (candidates.some((c: string) => c && c.length >= 2 && (lowText.includes(c) || new RegExp(`\\b${c}\\b`, 'i').test(lowText)))) {
      return {
        id: item.id,
        label: item.label,
        type: item.type,
        subject: item.subject,
        firstGradeVerified: item.firstGradeVerified,
        prerequisiteId: item.prereqId || undefined,
        prerequisiteLabel: item.prereqLabel || undefined,
        distractorId: item.distId || undefined,
        distractorLabel: item.distLabel || undefined
      }
    }
  }
  return null
}
""")

ts_code = '\n'.join(ts_lines)

with open('lib/runtime-kag-guard.ts', 'r', encoding='utf-8') as f:
    guard_content = f.read()

# Strip existing registry if present
idx = guard_content.find('// CANONICAL ONTOLOGY REGISTRY & RESOLVER')
if idx != -1:
    prev_comment = guard_content.rfind('// ======================================', 0, idx)
    if prev_comment != -1:
        guard_content = guard_content[:prev_comment].strip()
    else:
        guard_content = guard_content[:idx].strip()

with open('lib/runtime-kag-guard.ts', 'w', encoding='utf-8') as f:
    f.write(guard_content + '\n' + ts_code)
print("Updated canonical ontology registry in lib/runtime-kag-guard.ts successfully!")
