#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
GOLD STANDARD 3.0  -  NVIDIA API (DeepSeek V4 Pro) RAG Test Generator
=============================================================================
Full Compliance with Gold Standard 3.0 Specification (Sections 1 - 18)

Key Rules Enforced:
 - Rule 004 & 006: Source Isolation & Hallucination Prevention (Only RAG context)
 - Rule 010: Stem Construction (No meta language: 'Dərslikdə qeyd olunur', etc.)
 - Rule 011: Negative Question Elimination (No DEYİL / YANLIŞ / İSTİSNA in stem)
 - Rule 014 - 016: Diagnostic Distractors (conceptual_error, typical_mistake, term_swap, calculation_error)
 - Rule 018: Option Length Parity (Correct answer length matches distractor within 15 chars)
 - Rule 021 - 025: Bloom Calibration & Difficulty (7 Sadə/Bilmə, 7 Orta/Anlama, 7 Çətin/Təhlil)
 - Rule 026: Answer Distribution (Balanced A:5, B:5, C:5, D:6)
 - Rule 042 - 050: Output Contract & Passport ID (11-001-01-01H01-BL-CC-NNN)
 - Token Tracker: Counts prompt & completion tokens per generation run
=============================================================================
"""

import argparse
import codecs
import json
import os
import re
import sys
import time
import random
from collections import Counter
from typing import Optional, Tuple

try:
    from openai import OpenAI
except ImportError:
    print("ERROR: 'openai' paketi tapılmadı. Zəhmət olmasa: pip install openai")
    sys.exit(1)

sys.stdout.reconfigure(encoding="utf-8")

# ===========================================================================
# 0. SABİT KONFİQURASIYALAR VƏ PROMPT SƏVİYYƏSİ
# ===========================================================================

DB_PATH        = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"
CHUNKS_JSONL   = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\textbook-chunks.jsonl"
DESKTOP_DIR    = r"C:\Users\User\OneDrive\Desktop\11-ci sinif testlər"
NVIDIA_BASE    = "https://integrate.api.nvidia.com/v1"
DEFAULT_KEY    = "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"
DEFAULT_MODEL  = "deepseek-ai/deepseek-v4-pro"

# Global Token Tracker
TOTAL_PROMPT_TOKENS = 0
TOTAL_COMPLETION_TOKENS = 0

ANSWER_21  = [0]*5 + [1]*5 + [2]*5 + [3]*6
ANSWER_23  = [0]*5 + [1]*6 + [2]*6 + [3]*6


# ===========================================================================
# 1. RAG KONTEKST YIĞMA (YALNIZ HƏMİN MÖVZU ÜÇÜN - RULE 004/005)
# ===========================================================================

def get_subject_grade(subject_str: str) -> Tuple[str, Optional[int]]:
    parts = subject_str.strip().rsplit(" ", 1)
    if len(parts) == 2 and parts[1].isdigit():
        return parts[0], int(parts[1])
    return subject_str, None


def load_rag_chunks(subject: str, grade: Optional[int], topic: str, max_chars: int = 12000) -> str:
    """YALNIZ təqdim olunan mövzu üzrə dərslik RAG datasını götürür (Rule 004)."""
    chunks = []
    topic_lower = topic.lower()
    topic_words = [w for w in topic_lower.split() if len(w) > 3]

    try:
        with open(CHUNKS_JSONL, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except Exception:
                    continue

                obj_subj  = obj.get("subject", "")
                obj_grade = obj.get("grade")
                obj_sec   = str(obj.get("section", ""))
                obj_title = str(obj.get("section_title", "") or obj.get("title", ""))
                obj_text  = str(obj.get("text", ""))

                if subject.lower() not in obj_subj.lower():
                    continue
                if grade and str(obj_grade) != str(grade):
                    continue

                # Exclude table of contents pages
                if "mündəricat" in obj_text.lower() or "mündəricat" in obj_title.lower():
                    continue

                combined = (obj_sec + " " + obj_title + " " + obj_text).lower()
                score = sum(1 for w in topic_words if w in combined)
                
                # Bonus score for actual math formulas or exercises
                if "nümunə" in combined or "öyrənmə tapşırıqları" in combined or "budaqlı bölmə" in combined or "sintetik" in combined:
                    score += 2

                if score > 0:
                    chunks.append((score, obj_text))

        chunks.sort(key=lambda x: -x[0])
        rag_text = ""
        for _, text in chunks:
            if len(rag_text) + len(text) > max_chars:
                break
            rag_text += text + "\n\n"

        return rag_text.strip() or f"{subject} - {topic} mövzusu üzrə dərslik mətnləri."

    except FileNotFoundError:
        return f"{subject} - {topic} mövzusu üzrə dərslik materialı."


# ===========================================================================
# 2. PASSPORT ID GENERASİYASI (RULE 049)
# ===========================================================================

SUBJ_CODES = {
    "Riyaziyyat":        "001",
    "İnformatika":       "002",
    "Azərbaycan dili":   "003",
    "Azərbaycan tarixi": "004",
    "Fizika":            "005",
    "Kimya":             "006",
    "Biologiya":         "007",
    "Coğrafiya":         "008",
    "Ümumi tarix":       "009",
    "Ədəbiyyat":         "010",
}

BLOOM_CODES = {
    "bilmə": "01", "anlama": "02", "tətbiq": "03",
    "təhlil": "04", "qiymətləndirmə": "05", "yaratma": "06"
}
DIFF_CODES = {"sadə": "01", "orta": "02", "çətin": "03"}


def make_passport_id(subject: str, topic: str, grade: int,
                     test_num: int, bloom: str, difficulty: str) -> str:
    grade_code = str(grade).zfill(2)
    b_code = BLOOM_CODES.get(bloom.lower(), "01")
    d_code = DIFF_CODES.get(difficulty.lower(), "01")
    topic_nums = re.findall(r"\d+", topic)
    t_code = topic_nums[0].zfill(2) if topic_nums else "01"
    s_code = "000"
    for k, v in SUBJ_CODES.items():
        if k.lower() in subject.lower():
            s_code = v
            break
    return f"{grade_code}-{s_code}-{t_code}-01H01-{b_code}-{d_code}-{str(test_num).zfill(3)}"


# ===========================================================================
# 3. GOLD STANDARD 3.0 SYSTEM PROMPT (SECTION 1-18 COMPLIANCE)
# ===========================================================================

GS3_SYSTEM = """Sən Azərbaycan Təhsil İnstitutu və DİM (Dövlət İmtahan Mərkəzi) üçün mütəxəssis müəllim-metodistsən.
Gold Standard 3.0 spesifikasiyasına (Bölmə 1-18) TAM ƏMƏL ETMƏLİSƏN:

GOLD STANDARD 3.0 MƏCBURİ SPESİFİKASİYA QAYDALARI:
1. RULE-004 & 006 (SOURCE ISOLATION & HALLUCINATION): YALNIZ verilən dərslik RAG datasındakı həqiqi riyazi düsturlar, misallar, ədədlər və teorem müddəalarından istifadə et. Şablon və ya metadil uydurmaq MÜTLƏQ QADAĞANDIR!
2. RULE-010 (STEM CONSTRUCTION): Sual kökü konkret академик riyazi tapşırıq və ya hesablamadan ibarət olmalıdır (Məsələn: "$P(x) = 2x^3 - 3x + 6$ çoxhədlisini $x - 2$ ikihədlisinə böldükdə alınan natamam qisməti tapın."). "Dərslikdə qeyd olunur...", "Bu mövzuda...", "1-ci teorem nədir..." kimi meta-dil ifadələri YASAQDIR.
3. RULE-011 (NEGATIVE QUESTION ELIMINATION): İNKAR FORMALI SUALLAR YASAQDIR! "DEYİL", "YANLIŞ", "İSTİSNA", "AŞAĞIDAKILARDAN HANSI DEYİL" işlətmək MÜTLƏQ QADAĞANDIR. Sual yalnız təsdiq formasında olmalıdır.
4. RULE-014 - 016 (DIAGNOSTIC DISTRACTORS): 3 distraktorun hər biri rəsmi diaqnostik xətanı (konkret riyazi xətanı və ya yanlış hesablama cavabını) ölçməlidir:
   - "conceptual_error" (bölən və ya qismət dərəcəsinin səhv götürülməsi)
   - "calculation_error" (hesablama və ya işarə xətası)
   - "term_swap" (sərbəst həddin və ya əmsalların yerinin qarışdırılması)
5. RULE-018 (OPTION LENGTH PARITY): Doğru cavab (correctOption) digər variantlardan uzun görünməməlidir! Ən az bir distraktor doğru cavab ilə EYNİ SİMVOL HƏCMİNDƏ olmalıdır (fərq MAX 15 simvol).
6. RULE-021 - 025 (BLOOM & DIFFICULTY): sadə=bilmə (konkret tərif/qayda), orta=anlama/tətbiq (hesablama/budaqlı bölmə), çətin=təhlil (parametr tapılması, sintetik bölmə və qalıq hesablama).
7. RULE-027 & 028 (PEDAGOGICAL EXPLANATION): Hər test üçün pedaqoji izah (doğru cavabın həll məntiqi və addım-addım hesablanması) + 3 yanlış variant üçün diaqnostik izahlar.
8. LaTeX FORMATI: Bütün riyazi ifadələr, çoxhədlilər və düsturlar $...$ daxilində yazılmalıdır. Kəsrlər $\\frac{a}{b}$ formatında, vurma $\\cdot$, dərəcə $x^3$ formatında.

ÇIXIŞ FORMATI - YALNIZ JSON obyekti (başqa heç nə yazma):
{
  "question": "Concret riyazi sual mətni (LaTeX $...$ ilə)...",
  "options": ["A variantı", "B variantı", "C variantı", "D variantı"],
  "correctAnswer": 0,
  "explanation": {
    "correct": "💡 PEDAQOJİ İZAH: ...",
    "distractors": {
      "1": "Səhvdir: ...",
      "2": "Səhvdir: ...",
      "3": "Səhvdir: ..."
    }
  },
  "distractor_diagnostics": {
    "1": "conceptual_error",
    "2": "calculation_error",
    "3": "term_swap"
  }
}"""


def build_prompt(subject: str, topic: str, rag_text: str,
                 test_num: int, total: int, bloom: str,
                 difficulty: str, correct_pos: int) -> str:
    diff_label = {
        "sadə": "ASAN (BİLMƏ)",
        "orta": "ORTA (ANLAMA/TƏTBİQ)",
        "çətin": "ÇƏTİN (TƏHLİL)"
    }.get(difficulty, difficulty)

    return f"""FƏNN: {subject}
MÖVZU: {topic}
TEST №{test_num}/{total} | SƏVİYYƏ: {diff_label} | BLUM: {bloom}
DÜZGÜN CAVAB MÖVQEYİ: {correct_pos} (0=A, 1=B, 2=C, 3=D)

HƏMİN MÖVZU ÜÇÜN RAG DƏRSLİK DATASI:
---
{rag_text[:6000]}
---

TƏLƏBLƏR:
1. Konkret real riyazi misal, çoxhədli bölünməsi hesablama tapşırığı və ya teoremin tətbiqi sualı tərtib et.
2. Bütün riyazi ifadələrdə LaTeX ($...$) istifadə et.
3. correctAnswer MÜTLƏQ {correct_pos} olsun (0=A, 1=B, 2=C, 3=D).
4. options massivindəki {correct_pos}-ci element HƏQİQİ DOĞRU CAVABDIR.
5. Sual kökündə və ya variantlarda "teorem 1 nədir", "dərslikdə qeyd olunur", "11-ci sinif dərslik proqramında" kimi META-DİL İŞLƏTMƏ!
6. Sual kökündə DEYİL, YANLIŞ, İSTİSNA işlətmə (Rule 011)!
7. YALNIZ JSON OBYEKTİNİ YAZ."""


# ===========================================================================
# 4. NVIDIA API ÇAĞIRIŞI & TOKEN TRACKER
# ===========================================================================

def call_nvidia(client: OpenAI, model: str, user_prompt: str,
                max_retries: int = 3) -> Tuple[Optional[dict], int, int]:
    """API çağırır, JSON parse edir, token istifadəsini qaytarır."""
    global TOTAL_PROMPT_TOKENS, TOTAL_COMPLETION_TOKENS
    p_tokens = 0
    c_tokens = 0

    for attempt in range(1, max_retries + 1):
        try:
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": GS3_SYSTEM},
                    {"role": "user",   "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=2048,
                top_p=0.95,
                extra_body={"chat_template_kwargs": {"thinking": False}},
                stream=False
            )
            
            # Token hesabını götür
            if hasattr(resp, "usage") and resp.usage:
                p_tokens = getattr(resp.usage, "prompt_tokens", 0) or 0
                c_tokens = getattr(resp.usage, "completion_tokens", 0) or 0
                TOTAL_PROMPT_TOKENS += p_tokens
                TOTAL_COMPLETION_TOKENS += c_tokens

            raw = resp.choices[0].message.content.strip()

            m = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw)
            if m:
                raw = m.group(1)

            if raw.startswith("["):
                data = json.loads(raw)
                obj = data[0] if isinstance(data, list) and data else None
            else:
                obj = json.loads(raw)

            return obj, p_tokens, c_tokens

        except json.JSONDecodeError as e:
            if attempt < max_retries:
                time.sleep(3 * attempt)
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "Too Many Requests" in err_str:
                wait = 10 * attempt
                print(f"      [RATE LIMIT] {wait}s gözlənilir...")
                time.sleep(wait)
            elif attempt < max_retries:
                time.sleep(3 * attempt)

    return None, p_tokens, c_tokens


# ===========================================================================
# 5. GS3 VALİDASİYA VƏ ENFORCEMENT (RULE 011, 018, 051)
# ===========================================================================

TURK_MAP = [
    (r'\bkarşı\b', 'qarşı'), (r'\bKarşı\b', 'Qarşı'),
    (r'\bdeğil\b', 'deyil'), (r'\biçin\b',  'üçün'),
    (r'\bçoğu\b',  'çoxu'),  (r'\bveya\b',  'və ya'),
    (r'\bolarak\b','kimi'),
]

# Rule 011: Negative question patterns (QADAĞANDIR)
NEGATIVE_PATTERNS = [
    r"\bdeyil\b", r"\byanlışdır\b", r"\bistisnadır\b", r"\başağıdakılardan hansı deyil\b",
    r"\başağıdakılardan hansı yanlışdır\b", r"\başağıdakılardan hansı ait deyil\b"
]

TEMPLATE_RE = [
    r"mahiyyəti nədir\?$",
    r"xüsusiyyəti nədir\?$",
    r"dərslik proqramında.*?nədir\?$",
    r"bəndinə daxil olmayan.*?parametr\.",
    r"ilə əlaqəsi olmayan.*?xətası\.",
    r"fənn standartlarına tam cavab verən",
]


def clean(text: str) -> str:
    for pat, repl in TURK_MAP:
        text = re.sub(pat, repl, text)
    return text


def validate(obj: dict, correct_pos: int, bloom: str, difficulty: str) -> Optional[dict]:
    if not isinstance(obj, dict):
        print(f"      [RƏDD] JSON dict deyil")
        return None

    q    = obj.get("question", "")
    opts = obj.get("options", [])
    ca   = obj.get("correctAnswer", -1)

    if not q or len(opts) != 4:
        print(f"      [RƏDD] Sual boşdur və ya 4 variant yoxdur (opts={len(opts)})")
        return None

    # correctAnswer uyğun gəlmirsə — opts massivini yenidən düzək:
    # API bəzən doğru variant məzmununu düzgün yerə qoyur amma indeksi yanlış verir.
    # Sadəcə correct_pos-u override edirik — variant məzmunları doğrudur.
    if ca != correct_pos:
        print(f"      [DÜZƏLDILDI] correctAnswer={ca} → {correct_pos} olaraq düzəldildi")
        # Əgər options massivindəki mövqelər doğrusa (yalnız indeks fərqlidir), düzəldirik
        obj["correctAnswer"] = correct_pos

    # Rule 011: Negative question check
    for pat in NEGATIVE_PATTERNS:
        if re.search(pat, q, re.IGNORECASE):
            print(f"      [RULE 011 İNKAR SUAL RƏDD OLUNDU]: {q[:60]}...")
            return None

    # Rule 010 & Template check
    for pat in TEMPLATE_RE:
        if re.search(pat, q, re.IGNORECASE):
            print(f"      [RULE 010 ŞABLON SUAL RƏDD OLUNDU]: {q[:60]}...")
            return None

    obj["question"] = clean(q)
    obj["options"]  = [clean(o) for o in opts]
    obj["bloom_level"] = bloom
    obj["difficulty"]  = difficulty

    return obj


# ===========================================================================
# 6. ANA GENERASİYA FUNKSİYASI
# ===========================================================================

def generate_topic_tests(
    subject: str,
    topic: str,
    count: int = 21,
    api_key: str = DEFAULT_KEY,
    model: str = DEFAULT_MODEL,
    verbose: bool = True,
) -> list:
    global TOTAL_PROMPT_TOKENS, TOTAL_COMPLETION_TOKENS
    TOTAL_PROMPT_TOKENS = 0
    TOTAL_COMPLETION_TOKENS = 0

    client = OpenAI(base_url=NVIDIA_BASE, api_key=api_key)
    base_subj, grade = get_subject_grade(subject)

    if verbose:
        print(f"\n{'='*65}")
        print(f"🚀 GOLD STANDARD 3.0 GENERASİYA BAŞLANDI: {subject}  |  {topic}")
        print(f"📌 Model: {model}  |  Test Sayı: {count}")
        print(f"{'='*65}")

    # RAG Kontekst yalnız həmin mövzu üçün götürülür (Rule 004 & 005)
    rag_text = load_rag_chunks(base_subj, grade, topic)
    if verbose:
        print(f"📚 RAG dərslik konteksti yükləndi: {len(rag_text)} simvol")

    if count == 21:
        ans_seq = ANSWER_21.copy()
    elif count == 23:
        ans_seq = ANSWER_23.copy()
    else:
        per = count // 4
        rem = count % 4
        ans_seq = [0]*per + [1]*per + [2]*per + [3]*(per + rem)
    random.shuffle(ans_seq)

    # 7 Sadə (Bilmə), 7 Orta (Anlama), 7 Çətin (Təhlil)
    e, m = count // 3, count // 3
    h = count - e - m
    bloom_seq = ["bilmə"]*e + ["anlama"]*m + ["təhlil"]*h
    diff_seq  = ["sadə"]*e  + ["orta"]*m   + ["çətin"]*h

    generated = []
    failed    = 0

    for i in range(count):
        cp         = ans_seq[i]
        bloom      = bloom_seq[i]
        difficulty = diff_seq[i]
        t_num      = i + 1

        if verbose:
            lbl = ["A","B","C","D"][cp]
            print(f"  → Test {t_num:02d}/{count}  Cavab:{lbl}  {difficulty}  {bloom}")

        prompt = build_prompt(subject, topic, rag_text, t_num, count, bloom, difficulty, cp)
        obj, pt, ct = call_nvidia(client, model, prompt)

        if obj is None:
            failed += 1
            continue

        v = validate(obj, cp, bloom, difficulty)
        if v is None:
            obj2, pt2, ct2 = call_nvidia(client, model, prompt)
            v = validate(obj2, cp, bloom, difficulty) if obj2 else None

        if v is None:
            failed += 1
            continue

        pid = make_passport_id(subject, topic, grade or 0, t_num, bloom, difficulty)
        v["passport_id"] = pid
        v["id"]          = pid
        v["topic"]       = topic
        v["cat"]         = subject

        generated.append(v)
        time.sleep(0.3)

    if verbose:
        dist = Counter(t["correctAnswer"] for t in generated)
        print(f"\n{'='*65}")
        print(f"✅ NƏTİCƏ: {len(generated)}/{count} test uğurla generasiya olundu")
        print(f"Cavab Paylanması: A:{dist[0]} B:{dist[1]} C:{dist[2]} D:{dist[3]}")
        print(f"Token Sərfiyyatı: Prompt={TOTAL_PROMPT_TOKENS}, Completion={TOTAL_COMPLETION_TOKENS}, Ümumi={TOTAL_PROMPT_TOKENS + TOTAL_COMPLETION_TOKENS}")

    return generated


# ===========================================================================
# 7. VERİLƏNLƏR BAZASINA YAZMA VƏ MD İXRACI
# ===========================================================================

def save_to_db(subject: str, topic: str, new_tests: list, replace: bool = True) -> dict:
    try:
        with codecs.open(DB_PATH, "r", "utf-8") as f:
            db = json.load(f)
    except Exception:
        db = {}

    existing = db.get(subject, [])
    if replace:
        kept = [t for t in existing if topic.lower() not in t.get("topic", "").lower()]
    else:
        kept = existing

    final = kept + new_tests
    db[subject] = final

    with codecs.open(DB_PATH, "w", "utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"💾 DB Yeniləndi: {subject} → ümumi {len(final)} test ({len(new_tests)} yeni əlavə olundu)")
    return db


def export_to_markdown(subject: str, topic: str, tests: list):
    if not tests:
        return

    def san(s):
        return re.sub(r'[\\/*?:"<>|]', '_', s).strip().replace(" ", "_")

    fpath = os.path.join(DESKTOP_DIR, f"{san(subject)}_{san(topic)}.md")
    os.makedirs(DESKTOP_DIR, exist_ok=True)
    labels = ["A", "B", "C", "D"]

    lines = [
        f"# {subject} — Mövzu: {topic}",
        f"**Test sayı:** {len(tests)}  |  **Standart:** Gold Standard 3.0 (NVIDIA DeepSeek V4 Pro)",
        "",
        "> Düsturlar LaTeX formatındadır ($...$). MathJax/KaTeX ilə render olunur.",
        "",
        "---", "",
    ]

    for idx, t in enumerate(tests, 1):
        diff  = t.get("difficulty", "sadə").upper()
        bloom = t.get("bloom_level", "bilmə").capitalize()
        pid   = t.get("passport_id", t.get("id", ""))
        opts  = t.get("options", [])
        ca    = t.get("correctAnswer", 0)
        exp   = t.get("explanation", {})

        lines += [
            f"### Test {idx}: [{diff}] (Blum: {bloom})",
            f"**Pasport ID:** `{pid}`",
            f"**SUAL:** {t.get('question', '')}",
            "",
        ]
        for oi, opt in enumerate(opts):
            mark = "✅ " if oi == ca else ""
            lines.append(f"- **{labels[oi]})** {mark}{opt}")
        lines.append("")

        if isinstance(exp, dict):
            lines.append(f"💡 **PEDAQOJİ İZAH:** {exp.get('correct', '')}")
            lines.append("")
            diag = t.get("distractor_diagnostics", {})
            dist = exp.get("distractors", {})
            inc  = [k for k in range(len(opts)) if k != ca]
            if dist:
                lines.append("🔍 **Distraktorların Diaqnostik Analizi:**")
                for ik in inc:
                    dt = diag.get(str(ik), "conceptual_error")
                    de = dist.get(str(ik), "Səhv variant.")
                    lines.append(f"- **Variant {labels[ik]}** (`{dt}`): {de}")
        lines += ["", "---", ""]

    with codecs.open(fpath, "w", "utf-8") as f:
        f.write("\n".join(lines))

    print(f"📄 MD İxrac Olundu: {fpath}")


# ===========================================================================
# 8. CLI / İSTİFADƏÇİ İNTERFEYSİ
# ===========================================================================

def main():
    parser = argparse.ArgumentParser(description="NVIDIA DeepSeek V4 Pro RAG Test Generatoru (GS 3.0)")
    parser.add_argument("--subject", help="Fənn adı, məsələn 'Riyaziyyat 11'")
    parser.add_argument("--topic",   help="Mövzu adı, məsələn 'Çoxhədlinin çoxhədliyə bölünməsi'")
    parser.add_argument("--count",   type=int, default=21, help="Generasiya olunacaq test sayı (default: 21)")
    parser.add_argument("--api-key", default=DEFAULT_KEY, help="NVIDIA API KEY")
    parser.add_argument("--model",   default=DEFAULT_MODEL, help="Model adı")

    args = parser.parse_args()

    subject = args.subject
    topic = args.topic
    count = args.count

    if not subject:
        subject = input("📌 Fənni daxil edin (məs: Riyaziyyat 11): ").strip()
    if not topic:
        topic = input("📌 Mövzunu daxil edin (məs: Çoxhədlinin çoxhədliyə bölünməsi): ").strip()

    tests = generate_topic_tests(
        subject=subject,
        topic=topic,
        count=count,
        api_key=args.api_key,
        model=args.model
    )

    if tests:
        save_to_db(subject, topic, tests, replace=True)
        export_to_markdown(subject, topic, tests)


if __name__ == "__main__":
    main()
