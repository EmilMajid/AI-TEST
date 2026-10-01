#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KAG Precision Finalizer: Cleans the final 14 edge cases to reach 0 across all defect metrics.
"""

import os
import sys
import json
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "grades")
STAGING_DIR = os.path.join(os.path.dirname(__file__), "..", "autonomous_kag", "active_staging")

def finalize():
    fixed = 0
    for g in range(1, 12):
        p = os.path.join(DATA_DIR, f"grade_{g}.json")
        if not os.path.exists(p):
            continue
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        g_changed = False
        for subj, tops in data.items():
            if not isinstance(tops, dict):
                continue
            s_low = subj.lower()
            if "azərbaycan" not in s_low and "ingilis" not in s_low and "rus" not in s_low:
                continue
                
            for top, qs in tops.items():
                if not isinstance(qs, list):
                    continue
                for q in qs:
                    if not isinstance(q, dict):
                        continue
                    bt = q.get("backward_trace", {})
                    rc = str(bt.get("root_concept", "")).lower()
                    ql = str(q.get("question", "")).lower()
                    rg = bt.get("root_grade")
                    
                    # 1. Saylar və saylardan sonra isimlərin işlənməsi (Grade 6)
                    if "saylar" in ql or "sayından sonra" in ql or "saylarından sonra" in ql or "sayla ifadə olunmuş" in ql:
                        if "kitablar" in rc or "mətn təhlili" in rc:
                            bt["is_root_anchor"] = False
                            bt["is_intra_grade"] = True
                            bt["root_grade"] = 6
                            bt["root_book"] = "Azərbaycan dili 6"
                            bt["root_concept"] = "Say və onun mənaca növləri: saylardan sonra isimlərin işlənməsi"
                            bt["parent_action_tip"] = "Övladınızın morfoloji bilik və qrammatik bacarıqlarını möhkəmləndirmək üçün hazırda istifadə etdiyi 6-ci sinif Azərbaycan dili 6 dərsliyindəki 'Say və onun mənaca növləri: saylardan sonra isimlərin işlənməsi' mövzusunu (əsas qaydaları) 10 dəqiqə nəzərdən keçirməsi kifayətdir."
                            bt["remedial_duration_mins"] = 10
                            fixed += 1
                            g_changed = True
                            
                    # 2. Budaq cümlələr (Grade 9)
                    if "budaq cümlə" in ql or "mürəkkəb cümlə" in ql:
                        if "söz sırası" in rc or "mətn:" in rc or (g >= 9 and rg is not None and rg <= 5):
                            bt["is_root_anchor"] = False
                            bt["is_intra_grade"] = (g == 9)
                            bt["root_grade"] = 9
                            bt["root_book"] = "Azərbaycan dili 9"
                            bt["root_concept"] = "Tabesiz və tabeli mürəkkəb cümlələr"
                            bt["remedial_duration_mins"] = 15
                            bt["parent_action_tip"] = "Övladınızın sintaktik təhlil bacarığını möhkəmləndirmək üçün 9-cu sinif Azərbaycan dili 9 dərsliyindəki 'Tabesiz və tabeli mürəkkəb cümlələr' təməl mövzusunu və 2-3 nümunə situasiya tapşırığını 15 dəqiqə işləyin."
                            fixed += 1
                            g_changed = True

        if g_changed:
            with open(p, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            staging_p = os.path.join(STAGING_DIR, f"grade_{g}.json")
            with open(staging_p, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"✅ Grade {g} precision tuned.")

    print(f"\nFinalizer resolved {fixed} edge cases.")

if __name__ == "__main__":
    finalize()
