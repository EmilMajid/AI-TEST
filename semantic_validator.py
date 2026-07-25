# -*- coding: utf-8 -*-
import json
import os
import time
import argparse
import re
from openai import OpenAI

BASE_DIR = r"C:\Users\User\Downloads\azerbaijanaiplatform"
TESTS_FILE = os.path.join(BASE_DIR, "data", "offline_tests.json")
CHUNKS_FILE = os.path.join(BASE_DIR, "data", "textbook-chunks.jsonl")

MODELS = [
    "deepseek-ai/deepseek-v4-flash",
    "meta/llama-3.3-70b-instruct",
    "mistralai/mistral-large"
]

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)

def load_rag_chunks(target_subject):
    chunks = []
    if not os.path.exists(CHUNKS_FILE):
        return chunks
    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip(): continue
            try:
                c = json.loads(line)
                sub = c.get("subject", "").lower()
                gr = str(c.get("grade", ""))
                # Match subject loosely. target_subject is "Riyaziyyat 7"
                if sub in target_subject.lower() and ("7" in target_subject and gr == "7"):
                    chunks.append(c)
            except:
                pass
    return chunks

def get_context_for_query(topic, chunks):
    clean_topic = re.sub(r"^[\d\.]+\s*", "", topic).lower()
    for c in chunks:
        title = c.get("section_title") or ""
        text = c.get("text") or ""
        if title and (clean_topic in title.lower() or title.lower() in clean_topic):
            return text
        if clean_topic in text.lower():
            return text
    return ""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", required=True)
    args = parser.parse_args()
    
    subject = args.subject
    print(f"[{subject}] semantik uyğunluq yoxlanışına başlanılır...")
    
    with open(TESTS_FILE, "r", encoding="utf-8") as f:
        db = json.load(f)
        
    if subject not in db:
        print(f"XƏTA: {subject} tapılmadı!")
        return
        
    tests = db[subject]
    chunks = load_rag_chunks(subject)
    print(f"RAG Bazasından bu fənn üçün {len(chunks)} dərslik bloku tapıldı.")
    
    OUTLIERS_FILE = os.path.join(BASE_DIR, "scratch", f"outliers_{subject.replace(' ', '_').lower()}.json")
    
    outliers = []
    if os.path.exists(OUTLIERS_FILE):
        with open(OUTLIERS_FILE, "r", encoding="utf-8") as f:
            outliers = json.load(f)
            
    PROGRESS_FILE = os.path.join(BASE_DIR, "scratch", f"validator_progress_{subject.replace(' ', '_').lower()}.json")
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            checked_indices = json.load(f)
    else:
        checked_indices = []
        
    for idx, test in enumerate(tests):
        if idx in checked_indices:
            continue
            
        topic = test.get("topic", "")
        question = test.get("question", "")
        
        generic_keywords = ["ümumiləşdirici", "özünüzü", "təkrar", "bölmə", "xülasə", "elm, texnologiya, həyat", "sözlük", "giriş"]
        if any(kw in topic.lower() for kw in generic_keywords):
            print(f"[{idx+1}/{len(tests)}] ⏭ SKIPPED (Ümumi mövzu): {topic}")
            checked_indices.append(idx)
            if idx % 5 == 0:
                with open(OUTLIERS_FILE, "w", encoding="utf-8") as f:
                    json.dump(outliers, f, ensure_ascii=False)
                with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
                    json.dump(checked_indices, f, ensure_ascii=False)
            continue
        
        context = get_context_for_query(topic, chunks)
        if not context:
            print(f"[{idx+1}/{len(tests)}] Kontekst tapılmadı ({topic}). Outlier olaraq işarələnir.")
            outliers.append(idx)
            checked_indices.append(idx)
            continue
            
        prompt = f"""DƏRSLİK MƏTNİ (RAG):
{context[:1500]}

SUAL: {question}

TƏLİMAT: Verilmiş sual yuxarıdakı DƏRSLİK MƏTNİNƏ (RAG) və {subject} fənninə mənaca uyğundurmu? (Qeyd: Riyaziyyat və ya Fizika sualıdırsa, sualın mövzusunun mətndəki qaydalara/terminlərə uyğun olması kifayətdir, birbaşa eyni cümlə olması şərt deyil). Mətnin əhatə etdiyi mövzularla sualın eyni fəsilə aid olub-olmadığını yoxla. Sual mətndən tamamilə kənardırsa 'NO' de.
YALNIZ 'YES' VƏ YA 'NO' CAVABI VER. Heç bir əlavə söz yazma."""
        
        success = False
        for model_name in MODELS:
            if success: break
            for attempt in range(3):
                try:
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.1,
                        max_tokens=10,
                        stream=False
                    )
                    answer = response.choices[0].message.content.strip().upper()
                    if "NO" in answer:
                        outliers.append(idx)
                        print(f"[{idx+1}/{len(tests)}] ❌ UYĞUNSUZ (Outlier): {question[:50]}...")
                    else:
                        print(f"[{idx+1}/{len(tests)}] ✅ UYĞUN: {question[:50]}...")
                    success = True
                    break
                except Exception as e:
                    time.sleep(2)
            
        if success:
            checked_indices.append(idx)
            if idx % 5 == 0:
                with open(OUTLIERS_FILE, "w", encoding="utf-8") as f:
                    json.dump(outliers, f, ensure_ascii=False)
                with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
                    json.dump(checked_indices, f, ensure_ascii=False)
                    
    with open(OUTLIERS_FILE, "w", encoding="utf-8") as f:
        json.dump(outliers, f, ensure_ascii=False)
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(checked_indices, f, ensure_ascii=False)
        
    print(f"Yoxlama bitdi. Cəmi tapılan kənarlaşma (Outlier) sayı: {len(outliers)}")

if __name__ == "__main__":
    main()
