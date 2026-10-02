#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "grades")
STAGING_DIR = os.path.join(os.path.dirname(__file__), "..", "autonomous_kag", "active_staging")

def clean_all_remaining():
    cleaned_b = 0
    cleaned_c = 0
    for g in range(1, 12):
        p = os.path.join(DATA_DIR, f"grade_{g}.json")
        if not os.path.exists(p): continue
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
        g_changed = False
        
        for subj, tops in data.items():
            if not isinstance(tops, dict): continue
            for top, qs in tops.items():
                if not isinstance(qs, list): continue
                clean_top = re.sub(r"^[0-9ivxlcdm]+[\.\:\-]*\s*", "", top).strip()
                
                for q in qs:
                    if not isinstance(q, dict): continue
                    bt = q.get("backward_trace")
                    if not isinstance(bt, dict): continue
                    
                    rb = str(bt.get("root_book", "")).strip()
                    cn = str(bt.get("concept_name", "")).strip()
                    
                    # Fix any remaining double number in root_book (e.g. "Azərbaycan tarixi 8 7")
                    m = re.search(r"^(.*?)\s*(\d+)\s+(\d+)$", rb)
                    if m:
                        base_title = m.group(1).strip()
                        last_digit = m.group(3).strip()
                        new_rb = f"{base_title} {last_digit}"
                        bt["root_book"] = new_rb
                        cleaned_b += 1
                        g_changed = True
                        
                        # also update in parent_action_tip if present
                        tip = str(bt.get("parent_action_tip", ""))
                        if rb in tip:
                            bt["parent_action_tip"] = tip.replace(rb, new_rb)
                            
                    # Fix any dummy concept names like "Elmi Anlayış: correct"
                    if re.search(r"\b(?:correct|true|false)\b", cn.lower()) or cn.lower() == "elmi anlayış: correct":
                        bt["concept_name"] = clean_top
                        cleaned_c += 1
                        g_changed = True
                        
        if g_changed:
            with open(p, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            staging_path = os.path.join(STAGING_DIR, f"grade_{g}.json")
            with open(staging_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                
    print(f"Cleaned remaining books: {cleaned_b}, concepts: {cleaned_c}")

if __name__ == "__main__":
    clean_all_remaining()
