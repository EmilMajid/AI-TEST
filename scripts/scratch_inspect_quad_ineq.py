import os
import sys
import json
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def inspect_quadratic_inequalities():
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
                    
                    is_ineq = "bərabərsizli" in full_text
                    is_quad = any(k in full_text for k in ["kvadrat", "x^2", "x²", "diskriminant", "interval"])
                    
                    if is_ineq and is_quad:
                        results.append({
                            "grade": g,
                            "subject": mk,
                            "topic": top,
                            "id": qid,
                            "question": q_text,
                            "explanation": exp,
                            "steps": steps_str
                        })

    print(f"Total matching questions: {len(results)}")
    by_grade = {}
    for r in results:
        by_grade[r["grade"]] = by_grade.get(r["grade"], 0) + 1
    print("Breakdown by grade:", by_grade)

    out_path = os.path.join(BASE_DIR, "reports", "quadratic_inequalities_pilot_dataset.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Saved to {out_path}")

    print("\n--- SAMPLE QUESTIONS (FIRST 5) ---")
    for i, r in enumerate(results[:5], 1):
        print(f"\n[{i}] Grade {r['grade']} | ID: {r['id']} | Topic: {r['topic']}")
        print(f"Q: {r['question'][:120]}")
        print(f"Expl: {r['explanation'][:160]}")

if __name__ == "__main__":
    inspect_quadratic_inequalities()
