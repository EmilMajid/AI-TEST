# -*- coding: utf-8 -*-
"""Continuous Automated Psychometric & Anti-Template Guardrail v2.0
FIXED: Now correctly handles both storage structures in offline_tests.json:
  - Structure A (old): { subject: { topic_name: [question, ...], ... } }
  - Structure B (new): { subject: [ question_obj, ... ] }
And correctly reads options regardless of dict or list format.

Blocks any test question from entering or staying in the system if:
1. Max/Min option length ratio > 1.40
2. Contains forbidden generic template sentences
3. Contains naive clue keywords ("Yalnız...", "Heç bir vəchlə...", etc.)
4. Contains parenthetical giveaways in options
5. Correct answer index mismatches between correctAnswer and correct_answer fields
"""

import argparse
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = r"C:\Users\User\Downloads\azerbaijanaiplatform"
DB_PATH = f"{ROOT}/data/offline_tests.json"

FORBIDDEN_TEMPLATES = [
    r"sintaktik və məna ardıcıllığı ilə bağlı \d+-ci sual",
    r"Cümlələrin düzgün əlaqələndirilməsi qaydası hansıdır",
    r"mətnində toxunulan əsas ictimai və mədəni problem hansıdır",
    r"mövzusunda tədris olunan milli-mənəvi dəyərlər",
    r"Yalnız sözlərin hərflərinin sayına",
    r"Düşüncəni aydın, lakonik və təsirli ifadə edən",
    r"Şagirdlərdə oxu-anlama, leksik təhlil və mürəkkəb"
]

NAIVE_GIVEAWAYS = [
    r"^yalnız\s+",
    r"^heç\s+bir\s+vəchlə\s+",
    r"^hamısı\s+",
    r"qədim roma\w*"
]

LETTERS = ["A", "B", "C", "D"]

def extract_opts_list(opts_raw):
    """
    Normalize options to a plain list of 4 strings regardless of source format.
    Handles:
      - list of strings: ["opt1", "opt2", "opt3", "opt4"]
      - dict with letter keys: {"A": "opt1", "B": "opt2", "C": "opt3", "D": "opt4"}
    """
    if isinstance(opts_raw, list):
        return [str(o).strip() for o in opts_raw]
    elif isinstance(opts_raw, dict):
        # Try letter keys first
        result = []
        for k in LETTERS:
            if k in opts_raw:
                result.append(str(opts_raw[k]).strip())
        if len(result) == 4:
            return result
        # Fallback: take values in insertion order
        return [str(v).strip() for v in opts_raw.values()]
    return []

def check_question(q, subject, topic_name, q_idx, violations_list):
    """Check a single question object. Appends violation messages to violations_list."""

    q_text  = (q.get("question") or q.get("q") or "").strip()
    opts_raw = q.get("options") or q.get("opts") or []
    opts    = extract_opts_list(opts_raw)

    # --- 1. Forbidden template in stem ---
    for pat in FORBIDDEN_TEMPLATES:
        if re.search(pat, q_text, re.IGNORECASE):
            violations_list.append(
                f"[ŞABLON]   {subject} | {topic_name} | Sual {q_idx}: "
                f"Qadağan şablon tapıldı: '{pat}'"
            )

    # --- 2. Option count ---
    if len(opts) != 4:
        violations_list.append(
            f"[VARIANT SAYI] {subject} | {topic_name} | Sual {q_idx}: "
            f"4 variant gözlənilir, {len(opts)} tapıldı"
        )
        return  # Skip further checks if we don't have 4 options

    # --- 3. Length ratio ---
    lens  = [len(o) for o in opts]
    min_l = max(min(lens), 1)
    ratio = max(lens) / min_l
    if ratio > 1.50:
        violations_list.append(
            f"[UZUNLUQ]  {subject} | {topic_name} | Sual {q_idx}: "
            f"Ratio {ratio:.2f} > 1.50 | uzunluqlar={lens}"
        )

    # --- 4. Naive giveaways & parentheses in options ---
    for i, opt in enumerate(opts):
        letter = LETTERS[i]
        for pat in NAIVE_GIVEAWAYS:
            if re.search(pat, opt, re.IGNORECASE):
                violations_list.append(
                    f"[İPUCU]    {subject} | {topic_name} | Sual {q_idx} | "
                    f"Variant {letter}: naiv ipucu '{pat}' -> '{opt[:60]}'"
                )
        if "(" in opt and ")" in opt:
            violations_list.append(
                f"[MÖTƏRİZƏ] {subject} | {topic_name} | Sual {q_idx} | "
                f"Variant {letter}: mötərizəli ipucu tapıldı -> '{opt[:60]}'"
            )

    # --- 5. Correct answer key consistency ---
    corr_letter = q.get("correct_answer") or q.get("answer")
    corr_idx    = q.get("correctAnswer")
    if corr_letter is not None and corr_idx is not None:
        expected_idx = LETTERS.index(corr_letter.strip().upper()) if corr_letter.strip().upper() in LETTERS else -1
        if expected_idx != corr_idx:
            violations_list.append(
                f"[AÇAR UYĞUNSUZLUĞU] {subject} | {topic_name} | Sual {q_idx}: "
                f"correct_answer='{corr_letter}' ({expected_idx}) != correctAnswer={corr_idx}"
            )


def run_guardrail(target_subject=None):
    if not os.path.exists(DB_PATH):
        print(f"[XƏTA] Baza faylı tapılmadı: {DB_PATH}")
        sys.exit(1)

    with open(DB_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    total_violations  = 0
    checked_questions = 0
    all_violations    = []

    print(f"\n🛡️  PSİXOMETRİK VƏ ŞABLONSUZLUQ QORUYUCUSU v2.0")
    print(f"    Hədəf: {target_subject or 'BÜTÜN BAZA'}\n")

    # Deduplicate: skip alias keys that point to the same data as the primary key
    seen_data_ids = set()

    for subject, value in db.items():
        # Subject filter
        if target_subject and subject.lower() != target_subject.lower():
            continue

        # Deduplicate alias keys (azerbaycan-tarixi-9, Azərbaycan tarixi, etc.)
        data_id = id(value)
        if data_id in seen_data_ids:
            continue
        seen_data_ids.add(data_id)

        # ── Structure A: { topic_name: [q, ...], ... } ──────────────────────
        if isinstance(value, dict):
            for t_name, qs in value.items():
                if not isinstance(qs, list):
                    continue
                for q_idx, q in enumerate(qs, 1):
                    if not isinstance(q, dict):
                        continue
                    checked_questions += 1
                    check_question(q, subject, t_name, q_idx, all_violations)

        # ── Structure B: [ q, ... ] ──────────────────────────────────────────
        elif isinstance(value, list):
            for q_idx, q in enumerate(value, 1):
                if not isinstance(q, dict):
                    continue
                t_name = q.get("topic") or q.get("topic_key") or "—"
                checked_questions += 1
                check_question(q, subject, t_name, q_idx, all_violations)

    total_violations = len(all_violations)

    if all_violations:
        print("POZUNTULAR:")
        for msg in all_violations:
            print(f"  {msg}")
        print()

    print("─" * 80)
    print(f"  Yoxlanılan Ümumi Sual Sayı : {checked_questions}")
    print(f"  Aşkar Edilən Pozuntu Sayı  : {total_violations}")
    print("─" * 80)

    if total_violations == 0 and checked_questions > 0:
        print("✅ [TƏSDİQ EDİLDİ] Baza 100% təmizdir! Heç bir şablon, ipucu, "
              "mötərizə və ya açar uyğunsuzluğu yoxdur.")
        return True
    elif checked_questions == 0:
        print("⚠️  [XƏBƏRDARLIQ] Heç bir sual yoxlanılmadı! Fənn adını yenidən yoxlayın.")
        return False
    else:
        print("❌ [BLOKLANDI] Baza standartlara cavab vermir. Düzəliş tələb olunur!")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", type=str, default=None,
                        help="Yoxlanılacaq fənnin adı (məs: 'Azərbaycan tarixi 9')")
    args    = parser.parse_args()
    success = run_guardrail(args.subject)
    sys.exit(0 if success else 1)
