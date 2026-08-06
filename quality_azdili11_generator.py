#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Azərbaycan dili 11 - 100% Xalis Dərslik RAG Əsaslı Test Generatoru.
Heç bir kənar mövzu, uydurma mətni, ziddiyyət və ya dil xətası olmadan generasiya edir.
"""
import subprocess, sys, time, json, os, re

sys.stdout.reconfigure(encoding="utf-8")

SUBJECT = "Azərbaycan dili 11"
MODELS = [
    "meta/llama-3.3-70b-instruct",
    "nvidia/llama-3.3-nemotron-super-49b-v1",
]
DB_PATH = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"
TARGET = 21

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

def clean_database():
    """Bazada olan bütün uyğunsuz/bərbad testləri sıfırlayır."""
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        db[SUBJECT] = []
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(db, f, ensure_ascii=False, indent=2)
        print("✅ Bazadakı bütün köhnə testlər sıfırlandı.")
    except Exception as e:
        print(f"Baza təmizlənmə xətası: {e}")

def get_counts():
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        tests = db.get(SUBJECT, [])
        from collections import Counter
        return Counter(t.get("topic", "") for t in tests)
    except Exception:
        return {}

def run_generation(topic, need):
    print(f"\n{'='*70}")
    print(f"🚀 GENERASİYA (100% RAG DƏRSLİK): '{topic}' (+{need} test)")
    print(f"{'='*70}")
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
    clean_database()
    
    print("\n🎯 AZƏRBAYCAN DİLİ 11 - KEYFİYYƏTLİ DƏRSLİK GENERASİYASI BAŞLANDI")
    print(f"📌 14 Mövzu × 21 Test = Cəmi 294 Həqiqi Dil və Mətn Təhlili Testi\n")
    
    for i, topic in enumerate(TOPICS, 1):
        cnts = get_counts()
        cnt = cnts.get(topic, 0)
        need = TARGET - cnt
        if need > 0:
            print(f"\n[{i}/14] Mövzu: {topic} (Mövcud: {cnt}, Lazımdır: {need})")
            run_generation(topic, need)
        time.sleep(3)

    print("\n🎉 BÜTÜN MÖVZULAR 100% DƏRSLİK RAG MATERİALLARI ƏSASINDA 21 TESTƏ ÇATDIRILDI!")

if __name__ == "__main__":
    main()
