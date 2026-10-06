import json
import re

print("Loading ontology core files for TypeScript registry build...")

with open('data/ontology/nodes.jsonl', 'r', encoding='utf-8') as f:
    nodes = [json.loads(line) for line in f if line.strip()]

with open('data/ontology/edges.jsonl', 'r', encoding='utf-8') as f:
    edges = [json.loads(line) for line in f if line.strip()]

with open('data/ontology/claims.jsonl', 'r', encoding='utf-8') as f:
    claims = [json.loads(line) for line in f if line.strip()]

with open('data/ontology/audit/evidence_registry.jsonl', 'r', encoding='utf-8') as f:
    evidence = [json.loads(line) for line in f if line.strip()]

node_map = {n['id']: n for n in nodes}

# Build node -> claim statement
node_claim_map = {}
for c in claims:
    nid = c.get('node_id')
    stmt = c.get('statement') or c.get('text') or ''
    if nid and stmt and nid not in node_claim_map:
        node_claim_map[nid] = stmt

# Helper to format clean human textbook title
def format_book_title(book_id, subject, grade):
    if not book_id:
        return f"{subject} {grade}"
    b = str(book_id).replace("-h1", " (hissə 1)").replace("-h2", " (hissə 2)").replace("-", " ")
    # Capitalize
    words = b.split()
    formatted = " ".join(w.capitalize() if not w.isdigit() else w for w in words)
    return formatted

# Build node -> book
node_book_map = {}
for e in evidence:
    nid = e.get('node_id')
    bid = e.get('book_id')
    if nid and bid and nid not in node_book_map:
        n = node_map.get(nid, {})
        subj = n.get('subject', 'Dərslik')
        gr = n.get('first_grade_verified', e.get('grade', 5))
        node_book_map[nid] = format_book_title(bid, subj, gr)

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
    prereq_node = node_map.get(prereq_id) if prereq_id else None
    prereq_lbl = prereq_node['canonical_label'] if prereq_node else None
    prereq_grade = prereq_node.get('first_grade_verified', 5) if prereq_node else None
    prereq_book = node_book_map.get(prereq_id, f"{prereq_node['subject']} {prereq_grade}" if prereq_node else None)
    prereq_claim = node_claim_map.get(prereq_id) if prereq_id else None

    dist_id = distractor_map.get(nid)
    dist_node = node_map.get(dist_id) if dist_id else None
    dist_lbl = dist_node['canonical_label'] if dist_node else None

    item = {
        'id': nid,
        'stem': stem,
        'aliases': n.get('aliases', []),
        'label': lbl,
        'type': n['type'],
        'subject': n['subject'],
        'firstGradeVerified': n.get('first_grade_verified', 5),
        'claim': node_claim_map.get(nid),
        'book': node_book_map.get(nid, f"{n['subject']} {n.get('first_grade_verified', 5)}"),
        'prereqId': prereq_id,
        'prereqLabel': prereq_lbl,
        'prereqGrade': prereq_grade,
        'prereqBook': prereq_book,
        'prereqClaim': prereq_claim,
        'distId': dist_id,
        'distLabel': dist_lbl
    }
    items.append(item)

print(f"Generated {len(items)} registry items with hydrated prerequisite claims & books.")

ts_lines = []
ts_lines.append("\n// ============================================================================")
ts_lines.append("// CANONICAL ONTOLOGY REGISTRY & RESOLVER (SİTG Gold Core v5.0 - HYDRATED)")
ts_lines.append("// ============================================================================\n")
ts_lines.append("export interface CanonicalOntologyMatch {")
ts_lines.append("  id: string")
ts_lines.append("  label: string")
ts_lines.append("  type: string")
ts_lines.append("  subject: string")
ts_lines.append("  firstGradeVerified: number")
ts_lines.append("  claim?: string")
ts_lines.append("  book?: string")
ts_lines.append("  prerequisiteId?: string")
ts_lines.append("  prerequisiteLabel?: string")
ts_lines.append("  prerequisiteGrade?: number")
ts_lines.append("  prerequisiteBook?: string")
ts_lines.append("  prerequisiteClaim?: string")
ts_lines.append("  distractorId?: string")
ts_lines.append("  distractorLabel?: string")
ts_lines.append("}\n")
ts_lines.append("const CANONICAL_ONTOLOGY_REGISTRY = " + json.dumps(items, ensure_ascii=False, indent=2) + ";\n")
ts_lines.append("""export function resolveCanonicalOntologyNode(text: string, subject?: string): CanonicalOntologyMatch | null {
  if (!text) return null
  const lowText = text.toLowerCase()
  
  for (const item of CANONICAL_ONTOLOGY_REGISTRY) {
    const candidates = [item.stem, ...(item.aliases || []).map((a: string) => a.toLowerCase().trim())]
    if (candidates.some((c: string) => c && c.length >= 2 && (lowText.includes(c) || new RegExp(`\\\\b${c}\\\\b`, 'i').test(lowText)))) {
      return {
        id: item.id,
        label: item.label,
        type: item.type,
        subject: item.subject,
        firstGradeVerified: item.firstGradeVerified,
        claim: item.claim || undefined,
        book: item.book || undefined,
        prerequisiteId: item.prereqId || undefined,
        prerequisiteLabel: item.prereqLabel || undefined,
        prerequisiteGrade: item.prereqGrade || undefined,
        prerequisiteBook: item.prereqBook || undefined,
        prerequisiteClaim: item.prereqClaim || undefined,
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

print("Updated fully hydrated canonical ontology registry in lib/runtime-kag-guard.ts successfully!")
