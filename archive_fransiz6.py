import json
import os

DB_FILE = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"

print("offline_tests.json oxunur...")
with open(DB_FILE, 'r', encoding='utf-8') as f:
    db = json.load(f)

french_keys = [k for k in db.keys() if 'frans' in k.lower() and '6' in k]
print(f"Tapılan açarlar: {french_keys}")

archive_key = "[Arxiv] Xətalı Köhnə Generasiya"
if archive_key not in db:
    db[archive_key] = []

moved_count = 0
for key in french_keys:
    tests = db[key]
    moved_count += len(tests)
    db[archive_key].extend(tests)
    del db[key]

print(f"{moved_count} test arxivə köçürüldü.")

with open(DB_FILE, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=4)

print("Tamamlandı.")
