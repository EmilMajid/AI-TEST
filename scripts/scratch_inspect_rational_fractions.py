import os
import sys
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def inspect_rational_fractions():
    results = []
    
    for g in [8, 9, 10, 11]:
        fpath = os.path.join(BASE_DIR, "data", "grades", f"grade_{g}.json")
        if not os.path.exists(fpath):
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            d = json.load(f)

        math_keys = [k for k in d.keys() if re.search(r"riyaziyyat|cəbr|həndəsə", k, re.I)]
        
        q_count = 0
        for mk in math_keys:
            for top, q_list in d[mk].items():
                if not isinstance(q_list, list):
                    continue
                for q in q_list:
                    q_count += 1
                    qid = str(q.get("id") or q.get("passport_id") or f"gr{g}_{mk}_{q_count}")
                    q_text = str(q.get("question") or q.get("q") or "")
                    exp = str(q.get("explanation") or q.get("izah") or "")
                    steps = q.get("solution_steps") or q.get("steps") or []
                    steps_str = " ".join([str(s) for s in steps]) if isinstance(steps, list) else str(steps)
                    
                    full_text = f"{q_text} {exp} {steps_str} {top}".lower()
                    
                    # Search specifically for rational fractions / algebraic fractions
                    is_fraction = any(k in full_text for k in [
                        "rasional kəsr", "cəbri kəsr", "kəsrin ixtisarı", "ortaq məxrəc", 
                        "məxrəc", "sürət və məxrəc", "mümkün qiymətlər", "təyin oblastı"
                    ])
                    # Ensure it's algebraic fraction, not just simple arithmetic fraction (1/2 + 1/3)
                    has_algebra = any(k in full_text for k in ["x", "a", "b", "y", "vuruq", "çoxhədli", "\\frac"])
                    
                    if is_fraction and has_algebra:
                        results.append({
                            "grade": g,
                            "subject": mk,
                            "topic": top,
                            "id": qid,
                            "question": q_text.strip(),
                            "explanation": exp.strip(),
                            "steps": steps_str.strip()
                        })

    print(f"Total matching rational fraction questions: {len(results)}")
    by_grade = {}
    for r in results:
        by_grade[r["grade"]] = by_grade.get(r["grade"], 0) + 1
    print("Breakdown by grade:", by_grade)

    # Breakdown by topic
    topic_counts = {}
    for r in results:
        t_key = f"Gr{r['grade']}: {r['topic']}"
        topic_counts[t_key] = topic_counts.get(t_key, 0) + 1
    
    print("\nTop Topics with Rational Fractions:")
    for t, c in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  - {t}: {c} questions")

    out_path = os.path.join(BASE_DIR, "reports", "rational_fractions_pilot_dataset.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nSaved all {len(results)} questions to {out_path}")

if __name__ == "__main__":
    inspect_rational_fractions()
