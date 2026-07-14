import json

# Search in textbook-chunks.jsonl for Alman dili 6 content
print('textbook-chunks.jsonl içinde Alman dili 6 axtarılır...')
count = 0
alman6_chunks = []

with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8', errors='replace') as f:
    for line in f:
        try:
            obj = json.loads(line.strip())
            all_text = json.dumps(obj, ensure_ascii=False).lower()
            if ('alman' in all_text or 'german' in all_text or 'deutsch' in all_text or 'deu' in all_text):
                if '"6"' in all_text or 'grade_6' in all_text or 'sinif 6' in all_text or '6-ci' in all_text:
                    count += 1
                    if count <= 5:
                        alman6_chunks.append(obj)
        except:
            pass

print(f'Tapılan Alman dili 6 chunk sayı: {count}')
for c in alman6_chunks:
    keys = list(c.keys())
    print(f'  Keys: {keys}')
    content_key = 'content' if 'content' in c else ('text' if 'text' in c else keys[0] if keys else 'N/A')
    content_preview = str(c.get(content_key, ''))[:200]
    print(f'  Content preview: {content_preview}')
    print()

# Also check total lines
print('\n--- Ümumi statistika ---')
with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8', errors='replace') as f:
    total = sum(1 for _ in f)
print(f'  Cəmi chunk sayı: {total}')
