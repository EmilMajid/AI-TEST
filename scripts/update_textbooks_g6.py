import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

updates = {
    "azerbaycan-dili-6-h1": {
        "id": "903",
        "topics": "Bölmə 1. Fərd və toplum\nFəsil 1. Söz vermişəm\nSözlərdə saitlərin deyilişi və yazılışı: səsdüşümü və səsartımı\nFəsil 2. Sənin kimi olacağam\nSaitlərin uzun tələffüzü\nFəsil 3. Buqələmun\nSamitlərin tələffüzü\nFəsil 4. Sadiq dost\nSöz ortasında yanaşı gələn samitlərin deyilişi və yazılışı\nÜmumiləşdirici təkrar\nBölmə 2. Qədimdə yazı\nFəsil 1. Piktoqramdan hərflərə\nAlınma sözlərin bitişik və defislə yazılması\nFəsil 2. Rozetta daşının sirri\nHiperonim və hiponim\nQoşa samitlə bitən sözlərin deyilişi və yazılışı\nFəsil 3. Qədim türk əlifbası\nMürəkkəb adlar (şəxs və yer adları)\nFəsil 4. Qədimdə yazı materialları\nSözlərin təkrarından yaranan mürəkkəb sözlər\nÜmumiləşdirici təkrar\nBölmə 3. Milli dəyərlər\nFəsil 1. Vətən sağ olsun!\nSözün başlanğıc forması\nFəsil 2. Sonuncu dərs\nEyniköklü sözlər\nFəsil 3. Şeyx Səfi məqbərəsi necə talan olundu?\nSöz birləşmələri\nFəsil 4. Ağdam Chörək Muzeyi\nQeyri-müəyyən yiyəlik hal\nÜmumiləşdirici təkrar\nBölmə 4. Qədim dünya: tarix və miflər\nFəsil 1. Fironlar və ehramlar\nQoşma. Qoşmaların orfoqrafiyası\nFəsil 2. Troya müharibəsi\nQoşmanın qrammatik sinonimliyi və omonimliyi\nFəsil 3. Barbarlar və vandallar\nBağlayıcılar\nÜmumiləşdirici təkrar\nİzahlı sözlük"
    },
    "azerbaycan-dili-6-h2": {
        "id": "904",
        "topics": "Bölmə 5. İncəsənət və informasiya\nFəsil 1. Danışan ilmələr\nSaylardan sonra isimlərin təkdə və ya cəmdə olması\nFəsil 2. Rəqslərin dili\nNumerativ sözlər\nFəsil 3. Heykəltaraş Mirəli Mirqasımov\nTamamlıq\nFəsil 4. Qoca aşpaz\nQeyri-müəyyən təsirlik hal\nÜmumiləşdirici təkrar\nBölmə 6. Ədəbiyyatda fantastika\nFəsil 1. Doktor Salvator ittihamları rədd edir\nHal şəkilçisi qəbul etməyən isimlər\nFəsil 2. Görünməz adam\nTəyin\nFəsil 3. Skelliq\nZərflik\nFəsil 4. Yaddaş\nSöz birləşmələri cümlə üzvü kimi\nÜmumiləşdirici təkrar\nBölmə 7. Nəqliyyatda ixtiralar\nFəsil 1. Avtomobil necə yarandı?\nCümlədə söz sırası\nFəsil 2. Havada uchuş\nXəbər vəzifəsində olan feillərin deyilişi və yazılışı\nFəsil 3. Relslər üzərində hərəkət\n“L” samiti ilə başlanan bəzi şəkilçilərin tələffüzü\nFəsil 4. Gələcəyin nəqliyyatı\n“-la” şəkilçisinin funksiyaları\nÜmumiləşdirici təkrar\nBölmə 8. Kitabın tarixi\nFəsil 1. Qədimdə kitab işi\nMənsubiyyət şəkilçisinin yazılışı\nFəsil 2. Kitab çapı\n“O” və “bu” əvəzliklərindən sonra vergül\nFəsil 3. Naşirlər və oxucular\nFəsil 4. Müasir kitablar\nÜmumiləşdirici təkrar\nİzahlı sözlük"
    },
    "riyaziyyat-6-h1": {
        "id": "906",
        "topics": "Bölmə 1. Natural ədədlər və onlar üzərində əməllər\nİlkin yoxlama\n1.1. Natural ədədin qüvvəti\n1.2. Sadə və mürəkkəb ədədlər\n1.3. Ən böyük ortaq bölən (ƏBOB)\n1.4. Ən kiçik ortaq bölünən (ƏKOB)\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Kriptoqrafiya\"\nBölmə 2. Nisbət. Tənasüb. Faiz\nİlkin yoxlama\n2.1. Nisbət\n2.2. Kəmiyyətlərin nisbəti\n2.3. Kəmiyyətin verilən nisbətdə bölünməsi\n2.4. Tənasüb\n2.5. Miqyas\n2.6. Düz mütənasib asılılıq\n2.7. Tərs mütənasib asılılıq\nMəsələ və misallar\n2.8. Nisbətin faizlə ifadəsi\n2.9. Kəmiyyətin dəyişməsinin faizlə ifadəsi\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Ekran nisbəti və çözümlülük\"\nBölmə 3. Tam ədədlər\nİlkin yoxlama\n3.1. Tam ədədlər\n3.2. Tam ədədlərin müqayisəsi və sıralanması\n3.3. Ədədin mütləq qiyməti\n3.4. Tam ədədlərin toplanması\n3.5. Tam ədədlərin çıxılması\nMəsələ və misallar\n3.6. Tam ədədlərin vurulması və bölünməsi\n3.7. Tam ədədlər üzərində əməllər\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Ekstremal temperatur və mütləq sıfır\"\nBölmə 4. Düzbucaqlı koordinat sistemi\nİlkin yoxlama\n4.1. Düzbucaqlı koordinat sistemi\n4.2. Düzbucaqlı koordinat sistemində məsafə\n4.3. Düzbucaqlı koordinat sistemində simmetriya və yerdəyişmə\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Kriptoqrafiya\"\nBirinci yarımil üzrə ümumiləşdirici tapşırıqlar\nSözlük\nCavablar"
    },
    "riyaziyyat-6-h2": {
        "id": "907",
        "topics": "Bölmə 5. Choxluqlar və onlar üzərində əməllər\nİlkin yoxlama\n5.1. Choxluq\n5.2. Choxluqlar üzərində əməllər\n5.3. Eyler-Venn diaqramının köməyi ilə məsələ həlli\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Axtarış sistemləri\"\nBölmə 6. Dəyişəni olan ifadələr. Tənlik. Bərabərsizlik\nİlkin yoxlama\n6.1. Dəyişəni olan ifadələr\n6.2. Riyazi ifadələrdə mötərizələrin achılması\n6.3. Dəyişənli ifadələrin sadələşdirilməsi\n6.4. Tənliklər\n6.5. Tənlik qurmaqla məsələ həlli\n6.6. Bərabərsizliklər\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Riyazi modelləşdirmə\"\nBölmə 7. Üçbucaqlar\nİlkin yoxlama\n7.1. Üçbucağın medianı, tənböləni və hündürlüyü\n7.2. Üçbucaqların konqruyentlik əlamətləri\n7.3. Düz xətlərin paralelliyi\n7.4. Üçbucağın bucaqlarının cəmi\n7.5. Üç tərəfinə görə üçbucağın qurulması\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Geodeziya qübbələri\"\nBölmə 8. Həndəsi fiqurların sahəsi və həcmi\nİlkin yoxlama\n8.1. Üçbucağın sahəsi\n8.2. Paraleloqram və rombun sahəsi\n8.3. Chevrənin uzunluğu. Dairənin sahəsi\nMəsələlər\n8.4. Düz üçbucaqlı prizmanın və silindrin səthinin sahəsi\n8.5. Düz üçbucaqlı prizmanın və silindrin həcmi\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Mars şəhərciyi\"\nBölmə 9. Statistika və ehtimal\nİlkin yoxlama\n9.1. Median və moda\n9.2. Təsadüfi hadisə\n9.3. Hadisənin ehtimalı\n9.4. Məlumatların təsviri\nXülasə\nÜmumiləşdirici tapşırıqlar\nSTEAM. \"Genealoji DNT testi və ehtimal nəzəriyyəsi\"\n6-cı sinif üzrə ümumiləşdirici tapşırıqlar\nSözlük\nCavablar"
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
print("textbooks.json updated successfully.")
