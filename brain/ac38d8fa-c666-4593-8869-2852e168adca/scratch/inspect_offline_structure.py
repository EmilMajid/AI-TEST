import json
import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open('data/offline_tests.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

subject_data = data.get("İnformatika 6", [])
if subject_data:
    print(f"Number of topics: {len(subject_data)}")
    print("First topic keys:", subject_data[0].keys())
    print("First topic title:", subject_data[0].get("topic"))
    questions = subject_data[0].get("questions", [])
    print(f"Number of questions in first topic: {len(questions)}")
    if questions:
        print("First question example:")
        print(json.dumps(questions[0], ensure_ascii=False, indent=2))
else:
    print("İnformatika 6 not found or empty.")
