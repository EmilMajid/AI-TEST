#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Riyaziyyat 11 - Çoxhədlilər fəslinin bütün mövzuları üçün
21 (7+7+7) test generasiyası - paralel, Unicode riyazi simvollarla
"""
import subprocess, sys, time
sys.stdout.reconfigure(encoding="utf-8")


SUBJECT = "Riyaziyyat 11"
MODELS = [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.3-nemotron-super-49b-v1"
]

# Mövzular: "Çoxhədlilər" fəslinin 9 mövzusu
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

MODEL_ARGS = " ".join(f'"{m}"' for m in MODELS)

import json, os

DB_PATH = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"

def is_topic_completed(subject: str, topic: str, target_count: int = 15) -> bool:
    if not os.path.exists(DB_PATH):
        return False
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        tests = db.get(subject, [])
        count = sum(1 for t in tests if topic.lower() in t.get("topic", "").lower())
        return count >= target_count
    except Exception:
        return False

def run_topic(topic: str, idx: int, total: int):
    if is_topic_completed(SUBJECT, topic, 15):
        print(f"\n⚡ [{idx}/{total}] MÖVZU ARTIQ MÖVCUDDUR (DB-də tapıldı): {topic} → Atlanır")
        return

    print(f"\n{'='*65}")
    print(f"[{idx}/{total}] BAŞLADI: {topic}")
    print(f"{'='*65}")
    
    cmd = [
        sys.executable, "-u",
        "nvidia_parallel_generator.py",
        "--subject", SUBJECT,
        "--topic", topic,
        "--count", "21",
        "--workers", "7",
        "--models", *MODELS,
    ]
    
    result = subprocess.run(cmd, capture_output=False, text=True)
    
    if result.returncode == 0:
        print(f"✅ [{idx}/{total}] TAMAMLANDI: {topic}")
    else:
        print(f"❌ [{idx}/{total}] XƏTA: {topic} (kod: {result.returncode})")
    
    if idx < total:
        print(f"⏳ 10s gözlənilir (növbəti mövzuya keçid)...")
        time.sleep(10)

def main():
    total = len(TOPICS)
    print(f"\n🚀 BATCH GENERASİYA BAŞLADI")
    print(f"📌 Fənn: {SUBJECT}")
    print(f"📚 Mövzu sayı: {total}")
    print(f"🔢 Hər mövzu: 21 test (7 sadə + 7 orta + 7 çətin)")
    print(f"⚡ Modellər: {', '.join(m.split('/')[-1] for m in MODELS)}")
    print(f"🔢 Ümumi test: {total * 21}")
    
    start = time.time()
    for i, topic in enumerate(TOPICS, 1):
        run_topic(topic, i, total)
    
    elapsed = time.time() - start
    mins = int(elapsed // 60)
    secs = int(elapsed % 60)
    
    print(f"\n{'='*65}")
    print(f"🎉 BATCH GENERASİYA TAMAMLANDI!")
    print(f"⏱️  Ümumi vaxt: {mins} dəq {secs} san")
    print(f"📊 Generasiya olunan: {total * 21} test ({total} mövzu × 21)")
    print(f"{'='*65}")

if __name__ == "__main__":
    main()
