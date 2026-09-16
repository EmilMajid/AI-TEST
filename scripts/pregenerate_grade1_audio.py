import json
import os
import hashlib
import asyncio
import edge_tts
import re
import sys

def clean_text(raw_text):
    text = re.sub(r'[\U00010000-\U0010ffff]', '', raw_text)
    text = re.sub(r'[\u2600-\u27BF]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_hash(voice, text):
    payload = f"{voice}__{text}"
    return hashlib.md5(payload.encode('utf-8')).hexdigest()

async def synthesize_item(sem, text, voice, target_file, idx, total):
    async with sem:
        if os.path.exists(target_file) and os.path.getsize(target_file) > 1000:
            return "skipped"
        try:
            comm = edge_tts.Communicate(text, voice, rate="-5%")
            await comm.save(target_file)
            return "generated"
        except Exception as e:
            return f"error: {e}"

async def main():
    json_path = os.path.join("data", "grades", "grade_1.json")
    if not os.path.exists(json_path):
        print("grade_1.json not found")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    cache_dir = os.path.join("public", "audio", "cache")
    os.makedirs(cache_dir, exist_ok=True)

    voice = "az-AZ-BanuNeural"
    all_texts = set()

    for subject, topics in data.items():
        if not isinstance(topics, dict):
            continue
        for topic_name, q_list in topics.items():
            if not isinstance(q_list, list):
                continue
            for q in q_list:
                q_text = clean_text(q.get("question", ""))
                if q_text:
                    all_texts.add(q_text)
                opts = q.get("options", [])
                if isinstance(opts, list):
                    for opt in opts:
                        opt_text = clean_text(str(opt))
                        if opt_text:
                            all_texts.add(opt_text)

    texts_list = sorted(list(all_texts))
    total = len(texts_list)
    print(f"Total texts to ensure audio for: {total}")

    sem = asyncio.Semaphore(4)  # Concurrently generate 4 items at a time
    tasks = []
    
    for i, text in enumerate(texts_list):
        truncated = text[:500]
        h = get_hash(voice, truncated)
        target_file = os.path.join(cache_dir, f"{h}.mp3")
        tasks.append(synthesize_item(sem, truncated, voice, target_file, i + 1, total))

    results = await asyncio.gather(*tasks)
    gen_count = results.count("generated")
    skip_count = results.count("skipped")
    err_count = len([r for r in results if r.startswith("error")])

    print(f"Done! Generated: {gen_count}, Already cached: {skip_count}, Errors: {err_count}")

if __name__ == "__main__":
    asyncio.run(main())
