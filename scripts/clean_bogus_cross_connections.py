import glob
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def az_lower(text):
    if not text: return ""
    return str(text).replace('İ', 'i').replace('I', 'ı').lower()

def is_bogus_connection(q_subj, q_grade, q_topic, q_text, cs):
    cs_subj = az_lower(cs.get("subject", "")).strip()
    cs_grade = int(cs.get("grade", 0))
    cs_facet = az_lower(cs.get("facet", "")).strip()
    cs_topic = az_lower(cs.get("topic", "")).strip()

    q_subj_low = az_lower(q_subj)
    combined_q = az_lower(f"{q_topic} {q_text}")

    # 1. Informatics questions linking to Tectonics / Mechanical stress / Geography
    if "informatika" in q_subj_low or "informasiya" in q_subj_low:
        if "tektonik" in cs_facet or "gərginlik" in cs_facet or "deformasiya" in cs_facet or "coğrafiya" in cs_subj or "fizika" in cs_subj:
            return True

    # 2. Grade 1-5 elementary questions linking to high-school (Grade 9-11)
    if q_grade <= 5 and cs_grade >= 9:
        return True

    # 3. Bogus Lipid / Wax connection from "mum" in "ümumi" / "məlumat"
    if "lipid" in cs_facet or "mühafizə örtüyü" in cs_facet or "mumlar" in cs_topic:
        if not any(w in combined_q for w in ["lipid", "vaks", "mum qatı", "kutikula", "transpirasiya", "buxarlanma", "yağlar"]):
            return True

    # 4. Bogus Tectonic Deformations from "fay" / "faylar"
    if "tektonik deformasiya" in cs_facet or "qraben" in cs_topic or "horst" in cs_topic:
        if not any(w in combined_q for w in ["tektonik", "litosfer", "qraben", "horst", "yer qabığı", "orogenez", "zəlzələ"]):
            return True

    # 5. Bogus Mechanical Stress from c_faults anchor
    if "mexaniki gərginlik" in cs_facet or "qüvvə və deformasiya" in cs_topic:
        if not any(w in combined_q for w in ["qüvvə", "gərginlik", "mexaniki", "huk", "deformasiya", "elastiklik", "prujin", "dartılma", "sıxılma"]):
            return True

    # 6. Bogus Proportion / Scale / Density from "nisbət" in "münasibət"
    if "mütənasib" in cs_facet or "miqyas" in cs_facet or "sıxlıq" in cs_facet or "kütlə nisbət" in cs_facet:
        if any(h in q_subj_low for h in ["tarix", "ədəbiyyat", "dili", "ingilis", "alman", "fransız"]):
            return True
        if not any(w in combined_q for w in ["tənasüb", "nisbət", "miqyas", "sıxlıq", "faiz", "mütənasib", "hesablama"]):
            return True

    # 7. History linked to foreign language
    if "tarix" in q_subj_low and any(l in cs_subj for l in ["ingilis", "alman", "fransız", "rus"]):
        return True

    # 8. Language linked to Physics/Chemistry
    if ("dili" in q_subj_low or "ədəbiyyat" in q_subj_low) and any(s in cs_subj for s in ["fizika", "kimya"]):
        return True

    return False

def audit_and_clean(apply_changes=False):
    cleaned_count = 0
    total_cross_evaluated = 0
    cleaned_by_category = {}

    target_patterns = ['data/grades/*.json', 'autonomous_kag/active_staging/*.json']
    files = []
    for pat in target_patterns:
        files.extend(glob.glob(pat))

    for fpath in sorted(set(files)):
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error reading {fpath}: {e}")
            continue

        file_changed = False
        m = re.search(r'grade_(\d+)', fpath)
        file_grade = int(m.group(1)) if m else 6

        entries = data.items() if isinstance(data, dict) else [("root", data)]

        for subj_name, val in entries:
            items = val if isinstance(val, list) else []
            if isinstance(val, dict):
                for subk, subval in val.items():
                    if isinstance(subval, list):
                        items.extend(subval)


            for item in items:
                if not isinstance(item, dict): continue
                qs = item.get('questions', [item]) if 'questions' in item else [item]
                item_topic = item.get('topic') or item.get('topic_key') or ''

                for q in qs:
                    if not isinstance(q, dict): continue
                    bt = q.get('backward_trace')
                    if not isinstance(bt, dict): continue
                    csc = bt.get('cross_subject_connections')
                    if not isinstance(csc, list) or len(csc) == 0: continue

                    q_txt = q.get('question', '')
                    q_top = q.get('topic') or item_topic

                    valid_csc = []
                    for cs in csc:
                        total_cross_evaluated += 1
                        if is_bogus_connection(subj_name, file_grade, q_top, q_txt, cs):
                            cleaned_count += 1
                            cat = f"{subj_name} -> {cs.get('subject')} ({cs.get('facet')})"
                            cleaned_by_category[cat] = cleaned_by_category.get(cat, 0) + 1
                            file_changed = True
                        else:
                            valid_csc.append(cs)

                    if len(valid_csc) > 0:
                        bt['cross_subject_connections'] = valid_csc
                    else:
                        bt.pop('cross_subject_connections', None)
                        file_changed = True

        if apply_changes and file_changed:
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Total cross connections evaluated: {total_cross_evaluated}")
    print(f"Total bogus cross connections detected: {cleaned_count}")
    print(f"Remaining legitimate cross connections: {total_cross_evaluated - cleaned_count}")
    print("\nTop 20 Bogus Connections Cleaned:")
    for cat, cnt in sorted(cleaned_by_category.items(), key=lambda x: x[1], reverse=True)[:20]:
        print(f"  [{cnt}x] {cat}")

if __name__ == "__main__":
    apply = "--apply" in sys.argv
    print(f"Running bogus cross connection cleaner (apply_changes={apply})...")
    audit_and_clean(apply_changes=apply)
