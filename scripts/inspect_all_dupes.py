import json
import glob
import os

all_dupes = []
for fpath in sorted(glob.glob('data/grades/grade_*.json')):
    if 'other' in fpath: continue
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        d = json.load(f)
    for subj, tops in d.items():
        if not isinstance(tops, dict): continue
        for t, qs in tops.items():
            if not isinstance(qs, list): continue
            for idx, q in enumerate(qs, 1):
                opts = q.get('options', [])
                clean = [str(o).strip().lower() for o in opts]
                if len(clean) != len(set(clean)):
                    all_dupes.append({
                        "file": fname, "subj": subj, "topic": t, "q_num": idx,
                        "opts": opts, "q": q.get('question', '')[:60], "correct": q.get('correctAnswer')
                    })

print(f"Total duplicate options questions across all grades: {len(all_dupes)}")
for item in all_dupes[:15]:
    print(f"[{item['file']} | {item['subj']} | {item['topic']} Q{item['q_num']}]")
    print("  Opts:", item['opts'])
    print("  Correct:", item['correct'])
