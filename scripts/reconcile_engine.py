import sys
import os
import json
import ast
import re

sys.stdout.reconfigure(encoding='utf-8')

SUFFIXES = [
    'dir', 'dür', 'dır', 'dur', 'di', 'dü', 'dı', 'du',
    'yə', 'ya', 'ə', 'a', 'dən', 'dan', 'i', 'ü', 'ı', 'u',
    'ni', 'nı', 'nü', 'nu', 'ci', 'cı', 'cü', 'cu'
]

MISTAKE_INDICATORS = [
    'yanlış', 'səhv', 'aldadıcı', 'diqqətsizlik',
    'tapa bilər, lakin', 'qarışdırıb', 'yayğın səhv'
]

def clean_opt(o):
    s = str(o).strip()
    s = re.sub(r'^[a-eA-E]\)\s*', '', s).strip()
    return s

def normalize_math(s):
    if not s:
        return ""
    t = str(s).strip().lower()
    t = re.sub(r'^[a-e]\)\s*', '', t).strip()
    t = t.replace('−', '-').replace('–', '-')
    t = re.sub(r'(\d),(\d)', r'\1.\2', t)
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

def filter_noise_and_mistakes(text):
    # Remove grade curriculum references like '10-cu sinif', '8-ci sinif'
    t = re.sub(r'\b\d+-c[iıüu]\s+sinif\b', '', text, flags=re.IGNORECASE)
    # Remove section numbers like '3. Qüvvət funksiyaları'
    t = re.sub(r'[\'\"“]\d+\.\s+[^\"\'”]+[\'\"”]', '', t)
    
    sentences = re.split(r'[\.\!\?]\s+', t)
    valid = []
    for s in sentences:
        s_lower = s.lower()
        if any(w in s_lower for w in MISTAKE_INDICATORS):
            continue
        valid.append(s)
    return '. '.join(valid)

def matches_single_token(tok, text):
    if not tok or not text:
        return False
    is_neg = tok.startswith('-')
    raw_num = tok.lstrip('-')
    
    if is_neg:
        prefix = r'(?:^|[^\w\d])\-'
        body = re.escape(raw_num)
    else:
        prefix = r'(?:^|[^\w\d\-])'
        body = re.escape(raw_num)
        
    suffix_pattern = r'(?:-(?:' + '|'.join(SUFFIXES) + r')\b)?'
    pattern = prefix + body + suffix_pattern + r'(?:$|[^\w\d\/])'
    return bool(re.search(pattern, text))

def matches_option_in_text(opt, text):
    opt_norm = normalize_math(opt)
    text_norm = normalize_math(text)
    
    # 0. Check key-value pairs e.g. "Cəmi: -7, Hasili: -10" or "Digər kök: 3, q = 15"
    pairs = re.findall(r'([a-zA-ZçəıöğşüÇƏİÖĞŞÜ\s]+)[:=]\s*(\-?\d+(?:[\.,]\d+)?)', opt_norm)
    if pairs and len(pairs) >= 2:
        all_pairs_found = True
        for key, val in pairs:
            val_clean = val.replace(',', '.')
            if not matches_single_token(val_clean, text_norm):
                all_pairs_found = False
                break
        if all_pairs_found:
            return True
            
    # 1. Multiple parts separated by ; , or ' və '
    parts = [p.strip() for p in re.split(r'[,;]|\s+və\s+', opt_norm) if p.strip()]
    if len(parts) >= 2:
        if all(p in text_norm for p in parts):
            return True
        all_found = True
        for part in parts:
            if not matches_single_token(part, text_norm):
                all_found = False
                break
        return all_found
        
    return matches_single_token(opt_norm, text_norm)

def reconcile_answer_key(question_text, options, raw_explanation, current_idx):
    if not options or not isinstance(options, list) or len(options) == 0:
        return current_idx, "No options"
        
    sol = extract_solution_text(raw_explanation)
    if not sol or len(sol.strip()) == 0:
        return current_idx, "No explanation"
        
    sol_lower = sol.lower()
    
    # 1. Comprehensive explicit letter check:
    # e.g. "dəqiq nəticə D bəndidir", "Doğru cavab A variantıdır", "Düzgün cavab: C"
    rx_letter = re.compile(r'(?:dəqiq\s+nəticə|doğru\s+cavab|düzgün\s+cavab|cavab)\s*:?\s*([a-e])\b(?:\s+(?:bəndi|variant|bəndidir|variantıdır))?', re.IGNORECASE)
    explicit_letter = rx_letter.search(sol)
    if explicit_letter:
        target_idx = ord(explicit_letter.group(1).upper()) - 65
        if 0 <= target_idx < len(options):
            if target_idx == current_idx:
                return current_idx, "Explicitly confirmed by explanation text"
            return target_idx, f"Explicitly stated in explanation: '{explicit_letter.group(0)}'"

    # 2. Filter noise and mistake sentences
    clean_sol = filter_noise_and_mistakes(sol)
    if not clean_sol.strip():
        clean_sol = sol
        
    clean_sol_norm = normalize_math(clean_sol)
    tail = clean_sol_norm[-200:] if len(clean_sol_norm) > 200 else clean_sol_norm
    sentences = [s.strip() for s in re.split(r'[\.\!\?]\s+', clean_sol_norm) if s.strip()]
    last_sentence = sentences[-1] if sentences else tail
    
    # Check if current_idx is explicitly denounced as wrong
    current_opt = options[current_idx] if current_idx < len(options) else ""
    current_denounced = False
    if current_opt:
        c_norm = normalize_math(current_opt)
        if re.search(re.escape(c_norm) + r'[^.\n]*?(?:səhv|yanlış|aldadıcı|diqqətsizlik)', sol_lower):
            current_denounced = True

    # 3. Check matches in last sentence
    last_matches = []
    for i, o in enumerate(options):
        if matches_option_in_text(o, last_sentence):
            tok = normalize_math(o).lstrip('-')
            pos = last_sentence.rfind(tok)
            last_matches.append((pos, i))
            
    if last_matches:
        last_matches.sort(key=lambda x: x[0], reverse=True)
        best_i = last_matches[0][1]
        if best_i == current_idx and not current_denounced:
            return current_idx, "Current answer confirmed in last sentence"
        return best_i, f"Derived from conclusion in last sentence: '{options[best_i]}'"

    # If current_idx matches tail and not denounced, keep it
    if not current_denounced and current_opt:
        if matches_option_in_text(current_opt, tail):
            return current_idx, "Current answer confirmed in conclusion tail"

    # 4. Search for matching option in tail
    tail_matches = []
    for i, o in enumerate(options):
        if matches_option_in_text(o, tail):
            tok = normalize_math(o).lstrip('-')
            pos = tail.rfind(tok)
            tail_matches.append((pos, i))
            
    if tail_matches:
        tail_matches.sort(key=lambda x: x[0], reverse=True)
        best_i = tail_matches[0][1]
        return best_i, f"Derived from rightmost match in tail: '{options[best_i]}'"
            
    # 5. Check full clean derivation if only one option matches
    full_matches = []
    for i, o in enumerate(options):
        if matches_option_in_text(o, clean_sol_norm):
            full_matches.append(i)
            
    if len(full_matches) == 1:
        return full_matches[0], f"Derived from unique match in solution: '{options[full_matches[0]]}'"
        
    return current_idx, "Unchanged (safe fallback)"
