import json

count = 0
unique_book_ids = set()

with open('data/textbook-chunks.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            book_id = obj.get('book_id')
            if book_id:
                unique_book_ids.add(book_id)
            if book_id == 'informatika-11':
                count += 1
        except Exception as e:
            pass

print(f"Total informatika-11 chunks: {count}")
print(f"All book IDs in database: {sorted(list(unique_book_ids))}")
