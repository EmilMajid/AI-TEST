import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

# 1. Remove Physical Education from Grade 7
if "7" in d:
    d["7"] = [b for b in d["7"] if b["id"] != "fiziki-terbiye-7"]

# 2. Update Azerbaijan History 7 (PDF)
az_history_update = {
    "id": "azerbaycan-tarixi-7",
    "title": "Azərbaycan tarixi 7",
    "subject": "Azərbaycan tarixi",
    "grade": 7,
    "type": "pdf",
    "path": "https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-7-ci-sinif-ucun-darslik.pdf",
    "topics": "KİTABIN İÇİNDƏKİLƏR (PDF səh 7, Dərslik səh 5)"
}

found = False
for i, b in enumerate(d.get("7", [])):
    if b["id"] == "azerbaycan-tarixi-7":
        d["7"][i].update(az_history_update)
        found = True
        break
if not found:
    if "7" not in d: d["7"] = []
    d["7"].append(az_history_update)

with open(p, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("textbooks.json updated: Removed physical ed, updated Az.History 7.")
