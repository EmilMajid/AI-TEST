import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

updates = {
    "tebiet-6-h1": {
        "id": "780",
        "topics": "Bölmə 1. Qüvvə və hərəkət\n1.1 Qüvvənin təsirinədən asılıdır\n1.2 Ağırlıq qüvvəsi\n1.3 Sürtünmə qüvvəsi\n1.4 Arximed qüvvəsi\n1.5 Tarazlaşan və tarazlaşmayan qüvvələr\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 2. İnsan orqanizmi və sağlamlıq\n2.1 Ürək necə işləyir\n2.2 Bədəndə qan necə hərəkət edir\n2.3 Ağciyərlərdə qazlar mübadiləsi necə başverir\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 3. Canlıların müxtəlifliyi: göbələklər və bakteriyalar\n3.1 Göbələk nədir\n3.2 Bakteriya nədir\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 4. Patogenlər və xəstəliklər\n4.1 Xəstəlik nədir\n4.2 Yoluxucu xəstəliklərin qarşısını necə almaq olar\n4.3 Bitki və heyvanların yoluxucu xəstəlikləri hansılardır\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 5. Maddənin xassələri\n5.1 Maddənin fiziki xassələri\n5.2 Maddənin sıxlığı\n5.3 Maddəni təşkil edən zərrəciklər\n5.4 Su molekulu\n5.5 Diffuziya\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 6. Saf maddələr və qarışıqlar\n6.1 Qarışıqlar\n6.2 Maddalarin hallolması\n6.3 Eynicinsli və müxtəlifcinsli qarışıqlar\n6.4 Saf maddələr\n6.5 Suyun əhəmiyyəti\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 7. Dəyişən Yer kürəsi\n7.1 Yer qabığındakı süxurlar\n7.2 Hava şəraiti və suxurların aşınması\n7.3 Torpaq necə yaranır\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    "tebiet-6-h2": {
        "id": "781",
        "topics": "Bölmə 8. Elektrik dövrəsi və dövrə elementləri\n8.1 Qüvvənin təsirinədən asılıdır\n8.2 Ağırlıq qüvvəsi\n8.3 Sürtünmə qüvvəsi\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 9. Səsin yaranması və yayılması\n9.1 Səs necə yaranır\n9.2 Səslər bir-birindən necə fərqlənir\n9.3 Səs başqa mühitlərdə yayılırmı\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 10. İstilik enerjisinin ötürülməsi\n10.1 Cisimlərin istidən genişlənməsi\n10.2 İstilik tarazlığı və istilik keçirmə\n10.3 İstilik enerjisinin konveksiya ilə ötürülməsi\n10.4 İstilik enerjisinin şüalanma ilə ötürülməsi\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 11. Canlıların mühitə uyğunlaşması\n11.1 Uyğunlaşma nədir\n11.2 Heyvanlar mühitə necə uyğunlaşır\n11.3 Heyvanlar sağ qalmaq üçün necə uyğunlaşır\n11.4 Bitkilər ətraf mühitə necə uyğunlaşır\n11.5 Canlılar ekstremal temperaturlarda necə yaşayır\n11.6 Canlılar mühitə uyğunlaşa bilmədikdə nə baş verir\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 12. Canlılar arasında qida əlaqələri\n12.1 Canlılar bir-birindən necə asılıdır\n12.2 Ekoloji piramidalar nədir\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 13. Fosil yanacaqlar və qlobal istiləşmə\n13.1 Fosillər və fosil yanacaqlar\n13.2 Yanma prosesi\n13.3 Təbiətdə karbon dövranı\n13.4 İstixana effekti və qlobal istiləşmə\nXülasə\nÜmumiləşdirici tapşırıqlar\nBölmə 14. Yer planeti Günəş sistemində\n14.1 Günəş sisteminin quruluşu .\n14.2 Ay və Yerin hərəkəti\n14.3 Yer kürəsi və fəsillər\nXülasə\nÜmumiləşdirici tapşırıqlar\nSözlük"
    },
    "edebiyyat-6": {
        "id": "911",
        "topics": "1. ŞİFAHİ XALQ ƏDƏBİYYATINDAN NÜMUNƏLƏR\nSu həsrəti\nQanlı daş\nİlyas\nAlı kişi (“Koroğlu” dastanından)\n2. UŞAQ DÜŞÜNCƏSİ, UŞAQ DÜNYASI\nSViktor Hüqo. KOZETTA\nNaibə Yusif. DƏRS\nZahid Xəlil. DOSTLAR\n3. YURD SEVGİSİ, QƏHRƏMANLIQ SƏHİFƏLƏRİ\nSüleyman Abdulla. AZƏRBAYCAN BAYRAĞI\nMəmməd İsmayıl. VƏTƏN SEÇİLMƏZ\nNəbi Xəzri. İSTİQLAL MARŞI\nMikayıl Rzaquluzadə. AND\nEyvaz Zeynallı. TƏNHA NAR AĞACI\n4. MƏNƏVİ DƏYƏRLƏR, YAŞAYAN HİKMƏTLƏR\nAbbasqulu ağa Bakıxanov. QURD VƏ İLBİZ\nSeyid Əzim Şirvani. QAZ VƏ DURNA\nXəlil Rza Ulutürk. LAYLAM MƏNİM, NƏRƏM MƏNİM\nMahirə Nağıqızı. ANA DİLİM\nSəməd Behrəngi. BALACA QARA BALIQ\n5. TƏBİƏTİN GÖZƏLLİYİ, TƏBİƏTƏ QAYĞI\nElçin Hüseynbəyli. QƏSD EDİLMİŞ GÖZƏLLİK\nRamiz Qusarçaylı. PAYIZ\nRahil Məmməd. İLİN QIZIL FƏSLİ\nBayram Həsənov. BULAQ BAŞINDA\nİnşanı necə yazmalı\nEsseni necə yazmalı\nLayihə (I yarımil)\nLayihə (II yarımil)\nİfadəli oxuda istifadə edilən şərti işarələr\nLüğət\nDərslikdəki bəzi terminlərin izahı\nOxumağı məsləhət görürük"
    },
    "cografiya-6-h1": {
        "id": "859",
        "topics": "Bölmə 1. MƏKANI TANIYAQ\n1.1 Məkan\nHarada yaşayırıq?\nCoğrafi məkan necə fərqlənir?\nYaşadığımız məkanı necə fərqləndirmək olar?\nDəyərləndirmə\n1.2 Məkanın miqyası\nMəkanın miqyası fərqlənirmi?\nLokal məkandan qlobal məkana\nÖlkəmizdən dünyaya\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nBölmə 2. MƏKANIN BƏLƏDÇİSİ\n2.1. Məkanın təsvir edilməsi\nPlan tərtib etmək üçün hansı biliklər tələb olunur?\nPlanın tərtib edilməsi\nDəyərləndirmə\n2.2. Məkanın kodlaşdırılması\nPlanetimiz necə təsvir edilir?\nDərəcə torunun elementləri\nXəritə necə tərtib edilir?\nXəritələr niyə müxtəlif rənglərdə çəkilir?\nMüasir xəritələr necə tərtib edilir?\nCoğrafi informasiya sistemlərindən harada istifadə olunur?\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nBölmə 3. ÇÖL TƏDQİQATI\n3.1. Ərazidə tədqiqat\nÇöl tədqiqatı nədir?\nTədqiqat çantanız varmı?\nMəktəb ərazisində çöl tədqiqatını necə aparmaq olar?\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nBölmə 4. KAİNATI SEYR EDİRƏM\n4.1. Nə üçün səma cisimlərinə maraq göstəririk?\nSəmanı seyr edərkən nələri görürük?\nYerin öz oxu ətrafında hərəkəti\nYerin Günəş ətrafında hərəkəti\nAy\nÇin mütəxəssislərinin uğurları\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nSÖZLÜK"
    },
    "cografiya-6-h2": {
        "id": "860",
        "topics": "Bölmə 5. TƏBİƏTİ KƏŞF EDİRƏM\n5.1. Təbiətdəki müxtəliflik\nYer kürəsinin təbii mənzərəsi\nTəbiətdə hansı komponentlər var?\nTəbii komponentlər fərqli mənzərələr yaradır\nDəyərləndirmə\n5.2. Təbiət bir sistemdir\nTəbii sistemin formalaşması\nFotosintezin coğrafiyası\nManqr meşələri lokal təbii sistemdir\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nBölmə 6. YURDUMUZUN TƏBİƏTİNƏ SƏYAHƏT\n6.1. Ölkəmizin təbiətini tanıyaq\nTəbiətimizin zənginlikləri\nAzərbaycan təbiətinin formalaşmas\nŞirvan qoruğu nə üçün yaradıldı?\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nBölmə 7. DÜNYA BİZİM EVİMİZDİR!\n7.1. Yer kürəsinin sosial mənzərəsi\nSosial həyat nədir?\nFərdlər sosial həyatın əsasıdır\nAilə kiçik dövlətdir\nCəmiyyət sosial həyatın əsas hissəsidir\nDövlət cəmiyyətin siyasi qurumudur\nNovruz şənlikləri\nDəyərləndirmə\n7.2. Cəmiyyətin inkişafında qurumların rolu\nİş mühiti və sosial həyat\nQeyri-hökumət təşkilatları\nŞirkətlərin sosial həyatdakı rolu\nDəyərləndirmə\n7.3. Lokal və qlobal əlaqələr\nVətəndaşın vəzifələri\nMilli məsuliyyət hissi\nDünya həqiqətən də böyükdürmü?\nAzərbaycanın dünya dövlətləri ilə münasibətləri\nDəyərləndirmə\nÜmumiləşdirici tapşırıqlar\nSÖZLÜK"
    }
}

for book in d["6"]:
    if book["id"] in updates:
        book.update({
            "type": "ederslik_html",
            "e_derslik_id": updates[book["id"]]["id"],
            "topics": updates[book["id"]]["topics"]
        })

with open(p, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("textbooks.json updated successfully for Phase 2.")
