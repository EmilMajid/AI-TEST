import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

# Define updates for Grade 7 Phase 2
updates = [
    {
        "id": "cografiya-7-h1",
        "title": "Coğrafiya 7 (1-ci hissə)",
        "subject": "Coğrafiya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "922",
        "topics": "Bölmə 1. Cografi mövqe\n1.1. Coğrafi mövqeyin təyini\n1.2. CİS-lə coğrafi mövqe təyini\nBölmə 2. Yerin daxili prosesləri\n2.1. Yerin daxili quruluşu\n2.2. Litosferin hərəkəti\nBölmə 3. Yer səthinin qurluşu\n3.1. Relyef nədir?\n3.2. Qitələrin və okeanların relyefi\nSÖZLÜK"
    },
    {
        "id": "cografiya-7-h2",
        "title": "Coğrafiya 7 (2-ci hissə)",
        "subject": "Coğrafiya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "923",
        "topics": "Bölmə 4 HAVA ŞƏRAİTİ\n4.1. Dəyişkən hava\n4.2. Havada su\nBölmə 5. İQLİM\n5.1. Məkanda iqlim\nBölmə 6. MAĞARADAN GÖYDƏLƏNƏ\n6.1. Əhali artımı və yaşayış məntəqələri\n6.2. Azıx mağarasından 'Alov qüllələri'nə\nBölmə 7. İQTİSADİ FƏALİYYƏT\n7.1. Məkanın iqtisadi mənzərəsi\n7.2. Azərbaycanın iqtisadi mənzərəsi\nSÖZLÜK"
    },
    {
        "id": "azerbaycan-dili-7",
        "title": "Azərbaycan dili 7",
        "subject": "Azərbaycan dili",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "696",
        "topics": "I BÖLMƏ. FƏRD VƏ CƏMİYYƏT\nII BÖLMƏ. HƏR SÖZÜN BİR TALEYİ VAR\nIII BÖLMƏ. ANA TƏBİƏT\nIV BÖLMƏ. KAMİLLİYƏ DOĞRU\nV BÖLMƏ. DƏYƏRLƏRİMİZ\nVI BÖLMƏ. İXTİRALAR VƏ KƏŞFLƏR\nVII BÖLMƏ. KİTABIN TARİXİ\nSÖZLÜK"
    },
    {
        "id": "edebiyyat-7",
        "title": "Ədəbiyyat 7",
        "subject": "Ədəbiyyat",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "701",
        "topics": "ŞİFAHİ XALQ ƏDƏBİYYATINDAN SEÇMƏLƏR\nVƏTƏN SEVGİSİ, QƏHRƏMANLIQ SƏHİFƏLƏRİ\nMƏNƏVİ DƏYƏRLƏR, HƏMİŞƏYAŞAR HİKMƏTLƏR\nUŞAQ ALƏMİ, UŞAQ TALEYİ\nTƏBİƏTƏ VURĞUNLUQ, TƏBİƏTƏ QAYĞI\nLüğət\nQısa ədəbiyyatşünaslıq terminləri lüğəti"
    },
    {
        "id": "riyaziyyat-7",
        "title": "Riyaziyyat 7",
        "subject": "Riyaziyyat",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "714",
        "topics": "BÖLMƏ 1. STATİSTİKA. EHTİMAL\nBÖLMƏ 2. RASİONAL ƏDƏDLƏR\nBÖLMƏ 3. PARALELLİK. PERPENDİKULYARLIQ\nBÖLMƏ 4. BİRHƏDLİLƏR. ÇOXHƏDLİLƏR\nBÖLMƏ 5. ÜÇBUCAQLAR\nBÖLM9 6. MÜXTƏSƏR VURMA DÜSTURLARI\nBÜLM9 7. FUNKSİYA\nBÖLMƏ 8. XƏTTİ TƏNLİKLƏR SİSTEMİ\nBÖLMƏ 9. ÜÇBUCAQLARIN KONQRUYENTLİYİ\nBÖLMƏ 10.SİTUASİYA MƏSƏLƏLƏRİ\nCavablar"
    },
    {
        "id": "umumi-tarix-7",
        "title": "Ümumi tarix 7",
        "subject": "Ümumi tarix",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "723",
        "topics": "Dünya ölkələri III-XI yüzilliklərdə\nDünya ölkələri XI-XVI yüzilliklərdə"
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
print("textbooks.json updated for Grade 7 Phase 2.")
