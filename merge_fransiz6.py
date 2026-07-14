import json
import os

SCRATCH_DIR = r"C:\Users\User\.gemini\antigravity\scratch"
OFFLINE_TESTS = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"

fransiz6_tests = []

for i in range(1, 7):
    file_path = os.path.join(SCRATCH_DIR, f"fransiz6_U{i}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                tests = data.get("Fransız dili 6", [])
                fransiz6_tests.extend(tests)
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

print(f"Total Fransız dili 6 tests loaded: {len(fransiz6_tests)}")

if fransiz6_tests:
    with open(OFFLINE_TESTS, "r", encoding="utf-8") as f:
        db = json.load(f)
        
    if "Fransız dili 6" not in db:
        db["Fransız dili 6"] = []
        
    # Append the newly generated tests
    db["Fransız dili 6"].extend(fransiz6_tests)
    
    with open(OFFLINE_TESTS, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=4)
        
    print(f"Successfully merged {len(fransiz6_tests)} tests into offline_tests.json")
else:
    print("No tests found to merge.")
