import glob
import json
import os

search_paths = [
    r"C:\Users\User\.gemini\antigravity\scratch\cog6_b*.json"
]

files = []
for p in search_paths:
    files.extend(glob.glob(p))

if not files:
    print("No new tests found.")
    exit(0)

try:
    with open('data/offline_tests.json', 'r', encoding='utf8') as f:
        db = json.load(f)
except FileNotFoundError:
    db = {"Coğrafiya 6": []}

merged_count = 0
for file in files:
    try:
        with open(file, 'r', encoding='utf8') as f:
            new_data = json.load(f)
            if "Coğrafiya 6" in new_data:
                db["Coğrafiya 6"].extend(new_data["Coğrafiya 6"])
                merged_count += len(new_data["Coğrafiya 6"])
                print(f"Merged {file}")
        os.remove(file)
    except Exception as e:
        print(f"Error processing {file}: {e}")

if merged_count > 0:
    with open('data/offline_tests.json', 'w', encoding='utf8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"Successfully merged {merged_count} new tests.")
