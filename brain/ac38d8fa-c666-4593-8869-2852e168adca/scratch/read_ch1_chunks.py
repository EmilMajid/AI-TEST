import json
import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Chapter 1 mövzu başlıqları
chapter1_topics = [
    "1.1. informasiya sistemi və onun elementləri",
    "1.2. informasiya sistemlərinin təsnifatı",
    "1.3. Coğrafi informasiya sistemləri",
    "1.4. Süni intellekt",
    "1.5. Ekspert sistemləri",
    "1.6. Axtarış sistemləri",
    "1.7. \"Böyük verilənlər\"texnologiyası",
    "1.8. informasiya cəmiyyəti"
]

topic_chunks = {t: [] for t in chapter1_topics}

with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            c = json.loads(line)
            if c.get('book_id') == 'informatika-11':
                sec = c.get('section')
                if sec in topic_chunks:
                    txt = c.get('text', '')
                    if txt and len(txt.strip()) > 20:
                        topic_chunks[sec].append(txt.strip())
        except:
            pass

for t, texts in topic_chunks.items():
    combined = ' '.join(texts)[:2000]
    print(f"\n=== {t} ({len(texts)} chunk) ===")
    print(combined[:800])
    print("---")
