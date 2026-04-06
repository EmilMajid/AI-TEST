import json

# ALL Grade 8 e-derslik HTML books (user-provided data)
# This includes textbooks previously incorrectly marked as PDF!
GRADE8_ALL_HTML = [
    # --- Already in DB (updating with topics/IDs) ---
    {
        "id": "azerbaycan-dili-8",
        "title": "Azərbaycan dili 8",
        "subject": "Azərbaycan dili",
        "type": "ederslik_html",
        "e_derslik_id": "784",
        "topics": "I BÖLMƏ. BİLİK XƏZİNƏDİR\n1. Tətildən sonra\n2. Qori seminariyasında Azərbaycan şöbəsi necə açıldı\n3. Yaxşılıq itmir\n4. Ana dili\n5. Mədinə xanım Qiyasbəyli\n6. Mücrü\n7. Şuşanın körpə qartalı\nII BÖLMƏ. TARİXİN DAŞ YADDAŞI\n1. Mətn\n2. Nə gözəl səslənir Şuşalı vətən\n3. Muğan\n4. Gülüstan\n5. Zivər bəy Əhmədbəyov\nIII BÖLMƏ. MİLLİ-MƏNƏVİ DƏYƏRLƏRİMİZ\n1. İbrət dərsi\n2. Duyğular adası\n3. Zəhər\n4. Qaranquşların ömrü 6 aydır\n5. Həmrəyliyimiz əbədidir\n6. Sədaqət\n7. Tariximizin şanlı səhifəsi\n8. Qədim türklərdə tərbiyə\nIV BÖLMƏ. ŞƏXSİYYƏTLƏR\n1. Azərbaycan teatrı\n2. Hüseynqulu Sarabskinin xatirələri\n3. İlk aktrisamız kimdir?\n4. Evrika\n5. Oqtay Eloğlu\nV BÖLMƏ. MƏTBUAT: DÜNƏN VƏ BU GÜN\n1. Günün hadisələri\n2. Molla Nəsrədddinə gedən yol\n3. İlk redaktor\nVI BÖLMƏ. SƏNƏT DÜNYASINA SƏYAHƏT\n1. Hacı Zeynalabdin Şirvani\n2. Mahmud Kaşğarlı\n3. Qurban Səidin gizli qalmış ömrü\n4. Fərhəng Hüseynov"
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
        "topics": "Şərq ölkələri XVII-XVIII yüzilliklərdə\n1. Qızılbaş dövlətləri\n2. Böyük Moğol dövləti\n3. Çin\n4. Osmanlı imperiyası\n5. Volqaboyu türk xalqları\n6. Qafqaz\n7. Mədəniyyət\nAvropa və Amerika XVII-XVIII yüzilliklərdə\n8. İngiltərə\n9. Şimali Amerika\n10. Fransa\n11. Rusiya\n12. Mədəniyyət"
    },
    {
        "id": "edebiyyat-8",
        "title": "Ədəbiyyat 8",
        "subject": "Ədəbiyyat",
        "type": "ederslik_html",
        "e_derslik_id": "793",
        "topics": "QƏDİM DÖVR AZƏRBAYCAN ƏDƏBİYYATI\nKazan bəyin oğlu Uruz bəyin dustaq olduğu boy\nİNTİBAH DÖVRÜ AZƏRBAYCAN ƏDƏBİYYATI\nXaqani Şirvani. Gənclərə nəsihət\nNizami Gəncəvi. Sultan Səncər və qarı\nORTA ƏSRLƏR AZƏRBAYCAN ƏDƏBİYYATI\nİmadədin Nəsimi. Ağrımaz\nŞah İsmayıl Xətayi. Bahariyyə\nMəhəmməd Füzuli. Söz\nERKƏN YENİ DÖVR AZƏRBAYCAN ƏDƏBİYYATI\nKoroğlu ilə Bolu bəy\nMolla Pənah Vaqif. Hayıf ki, yoxdur\nMAARİFÇİ REALİZM\nQasım bəy Zakir. Durnalar\nAşıq Ələsgər. Dağlar\nTƏNQİDİ REALİZM VƏ ROMANTİZM\nCəlil Məmmədquluzadə. Qurbanəli bəy\nMirzə Ələkbər Sabir. Əkinçi\nƏbdürrəhim bəy Haqverdiyev. Bomba\nMəhəmməd Hadi. Türkün nəğməsi\nHüseyn Cavid. Ana"
    },
    # --- NEW: Previously thought to be PDF, actually HTML! ---
    {
        "id": "informatika-8",
        "title": "İnformatika 8",
        "subject": "İnformatika",
        "type": "ederslik_html",
        "e_derslik_id": "797",
        "topics": "1. İNFORMASİYA\n1. İnformasiyanın kodlaşdırılması\n2. 2-lik, 8-lik və 16-lıq say sistemləri\n3. Bir say sistemindən başqasına keçid\n4. İnformasiyanın ölçülməsi\n2. MULTİMEDİA\n5. Multimedia qurğuları\n6. Elektron təqdimatda animasiya\n7. Təqdimatda səs və video\n3. PROQRAMLAŞDIRMA\n8. Proqram necə hazırlanır\n9. Python dilində ilk proqram\n10. Proqramda kəmiyyətlər\n11. Şərt operatoru\n12. Proqramda dövr\n13. Sayğaclı dövrlər\n4. KOMPÜTER\n14. İş masasının nizamlanması\n15. İnformasiya modelinin ağac forması\n16. Faylların axtarışı\n5. TƏTBİQİ PROQRAMLAR\n18. Üçölçülü qrafika\n19. Tillər və üzlər\n20. Üçölçülü modellərin qurulması\n21. Mətn redaktorunun obyektləri\n22. Elektron cədvəl\n23. Düsturlarla iş\n6. İNFORMASİYA CƏMİYYƏTİ VƏ İNTERNET\n24. Cəmiyyətin informasiyalaşdırılması\n25. Kompüter şəbəkələri\n26. İnternet xidmətləri"
    },
    {
        "id": "cografiya-8",
        "title": "Coğrafiya 8",
        "subject": "Coğrafiya",
        "type": "ederslik_html",
        "e_derslik_id": "799",
        "topics": "I. Coğrafi kəşflərdən tədqiqatlara doğru\nII. Xəritələr və onların üzərində təsvir üsulları\nIII. Yerin hərəkəti və onun coğrafi nəticələri\nIV. Yerin fəal tektonik təbəqəsi\nV. Atmosfer\nVI. Yerin su təbəqəsi\nVII. Biosfer\nVIII. Dünya ölkələrinin təsnifatı\nIX. Əhali və təsərrüfatın ərazi təşkili\nX. Ekoloji mühit və onun mühafizəsi"
    },
    {
        "id": "azerbaycan-tarixi-8",
        "title": "Azərbaycan tarixi 8",
        "subject": "Azərbaycan tarixi",
        "type": "ederslik_html",
        "e_derslik_id": "801",
        "topics": "1. AZƏRBAYCAN XVI ƏSRİN İKİNCİ YARISI - XVII ƏSRDƏ\n1. Azərbaycan ərazilərinin Osmanlılar tərəfindən işğalı\n2. Şah I Abbasın islahatları\n3. Cəlalilər hərəkatı\n4. XVI əsrin ikinci yarısı - XVII əsrdə sosial-iqtisadi həyat\n5. Azərbaycan beynəlxalq ticarət əlaqələrində\n6. XVII əsrdə Azərbaycan mədəniyyəti\n2. AZƏRBAYCAN XVIII ƏSRİN BİRİNCİ YARISINDA\n7. XVIII əsrin əvvəllərində iqtisadi və siyasi vəziyyət\n8. Rusiyanın Xəzər dənizi hövzəsinə yürüşə hazırlaşması\n9. Azərbaycan torpaqlarının iki imperiya tərəfindən bölüşdürülməsi\n10. Azərbaycan torpaqlarının azad edilməsi\n11. Əfşar imperiyasının yaranması\n3. AZƏRBAYCAN XVIII ƏSRİN İKİNCİ YARISINDA\n15. Azərbaycanda ilk müstəqil xanlıq\n16. Quba xanlığı\n17. Qarabağ xanlığı\n18. Qərbi Azərbaycan xanlıqları\n19. Bakı, Lənkəran və Dərbənd xanlıqları\n4. AZƏRBAYCAN XIX ƏSRİN ƏVVƏLLƏRİNDƏ\n27. Rusiyanın Azərbaycan torpaqlarının işğalına başlaması\n28. Gəncə xanlığının işğalı\n29. Qarabağ, Şəki xanlıqlarının işğalı\n30. Gülüstan müqaviləsi\n31. Naxçıvan və İrəvan xanlıqlarının işğalı\n32. Türkmənçay müqaviləsi"
    },
    {
        "id": "ortaq-turk-tarixi-8",
        "title": "Ortaq türk tarixi 8",
        "subject": "Ortaq türk tarixi",
        "type": "ederslik_html",
        "e_derslik_id": "803",
        "topics": "I BÖLMƏ. TÜRK DÜNYASI BƏŞƏR TARİXİ KONTEKSTİNDƏ\nII BÖLMƏ. HUN İMPERİYALARI VƏ SONRAKI TÜRK DÖVLƏTLƏRİ\nIII BÖLMƏ. TÜRK XAQANLIQLARI\nIV BÖLMƏ. İLK TÜRK-MÜSƏLMAN DÖVLƏTLƏRİ\nV BÖLMƏ. TÜRK-MONQOL DÖVLƏTLƏRİ\nVI BÖLMƏ. TÜRK DÜNYASI (XIII-XV ƏSRLƏR)\nVII BÖLMƏ. TÜRK DÜNYASININ ORTAQ MƏNƏVİ VƏ MƏDƏNİ İRSİ"
    },
    {
        "id": "tesviri-incesenet-8",
        "title": "Təsviri incəsənət 8",
        "subject": "Təsviri incəsənət",
        "type": "ederslik_html",
        "e_derslik_id": "369",
        "topics": "1. TƏSVİRİ SƏNƏTDƏ TARİXİ HADİSƏLƏR VƏ QƏHRƏMANLIQ MÖVZUSU\n1. Təsviri sənətdə batal və tarixi janrlar\n2. Fransisko Qoyya\n3. Jak Lui David\n4. Jan Ogüst Dominik Enqr\n5. Ejen Delakrua\n2. TƏSVİRİ SƏNƏTDƏ YENİ DÖVRÜN BƏDİİ İFADƏ VASİTƏLƏRİ\n6. İmpressionizm\n7. Oskar Klod Mone\n8. Eduard Mane\n9. Ogüst Renuar\n10. Ogüst Roden\n11. Vinsent Van Qoq\n12. Pol Qogen\n13. Anri Matis\n3. AZƏRBAYCAN SƏNƏTKARLARI\n14. Böyükağa Mirzəzadə\n15. Fuad Əbdürrəhmanov\n16. Tokay Məmmədov\n17. Sadıq Dadaşov\n18. Toğrul Nərimanbəyov\n19. Eldar Mikayılzadə"
    },
    {
        "id": "texnologiya-8",
        "title": "Texnologiya 8",
        "subject": "Texnologiya",
        "type": "ederslik_html",
        "e_derslik_id": "371",
        "topics": "I. MƏİŞƏT MƏDƏNİYYƏTİ\nII. AĞAC VƏ METALIN BƏDİİ EMALI TEXNOLOGİYASI\nIII. SADƏ TƏMİR İŞLƏRİ\nIV. ELEKTROTEXNİKİ İŞLƏR\nV. QİDA MƏHSULLARININ EMALI TEXNOLOGİYASI\nVI. PARÇANIN EMALI TEXNOLOGİYASI"
    },
    {
        "id": "musiqi-8",
        "title": "Musiqi 8",
        "subject": "Musiqi",
        "type": "ederslik_html",
        "e_derslik_id": "374",
        "topics": "I BÖLMƏ. BƏSTƏKARLARIN YARADICILIĞINDA XALQ MUSİQİSİ\nII BÖLMƏ. AZƏRBAYCAN BƏSTƏKARLARININ SİMFONİK YARADICILIĞINDA XALQ MUSİQİSİ\nIII BÖLMƏ. MUĞAMDAN OPERAYADƏK\nIV BÖLMƏ. XALQ MUSİQİSİ VƏ PROFESSİONAL MUSİQİÇİLƏR"
    },
    {
        "id": "hayat-bilgisi-8",
        "title": "Həyat bilgisi 8",
        "subject": "Həyat bilgisi",
        "type": "ederslik_html",
        "e_derslik_id": "379",
        "topics": "I BÖLMƏ. TƏBİƏTDƏKİ QANUNAUYĞUNLUQLAR\n1. Materiya - maddə və sahə\n2. Kainatda baş verən hadisələrin sirri\n3. Ekoloji tarazlıq\nII BÖLMƏ. CƏMİYYƏT VƏ DÖVLƏT\n1. Cəmiyyətin inkişafında inteqrasiyanın rolu\n2. Dövlət hakimiyyəti\n3. İnsan hüquqları\nIII BÖLMƏ. MƏNİM MƏNƏVİ DÜNYAM\n1. Münasibəti necə qururuq?\n2. İnsanlararası münasibətlər\n3. Mənim mənəvi borcum\nIV BÖLMƏ. TƏHLÜKƏSİZ VƏ SAĞLAM YAŞA\n1. Sağlam həyat - sağlam ailə\n2. Təhlükəsiz həyat\n3. Yol hərəkətinin nizamlanması"
    },
    {
        "id": "riyaziyyat-8",
        "title": "Riyaziyyat 8",
        "subject": "Riyaziyyat",
        "type": "ederslik_html",
        "e_derslik_id": "393",
        "topics": "1. Kvadrat kök. Həqiqi ədədlər\n2. Pifaqor teoremi\n3. Kvadrat tənliklər\n4. Dördbucaqlılar\n5. Rasional ifadələr\n6. Fiqurların sahəsi\n7. Rasional tənliklər\n8. Fiqurların oxşarlığı\n9. Bərabərsizliklər\n10. Triqonometrik nisbətlər. Koordinatlar üsulu\n11. Məlumatın toplanması və təqdimi. Ehtimalın hesablanması"
    },
    {
        "id": "biologiya-8-h1",
        "title": "Biologiya 8 (hissə 1)",
        "subject": "Biologiya",
        "type": "ederslik_html",
        "e_derslik_id": "927",
        "topics": "Bölmə 1. Həyatın kimyası\n1.1 Hüceyrənin kimyəvi tərkibi. Su\n1.2 Hüceyrənin üzvi birləşmələri\n1.3 Fermentlər\n1.4 Maddələrin hüceyrə membranında daşınması\nBölmə 2. Bitki orqanizmi\n2.1 Bitki orqanizmi və qazlar mübadiləsi\n2.2 Fotosintez\n2.3 Bitki orqanizmində maddələrin daşınması\nBölmə 3. Qan dövranı sistemi\n3.1 Heyvanlarda qan dövranı\n3.2 İnsan ürəyinin quruluşu\n3.3 İnsanın qan dövranı\n3.4 Qanın tərkibi və funksiyaları\n3.5 Qanköçürmə və qan qrupları\nBölmə 4. Tənəffüs sistemi\n4.1 Heyvanlarda tənəffüs\n4.2 İnsanda tənəffüs sistemi\n4.3 Tənəffüs hərəkətləri"
    },
    {
        "id": "biologiya-8-h2",
        "title": "Biologiya 8 (hissə 2)",
        "subject": "Biologiya",
        "type": "ederslik_html",
        "e_derslik_id": "928",
        "topics": "Bölmə 5. Həzm və qidalanma\n5.1 Orqanizmdə maddələr mübadiləsi\n5.2 Həzm sisteminin quruluşu\n5.3 İnsan orqanizmində həzm prosesi\nBölmə 6. Heyvanlarda və insanda çoxalma\n6.1 Qeyri-cinsi çoxalma\n6.2 Cinsi çoxalma\n6.3 Onurğalı heyvanların həyat dövriyyəsi\n6.4 İnsanın cinsiyyət sistemi\n6.5 Mayalanma prosesi\n6.6 İnsanın yaş dövrləri\nBölmə 7. Canlı aləmin təsnifatı\n7.1 Canlı orqanizmlərin təsnifatı\n7.2 Heyvanlar aləminin təsnifatı\n7.3 Bitkilər aləminin təsnifatı\nBölmə 8. İnsan sağlamlığı və ətraf mühit\n8.1 Orqanizmin qoruyucu sistemi\n8.2 Sağlam qidalanma\n8.3 Sağlamlığa təsir edən amillər"
    },
    {
        "id": "fizika-8-h1",
        "title": "Fizika 8 (hissə 1)",
        "subject": "Fizika",
        "type": "ederslik_html",
        "e_derslik_id": "931",
        "topics": "Bölmə 1. Qüvvə\n1.1 Qüvvə və onun növləri\n1.2 Nyutonun birinci qanunu\n1.3 Nyutonun ikinci qanunu\n1.4 Nyutonun üçüncü qanunu\n1.5 Elastiklik qüvvəsi\n1.6 Sürtünmə qüvvəsi\n1.7 Qüvvə momenti\nBölmə 2. İş və enerji\n2.1 Mexaniki iş\n2.2 Güc\n2.3 Potensial və kinetik enerji\nBölmə 3. Təzyiq\n3.1 Bərk cisimlərin təzyiqi\n3.2 Maye və qazların təzyiqi\n3.3 Arximed qüvvəsi"
    },
    {
        "id": "fizika-8-h2",
        "title": "Fizika 8 (hissə 2)",
        "subject": "Fizika",
        "type": "ederslik_html",
        "e_derslik_id": "932",
        "topics": "Bölmə 4. Dalğalar\n4.1 Mexaniki dalğalar\n4.2 Səs dalğası\n4.3 Elektromaqnit dalğaları\nBölmə 5. Molekulların istilik hərəkəti\n5.1 Temperatur\n5.2 Cisimlərin istidən genişlənməsi\n5.3 Daxili enerji\n5.4 İstilikvermənin növləri\nBölmə 6. İstilik hadisələrinde enerjinin saxlanması\n6.1 İstilik miqdarı\n6.2 Maddənin aqreqat halının dəyişməsi\n6.3 İstilik mühərriki\n6.4 Daxiliyanma mühərriki\n6.5 Reaktiv mühərrik"
    },
    {
        "id": "kimya-8-h1",
        "title": "Kimya 8 (hissə 1)",
        "subject": "Kimya",
        "type": "ederslik_html",
        "e_derslik_id": "935",
        "topics": "Bölmə 1. Atomun quruluşu və dövri cədvəl\n1.1 Atomun elektron örtüyü\n1.2 Müasir dövri cədvəl\n1.3 Elementlərin xassələrinin dövriliyi\nBölmə 2. Kimyəvi rabitə\n2.1 İon rabitəsi\n2.2 Kovalent rabitə\n2.3 Metal rabitəsi\n2.4 Kristal qəfəsin tipləri\nBölmə 3. Kimyəvi reaksiyaların təsnifatı\n3.1 Kimyəvi tənliklər\n3.2 Maddə kütləsinin saxlanması qanunu\n3.3 Birləşmə, parçalanma, əvəzetmə, mübadilə reaksiyaları"
    },
    {
        "id": "kimya-8-h2",
        "title": "Kimya 8 (hissə 2)",
        "subject": "Kimya",
        "type": "ederslik_html",
        "e_derslik_id": "936",
        "topics": "Bölmə 4. Kimyəvi reaksiyaların sürəti\n4.1 Reaksiya sürətinin ölçülməsi\n4.2 Qatılığın təsiri\n4.3 Temperaturun təsiri\n4.4 Katalizatorun təsiri\nBölmə 5. Oksidləşmə və reduksiya prosesləri\n5.1 Yanma reaksiyaları\n5.2 Oksidlər\n5.3 Oksidləşmə-reduksiya reaksiyaları\nBölmə 6. Turşular və əsaslar\n6.1 Turşular\n6.2 Əsaslar\n6.3 Turşular və əsasların ümumi alınma reaksiyaları\n6.4 Duzlar\n6.5 İon tənlikləri"
    },
]

def update_grade8_all():
    with open('data/textbooks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    if "8" not in data:
        data["8"] = []

    existing_ids = {b["id"]: i for i, b in enumerate(data["8"])}
    added = 0
    updated = 0

    for book in GRADE8_ALL_HTML:
        if book["id"] in existing_ids:
            idx = existing_ids[book["id"]]
            data["8"][idx] = book
            updated += 1
        else:
            data["8"].append(book)
            added += 1

    with open('data/textbooks.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Done! Added: {added}, Updated: {updated}")
    print(f"Total Grade 8 entries: {len(data['8'])}")
    
    html_books = [b for b in data["8"] if b.get("type") == "ederslik_html"]
    print(f"Grade 8 HTML textbooks: {len(html_books)}")

if __name__ == "__main__":
    update_grade8_all()
