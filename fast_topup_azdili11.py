#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Azərbaycan dili 11 fənni üzrə çatışmayan testləri tək-tək paralel şəkildə 
generasiya edərək bütün 14 mövzunu DƏQİQ 21/21 testə çatdıran skript.
"""
import subprocess, sys, time, json

sys.stdout.reconfigure(encoding="utf-8")

SUBJECT = "Azərbaycan dili 11"
MODELS = [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.3-nemotron-super-49b-v1",
]
DB_PATH = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"
TARGET = 21

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

def get_counts():
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        tests = db.get(SUBJECT, [])
        from collections import Counter
        return Counter(t.get("topic", "") for t in tests)
    except Exception:
        return {}

def fill_topic(topic, need):
    print(f"\n⚡ TOPIC FILL: '{topic}' (+{need} test generasiya edilir)")
    cmd = [
        sys.executable, "-u",
        "nvidia_parallel_generator.py",
        "--subject", SUBJECT,
        "--topic", topic,
        "--count", str(need),
        "--workers", "4",
        "--append",
        "--models", *MODELS,
    ]
    subprocess.run(cmd)

def main():
    while True:
        cnts = get_counts()
        deficits = {t: TARGET - cnts.get(t, 0) for t in TOPICS if cnts.get(t, 0) < TARGET}
        if not deficits:
            print("\n🎉 BÜTÜN 14 MÖVZU TAM 21/21 TESTƏ ÇATDI!")
            break
        
        print("\n=== CARİ DEFİSİTLƏR ===")
        for t, need in deficits.items():
            print(f"  {cnts.get(t,0):2d}/21  {t}  (Çatışmır: {need})")
            
        for t, need in list(deficits.items()):
            fill_topic(t, need)
            time.sleep(3)

if __name__ == "__main__":
    main()
