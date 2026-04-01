import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

# Define updates for Grade 7 Phase 3
updates = [
    {
        "id": "ingilis-dili-7",
        "title": "English - 7 (əsas xarici dil)",
        "subject": "İngilis dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "710",
        "topics": "UNIT 1.SCHOOLS AROUND THE WORLD\nUNIT 2. A WORLD OF TECHNOLOGY\nUNIT 3. WHAT A TALENT!\nUNIT 4. TRAVEL\nUNIT 5.FRIENDS FOREVER\nUNIT 6.LIFE IN THE FUTURE\nTests\nGrammar bank"
    },
    {
        "id": "ingilis-dili-2-7",
        "title": "English - 7 (ikinci xarici dil)",
        "subject": "İngilis dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "711",
        "topics": "ARE YOU READY FOR GRADE 7?\nLESSON 1. MEETING NEW FRIENDS!\nLESSON 2. BEFORE AND NOW\nLESSON 3. BIRTHDAY PARTY\nLESSON 4. MY DAY\nLESSON 5. THEN AND NOW\nLESSON 6. ROLE MODELS IN SPORT\nLESSON 7. WHAT A DAY!\nLESSON 8. THAT’S AMAZING!\nLESSON 9. HOW DIFFERENT THEY ARE!\nLESSON 10. WORLD RECORDS\nLESSON 11. THE LAND OF FIRE\nLESSON 12. TRAVELLING"
    },
    {
        "id": "fransiz-dili-7",
        "title": "Fransız dili - 7 (əsas xarici dil)",
        "subject": "Fransız dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "704",
        "topics": "UNITÉ 1. VOUPIIII, C'EST LA RENTRÉE!\nUNITÉ 2. DOMAİNES D'İNTÉRÊT\nUNITÉ 3. L'AZERBAÏDJAN - TERRE DE FEU!\nUNITÉ 4. LES PAYS DU MONDE\nUNITÉ 5. ÊTRE EN FORME\nUNITÉ 6. SOIRÉES\nUNITÉ 7. DÉPLACEMENT\nUNITÉ 8. AMITIÉ"
    },
    {
        "id": "fransiz-dili-2-7",
        "title": "Fransız dili - 7 (ikinci xarici dil)",
        "subject": "Fransız dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "705",
        "topics": "UNITÉ 1. VIVE LA RENTRÉE!\nUNITÉ 2. LA FAMILLE\nUNITÉ 3. BIENVENUE À BAKOU\nUNITÉ 4. LE GOÛT MUSICAL\nUNITÉ 5. LA VIE QUOTIDIENNE\nUNITÉ 6. LES VACANCES"
    },
    {
        "id": "alman-dili-7",
        "title": "Alman dili - 7 (əsas xarici dil)",
        "subject": "Alman dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "694",
        "topics": "Lektion 1. Mein erster Schultag\nLektion 2. Feste und Traditionen\nLektion 3. Mein Zuhause, meine Pflichten\nLektion 4. Guten Appetit\nLektion 5. Ohne mein Handy? Nein.\nLektion 6. Die Welt ist schön"
    },
    {
        "id": "alman-dili-2-7",
        "title": "Alman dili - 7 (ikinci xarici dil)",
        "subject": "Alman dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "695",
        "topics": "1. LÄNDER UND SPRACHEN\n2. WETTER UND JAHRESZEITEN\n3. FREIZEIT UND HOBBYS\n4. WOHNEN"
    },
    {
        "id": "musiqi-7",
        "title": "Musiqi - 7",
        "subject": "Musiqi",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "712",
        "topics": "MUSİQİ OBRAZI (I HİSSƏ)\nMUSİQİ OBRAZI (II HİSSƏ)\nMUSİQİ DRAMATURGİYASI (I HİSSƏ)\nMUSİQİ DRAMATURGİYASI (II HİSSƏ)"
    },
    {
        "id": "texnologiya-7",
        "title": "Texnologiya - 7",
        "subject": "Texnologiya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "719",
        "topics": "Məişət mədəniyyəti\nOduncağın emalı texnologiyası\nElektrotexniki işlər\nMetalın emalı texnologiyası\nƏrzaq məhsullarının emalı texnologiyası\nParçanın emalı texnologiyası"
    },
    {
        "id": "tesviri-incesenet-7",
        "title": "Təsviri incəsənət - 7",
        "subject": "Təsviri İncəsənət",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "721",
        "topics": "1. TƏSVİRİ SƏNƏT ORTA ƏSRLƏRDƏ\n2. TƏSVİRİ SƏNƏTDƏ JANRLAR\n3. DÖVR, XALQ VƏ GEYİMLƏR\n4. DEKORATİV-TƏTBİQİ SƏNƏT VƏ BƏDİİ DİZAYN"
    },
    {
        "id": "informatika-7",
        "title": "İnformatika - 7",
        "subject": "İnformatika",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "708",
        "topics": "1. KOMPÜTER\n2. TƏDİQİ PROQRAMLAR\n3. İNFORMASİYA\n4. PROQRAMLAŞDIRMA\n5. İNTERNET"
    }
]

for up in updates:
    found = False
    for i, b in enumerate(d.get("7", [])):
        if b["id"] == up["id"]:
            d["7"][i].update(up)
            found = True
            break
    if not found:
        if "7" not in d: d["7"] = []
        d["7"].append(up)

with open(p, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("textbooks.json updated for Grade 7 Phase 3.")
