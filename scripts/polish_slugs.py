#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KAG v8.1 Final Polish:
Normalizes all kebab-case / slug subject names (e.g. 'rus-dili-7 6' -> 'Rus dili 6')
across all 11 grades.
"""

import os
import sys
import json
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "grades")
STAGING_DIR = os.path.join(os.path.dirname(__file__), "..", "autonomous_kag", "active_staging")

SUBJECT_MAP = {
    "rus-dili": "Rus dili",
    "ingilis-dili": "İngilis dili",
    "alman-dili": "Alman dili",
    "fransiz-dili": "Fransız dili",
    "azerbaycan-dili": "Azərbaycan dili",
    "az-dili": "Azərbaycan dili",
    "riyaziyyat": "Riyaziyyat",
    "fizika": "Fizika",
    "kimya": "Kimya",
    "biologiya": "Biologiya",
    "cografiya": "Coğrafiya",
    "tarix": "Tarix",
    "umumi-tarix": "Ümumi tarix",
    "az-tarixi": "Azərbaycan tarixi",
    "edebiyyat": "Ədəbiyyat",
    "informatika": "İnformatika",
    "tebiet": "Təbiət",
    "heyat-bilgisi": "Həyat bilgisi"
}

def normalize_subj_title(raw_subj: str) -> str:
    s = str(raw_subj).strip()
    s = re.sub(r"\s*\([^)]*\)", "", s)
    s = re.sub(r"[-_\s]+\d+$", "", s).strip().lower()
    
    if s in SUBJECT_MAP:
        return SUBJECT_MAP[s]
        
    s = s.replace("-", " ").replace("_", " ")
    words = s.split()
    if words:
        words[0] = words[0].capitalize()
        for i in range(1, len(words)):
            if words[i] in ["dili", "tarixi", "bilgisi"]:
                words[i] = words[i].lower()
            else:
                words[i] = words[i].capitalize()
        return " ".join(words)
    return s.capitalize()

def polish():
    total_fixed = 0
    for g in range(1, 12):
        fpath = os.path.join(DATA_DIR, f"grade_{g}.json")
        if not os.path.exists(fpath): continue
        with open(fpath, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        g_changed = False
        for subj, tops in data.items():
            if not isinstance(tops, dict): continue
            clean_s = normalize_subj_title(subj)
            
            for top, qs in tops.items():
                if not isinstance(qs, list): continue
                clean_top = re.sub(r"^[0-9ivxlcdm]+[\.\:\-]*\s*", "", top).strip()
                
                for q in qs:
                    if not isinstance(q, dict): continue
                    bt = q.get("backward_trace")
                    if not isinstance(bt, dict): continue
                    
                    rb = str(bt.get("root_book", "")).strip()
                    rc = str(bt.get("root_concept", "")).strip()
                    rg = bt.get("root_grade", g)
                    tip = str(bt.get("parent_action_tip", ""))
                    
                    # Fix slug / double-grade in root_book
                    if "-" in rb or "_" in rb or re.search(r"\d+\s+\d+$", rb):
                        # extract grade from root_grade or last digits
                        rg_num = rg if isinstance(rg, int) else (int(re.findall(r"\d+", rb)[-1]) if re.findall(r"\d+", rb) else g)
                        new_rb = f"{clean_s} {rg_num}"
                        bt["root_book"] = new_rb
                        rb = new_rb
                        total_fixed += 1
                        g_changed = True
                        
                    # Fix slug in root_concept (e.g. 'Təməl rus-dili-7 anlayışları')
                    if "-" in rc or "_" in rc or "təməl" in rc.lower():
                        bt["root_concept"] = clean_top
                        rc = clean_top
                        total_fixed += 1
                        g_changed = True
                        
                    # Fix tip
                    if "-" in tip or "_" in tip or re.search(r"\d+\s+\d+", tip) or "təməl" in tip.lower():
                        dur = bt.get("remedial_duration_mins", 10)
                        is_intra = bool(bt.get("is_intra_grade", False)) or (rg == g)
                        clean_c = re.sub(r"^Elmi Anlayış:\s*", "", rc).strip()
                        
                        if is_intra:
                            new_tip = f"Övladınızın oxuyub-anlama və lüğət ehtiyatını möhkəmləndirmək üçün hazırda istifadə etdiyi {g}-ci sinif {rb} dərsliyindəki '{clean_c}' mövzusunu (əsas qaydaları) {dur} dəqiqə nəzərdən keçirməsi kifayətdir."
                        else:
                            new_tip = f"Övladınızın təməl bacarıqlarını möhkəmləndirmək üçün {rg}-ci sinif {rb} dərsliyindəki '{clean_c}' təməl mövzusunu {dur} dəqiqə təkrarlayın."
                        bt["parent_action_tip"] = new_tip
                        g_changed = True

        if g_changed:
            with open(fpath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            staging_path = os.path.join(STAGING_DIR, f"grade_{g}.json")
            with open(staging_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Grade {g} polished.")

    print(f"Total entries polished: {total_fixed}")

if __name__ == "__main__":
    polish()
