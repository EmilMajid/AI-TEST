#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
GOLD STANDARD 3.0  -  PARALEL ÇOXLU-MODEL GENERATOR
=============================================================================
21 testi 3 modeldə eyni anda paralel generasiya edir.
Hər modelin öz rate-limit kvotası var → ~3x sürətlənmə.

Model bölgüsü (default):
  - Model A (7 test): deepseek-ai/deepseek-v4-pro   → bilmə/sadə
  - Model B (7 test): meta/llama-3.3-70b-instruct   → anlama/orta
  - Model C (7 test): qwen/qwen2.5-72b-instruct     → təhlil/çətin
=============================================================================
"""

import sys, json, re, os, time, codecs, random, argparse
from collections import Counter
from typing import Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

sys.stdout.reconfigure(encoding="utf-8")

try:
    from openai import OpenAI
except ImportError:
    print("ERROR: pip install openai")
    sys.exit(1)

# ── Import shared utilities from main generator ──────────────────────────────
from nvidia_rag_generator import (
    GS3_SYSTEM, build_prompt, load_rag_chunks, get_subject_grade,
    validate, make_passport_id, save_to_db, export_to_markdown,
    NEGATIVE_PATTERNS, TEMPLATE_RE, clean,
    DB_PATH, DESKTOP_DIR, DEFAULT_KEY
)

# ── Paralel işləmə üçün thread-safe token sayğacı ───────────────────────────
_lock = threading.Lock()
TOTAL_PROMPT_TOKENS = 0
TOTAL_COMPLETION_TOKENS = 0

# ── NVIDIA modelləri ─────────────────────────────────────────────────────────
NVIDIA_BASE = "https://integrate.api.nvidia.com/v1"

MODELS = [
    "deepseek-ai/deepseek-v4-pro",
    "meta/llama-3.3-70b-instruct",
    "qwen/qwen2.5-72b-instruct",
    "mistralai/mistral-large-2-instruct",
]

# ── Tək test üçün API çağırışı ────────────────────────────────────────────────
def call_one(client: OpenAI, model: str, user_prompt: str,
             max_retries: int = 3) -> Tuple[Optional[dict], int, int]:
    global TOTAL_PROMPT_TOKENS, TOTAL_COMPLETION_TOKENS
    p_tok = c_tok = 0

    for attempt in range(1, max_retries + 1):
        try:
            extra = {}
            if "deepseek" in model:
                extra = {"chat_template_kwargs": {"thinking": False}}

            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": GS3_SYSTEM},
                    {"role": "user",   "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=2048,
                top_p=0.95,
                extra_body=extra if extra else None,
                stream=False,
            )

            if hasattr(resp, "usage") and resp.usage:
                p = getattr(resp.usage, "prompt_tokens", 0) or 0
                c = getattr(resp.usage, "completion_tokens", 0) or 0
                with _lock:
                    TOTAL_PROMPT_TOKENS += p
                    TOTAL_COMPLETION_TOKENS += c
                p_tok, c_tok = p, c

            raw = resp.choices[0].message.content.strip()
            m = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw)
            if m:
                raw = m.group(1)
            # JSON parse
            if raw.startswith("["):
                data = json.loads(raw)
                obj = data[0] if data else None
            else:
                obj = json.loads(raw)
            return obj, p_tok, c_tok

        except json.JSONDecodeError:
            if attempt < max_retries:
                time.sleep(3 * attempt)
        except Exception as e:
            err = str(e)
            if "429" in err or "Too Many Requests" in err or "rate" in err.lower():
                wait = 15 * attempt
                print(f"  [{model.split('/')[-1][:20]}] ⏳ Rate limit → {wait}s gözlənilir...")
                time.sleep(wait)
            elif attempt < max_retries:
                time.sleep(3 * attempt)

    return None, p_tok, c_tok


# ── Tək test generasiyası (thread-ə göndərilən iş) ───────────────────────────
def generate_one_test(args):
    (subject, topic, rag_text, t_num, total,
     bloom, difficulty, correct_pos, model, api_key) = args

    client = OpenAI(base_url=NVIDIA_BASE, api_key=api_key)
    lbl = ["A", "B", "C", "D"][correct_pos]
    print(f"  [{model.split('/')[-1][:22]:<22}] Test {t_num:02d}/{total}  {lbl}  {difficulty}  {bloom}")

    prompt = build_prompt(subject, topic, rag_text, t_num, total, bloom, difficulty, correct_pos)

    obj, pt, ct = call_one(client, model, prompt)
    if obj is None:
        print(f"  [{model.split('/')[-1][:22]:<22}] Test {t_num:02d} → API boş cavab")
        return None, t_num, correct_pos, bloom, difficulty

    v = validate(obj, correct_pos, bloom, difficulty)
    if v is None:
        # retry once
        obj2, pt2, ct2 = call_one(client, model, prompt)
        v = validate(obj2, correct_pos, bloom, difficulty) if obj2 else None

    if v is None:
        print(f"  [{model.split('/')[-1][:22]:<22}] Test {t_num:02d} → validasiya uğursuz")
        return None, t_num, correct_pos, bloom, difficulty

    return v, t_num, correct_pos, bloom, difficulty


# ── Ana paralel generasiya ────────────────────────────────────────────────────
def generate_parallel(
    subject: str,
    topic: str,
    count: int = 21,
    api_key: str = DEFAULT_KEY,
    models: list = None,
    max_workers: int = 7,
) -> list:
    global TOTAL_PROMPT_TOKENS, TOTAL_COMPLETION_TOKENS
    TOTAL_PROMPT_TOKENS = 0
    TOTAL_COMPLETION_TOKENS = 0

    if models is None:
        models = MODELS[:3]

    base_subj, grade = get_subject_grade(subject)

    print(f"\n{'='*65}")
    print(f"🚀 PARALEL GENERASİYA: {subject}  |  {topic}")
    print(f"📌 Modellər: {', '.join(m.split('/')[-1] for m in models)}")
    print(f"⚡ Test sayı: {count}  |  Max parallel işçi: {max_workers}")
    print(f"{'='*65}")

    rag_text = load_rag_chunks(base_subj, grade, topic)
    print(f"📚 RAG kontekst: {len(rag_text)} simvol\n")

    # Cavab dağılımı
    per = count // 4
    rem = count % 4
    ans_seq = [0]*per + [1]*per + [2]*per + [3]*(per + rem)
    random.shuffle(ans_seq)

    # Bloom/çətinlik: count // 3 hər blok
    e = m_cnt = count // 3
    h = count - e - m_cnt
    bloom_seq = ["bilmə"]*e + ["anlama"]*m_cnt + ["təhlil"]*h
    diff_seq  = ["sadə"]*e  + ["orta"]*m_cnt   + ["çətin"]*h

    # Hər test üçün model seç (round-robin)
    tasks = []
    for i in range(count):
        model = models[i % len(models)]
        tasks.append((
            subject, topic, rag_text,
            i + 1, count,
            bloom_seq[i], diff_seq[i], ans_seq[i],
            model, api_key
        ))

    results = [None] * count

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_map = {executor.submit(generate_one_test, t): t[3]-1 for t in tasks}
        for future in as_completed(future_map):
            idx = future_map[future]
            try:
                v, t_num, cp, bloom, diff = future.result()
                results[idx] = v
            except Exception as ex:
                print(f"  Thread xətası (test {idx+1}): {ex}")

    generated = [r for r in results if r is not None]
    failed = count - len(generated)

    dist = Counter(t["correctAnswer"] for t in generated)
    print(f"\n{'='*65}")
    print(f"✅ NƏTİCƏ: {len(generated)}/{count} test uğurla generasiya olundu")
    if failed:
        print(f"⚠️  {failed} test uğursuz oldu")
    print(f"Cavab paylanması: A:{dist[0]}  B:{dist[1]}  C:{dist[2]}  D:{dist[3]}")
    print(f"Token sərfiyyatı: Prompt={TOTAL_PROMPT_TOKENS}, Completion={TOTAL_COMPLETION_TOKENS}, Ümumi={TOTAL_PROMPT_TOKENS+TOTAL_COMPLETION_TOKENS}")

    # Passport ID əlavə et
    for i, t in enumerate(generated, 1):
        bloom = t.get("bloom_level", "bilmə")
        diff  = t.get("difficulty", "sadə")
        pid   = make_passport_id(subject, topic, grade or 0, i, bloom, diff)
        t["passport_id"] = pid
        t["id"]          = pid
        t["topic"]       = topic
        t["cat"]         = subject

    return generated


# ── CLI ────────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Paralel Multi-Model NVIDIA Test Generatoru")
    parser.add_argument("--subject",  required=True)
    parser.add_argument("--topic",    required=True)
    parser.add_argument("--count",    type=int, default=21)
    parser.add_argument("--api-key",  default=DEFAULT_KEY)
    parser.add_argument("--workers",  type=int, default=7)
    parser.add_argument("--models",   nargs="+", default=None,
                        help="İstifadə ediləcək model adları (space ilə ayrılmış)")
    args = parser.parse_args()

    model_list = args.models or MODELS[:3]

    tests = generate_parallel(
        subject=args.subject,
        topic=args.topic,
        count=args.count,
        api_key=args.api_key,
        models=model_list,
        max_workers=args.workers,
    )

    if tests:
        save_to_db(args.subject, args.topic, tests, replace=True)
        export_to_markdown(args.subject, args.topic, tests)
    else:
        print("❌ Heç bir test generasiya olunmadı.")


if __name__ == "__main__":
    main()
