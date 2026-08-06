#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Azərbaycan dili 11 - 14 mövzunun hər birini tam 21 testə çatdıran top-up skripti.
Mövcud testlərə əlavə edir (silmir).
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
    "Böyük ömrün dan yeri",
    "Şəbi-hicran",
    "Sizin də bir basketbol səbətiniz varmı?",
    "Hər uşağın ən yaxşı tərəfini üzə çıxarmaq",
    "Gəncə Müsəlman Qız Məktəbi",
    "Mətn",
    "Doroti Meri Kroufut Hodgkin",
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

def topup_topic(topic: str, need: int, idx: int, total: int):
    print(f"\n{'='*65}")
    print(f"[{idx}/{total}] TOP-UP: {topic} (+{need} test əlavə edilir)")
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

    subprocess.run(cmd, capture_output=False, text=True)
    new_count = get_topic_count(topic)
    print(f"📌 [{idx}/{total}] STATUS: {topic} (İndi DB-də: {new_count}/{TARGET})")
    time.sleep(5)

def main():
    print(f"\n🎯 AZƏRBAYCAN DİLİ 11 - TOP-UP MƏRHƏLƏSİ BAŞLADI")
    
    # 21-ə tamamlana qədər dövr et
    round_num = 1
    while True:
        deficits = []
        for tp in TOPICS:
            cnt = get_topic_count(tp)
            need = TARGET - cnt
            if need > 0:
                deficits.append((tp, need))
        
        if not deficits:
            print("\n🎉 BÜTÜN 14 MÖVZU TAM 21 TESTƏ ÇATDI!")
            break
        
        print(f"\n--- DÖVR {round_num}: Çatışmayan mövzular: {len(deficits)} ---")
        for i, (topic, need) in enumerate(deficits, 1):
            topup_topic(topic, need, i, len(deficits))
        
        round_num += 1

if __name__ == "__main__":
    main()
