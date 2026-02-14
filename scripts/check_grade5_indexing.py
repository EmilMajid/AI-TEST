import json
from pathlib import Path

def check_grade5():
    with open("data/textbooks.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    books = data.get("5", [])
    
    chunks = []
    if Path("data/textbook-chunks.jsonl").exists():
        with open("data/textbook-chunks.jsonl", "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    chunks.append(json.loads(line))
    
    print(f"{'ID':<25} | {'Title':<40} | {'Chunks':<5}")
    print("-" * 75)
    
    for book in books:
        count = sum(1 for c in chunks if c.get("book_id") == book["id"])
        print(f"{book['id']:<25} | {book['title']:<40} | {count:<5}")

if __name__ == "__main__":
    check_grade5()
