#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Azərbaycan dili 11 fənni üçün 14 mövzunun hər birinə 21 test generasiya edən batch skripti.
Gold Standard 3.0 və RAG datasından istifadə edir.
"""
import subprocess, sys, time, json, os
sys.stdout.reconfigure(encoding="utf-8")

SUBJECT  = "Azərbaycan dili 11"
MODELS   = [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.3-nemotron-super-49b-v1",
]
DB_PATH  = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"
TARGET   = 21

TOPICS = [
    # 1-ci bölmə. Vətəndaş və cəmiyyət
    "Böyük ömrün dan yeri",
    "Şəbi-hicran",
    "Sizin də bir basketbol səbətiniz varmı?",
    "Hər uşağın ən yaxşı tərəfini üzə çıxarmaq",
    "Gəncə Müsəlman Qız Məktəbi",
    "Mətn",
    "Doroti Meri Kroufut Hodgkin",
    # 2-ci bölmə. Ətraf aləm və biz
    "Təbiət Allahın şah əsəridi",
    "Ömürdən etüdlər",
    "Təmiz su sağlamlığın təməlidir",
    "Təbii bulaqlar muzeyi - Naxçıvan",
    "Bu torpaq üçün yaşa!",
    "Üç ağacın sirri",
    "Çanaqqalanı ölümsüzləşdirən ruh",
]

def get_topic_count(topic: str) -> int:
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        tests = db.get(SUBJECT, [])
        return sum(1 for t in tests if t.get("topic", "") == topic)
    except Exception:
        return 0

def run_topic(topic: str, need: int, idx: int, total: int):
    print(f"\n{'='*65}")
    print(f"[{idx}/{total}] GENERASİYA: {topic} ({need} test)")
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
    print(f"📌 [{idx}/{total}] BİTDİ: {topic} (DB-də: {new_count}/{TARGET})")
    time.sleep(5)

def main():
    print(f"🎯 AZƏRBAYCAN DİLİ 11 GENERASİYA BAŞLADI")
    print(f"📌 Fənn: {SUBJECT} | Hədəf: {TARGET} test/mövzu (Cəmi 14 mövzu = 294 test)")
    
    for i, topic in enumerate(TOPICS, 1):
        cnt = get_topic_count(topic)
        need = TARGET - cnt
        if need > 0:
            run_topic(topic, need, i, len(TOPICS))
        else:
            print(f"✅ [{i}/{len(TOPICS)}] {topic}: Artıq 21 test var.")

    print(f"\n🎉 BÜTÜN MÖVZULAR TƏMAMLANI!")

if __name__ == "__main__":
    main()
