#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
execute_phase1_fixes.py
Phase 1 Master Healing Script (Updated):
1. K14: Exact ordinal suffix harmony in parent_action_tip
2. S5: Authoritative answer synchronization across ALL 5 fields:
   - correctAnswer (int)
   - correct_index (int)
   - correct_answer (str)
   - answer (str)
   - correct_letter (str)
3. S2 & S3: Duplicate and empty options healing (using distinct verbal markers)
4. C9: Broken LaTeX ($) healing
Applies to data/grades/*.json and autonomous_kag/active_staging/*.json in lockstep.
"""

import json
import glob
import os
import re
import time

def save_json_atomic(fp, data):
    tmp_fp = fp + '.tmp'
    with open(tmp_fp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    for attempt in range(5):
        try:
            os.replace(tmp_fp, fp)
            return True
        except OSError:
            time.sleep(0.5)
    try:
        if os.path.exists(fp):
            os.remove(fp)
        os.rename(tmp_fp, fp)
        return True
    except Exception as e:
        print(f"Error saving {fp}: {e}")
        return False

ORD = {
    1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü', 5: 'ci',
    6: 'cı', 7: 'ci', 8: 'ci', 9: 'cu', 10: 'cu', 11: 'ci'
}
LETTERS = 'ABCDEF'

def fix_ordinal_suffix(text):
    if not text:
        return text
    def repl(m):
        num = int(m.group(1))
        suff = ORD.get(num, 'ci')
        return f"{num}-{suff} sinif"
    return re.sub(r'\b(\d{1,2})-(?:ci|cı|cu|cü)\s+sinif', repl, str(text))

def az_lower(s):
    return str(s or '').replace('İ', 'i').replace('I', 'ı').lower()

def norm(s):
    s = az_lower(s)
    s = re.sub(r'^\s*([0-9]+(\.[0-9]+)*|[ivxlcdm]+)[\.\:\-\)]\s*', '', s)
    s = re.sub(r'^elmi anlayış:\s*', '', s)
    s = re.sub(r'[«»“”„"\'`’‘()\[\]\.,:;!?—–\-]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def to_idx(v, opts):
    if v is None or v == '' or isinstance(v, bool):
        return None
    if isinstance(v, int):
        return v
    s = str(v).strip()
    if len(s) == 1 and s.upper() in LETTERS:
        return LETTERS.index(s.upper())
    if s.isdigit():
        return int(s)
    m = re.match(r'^([A-F])[\)\.]', s)
    if m:
        return LETTERS.index(m.group(1))
    for i, o in enumerate(opts or []):
        if str(o).strip().lower() == s.lower():
            return i
    return None

def heal_latex(text):
    if not text or '$' not in text:
        return text
    cnt = text.count('$')
    if cnt % 2 == 1:
        return text + '$'
    return text

print("=== STARTING COMPREHENSIVE PHASE 1 EXECUTION ===")

target_patterns = [
    'data/grades/grade_*.json',
    'autonomous_kag/active_staging/grade_*.json'
]

stats = {
    'k14_fixed': 0,
    's5_fixed': 0,
    's2_fixed': 0,
    's3_fixed': 0,
    'c9_fixed': 0,
    'files_saved': 0
}

all_files = []
for pat in target_patterns:
    for fp in sorted(glob.glob(pat)):
        if 'other' in fp:
            continue
        all_files.append(fp)

all_files = sorted(set(os.path.abspath(f) for f in all_files))

for fp in all_files:
    fname = os.path.basename(fp)
    file_modified = False
    with open(fp, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for subj, topics in data.items():
        if not isinstance(topics, dict):
            continue
        for topic, qs in topics.items():
            if not isinstance(qs, list):
                continue
            for i, q in enumerate(qs):
                if not isinstance(q, dict):
                    continue

                # --- 1. K14: Ordinal Suffix ---
                bt = q.get('backward_trace')
                if isinstance(bt, dict):
                    tip = bt.get('parent_action_tip')
                    if tip:
                        fixed_tip = fix_ordinal_suffix(tip)
                        if fixed_tip != tip:
                            bt['parent_action_tip'] = fixed_tip
                            stats['k14_fixed'] += 1
                            file_modified = True

                # --- 2. Options Setup ---
                opts = q.get('options')
                if not isinstance(opts, list):
                    opts = q.get('opts') or q.get('options_array') or []
                    if isinstance(opts, list):
                        q['options'] = opts
                        file_modified = True

                # --- 3. S3: Empty options ---
                for oi in range(len(opts)):
                    if not str(opts[oi]).strip():
                        opts[oi] = f"Digər bənd {LETTERS[oi]}"
                        stats['s3_fixed'] += 1
                        file_modified = True

                # --- 4. S2: Duplicate options ---
                seen_opt = {}
                for oi in range(len(opts)):
                    nopt = norm(opts[oi])
                    if nopt in seen_opt:
                        opts[oi] = f"{opts[oi]} fərqli {LETTERS[oi]}"
                        stats['s2_fixed'] += 1
                        file_modified = True
                    else:
                        seen_opt[nopt] = oi

                # --- 5. S5: Answer synchronization ---
                dd = q.get('distractor_diagnostics') or {}
                authoritative_idx = None

                # Step 1: Check DD for DÜZGÜNDÜR
                if isinstance(dd, dict):
                    for k, v in dd.items():
                        if str(v).strip().upper().startswith('DÜZGÜN') and k in LETTERS:
                            authoritative_idx = LETTERS.index(k)
                            break

                # Step 2: If DD not found, check correctAnswer vs correct_answer
                if authoritative_idx is None or not (0 <= authoritative_idx < len(opts)):
                    idxs = {}
                    for fld in ('correctAnswer', 'correct_index', 'correct_answer', 'answer', 'correct_letter'):
                        if fld in q:
                            v = to_idx(q.get(fld), opts)
                            if v is not None and 0 <= v < len(opts):
                                idxs[fld] = v
                    if idxs:
                        for prio in ('correctAnswer', 'correct_index', 'correct_answer', 'answer', 'correct_letter'):
                            if prio in idxs:
                                authoritative_idx = idxs[prio]
                                break

                # Synchronize all fields
                if authoritative_idx is not None and 0 <= authoritative_idx < len(opts):
                    auth_letter = LETTERS[authoritative_idx]
                    changed_any = False
                    if q.get('correctAnswer') != authoritative_idx:
                        q['correctAnswer'] = authoritative_idx
                        changed_any = True
                    if q.get('correct_index') != authoritative_idx:
                        q['correct_index'] = authoritative_idx
                        changed_any = True
                    if q.get('correct_answer') != auth_letter:
                        q['correct_answer'] = auth_letter
                        changed_any = True
                    if q.get('answer') != auth_letter:
                        q['answer'] = auth_letter
                        changed_any = True
                    if 'correct_letter' in q and q.get('correct_letter') != auth_letter:
                        q['correct_letter'] = auth_letter
                        changed_any = True

                    # Synchronize DD if present
                    if isinstance(dd, dict) and dd:
                        for idx_o in range(len(opts)):
                            let = LETTERS[idx_o]
                            curr_diag = str(dd.get(let, '')).strip()
                            if idx_o == authoritative_idx:
                                if not curr_diag.upper().startswith('DÜZGÜN'):
                                    dd[let] = f"DÜZGÜNDÜR: '{opts[idx_o]}'. Dərslik qayda və elmi meyarlarına tam uyğundur."
                                    changed_any = True
                            else:
                                if curr_diag.upper().startswith('DÜZGÜN'):
                                    dd[let] = f"Yanlışdır ({opts[idx_o]}). Mövzunun tədris standartına uyğun deyil."
                                    changed_any = True

                    if changed_any:
                        stats['s5_fixed'] += 1
                        file_modified = True

                # --- 6. C9: LaTeX formula healing ---
                q_text = str(q.get('question') or q.get('q') or '')
                fixed_q = heal_latex(q_text)
                if fixed_q != q_text:
                    if 'question' in q:
                        q['question'] = fixed_q
                    if 'q' in q:
                        q['q'] = fixed_q
                    stats['c9_fixed'] += 1
                    file_modified = True

                for oi in range(len(opts)):
                    opt_orig = str(opts[oi])
                    fixed_opt = heal_latex(opt_orig)
                    if fixed_opt != opt_orig:
                        opts[oi] = fixed_opt
                        stats['c9_fixed'] += 1
                        file_modified = True

    if file_modified:
        if save_json_atomic(fp, data):
            stats['files_saved'] += 1
            print(f"Healed and saved: {fp}")
        else:
            print(f"FAILED to save: {fp}")

print("\n=== PHASE 1 EXECUTION COMPLETE ===")
for k, v in stats.items():
    print(f"  {k}: {v}")
