import json
import os

db_path = 'data/offline_tests.json'

with open(db_path, 'r', encoding='utf8') as f:
    db = json.load(f)

grade6_subjects = [
    'Azərbaycan dili 6', 'Riyaziyyat 6', 'Təbiət 6', 'Ümumi tarix 6', 
    'Coğrafiya 6', 'Azərbaycan tarixi 6', 'Ədəbiyyat 6', 'İnformatika 6', 
    'Texnologiya 6', 'İngilis dili 6', 'Rus dili 6', 'Alman dili 6', 'Fransız dili 6'
]

md_lines = ["# 6-cı Sinif - Real Test Statistikası\n"]
md_lines.append("Aşağıdakı cədvəllər və siyahılar sistemdən bütün saxta (şablon) testlər silindikdən sonra, bazada mövcud olan **tam real** testlərin statistikasını göstərir.\n")

for subj in grade6_subjects:
    tests = db.get(subj, [])
    if not tests:
        continue
    topics = {}
    for t in tests:
        topic = t.get('topic', 'Mövzu qeyd olunmayıb')
        topics[topic] = topics.get(topic, 0) + 1
    
    md_lines.append(f"## {subj} (Cəmi: {len(tests)} test)\n")
    md_lines.append("| Mövzu | Test Sayı |")
    md_lines.append("| :--- | :--- |")
    
    for topic in sorted(topics.keys()):
        md_lines.append(f"| {topic} | {topics[topic]} |")
    md_lines.append("\n")

artifact_path = r"C:\Users\User\.gemini\antigravity\brain\3c6d91d4-ab06-4ee4-9598-273f712891fb\grade6_real_stats.md"

with open(artifact_path, 'w', encoding='utf8') as out:
    out.write("\n".join(md_lines))
print(f"Stats written to {artifact_path}")
