import shutil
import json

head_path = 'data/offline_tests_HEAD.json'
target_path = 'data/offline_tests.json'

with open(head_path, 'r', encoding='utf-16') as f:
    db = json.load(f)

# Save with utf8 to restore the main database correctly
with open(target_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Baza uğurla HEAD versiyasından bərpa edildi!")
