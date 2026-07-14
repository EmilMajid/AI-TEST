import json
import os

SCRATCH_DIR = r"C:\Users\User\.gemini\antigravity\scratch"
OFFLINE_TESTS = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\offline_tests.json"

alman6_tests = []

for i in range(1, 9):
    file_path = os.path.join(SCRATCH_DIR, f"alman6_L{i}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                tests = data.get("Alman dili 6", [])
                alman6_tests.extend(tests)
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

print(f"Total Alman dili 6 tests loaded: {len(alman6_tests)}")

if alman6_tests:
    with open(OFFLINE_TESTS, "r", encoding="utf-8") as f:
        db = json.load(f)
        
    if "Alman dili 6" not in db:
        db["Alman dili 6"] = []
        
    # Append the newly generated tests
    db["Alman dili 6"].extend(alman6_tests)
    
    with open(OFFLINE_TESTS, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=4)
        
    print(f"Successfully merged {len(alman6_tests)} tests into offline_tests.json")
else:
    print("No tests found to merge.")
