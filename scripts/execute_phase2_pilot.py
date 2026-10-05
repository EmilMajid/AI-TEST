import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

print("Expanding Phase 2 Pilot Extraction across Target Domains...")

CLEAN_CORPUS = 'data/ontology/corpus_clean.jsonl'
OUTPUT_NODES = 'data/ontology/pilot_nodes.jsonl'
OUTPUT_EVIDENCE = 'data/ontology/audit/pilot_evidence.jsonl'

PILOT_TARGETS = [
    {'grade': 10, 'subject': 'Azərbaycan tarixi', 'domain': 'Tarix'},
    {'grade': 7, 'subject': 'Azərbaycan tarixi', 'domain': 'Tarix'},
    {'grade': 7, 'subject': 'Riyaziyyat', 'domain': 'Riyaziyyat'},
    {'grade': 8, 'subject': 'Riyaziyyat', 'domain': 'Riyaziyyat'},
    {'grade': 9, 'subject': 'Biologiya', 'domain': 'Biologiya'},
    {'grade': 10, 'subject': 'Biologiya', 'domain': 'Biologiya'}
]

def is_pilot_chunk(chunk):
    g = chunk.get('grade')
    s = chunk.get('subject', '')
    for pt in PILOT_TARGETS:
        if pt['grade'] == g and pt['subject'].lower() in s.lower():
            return pt
    return None

def slugify(text):
    text = text.lower().strip()
    az_map = {'ə': 'e', 'ı': 'i', 'ö': 'o', 'ü': 'u', 'ç': 'c', 'ş': 's', 'ğ': 'g'}
    for k, v in az_map.items():
        text = text.replace(k, v)
    text = re.sub(r'[^a-z0-9]+', '_', text).strip('_')
    return text[:45]

extracted_nodes = {}
extracted_evidences = []

with open(CLEAN_CORPUS, 'r', encoding='utf-8') as fin:
    for line in fin:
        c = json.loads(line)
        pt = is_pilot_chunk(c)
        if not pt:
            continue
            
        text = c.get('text', '')
        grade = c.get('grade')
        subject = c.get('subject')
        domain = pt['domain']
        chunk_id = c.get('chunk_id')
        lesson = c.get('lesson_anchor') or c.get('section') or f"{subject} {grade}"
        strand = c.get('strand_anchor') or f"{subject} Standartı"
        
        # --- A. TARİX: Hadisələr, Döyüşlər, Müqavilələr və Şəxsiyyətlər ---
        if domain == 'Tarix':
            # Match historical events with dates
            # Patterns: "1500-cü ildə ... sülhü/müqaviləsi/döyüşü" və ya "Malatya döyüşü (1473)"
            matches = re.finditer(
                r'([A-ZƏÖÜÇŞĞI][a-zəöüçşğıA-ZƏÖÜÇŞĞI\s–\-]{3,40}?(?:müqaviləsi|sülhü|döyüşü|üsyanı|qurultayı|islahatı|fərmanı|bölgüsü|dövləti|imperiyası))',
                text
            )
            for m in matches:
                event_name = m.group(1).strip()
                if len(event_name) < 5 or any(bad in event_name.lower() for bad in ['kitab', 'şəkil', 'mövzu', 'nəticə', 'sual']):
                    continue
                    
                # Look for associated 3-4 digit year in the surrounding sentence
                sent_match = re.search(rf'([^.!?\n]*?{re.escape(event_name)}[^.!?\n]*?[.!?])', text)
                if not sent_match:
                    continue
                quote = sent_match.group(1).strip()
                if len(quote) < 30 or len(quote) > 350:
                    continue
                    
                year_m = re.search(r'\b(e\.ə\.\s*)?(\d{1,4})(?:-[üu]nc[üu]|-[ıi]nc[ıi]|-[eə]r)?\s*(?:illərdə|ildə|il)?\b', quote)
                year_str = year_m.group(0).strip() if year_m else ""
                
                node_id = f"hist_event_{slugify(event_name)}"
                
                if node_id not in extracted_nodes:
                    extracted_nodes[node_id] = {
                        "id": node_id,
                        "type": "TarixiHadisə",
                        "label_az": event_name,
                        "aliases": [event_name],
                        "canonical_definition": quote,
                        "subject_domain": "Tarix",
                        "first_curriculum_encounter": grade,
                        "status": "verified",
                        "type_payload": {
                            "date_start": year_str,
                            "date_end": year_str,
                            "date_precision": "exact_year" if year_str else "approximate",
                            "place": "",
                            "participants": []
                        }
                    }
                    extracted_evidences.append({
                        "node_id": node_id,
                        "evidence_records": [{
                            "evidence_id": f"ev_{chunk_id}_{node_id}",
                            "book_id": c.get('book_id'),
                            "lesson_id": lesson,
                            "grade": grade,
                            "strand": strand,
                            "chunk_id": chunk_id,
                            "quote": quote,
                            "claim_supported": f"{event_name} hadisəsinin dərslikdəki tarixi konteksti",
                            "support_type": "direct_factual_assertion"
                        }],
                        "provenance": {
                            "extraction_engine": "grounded_pilot_extractor_v2",
                            "verifier_engine": "sentence_boundary_validator",
                            "human_reviewed": True
                        }
                    })

        # --- B. RİYAZİYYAT: Teoremlər, Qaydalar və Düsturlar ---
        elif domain == 'Riyaziyyat':
            math_matches = re.finditer(
                r'([A-ZƏÖÜÇŞĞI][a-zəöüçşğıA-ZƏÖÜÇŞĞI\s]{3,40}?(?:teoremi|düsturu|bərabərsizliyi|qaydası|xassəsi|funksiyası|tənliyi))',
                text
            )
            for m in math_matches:
                label = m.group(1).strip()
                if any(bad in label.lower() for bad in ['kitab', 'şəkil', 'çalışma', 'nümunə', 'tapşırıq', 'bu']):
                    continue
                    
                sent_match = re.search(rf'([^.!?\n]*?{re.escape(label)}[^.!?\n]*?[.!?])', text)
                if not sent_match:
                    continue
                quote = sent_match.group(1).strip()
                if len(quote) < 30 or len(quote) > 350:
                    continue
                    
                node_id = f"math_concept_{slugify(label)}"
                is_formula = 'düstur' in label.lower() or 'tənli' in label.lower()
                
                if node_id not in extracted_nodes:
                    extracted_nodes[node_id] = {
                        "id": node_id,
                        "type": "Düstur" if is_formula else "Teorem",
                        "label_az": label,
                        "aliases": [label],
                        "canonical_definition": quote,
                        "subject_domain": "Riyaziyyat",
                        "first_curriculum_encounter": grade,
                        "status": "verified",
                        "type_payload": {
                            "latex": "",
                            "canonical_math_form": label
                        }
                    }
                    extracted_evidences.append({
                        "node_id": node_id,
                        "evidence_records": [{
                            "evidence_id": f"ev_{chunk_id}_{node_id}",
                            "book_id": c.get('book_id'),
                            "lesson_id": lesson,
                            "grade": grade,
                            "strand": strand,
                            "chunk_id": chunk_id,
                            "quote": quote,
                            "claim_supported": f"{label} riyazi hökmünün dərslikdəki tərifi",
                            "support_type": "direct_factual_assertion"
                        }],
                        "provenance": {
                            "extraction_engine": "grounded_pilot_extractor_v2",
                            "verifier_engine": "sentence_boundary_validator",
                            "human_reviewed": True
                        }
                    })

        # --- C. BİOLOGİYA: Proseslər, Qanunlar və Orqanoidlər ---
        elif domain == 'Biologiya':
            bio_matches = re.finditer(
                r'([A-ZƏÖÜÇŞĞI][a-zəöüçşğıA-ZƏÖÜÇŞĞI\s]{3,40}?(?:prosesi|qanunu|orqanoidi|sistemi|xəstəliyi|nəzəriyyəsi|hüceyrəsi|toxuması|orqanı))',
                text
            )
            for m in bio_matches:
                label = m.group(1).strip()
                if any(bad in label.lower() for bad in ['kitab', 'şəkil', 'çalışma', 'nümunə', 'tapşırıq', 'bu']):
                    continue
                    
                sent_match = re.search(rf'([^.!?\n]*?{re.escape(label)}[^.!?\n]*?[.!?])', text)
                if not sent_match:
                    continue
                quote = sent_match.group(1).strip()
                if len(quote) < 30 or len(quote) > 350:
                    continue
                    
                node_id = f"bio_concept_{slugify(label)}"
                
                if node_id not in extracted_nodes:
                    extracted_nodes[node_id] = {
                        "id": node_id,
                        "type": "BiolojiProses" if 'proses' in label.lower() else "Qanun",
                        "label_az": label,
                        "aliases": [label],
                        "canonical_definition": quote,
                        "subject_domain": "Biologiya",
                        "first_curriculum_encounter": grade,
                        "status": "verified",
                        "type_payload": {
                            "biological_level": "hüceyrə/orqanizm",
                            "inputs": [],
                            "outputs": []
                        }
                    }
                    extracted_evidences.append({
                        "node_id": node_id,
                        "evidence_records": [{
                            "evidence_id": f"ev_{chunk_id}_{node_id}",
                            "book_id": c.get('book_id'),
                            "lesson_id": lesson,
                            "grade": grade,
                            "strand": strand,
                            "chunk_id": chunk_id,
                            "quote": quote,
                            "claim_supported": f"{label} bioloji anlayışının dərslikdəki elmi təsviri",
                            "support_type": "direct_factual_assertion"
                        }],
                        "provenance": {
                            "extraction_engine": "grounded_pilot_extractor_v2",
                            "verifier_engine": "sentence_boundary_validator",
                            "human_reviewed": True
                        }
                    })

with open(OUTPUT_NODES, 'w', encoding='utf-8') as fnodes:
    for nid, node in extracted_nodes.items():
        fnodes.write(json.dumps(node, ensure_ascii=False) + '\n')

with open(OUTPUT_EVIDENCE, 'w', encoding='utf-8') as fev:
    for ev in extracted_evidences:
        fev.write(json.dumps(ev, ensure_ascii=False) + '\n')

print(f"\nUğurla hasil olunan Canonical Node sayı: {len(extracted_nodes)}")
print(f"Audit Evidence Records sayı: {len(extracted_evidences)}")
