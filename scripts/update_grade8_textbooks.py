import json

# Grade 8 HTML textbooks from e-derslik (user-provided data)
GRADE8_HTML = [
    {
        "id": "azerbaycan-dili-8",
        "title": "Azərbaycan dili 8",
        "subject": "Azərbaycan dili",
        "type": "ederslik_html",
        "e_derslik_id": "784",
        "topics": "I BÖLMƏ. BİLİK XƏZİNƏDİR\n1. Tətildən sonra\n2. Qori seminariyasında Azərbaycan şöbəsi necə açıldı\n3. Yaxşılıq itmir\n4. Ana dili\n5. Mədinə xanım Qiyasbəyli\n6. Mücrü\n7. Şuşanın körpə qartalı\nII BÖLMƏ. TARİXİN DAŞ YADDAŞI\n1. Mətn\n2. Nə gözəl səslənir Şuşalı vətən\n3. Mətn\n4. Muğan\n5. Gülüstan\n6. Zivər bəy Əhmədbəyov\nIII BÖLMƏ. MİLLİ-MƏNƏVİ DƏYƏRLƏRİMİZ\n1. İbrət dərsi\n2. Duyğular adası\n3. Səhəng içində nə varsa, onu sızdırar...\n4. Mətn\n5. Zəhər\n6. Qaranquşların ömrü 6 aydır...\n7. Həmrəyliyimiz əbədidir\n8. İnanılmaz tarixi fakt\n9. Sədaqət\n10. Hekayət\n11. Tariximizin şanlı səhifəsi\n12. Qırxıncı fəndi bu günə saxlamışdım\n13. Qədim türklərdə tərbiyə\n14. Yolun sonu\n15. Nar dənəsi\nIV BÖLMƏ. ŞƏXSİYYƏTLƏR\n1. Azərbaycan teatrı\n2. Hüseynqulu Sarabskinin xatirələri\n3. Vaqif obrazından başlanan səhnə uğuru\n4. İlk aktrisamız kimdir?\n5. Evrika\n6. Oqtay Eloğlu\nV BÖLMƏ. MƏTBUAT: DÜNƏN VƏ BU GÜN\n1. Günün hadisələri\n2. Əhvalpürsanlıq\n3. Molla Nəsrədddinə gedən yol\n4. Yalançı Xortdan\n5. İlk redaktor. O kim imiş?\nVI BÖLMƏ. SƏNƏT DÜNYASINA SƏYAHƏT\n1. Şəxsiyyətlər\n2. Hacı Zeynalabdin Şirvani\n3. Mahmud Kaşğarlı\n4. Qurban Səidin gizli qalmış ömrü\n5. Fərhəng Hüseynov"
    },
    {
        "id": "alman-dili-8",
        "title": "Alman dili 8 (əsas xarici dil)",
        "subject": "Alman dili",
        "type": "ederslik_html",
        "e_derslik_id": "785",
        "topics": "LEKTION 1. Studium und Beruf\nLEKTION 2. Klassenfahrt und Orte\nLEKTION 3. Wetterbericht\nLEKTION 4. Städte und Sehenswürdigkeiten\nLEKTION 5. Vorlieben\nLEKTION 6. Kleidung und Aussehen\nLEKTION 7. Tiere und Menschen\nLEKTION 8. Berühmte Personen"
    },
    {
        "id": "alman-dili-ikinci-8",
        "title": "Alman dili 8 (ikinci xarici dil)",
        "subject": "Alman dili (ikinci xarici)",
        "type": "ederslik_html",
        "e_derslik_id": "786",
        "topics": "LEKTION 1. Erfolgreich im neuen Schuljahr\nLEKTION 2. Die Traditionen\nLEKTION 3. Die Tourismus\nLEKTION 4. Jugend, heute!"
    },
    {
        "id": "fransiz-dili-8",
        "title": "Fransız dili 8 (əsas xarici dil)",
        "subject": "Fransız dili",
        "type": "ederslik_html",
        "e_derslik_id": "789",
        "topics": "UNITÉ 1. ENFIN LA RENTRÉE!\nUNITÉ 2. ON S'ENTEND MIEUX!\nUNITÉ 3. AIDER LES AUTRES\nUNITÉ 4. L'AZERBAÏDJAN, PAYS AU RICHE PATRIMOINE HISTORIQUE!\nUNITÉ 5. GRANDES INVENTIONS\nUNITÉ 6. ON EST MIEUX ICI!"
    },
    {
        "id": "fransiz-dili-ikinci-8",
        "title": "Fransız dili 8 (ikinci xarici dil)",
        "subject": "Fransız dili (ikinci xarici)",
        "type": "ederslik_html",
        "e_derslik_id": "790",
        "topics": "Unité 1. Bienvenue à l'école!\nUnité 2. La lecture c'est ma passion!\nUnité 3. Terre des Feux\nUnité 4. En forme!\nUnité 5. Protégeons la mère nature!\nUnité 6. La découverte de France"
    },
    {
        "id": "rus-dili-8",
        "title": "Rus dili 8 (əsas xarici dil)",
        "subject": "Rus dili",
        "type": "ederslik_html",
        "e_derslik_id": "795",
        "topics": "РАЗДЕЛ 1. ЗНАНИЕ-СИЛА\nРАЗДЕЛ 2. ХОРОША РОДИНА МОЯ\nРАЗДЕЛ 3. ДОСТОЯНИЯ ЧЕЛОВЕЧЕСТВА\nРАЗДЕЛ 4. АЗЕРБАЙДЖАН - СТРАНА ОГНЕЙ, МУДРОСТИ И ГОСТЕПРИИМСТВА\nРАЗДЕЛ 5. ИСКУССТВО СЛОВА\nРАЗДЕЛ 6. ЖИЗНЬ ЗАМЕЧАТЕЛЬНЫХ ЛЮДЕЙ"
    },
    {
        "id": "rus-dili-ikinci-8",
        "title": "Rus dili 8 (ikinci xarici dil)",
        "subject": "Rus dili (ikinci xarici)",
        "type": "ederslik_html",
        "e_derslik_id": "796",
        "topics": "Раздел 1. Мой родной Азербайджан\nРаздел 2. Кто жить умеет по часам\nРаздел 3. Наше достояние\nРаздел 4. В союзе с природой\nРаздел 5. Кем быть?\nРаздел 6. С миру по нитке"
    },
    {
        "id": "ingilis-dili-ikinci-8",
        "title": "İngilis dili 8 (ikinci xarici dil)",
        "subject": "İngilis dili (ikinci xarici)",
        "type": "ederslik_html",
        "e_derslik_id": "788",
        "topics": "LESSON 1. SUMMER HOLIDAY\nLESSON 2. YOUNG INVENTORS\nLESSON 3. HOBBIES AROUND THE WORLD\nLESSON 4. REAL HEROES\nLESSON 5. CHOOSE TO BE KIND\nLESSON 6. TRAVEL STORIES\nLESSON 7. CELEBRATIONS\nLESSON 8. ART\nLESSON 9. HELP THE EARTH!\nLESSON 10. PEOPLE IN OUR LIFE\nLESSON 11. MODERN TECHNOLOGY\nLESSON 12. IMPORTANT SKILLS FOR TEENS"
    },
    {
        "id": "umumi-tarix-8",
        "title": "Ümumi tarix 8",
        "subject": "Ümumi tarix",
        "type": "ederslik_html",
        "e_derslik_id": "791",
        "topics": "Şərq ölkələri XVII-XVIII yüzilliklərdə\n1. Qızılbaş dövlətləri\n2. Böyük Moğol dövləti\n3. Çin\n4. Osmanlı imperiyası\n5. Volqaboyu və Ural, Sibir, Mərkəzi Asiyanın türk xalqları\n6. Qafqaz\n7. Mədəniyyət\nAvropa və Amerika XVII-XVIII yüzilliklərdə\n8. İngiltərə\n9. Şimali Amerika\n10. Fransa\n11. Rusiya\n12. Mədəniyyət"
    },
    {
        "id": "edebiyyat-8",
        "title": "Ədəbiyyat 8",
        "subject": "Ədəbiyyat",
        "type": "ederslik_html",
        "e_derslik_id": "793",
        "topics": "QƏDİM DÖVR AZƏRBAYCAN ƏDƏBİYYATI\nKazan bəyin oğlu Uruz bəyin dustaq olduğu boy (Kitabi-Dədə Qorqud)\nİNTİBAH DÖVRÜ AZƏRBAYCAN ƏDƏBİYYATI\nXaqani Şirvani. Gənclərə nəsihət\nNizami Gəncəvi. Sultan Səncər və qarı (Sirlər xəzinəsi)\nORTA ƏSRLƏR AZƏRBAYCAN ƏDƏBİYYATI\nİmadədin Nəsimi. Ağrımaz\nŞah İsmayıl Xətayi. Bahariyyə\nMəhəmməd Füzuli. Söz\nERKƏN YENİ DÖVR AZƏRBAYCAN ƏDƏBİYYATI\nKoroğlu ilə Bolu bəy (Koroğlu dastanından)\nMolla Pənah Vaqif. Hayıf ki, yoxdur...\nAZƏRBAYCAN ƏDƏBİYYATINDA MAARİFÇİ REALİZM\nQasım bəy Zakir. Durnalar\nAşıq Ələsgər. Dağlar\nSeyid Əzim Şirvani. Qafqaz müsəlmanlarına xitab\nTƏNQİDİ REALİZM VƏ ROMANTİZM\nCəlil Məmmədquluzadə. Qurbanəli bəy\nMirzə Ələkbər Sabir. Əkinçi\nƏbdürrəhim bəy Haqverdiyev. Bomba\nMəhəmməd Hadi. Türkün nəğməsi\nHüseyn Cavid. Ana"
    }
]

def update_textbooks():
    with open('data/textbooks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # If grade "8" doesn't exist yet add it; otherwise merge
    if "8" not in data:
        data["8"] = []
    
    existing_ids = {b["id"] for b in data["8"]}
    added = 0
    updated = 0
    
    for book in GRADE8_HTML:
        if book["id"] in existing_ids:
            # Update existing entry with e_derslik_id and topics
            for i, b in enumerate(data["8"]):
                if b["id"] == book["id"]:
                    data["8"][i].update(book)
                    updated += 1
                    break
        else:
            data["8"].append(book)
            added += 1
    
    with open('data/textbooks.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Done! Added: {added}, Updated: {updated}")
    print(f"Total Grade 8 entries: {len(data['8'])}")

if __name__ == "__main__":
    update_textbooks()
