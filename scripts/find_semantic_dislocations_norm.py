#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import glob
import os
import re

print("Deep normalized scan for semantic dislocations...")

def norm(s):
    if not s: return ""
    return str(s).replace('İ', 'i').replace('I', 'ı').replace('ə', 'e').lower()

dislocations = []

for fpath in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fpath: continue
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for subj_name, topics in data.items():
        if not isinstance(topics, dict): continue
        s_norm = norm(subj_name)

        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list) or len(q_list) == 0: continue
            t_norm = norm(topic_name)

            for idx, q in enumerate(q_list):
                q_num = idx + 1
                bt = q.get('backward_trace', {})
                if not isinstance(bt, dict): continue

                rc = str(bt.get('root_concept', '') or '').strip()
                rc_norm = norm(rc)

                is_dislocated = False
                reason = ""

                # 1. INFORMATIKA
                if 'informatika' in s_norm:
                    # Modeling topic mapped to Cybercrime / Security / Phishing / Ethics
                    if any(w in t_norm for w in ['model', 'modellesdirme', 'formalizasiya', 'adekvatliq']):
                        if any(w in rc_norm for w in ['cinayet', 'kibertehlukesizlik', 'fisinq', 'etik', 'virus', 'spaminq', 'dos']):
                            is_dislocated = True
                            reason = "Modeling mapped to Cybercrime/Security"
                    # Algorithm / Code mapped to Cybercrime / Hardware
                    elif any(w in t_norm for w in ['alqoritm', 'proqramlasdirma', 'python', 'dovr']):
                        if any(w in rc_norm for w in ['cinayet', 'kibertehlukesizlik', 'fisinq', 'etik']):
                            is_dislocated = True
                            reason = "Algorithm/Code mapped to Cybercrime"
                    # Hardware mapped to Cybercrime / Ethics
                    elif any(w in t_norm for w in ['prosessor', 'yaddas', 'qurgu', 'aparat']):
                        if any(w in rc_norm for w in ['cinayet', 'kibertehlukesizlik', 'fisinq', 'etik']):
                            is_dislocated = True
                            reason = "Hardware mapped to Cybercrime"

                # 2. FIZIKA
                elif 'fizika' in s_norm:
                    if any(w in t_norm for w in ['mexaniki', 'suret', 'tecil', 'yerdeyisme', 'surunme', 'agirliq']):
                        if any(w in rc_norm for w in ['lorens', 'qaz bosalmasi', 'isigin yayilma', 'amper']):
                            is_dislocated = True
                            reason = "Mechanics mapped to EM/Optics"
                    elif any(w in t_norm for w in ['temperatur', 'buxar', 'mkt', 'rutubet', 'qaz', 'termodinamika', 'istilik', 'gerilme', 'kapilyar']):
                        if any(w in rc_norm for w in ['lorens', 'qaz bosalmasi', 'isigin yayilma', 'amper']):
                            is_dislocated = True
                            reason = "Thermal/Molecular mapped to EM/Optics"

                # 3. TARIX
                elif 'tarix' in s_norm:
                    if any(w in t_norm for w in ['qedim', 'ibtidai', 'manna', 'midiya', 'atropatena', 'albaniya', 'sumer', 'misir', 'roma']):
                        if any(w in rc_norm for w in ['ssri', 'xviii esr', 'xix esr', 'xx esr', 'soyuq muharibe', 'musteqillik']):
                            is_dislocated = True
                            reason = "Ancient history mapped to Modern/Contemporary"

                # 4. COGRAFIYA
                elif 'cografiya' in s_norm:
                    # Physical geography mapped to Economic / Demographic
                    if any(w in t_norm for w in ['litosfer', 'atmosfer', 'hidrosfer', 'relyef', 'vulkan', 'tektonik']):
                        if any(w in rc_norm for w in ['ehali', 'senaye', 'neqliyyat', 'teserrufat', 'urbanizasiya']):
                            is_dislocated = True
                            reason = "Physical geography mapped to Economic/Demographic"

                # 5. BIOLOGIYA
                elif 'biologiya' in s_norm:
                    # Plants / Botany mapped to Human Anatomy / Genetics
                    if any(w in t_norm for w in ['bitki', 'yarpaq', 'goyert', 'fotosintez', 'kok', 'cicek']):
                        if any(w in rc_norm for w in ['insan skeleti', 'qan dovran', 'eseb sistemi', 'urey']):
                            is_dislocated = True
                            reason = "Botany mapped to Human Anatomy"

                if is_dislocated:
                    dislocations.append({
                        "file": fname, "subj": subj_name, "topic": topic_name, "q_num": q_num,
                        "rc": rc, "reason": reason
                    })

print(f"\nTotal Dislocations Found: {len(dislocations)}")
by_topic = {}
for d in dislocations:
    k = f"{d['file']} | {d['subj']} | {d['topic']}"
    if k not in by_topic:
        by_topic[k] = {"count": 0, "rc": d["rc"], "reason": d["reason"]}
    by_topic[k]["count"] += 1

print(f"Unique Topics Affected: {len(by_topic)}")
for top, info in by_topic.items():
    print(f"  - [{top}] ({info['count']} qs): {info['reason']} -> Root: '{info['rc']}'")

with open('scripts/dislocations_detailed.json', 'w', encoding='utf-8') as f:
    json.dump(by_topic, f, ensure_ascii=False, indent=2)
