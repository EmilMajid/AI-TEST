import sys
import json
import ast
import re

sys.stdout.reconfigure(encoding='utf-8')

def extract_solution_text(expl_field):
    if isinstance(expl_field, dict):
        return expl_field.get('correct', '')
    if isinstance(expl_field, str):
        s = expl_field.strip()
        if s.startswith('{') and 'correct' in s:
            try:
                obj = ast.literal_eval(s)
                if isinstance(obj, dict):
                    return obj.get('correct', '')
            except:
                pass
        return s
    return ""

def clean_opt(o):
    s = str(o).strip()
    s = re.sub(r'^[A-E]\)\s*', '', s)
    return s.strip()

def match_target_against_solution(opts, solution_text):
    if not opts or not solution_text:
        return None, 0
    
    sol = solution_text.strip()
    # Normalize comma to dot for Azerbaijani decimals: e.g. 0,6 -> 0.6
    sol_num_norm = sol.replace(',', '.')
    
    # Check the conclusion section of the solution (last 180 chars)
    conclusion_text = sol[-200:] if len(sol) > 200 else sol
    conclusion_num_norm = conclusion_text.replace(',', '.')
    
    best_idx = None
    best_score = 0
    
    for idx, opt in enumerate(opts):
        o = clean_opt(opt)
        o_num_norm = o.replace(',', '.')
        score = 0
        
        # 1. Exact string matches in conclusion
        if o in conclusion_text:
            score += 50
        elif o_num_norm in conclusion_num_norm:
            score += 45
        elif o in sol:
            score += 20
        elif o_num_norm in sol_num_norm:
            score += 15
            
        # 2. Check roots list e.g. "2; 5" or "3 və -3" or "8 və -8"
        # Split by ;, ,, or ' və '
        parts = [p.strip() for p in re.split(r'[,;]|\s+və\s+', o) if p.strip()]
        if len(parts) >= 2:
            all_parts_found = True
            for part in parts:
                p_norm = part.replace(',', '.')
                # Look for part with boundary
                # E.g. part is "2", should not match "25"
                p_pattern = r'(?<![\d\w\-])' + re.escape(p_norm) + r'(?![\d\w])'
                if not re.search(p_pattern, conclusion_num_norm) and not re.search(p_pattern, sol_num_norm):
                    all_parts_found = False
                    break
            if all_parts_found:
                score += 60
                
        # 3. Check for specific Azerbaijani mathematical conclusion keywords preceding or following option:
        # e.g. "böyük kök -3", "kiçik kök -3", "cəmi ... 3", "hasili ... 6", "= 28", "= 1", "4 fərqli", "2 saniyə"
        opt_pattern = r'(?<![\d\w\-])' + re.escape(o_num_norm) + r'(?![\d\w])'
        match = re.search(opt_pattern, conclusion_num_norm)
        if match:
            score += 30
            # Check context around match
            start_pos = max(0, match.start() - 30)
            end_pos = min(len(conclusion_num_norm), match.end() + 30)
            snippet = conclusion_num_norm[start_pos:end_pos].lower()
            if any(k in snippet for k in ['böyük', 'kiçik', 'müsbət', 'mənfi', 'cəmi', 'hasili', 'perimetr', 'köklər', 'kök', '=', 'alınır', 'olur', 'edir', 'tapılır', 'tapırıq', 'bərabərdir', 'sayı']):
                score += 30
                
        # 4. Check negative penalty if option is explicitly marked as distractor/mistake:
        # e.g. "36 götürmək yayğın səhvdir"
        if re.search(re.escape(o_num_norm) + r'[^.\n]*?(?:səhv|yanlış|aldadıcı)', sol_num_norm, re.IGNORECASE):
            score -= 100

        if score > best_score:
            best_score = score
            best_idx = idx
            
    return best_idx, best_score

with open('data/grades/grade_8.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

topic = data['Riyaziyyat 8']['Kvadrat tənliklərin vuruqlara ayırma üsulu ilə həlli']
print("Auditing all 31 questions in topic:")
mismatches_fixed = 0
for i, q in enumerate(topic):
    opts = q.get('options', [])
    c_idx = q.get('correctAnswer', 0)
    sol_text = extract_solution_text(q.get('explanation'))
    best_idx, score = match_target_against_solution(opts, sol_text)
    
    stored_str = f"{chr(65+c_idx)}) {opts[c_idx]}"
    resolved_str = f"{chr(65+best_idx)}) {opts[best_idx]}" if best_idx is not None else "UNDETECTED"
    
    if best_idx is not None and best_idx != c_idx:
        mismatches_fixed += 1
        print(f"Q{i+1:02d}: [FIXED] Stored: {stored_str} => Mathematical Truth: {resolved_str} (Score: {score})")
    elif best_idx == c_idx:
        print(f"Q{i+1:02d}: [ALREADY CORRECT] {stored_str}")
    else:
        print(f"Q{i+1:02d}: [UNRESOLVED] Stored: {stored_str}")

print(f"\nTotal questions fixed in this topic: {mismatches_fixed} / {len(topic)}")
