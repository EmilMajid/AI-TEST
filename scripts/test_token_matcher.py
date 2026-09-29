import sys
import json
import ast
import re

sys.stdout.reconfigure(encoding='utf-8')

SUFFIXES = ['dir', 'dür', 'dır', 'dur', 'di', 'dü', 'dı', 'du', 'yə', 'ya', 'ə', 'a', 'dən', 'dan', 'i', 'ü', 'ı', 'u', 'ni', 'nı', 'nü', 'nu']

def normalize_math(s):
    if not s:
        return ""
    t = str(s).strip()
    t = re.sub(r'^[A-E]\)\s*', '', t).strip()
    t = t.replace('−', '-').replace('–', '-')
    t = t.replace(',', '.')
    return t

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

def matches_number_or_term(opt, text):
    """
    Checks if `opt` appears in `text` as a distinct token (respecting sign and suffixes).
    """
    opt_norm = normalize_math(opt)
    text_norm = normalize_math(text)
    
    # 1. If opt has multiple parts like "2; 5" or "3 və -3" or "a = 1, digər kök -4"
    parts = [p.strip() for p in re.split(r'[,;]|\s+və\s+', opt_norm) if p.strip()]
    if len(parts) >= 2:
        all_found = True
        for part in parts:
            if not matches_single_token(part, text_norm):
                all_found = False
                break
        return all_found
        
    return matches_single_token(opt_norm, text_norm)

def matches_single_token(tok, text):
    if not tok or not text:
        return False
        
    # Check if tok is an exact number with sign
    is_neg = tok.startswith('-')
    raw_num = tok.lstrip('-')
    
    # Build pattern
    # Preceded by start of string or non-word, non-digit, non-minus (if positive)
    if is_neg:
        prefix = r'(?:^|[^\w\d])\-'
        body = re.escape(raw_num)
    else:
        # positive number must NOT be preceded by '-'
        prefix = r'(?:^|[^\w\d\-])'
        body = re.escape(raw_num)
        
    # Suffixes can be hyphenated like -dür, -dir or directly attached
    suffix_pattern = r'(?:-(?:' + '|'.join(SUFFIXES) + r')\b)?'
    pattern = prefix + body + suffix_pattern + r'(?:$|[^\w\d])'
    
    return bool(re.search(pattern, text))

def solve_question(q):
    opts = q.get('options', [])
    c_idx = q.get('correctAnswer', 0)
    sol = extract_solution_text(q.get('explanation'))
    
    if not opts or not sol:
        return c_idx
        
    sol_norm = normalize_math(sol)
    tail = sol_norm[-200:] if len(sol_norm) > 200 else sol_norm
    
    # Priority 1: Check conclusions in tail (last sentence)
    # Sentences in Azerbaijani end with . ! ?
    sentences = [s.strip() for s in re.split(r'[\.\!\?]\s+', sol_norm) if s.strip()]
    last_sentence = sentences[-1] if sentences else tail
    
    # Check if last sentence matches exactly one option
    last_matches = []
    for i, o in enumerate(opts):
        if matches_number_or_term(o, last_sentence):
            last_matches.append(i)
            
    if len(last_matches) == 1:
        return last_matches[0]
        
    # Priority 2: Check matches in tail with conclusion keywords
    # Keywords: cavab, böyük, kiçik, müsbət, mənfi, cəmi, hasili, perimetr, köklər, bərabərdir, tapılır, alınır
    keyword_matches = []
    for i, o in enumerate(opts):
        if matches_number_or_term(o, tail):
            keyword_matches.append(i)
            
    if len(keyword_matches) == 1:
        return keyword_matches[0]
        
    # Priority 3: Full solution check if only 1 option appears
    full_matches = []
    for i, o in enumerate(opts):
        if matches_number_or_term(o, sol_norm):
            full_matches.append(i)
            
    if len(full_matches) == 1:
        return full_matches[0]
        
    # If multiple in tail, look for the one closest to the end
    if len(keyword_matches) > 1:
        # find the rightmost match
        best_pos = -1
        best_i = None
        for i in keyword_matches:
            o_clean = normalize_math(opts[i])
            pos = tail.rfind(o_clean.lstrip('-'))
            if pos > best_pos:
                best_pos = pos
                best_i = i
        if best_i is not None:
            return best_i
            
    return c_idx

with open('data/grades/grade_8.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

topic = data['Riyaziyyat 8']['Kvadrat tənliklərin vuruqlara ayırma üsulu ilə həlli']
print("Running token matcher on all 31 questions:")
changes = 0
for i, q in enumerate(topic):
    opts = q.get('options', [])
    c_idx = q.get('correctAnswer', 0)
    solved = solve_question(q)
    stored_str = f"{chr(65+c_idx)}) {opts[c_idx]}"
    solved_str = f"{chr(65+solved)}) {opts[solved]}"
    
    if solved != c_idx:
        changes += 1
        print(f"Q{i+1:02d}: [REPAIRED] {stored_str} ===> {solved_str}")
    else:
        print(f"Q{i+1:02d}: [UNCHANGED] {stored_str}")

print(f"\nTotal repaired: {changes} / {len(topic)}")
