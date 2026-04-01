import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

new_book = {
    "id": "ingilis-dili-2-6",
    "title": "İngilis dili 6 (ikinci xarici dil)",
    "subject": "İngilis dili",
    "grade": 6,
    "type": "pdf",
    "path": "/textbooks/6/ingilis-dili-2/book.pdf",
    "contentPath": "public/textbooks/6/ingilis-dili-2",
    "topics": "LESSONS\n1. School Subjects Are we Ready for Grade 6?\n 2. What do they Look like? \n3. My Favourite Sport \n4. What I Do\n 5. These are my Friends!\n6. Seasons and Clothes\n 7. Celebrations Around the World\n8. Free Time Activities \n9. My Family \n10. In the Street \n11. An Open-air Lesson \n12. Jobs \n13. My Birthday Party  \n4. Healthy Life\n15. Shopping \n16. My Favourite Recipe\n 17. Planning a Day Out \n18. At the Restaurant \n19. What’s the matter?\n 20. Transport\n 21. Save the Earth \n22. A Visit to Shusha\nPair Work Activities\nTests\nGrammar Bank\nWordlist",
    "chunks": 0
}

# Check if already exists, update or append
ids = [b["id"] for b in d["6"]]
if new_book["id"] in ids:
    for i, b in enumerate(d["6"]):
        if b["id"] == new_book["id"]:
            d["6"][i] = new_book
else:
    d["6"].append(new_book)

with open(p, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("textbooks.json updated for English 6 (2nd).")
