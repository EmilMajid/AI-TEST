#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Riyaziyyat 11 - Çoxhədlilər fəslinin bütün mövzularını 21 testə çatdırır.
Mövcud testlərə ƏLAVƏ edir (silmir).
"""
import subprocess, sys, time, json, os
sys.stdout.reconfigure(encoding="utf-8")

SUBJECT  = "Riyaziyyat 11"
MODELS   = [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.3-nemotron-super-49b-v1",
]
DB_PATH  = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"
TARGET   = 21

TOPICS = [
    "Çoxhədlinin çoxhədliyə bölünməsi",
    "Qalıq haqqında teorem",
    "Çoxhədlinin vuruqları haqqında teorem",
    "Rasional köklərin tapılması",
    "Kompleks ədədlər haqqında",
    "Cəbrin əsas teoremi",
    "Çoxhədli funksiya",
    "Rasional funksiya",
    "Ümumiləşdirici tapşırıqlar",
]


def get_topic_count(topic: str) -> int:
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        tests = db.get(SUBJECT, [])
        return sum(1 for t in tests if t.get("topic", "") == topic)
    except Exception:
        return 0


def topup_topic(topic: str, need: int, idx: int, total: int):
    print(f"\n{'='*65}")
    print(f"[{idx}/{total}] TOP-UP: {topic}  (+{need} test əlavə olunacaq)")
    print(f"{'='*65}")

    cmd = [
        sys.executable, "-u",
        "nvidia_parallel_generator.py",
        "--subject", SUBJECT,
        "--topic",   topic,
        "--count",   str(need),
        "--workers", "7",
        "--append",
        "--models",  *MODELS,
    ]

    result = subprocess.run(cmd, capture_output=False, text=True)

    new_count = get_topic_count(topic)
    if result.returncode == 0:
        print(f"✅ [{idx}/{total}] TAMAMLANDI: {topic}  (indi DB-də: {new_count})")
    else:
        print(f"⚠️  [{idx}/{total}] TAMAMLANDI (xəta ilə): {topic}  (DB-də: {new_count})")

    if idx < total:
        time.sleep(10)


def main():
    print(f"\n🎯 TOP-UP GENERASİYA BAŞLADI")
    print(f"📌 Fənn: {SUBJECT}  |  Hədəf: {TARGET} test/mövzu")
    print(f"⚡ Modellər: {', '.join(m.split('/')[-1] for m in MODELS)}")

    # Defisitləri hesabla
    deficits = []
    for tp in TOPICS:
        cnt = get_topic_count(tp)
        need = TARGET - cnt
        print(f"  {tp}: {cnt}/{TARGET}  → {'+'+str(need) if need > 0 else '✅'}")
        if need > 0:
            deficits.append((tp, need))

    if not deficits:
        print("\n✅ Bütün mövzular artıq 21 testə çatıb!")
        return

    print(f"\n📊 Top-up lazım olan mövzu: {len(deficits)}")
    total_new = sum(n for _, n in deficits)
    print(f"🔢 Əlavə ediləcək test sayı: {total_new}")

    start = time.time()
    for i, (topic, need) in enumerate(deficits, 1):
        topup_topic(topic, need, i, len(deficits))

    elapsed = time.time() - start
    mins = int(elapsed // 60)
    secs = int(elapsed % 60)

    # Yekun sayım
    print(f"\n{'='*65}")
    print(f"🎉 TOP-UP TAMAMLANDI!  ⏱️ {mins} dəq {secs} san")
    print(f"\nYEKUN MÖVZU SAYIMI:")
    total = 0
    for tp in TOPICS:
        cnt = get_topic_count(tp)
        total += cnt
        status = "✅" if cnt >= TARGET else f"⚠️  ({cnt})"
        print(f"  {status}  {tp}: {cnt}")
    print(f"\n📊 Riyaziyyat 11 - Çoxhədlilər ümumi: {total} test")
    print(f"{'='*65}")


if __name__ == "__main__":
    main()
