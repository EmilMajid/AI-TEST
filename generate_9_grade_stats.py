import json
from datetime import datetime
import os
import sys

def run():
    with open('data/offline_tests.json', 'r', encoding='utf8') as f:
        db = json.load(f)

    # find all subjects ending with 9
    subjects = [s for s in db.keys() if str(s).strip().endswith('9')]
    
    if not subjects:
        print("No 9th grade subjects found.")
        # fallback: print all subjects
        print("Available subjects:")
        for s in list(db.keys())[:20]:
            print(s)
        return

    md_lines = []
    
    now = datetime.now()
    md_lines.append(f"# 9-cu Sinif Üzrə Oflayn Test Bazası Statistikası")
    md_lines.append(f"**Tarix və Saat:** {now.strftime('%Y-%m-%d %H:%M:%S')}")
    
    total_tests = 0
    for subj in subjects:
        total_tests += len(db.get(subj, []))
        
    md_lines.append(f"**Ümumi Test Sayı:** {total_tests}\n")
    
    md_lines.append("| Fənn | Mövzu | Test Sayı |")
    md_lines.append("|---|---|---|")
    
    for subj in sorted(subjects):
        tests = db.get(subj, [])
        if not tests:
            continue
            
        topics = {}
        for t in tests:
            topic = t.get('topic', 'Mövzu qeyd olunmayıb')
            topics[topic] = topics.get(topic, 0) + 1
            
        for topic in sorted(topics.keys()):
            md_lines.append(f"| {subj} | {topic} | {topics[topic]} |")
            
        md_lines.append(f"| **{subj} (ÜMUMİ)** | | **{len(tests)}** |")
        
    md_lines.append(f"| **YEKUN** | | **{total_tests}** |")
    
    out_path = r"9_grade_stats.md"
    with open(out_path, 'w', encoding='utf8') as out:
        out.write("\n".join(md_lines))
        
    print(f"Successfully generated {out_path}")

if __name__ == '__main__':
    run()
