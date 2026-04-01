import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

# Define updates for Grade 7 Phase 1
updates = [
    {
        "id": "biologiya-7-h1",
        "title": "Biologiya 7 (1-ci hissə)",
        "subject": "Biologiya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "863",
        "topics": "Giriş\nBiologiya nəyi öyrənir\nBiologiyanı öyrənmək bizə nə verir\nBölmə 1. Hüceyrə və orqanizm\n1.1 Canlıların əsas xüsusiyyətləri\n1.2 İşıq mikroskopunun quruluşu\n1.3 İşıq mikroskopundan istifadə\n1.4 Hüceyrənin ümumi quruluşu\n1.5 Bitki və heyvan hüceyrələrinin quruluşu\n1.6 Bakteriyalar\n1.7 İxtisaslaşmış hüceyrələr\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 2. Bitki orqanizmi\n2.1 Orqanizmin təşkili səviyyələri\n2.2 Çiçəkli bitkilərin orqanları. Kök\n2.3 Çiçəkli bitkilərin orqanları. Gövdə\n2.4 Çiçəkli bitkilərin orqanları. Yarpaq\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 3. Bitkilərdə çoxalma\n3.1 Çiçək və onun quruluşu.\n3.2 Tozlanma.\n3.3 Çiçəkli bitkilərdə cinsiyyətli çoxalma. Mayalanma\n3.4 Toxumun quruluşu\n3.5 Toxumların cücərməsi\n3.6 Meyvə\n3.7 Meyvə və toxumların yayılması\n3.8 Çiçəkli bitkilərdə qeyri-cinsi çoxalma\n3.9 Bitkilərin həyat dövrü\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    {
        "id": "biologiya-7-h2",
        "title": "Biologiya 7 (2-ci hissə)",
        "subject": "Biologiya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "864",
        "topics": "Bölmə 4. Heyvanların bədən örtükləri və bədən quruluşu\n4.1 Onurğalı heyvanların xarici bədən örtükləri\n4.2 Onurğalı heyvanların bədən hissələri\n4.3 Onurğasız heyvanlarda bədənin əsas hissələri. Həlqəvi qurdlar və bağırsaqboşluqlular\n4.4 Onurğasız heyvanlarda bədənin əsas hissələri.Buğumayaqlılar\n4.5 Onurğasız heyvanlarda bədənin əsas hissələri.Molyusklar\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 5. Bioloji müxtəliflik\n5.1 Ekoloji amillər\n5.2 Təbii yaşayış mühitləri\n5.3 Biomüxtəliflik\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 6. Ekosistemlərdə enerji axını\n6.1 Ekosistemlərdə qida münasibətləri. Qida zəncirləri\n6.2 Ekosistemlərdə qida münasibətləri. Qida şəbəkəsi\n6.3 Su və quru ekosistemlərində qida şəbəkələri\n6.4 Ekoloji piramidalar\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 7. Sağlam həyat tərzi\n7.1 Fiziki sağlamlıq\n7.2 Bədən kütlə indeksi və sağlamlıq\n7.3 Psixi sağlamlıq\n7.4 Zərərli vərdişlər və sağlamlıq\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    {
        "id": "fizika-7-h1",
        "title": "Fizika 7 (1-ci hissə)",
        "subject": "Fizika",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "867",
        "topics": "Giriş. Fizika nəyi öyrənir?\nFiziklər təbiət haqqında nə bilirlər?\nFiziklər təbiəti necə öyrənirlər?\nFizikanın əhəmiyyəti\nBölmə 1. Fiziki kəmiyyətlər və onların ölçülməsi\n1.1 Fiziki kəmiyyətlər\n1.2 Fiziki kəmiyyətlərin ölçülməsi\n1.3 Ölçmədə dəqiqlik\n1.4 Skalyar və vektorial kəmiyyətlər\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 2. Düzxətli hərəkət\n2.1 Trayektoriya, yol və yerdəyişmə\n2.2 Sürət\n2.3 Düzxətli bərabərsürətli hərəkət\n2.4 Yolun və yola görə sürətin qrafik təsviri\n2.5 Düzxətli dəyişənsürətli hərəkət\n2.6 Təcil\n2.7 Orta sürət\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 3. Əyrixətli hərəkət\n3.1 Çevrə üzrə bərabərsürətli hərəkət\n3.2 Çevrə üzrə bərabərsürətli hərəkətdə sürət\n3.3 Periodik rəqsi hərəkət\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 4. Atomun quruluşu və ölçüsü\n4.1 Atomun quruluşu\n4.2 Atomun ölçüsü\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    {
        "id": "fizika-7-h2",
        "title": "Fizika 7 (2-ci hissə)",
        "subject": "Fizika",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "868",
        "topics": "Bölmə 5. Elektrik yükü və elektrik sahəsi\n5.1 Cisimlərin elektrik yükü\n5.2 Sürtünmə ilə elektriklənmə\n5.3 Elektroskop\n5.4 Keçiricilər və dielektriklər\n5.5 Elektrik sahəsi\n5.6 İnduksiya ilə elektriklənmə\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 6. Elektrik dövrəsi və dövrə elementləri\n6.1 Elektrik dövrəsi və dövrə elementləri\n6.2 Elektrik cərəyanı\n6.3 Gərginlik\n6.4 Om qanunu\n6.5 Naqilin müqaviməti nədən asılıdır?\n6.6 Lampaların ardıcıl və paralel birləşdirilməsi\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 7. Sabit maqnit və maqnit sahəsi\n7.1 Sabit maqnit\n7.2 Maqnit sahəsi\nElm, texnologiya, həyat\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    {
        "id": "kimya-7-h1",
        "title": "Kimya 7 (1-ci hissə)",
        "subject": "Kimya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "871",
        "topics": "Giriş. Kimya nəyi öyrənir?\nKimya laboratoriyasının avadanlıqları və laboratoriyada təhlükəsizlik qaydaları\nBölmə 1. Kimyəvi elementlər\n1.1 Kimyəvi elementlər və onların simvolları\n1.2 Bioelementlər\n1.3 Cansız təbiətdə olan mühüm elementlər\n1.4 Metallar və onların xassələri\n1.5 Qeyri-metallar və onların xassələri. Allotropiya\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 2. Atomun quruluşu\n2.1 Atomun quruluşu\n2.2 Nüvə yükü və kütlə ədədi\n2.3 İzotoplar və ionlar\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 3. Kimyəvi birləşmələr\n3.1 Kimyəvi birləşmələr, onların formulları və adları\n3.2 Məişətdə istifadə edilən mühüm kimyəvi birləşmələr.\n3.3 Təbiətdə sərbəst şəkildə tapılan mühüm kimyəvi birləşmələr\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 4. Qarışıqlar\n4.1 Qarışıqların növləri\n4.2 Kimyəvi birləşmələrin və qarışıqların fərqli xüsusiyyətləri\n4.3 Həllolma. Həllolmaya təsir edən amillər\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    {
        "id": "kimya-7-h2",
        "title": "Kimya 7 (2-ci hissə)",
        "subject": "Kimya",
        "grade": 7,
        "type": "ederslik_html",
        "e_derslik_id": "872",
        "topics": "Bölmə 5. Qarışıqların ayrılma üsulları\n5.1 Kristallaşdırma üsulu\n5.2 Sadə distillə və fraksiyalı distillə üsulları\n5.3 Durultma üsulu\n5.4 Kağız xromatoqrafiyası\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 6. Kimyəvi reaksiyalar\n6.1 Fiziki və kimyəvi hadisələr\n6.2 Kimyəvi reaksiyaların əlamətləri\n6.3 Ekzotermik və endotermik reaksiyalar\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 7. Turşular və əsaslar\n7.1 Turşular və turş mühit\n7.2 Əsaslar və əsasi mühit\n7.3 İndikatorlar və pH şkalası\n7.4 Neytrallaşma reaksiyaları\nElm, texnologiya, həyat\nLayihə\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
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
print("textbooks.json updated for Grade 7 Phase 1.")
