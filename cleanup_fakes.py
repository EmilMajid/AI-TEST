import json
import shutil
from datetime import datetime

db_path = 'data/offline_tests.json'
backup_path = f'data/offline_tests_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'

shutil.copy(db_path, backup_path)
print(f"Backup created at: {backup_path}")

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

fake_signatures = [
    "Dərsliyin əsas mətnindən birbaşa götürülmüş",
    "Bu, həmin fəaliyyət sahəsində ən çox tətbiq edilən",
    "A simple and direct vocabulary word",
    "Простое и прямое лексическое слово",
    "Ein einfaches Wort",
    "Un mot de vocabulaire de base",
    "Riyazi qanunauyğunluqlar əsasında doğru",
    "Bu, riyazi düsturun birbaşa və sadə",
    "Bu, kompüterin ən vacib hissəsi",
    "Onun əsas təyinatı informasiyanı emal etmək"
]

total_deleted = 0
for subject, tests in db.items():
    original_count = len(tests)
    # keep tests that DO NOT match fake signatures in any of their options or correct answer
    real_tests = []
    for t in tests:
        is_fake = False
        text_to_check = str(t.get('question', '')) + " " + str(t.get('options', [])) + " " + str(t.get('correctAnswer', '')) + " " + str(t.get('explanation', ''))
        for sig in fake_signatures:
            if sig in text_to_check:
                is_fake = True
                break
        if not is_fake:
            real_tests.append(t)
    
    deleted = original_count - len(real_tests)
    if deleted > 0:
        print(f"Subject: {subject} | Deleted fakes: {deleted} | Remaining: {len(real_tests)}")
        total_deleted += deleted
        db[subject] = real_tests

with open(db_path, 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Total fake tests deleted: {total_deleted}")
