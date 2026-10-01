#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Universal Answer Key Healing Engine v3.0
Full-spectrum scientific, semantic, and mathematical reconciliation across all 11 grades:
1. Azerbaijani Unicode Lowercasing & Normalization (proper handling of İ/ı/i)
2. Trailing Phrase Verification for Explicit Letter Rule (detecting & fixing fake A/B/C/D letter stamps)
3. LaTeX Math & Fraction Normalization (\frac{a}{b} -> a/b, \text, \sqrt, powers)
4. Morphological Stemmer for Azerbaijani Suffixes (Case, Possessive, Relational)
5. Chemical & Physical Scientific Synonym Expansion
6. Single-Letter & Physical Symbol Matcher (Q, V, m, t, p, F)
7. Reaction Sign & Formula Matcher (+Q, -Q)
8. Negative Question Inverter ("doğru deyil", "asılı deyil")
9. Distractor Elimination & Full Consistency Repair
"""

import os
import sys
import json
import re
import unicodedata
from collections import defaultdict, Counter

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "grades")
STAGING_DIR = os.path.join(os.path.dirname(__file__), "..", "autonomous_kag", "active_staging")

CHEM_SYNONYMS = {
    "əhəng daşı": ["kalsium-karbonat", "caco3", "əhəngdaşı"],
    "kalsium-karbonat": ["əhəng daşı", "caco3", "əhəngdaşının"],
    "caco3": ["kalsium-karbonat", "əhəng daşı", "əhəngdaşının"],
    "təbii qaz": ["metan", "ch4"],
    "metan": ["təbii qaz", "ch4"],
    "su": ["h2o"],
    "h2o": ["su", "suyun"],
    "karbon qazı": ["co2"],
    "co2": ["karbon qazı"],
    "dəmirin paslanması": ["dəmir hidroksidləri", "dəmir oksidləri", "paslanma", "dəmir paslanması"],
    "paslanma": ["dəmirin rütubətdə paslanması", "paslanması"],
    "sönmüş əhəng": ["kalsium-hidroksid", "ca(oh)2"],
    "sönməmiş əhəng": ["kalsium-oksid", "cao"],
}

STOP_WORDS = {
    "və", "ilə", "üçün", "görə", "olan", "hansı", "bütün", "yalnız", "daha",
    "adlanır", "olur", "edir", "kimi", "həm", "lakin", "ancaq", "amma", "çünki",
    "üç", "dörd", "bir", "iki", "bu", "o", "isə", "buna", "ona", "yəni", "haqqında"
}

AZ_SUFFIXES = [
    "nin", "nın", "nün", "nun", "in", "ın", "ün", "un",
    "dən", "dan", "də", "da", "yə", "ya", "nə", "na", "ə", "a",
    "dir", "dır", "dür", "dur", "di", "dı", "dü", "du",
    "lə", "la", "ilə", "lər", "lar", "si", "sı", "sü", "su",
    "ni", "nı", "nü", "nu", "i", "ı", "ü", "u"
]

def az_lower(s: str) -> str:
    if not s:
        return ""
    # Map Azerbaijani capital I/İ before calling lower()
    s = s.replace("İ", "i").replace("I", "ı")
    s = s.lower()
    s = s.replace("\u0307", "")  # strip combining dot
    s = s.replace("−", "-").replace("–", "-")
    # Replace comma between digits: 0,5 -> 0.5
    s = re.sub(r"(\d),(\d)", r"\1.\2", s)
    return unicodedata.normalize("NFC", s)

def stem_az(w: str) -> str:
    s = az_lower(w).strip(".,!?:;\"'()[]{}")
    for _ in range(3):
        changed = False
        for suff in AZ_SUFFIXES:
            if len(s) > len(suff) + 3 and s.endswith(suff):
                s = s[:-len(suff)]
                changed = True
                break
        if not changed:
            break
    return s

def norm_latex(s: str) -> str:
    if not s:
        return ""
    res = str(s).strip()
    res = res.replace("$", "")
    res = re.sub(r"\\frac\{([^}]+)\}\{([^}]+)\}", r" \1/\2 ", res)
    res = re.sub(r"\\text\{([^}]+)\}", r" \1 ", res)
    res = res.replace("\\cdot", "*").replace("\\times", "*").replace("\\sqrt", "sqrt").replace("\\", "")
    res = re.sub(r"\s+", " ", res).strip()
    return az_lower(res)

def clean_opt_text(opt: str) -> str:
    s = str(opt or "").strip()
    s = re.sub(r"^[a-eA-E][\)\.\:\-]\s*", "", s).strip()
    return norm_latex(s)

def solve_best_answer(question_text: str, options: list, explanation: str, current_answer: str) -> tuple:
    """
    Returns (healed_letter, confidence, reason, changed, updated_explanation)
    """
    if not options or len(options) < 2:
        return current_answer, 0, "insufficient_options", False, explanation
        
    ans_map = {"A": 0, "B": 1, "C": 2, "D": 3}
    rev_map = {0: "A", 1: "B", 2: "C", 3: "D"}
    curr_idx = ans_map.get(current_answer, -1)
    
    clean_opts = [clean_opt_text(o) for o in options]
    raw_clean_opts = [re.sub(r"^[a-eA-E][\)\.\:\-]\s*", "", str(o)).strip() for o in options]
    q_norm = norm_latex(question_text)
    exp_norm = norm_latex(explanation)
    
    # ── Rule 1: Explicit letter in explanation WITH Trailing Phrase Verification ──
    # Old generator frequently hardcoded: "Doğru cavab: A) [Actual D text]"
    rx_explicit = r"(?:düzgün\s+cavab|doğru\s+cavab)\s*:?\s*([a-d])\)?\s*([^\.\n]+)?"
    m_let = re.search(rx_explicit, exp_norm)
    if m_let:
        found_let = m_let.group(1).upper()
        trailing = m_let.group(2).strip() if m_let.group(2) else ""
        
        # Verify trailing phrase against options
        if len(trailing) >= 4:
            trailing_opt_idx = -1
            best_match_len = 0
            for idx, opt_norm in enumerate(clean_opts):
                if opt_norm in trailing or trailing in opt_norm:
                    if len(opt_norm) > best_match_len:
                        best_match_len = len(opt_norm)
                        trailing_opt_idx = idx
                tr_tokens = [t for t in re.findall(r"[a-zəöüğıçş0-9]+", trailing) if len(t) >= 4 and t not in STOP_WORDS]
                opt_tokens = [t for t in re.findall(r"[a-zəöüğıçş0-9]+", opt_norm) if len(t) >= 4 and t not in STOP_WORDS]
                if tr_tokens and opt_tokens:
                    overlap = set(tr_tokens).intersection(set(opt_tokens))
                    if len(overlap) == len(opt_tokens) or (len(overlap) >= 2 and len(overlap) >= len(tr_tokens) * 0.7):
                        if len(overlap) > best_match_len:
                            best_match_len = len(overlap)
                            trailing_opt_idx = idx
            
            if trailing_opt_idx != -1:
                real_let = rev_map[trailing_opt_idx]
                updated_exp = explanation
                if real_let != found_let:
                    # Fix the conflicting letter in explanation
                    updated_exp = re.sub(
                        r"((?:düzgün\s+cavab|doğru\s+cavab)\s*:?\s*)" + re.escape(m_let.group(1)) + r"(\)?)",
                        r"\g<1>" + real_let + r"\2",
                        explanation,
                        flags=re.IGNORECASE
                    )
                changed = (real_let != current_answer)
                return real_let, 100, "verified_explicit_trailing", changed, updated_exp

        # If trailing text is missing or short, check if found_let is verified or if another option is 100% in exp
        target_idx = ans_map.get(found_let)
        if target_idx is not None and target_idx < len(clean_opts):
            cand_norm = clean_opts[target_idx]
            other_exact_idx = -1
            for idx, opt_norm in enumerate(clean_opts):
                if idx == target_idx:
                    continue
                if len(opt_norm) >= 6 and opt_norm in exp_norm:
                    other_exact_idx = idx
                    break
            if other_exact_idx != -1 and (len(cand_norm) >= 4 and cand_norm not in exp_norm):
                # found_let has 0 presence while another option is 100% in explanation; do not trust found_let
                pass
            else:
                if not re.search(rf"\b{found_let}\s*(?:səhv|yanlış)", exp_norm):
                    changed = (found_let != current_answer)
                    return found_let, 95, "explicit_letter", changed, explanation

    # ── Rule 2: Distractor exclusion (Negative Elimination) ──
    if "səhv variant" in exp_norm:
        wrong_letters = set()
        for let in ["a", "b", "c", "d"]:
            if re.search(rf"(?:-\s*{let}\b|{let}\s*variant|{let}\s*bəndi)[\s\:\-][^\.\n]*?(?:səhv|yanlış|uyğun deyil)", exp_norm):
                wrong_letters.add(let.upper())
        if len(wrong_letters) == 3:
            all_letters = {"A", "B", "C", "D"}
            surviving = list(all_letters - wrong_letters)[0]
            surviving_idx = ans_map[surviving]
            if surviving_idx < len(clean_opts):
                changed = (surviving != current_answer)
                return surviving, 98, "distractor_exclusion", changed, explanation

    # ── Rule 3: Negative Question Handling ──
    is_negative_q = any(neg in q_norm for neg in [
        "doğru deyil", "düzgün deyil", "asılı deyil", "aid deyil",
        "uyğun deyil", "baş vermir", "müşahidə olunmur", "yanlışdır", "səhvdir"
    ])

    stemmed_exp = [stem_az(w) for w in re.findall(r"[a-zəöüğıçş0-9]+", exp_norm) if len(w) >= 3 and w not in STOP_WORDS]
    exp_stem_str = " " + " ".join(stemmed_exp) + " "

    # ── Rule 4: Semantic & Numerical Option Scoring ──
    opt_scores = []
    
    for idx, opt_norm in enumerate(clean_opts):
        raw_str = raw_clean_opts[idx]
        score = 0
        
        # A. Single-letter symbol matching (e.g. Q, V, t, m)
        if len(raw_str.strip()) == 1 and raw_str.strip().isalpha():
            raw_let = raw_str.strip()
            if re.search(rf"\b{re.escape(raw_let.lower())}\s*(?:hərfi|ilə|işarə|kimi|qiyməti)\b", exp_norm):
                score += 160
            elif f" {raw_let.lower()} " in f" {exp_norm} ":
                score += 50

        # B. Chemical equation reaction sign (+Q vs -Q)
        if "+q" in opt_norm or "+ q" in opt_norm:
            if "+q" in exp_norm or "+ q" in exp_norm or "ekzotermik" in exp_norm:
                score += 140
            if "-q" in exp_norm or "- q" in exp_norm:
                score -= 60
        elif "-q" in opt_norm or "- q" in opt_norm:
            if "-q" in exp_norm or "- q" in exp_norm or "endotermik" in exp_norm:
                score += 140
            if "+q" in exp_norm or "+ q" in exp_norm:
                score -= 60

        # C. Full exact substring match
        if len(opt_norm) >= 4 and opt_norm in exp_norm:
            score += 140
            
        # D. Stemmed token & phrase overlap
        opt_stem_words = [stem_az(w) for w in re.findall(r"[a-zəöüğıçş0-9]+", opt_norm) if len(w) >= 3 and w not in STOP_WORDS]
        if opt_stem_words:
            stem_matches = sum(1 for w in opt_stem_words if f" {w} " in exp_stem_str)
            stem_ratio = stem_matches / len(opt_stem_words)
            score += stem_ratio * 70
            if len(opt_stem_words) >= 2 and stem_matches == len(opt_stem_words):
                score += 60  # All substantive stems found!
                
            # Stem bigram matching
            if len(opt_stem_words) >= 2:
                for i in range(len(opt_stem_words) - 1):
                    bg = f" {opt_stem_words[i]} {opt_stem_words[i+1]} "
                    if bg in exp_stem_str:
                        score += 55
                    elif opt_stem_words[i] in exp_stem_str and opt_stem_words[i+1] in exp_stem_str:
                        score += 20
                    
        # E. Chemical synonyms match
        for k, syns in CHEM_SYNONYMS.items():
            if k in opt_norm:
                for s in syns:
                    if s in exp_norm:
                        score += 95
                        
        # F. Math exact numerical match & fractions
        num_m = re.findall(r"\b\-?\d+(?:\.\d+)?(?:/\d+)?\b", opt_norm)
        if num_m:
            for num in num_m:
                if re.search(rf"(?:=|\bbərabərdir\b|\balınır\b|\bqiyməti\b|\bcavab\b)\s*:?\s*{re.escape(num)}\b", exp_norm):
                    score += 130
                elif f"= {num}" in exp_norm or f"={num}" in exp_norm:
                    score += 100
                elif re.search(rf"\b{re.escape(num)}\b", exp_norm):
                    score += 35

        # G. Negative question bonus / penalty
        if is_negative_q:
            for w in opt_stem_words:
                if re.search(rf"\b{re.escape(w)}\w*(?:\s+\w+){{0,4}}\s+(?:deyil|yoxdur|rol oynamır|təsir etmir)\b", exp_norm):
                    score += 350
                if re.search(rf"\b{re.escape(w)}\w*(?:\s+\w+){{0,4}}\s+(?:asılıdır|aiddir|doğrudur)\b", exp_norm):
                    score -= 200
                
        opt_scores.append((idx, score, raw_str))
        
    opt_scores.sort(key=lambda x: x[1], reverse=True)
    best_idx, best_score, best_str = opt_scores[0]
    second_idx, second_score, _ = opt_scores[1] if len(opt_scores) > 1 else (-1, 0, "")
    
    # Decisive victory threshold
    if best_score >= 45 and (best_score - second_score) >= 20:
        chosen_letter = rev_map[best_idx]
        changed = (chosen_letter != current_answer)
        return chosen_letter, best_score, f"semantic_match (score={best_score:.1f} vs {second_score:.1f})", changed, explanation
        
    # If no decisive winner, keep current answer (safe fallback)
    return current_answer, 0, "ambiguous_fallback", False, explanation

def heal_all_grades():
    print("=" * 80, flush=True)
    print("UNIVERSAL ANSWER KEY HEALING ENGINE v3.0 — ALL 11 GRADES", flush=True)
    print("=" * 80, flush=True)
    
    total_processed = 0
    total_healed = 0
    grade_report = {}
    
    os.makedirs(STAGING_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)
    
    for grade in range(1, 12):
        path = os.path.join(DATA_DIR, f"grade_{grade}.json")
        if not os.path.exists(path):
            continue
            
        print(f"\n🔄 Emal edilir: Sinif {grade} ({path})...", flush=True)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        g_total = 0
        g_healed = 0
        healed_samples = []
        
        for subj, topics in data.items():
            if not isinstance(topics, dict):
                continue
            for topic, questions in topics.items():
                if not isinstance(questions, list):
                    continue
                for q in questions:
                    if not isinstance(q, dict):
                        continue
                    g_total += 1
                    total_processed += 1
                    
                    cur_ans = q.get("answer", q.get("correct_answer"))
                    opts = q.get("options", q.get("opts", []))
                    exp = q.get("explanation", q.get("izah", ""))
                    q_text = q.get("question", q.get("q", ""))
                    
                    healed_let, conf, reason, changed, updated_exp = solve_best_answer(q_text, opts, exp, cur_ans)
                    
                    if changed and healed_let in ["A", "B", "C", "D"]:
                        g_healed += 1
                        total_healed += 1
                        
                        # Apply heal
                        q["answer"] = healed_let
                        q["correct_answer"] = healed_let
                        q["correctAnswer"] = ord(healed_let) - 65
                        q["correct_index"] = ord(healed_let) - 65
                        if "explanation" in q:
                            q["explanation"] = updated_exp
                        if "izah" in q:
                            q["izah"] = updated_exp
                        
                        if len(healed_samples) < 5:
                            healed_samples.append({
                                "subj": subj,
                                "topic": topic[:40],
                                "q": q_text[:60],
                                "from": cur_ans,
                                "to": healed_let,
                                "opt": opts[ord(healed_let)-65] if ord(healed_let)-65 < len(opts) else ""
                            })
                            
                    # Always ensure all 4 answer fields are consistent across consumers
                    final_ans = q.get("answer") or q.get("correct_answer")
                    if final_ans in ["A", "B", "C", "D"]:
                        q["answer"] = final_ans
                        q["correct_answer"] = final_ans
                        q["correctAnswer"] = ord(final_ans) - 65
                        q["correct_index"] = ord(final_ans) - 65
                            
        # Save simultaneously to data/grades and autonomous_kag/active_staging
        out_staging = os.path.join(STAGING_DIR, f"grade_{grade}.json")
        out_data = os.path.join(DATA_DIR, f"grade_{grade}.json")
        
        with open(out_staging, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        with open(out_data, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"  ✅ Sinif {grade}: {g_total:,} sualdan {g_healed:,} sualın cavab açarı sağaldıldı və saxlanıldı.", flush=True)
        for hs in healed_samples:
            print(f"     • [{hs['subj']}] {hs['from']} ➔ {hs['to']} (\"{hs['opt']}\")", flush=True)
            
        grade_report[grade] = {"total": g_total, "healed": g_healed}
        
    print("\n" + "=" * 80, flush=True)
    print(f"🎉 BÜTÜN 11 SİNİF ÜZRƏ {total_processed:,} SUALDAN {total_healed:,} SUAL ƏLAVƏ SAĞALDILDI!", flush=True)
    print("=" * 80, flush=True)

if __name__ == "__main__":
    heal_all_grades()
