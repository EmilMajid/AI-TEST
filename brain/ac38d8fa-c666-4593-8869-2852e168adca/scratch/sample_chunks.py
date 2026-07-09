import json

count = 0
with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            if obj.get('book_id') == 'informatika-11':
                print(f"--- Chunk {count} ---")
                print(f"Title: {obj.get('title')}")
                print(f"Section: {obj.get('section')}")
                print(f"Text snippet: {obj.get('text')[:300]}")
                print(f"Type: {obj.get('type')}")
                count += 1
                if count >= 5:
                    break
        except Exception as e:
            print("Err:", e)
