import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

updates = {
    "hayat-bilgisi-6": {
        "id": "581",
        "topics": "I. Mənəvi aləmim\n1. Ünsiyyət mədəniyyəti\n2. Davranış normaları\n3. Ailə və Vətən qarşısında mənəvi borcumuz\n4. Dini ibadətlər və mərasimlər\nII. Dövlətimə arxalanıram\n5. Dövlətdə idarəçilik\n6. Cəmiyyətin idarə olunmasında dövlətin funksiyaları\n7. Hüquqlarımızın qorunması\n8. İqtisadi inkişaf\nIII. Cansızdan canlıya\n9. Maddələrin tərkibi və xassələri\n10. Elementlə\n11. Bir maddədən yeni maddə alına bilərmi?\n12. Saf maddələr və qarışıqlar\n13. Qeyri-üzvi və üzvi maddələr\n14. Üzvi maddədən canlıya\n15. İnsan - təbiətin ali varlığı\nIV. Təhlükəsiz həyat\n16. Sağlamlığın şərtləri\n17. Gigiyena sağlamlığın şərtidir\n18. Yoluxucu xəstəliklərdən qorunma yolları\n19. Təhlükəsizliyin təmin olunması\n20. Təbiətdəki təhlükəli hadisələrdən qorunaq\n21. Texnogen mənşəli qəzalardan qorunaq\n22. Yol nişanlarına diqqət edək\nİstifadə edilmiş ədəbiyyat"
    },
    "azerbaycan-tarixi-6": {
        "id": "910",
        "topics": "I Bölmə. Azərbaycanda ibtidai cəmiyyət\nı. Əsas tarixi anlayışlar və zaman ölçü vahidləri\n2. ibtidai cəmiyyət\n3. Erkən dövlətlər\nII Bölmə. Azərbaycanda qədim dövlətlər\n4. Manna dövlət\n5. Azərbaycan e.ə. VII-IV yüzilliklərdə\n6. Atropatena dövləti\n7. Albaniya dövləti\nIII Bölmə. Azərbaycan III–VI yüzilliklərdə\n8. Azərbaycanda feodal münasibətlərinin yaranması\n9. Azərbaycan Sasani imperiyası dövründə"
    },
    "umumi-tarix-6": {
        "id": "920",
        "topics": "Tarix\n1. Tarixdə il hesabı\n2. İbtidai cəmiyyət\nQədim Şərq sivilizasiyaları\n3. Ehramlar ölkəsi\n4. Şumerdən başlanan tarix\n5. ikiçayarasının digər dövlətləri\n6. Oda sitayiş edənlər\n7. Parfiya dövləti.\n8. Tanrının döyüşçüləri\n9. Böyük ipək yolunun başlandığı ölkə\n10. Şahmatın vətəni\nQədim Qərb sivilizasiyaları\n11. Avropa mədəniyyətinin beşiyi\n12. ilk Respublika yaradanlar"
    },
    "musiqi-6": {
        "id": "553",
        "topics": "I. MUSİQİNİN TƏSİR GÜCÜ\n1. Musiqidə təzadhlıq\n2. Musiqidə emosionallıq\n3. Musiqidə millilik və ümumbəşərilik\n4. Bəstəkarların yaradıcılığında milli xüsusiyyətlər\n5. Musiqidə müharibə mövzusu\n6. Musiqidə polifoniya\n7. Musiqidə homofoniya\nÖzünüzü yoxlayın\nII. MUSİQİ VƏ HƏYAT\n8. Musiqidə Qarabağ mövzusu\n9. Musiqidə mübarizə mövzusu\n10. Musiqidə gərginlik\n11. Musiqidə milli qəhrəman obrazı\n12. Klassik Azərbaycan muğamı - “Segah”\n13. Dünya Azərbaycanlılarının Həmrəyliyi Günü və musiqi\nÖzünüzü yoxlayın\nIII. MUSİQİDƏ ƏHVALİ-RUHİYYƏ\n14. Musiqinin obyektiv reallığı\n15. Musiqidə yumoreska\n16. 20 Yanvar və musiqi\n17. Musiqidə axşam əhvali-ruhiyyəsi\n18. Musiqidə təbiət təsviri\n19. Musiqidə real və qeyri-real obrazlar\n20. Fransız bəstəkarının yaradıcılığında Xocalı mövzusu\n21. Müxtəlif dövrlərdə mahnılarımızda qadın obrazları\n22. Novruz bayramı və musiqi\nÖzünüzü yoxlayın\nIV. AZƏRBAYCAN XALQ VƏ PROFESSİONAL MUSİQİSİ VƏHDƏTDƏ\n23. “Şüştər” muğamı\n24. Azərbaycan muğamları və xor\n25. Azərbaycan muğamları və simfonik orkestr\n26. Muğamlar və milli Azərbaycan operası\n27. Azərbaycan xalq rəqsləri və balet\n28. Azərbaycan xalq musiqisi və operetta\n29. 28 May - Respublika Günü və musiqi\nSinif konsertinə hazırlıq\nMahnı repertuarı\nMusiqi lüğəti\nİstifadə olunmuş ədəbiyyat"
    },
    "texnologiya-6": {
        "id": "559",
        "topics": "I. Məişət mədəniyyəti\n1. Məktəbdə ünsiyyət və davranış mədəniyyəti\n2. Ailə büdcəsinin formalaşdırılması. Gəlir və xərc\n3. Divar əşyalarının bərkidilməsi və bərkitmə yerlərinin təmiri texnologiyası\n4. Qapı kilidlərinin növləri, quruluşu və quraşdırılması\n5. Sanitar-texniki avadanlıqların sadə təmiri\n6. Meyvə ağaclarının əkilməsi və meyvələrin saxlanma texnologiyası\nII.Oduncağın emalı texnologiyası\n7. Oduncağın tədarükü və mişar materiallarının istehsalı\n8. Məmulatların konstruksiya edilməsi. Düzbucaqlı və müxtəlif formalı detalların çertyoju\n9. Tirciklərin birləşdirilməsi\n10. Əl alətləri ilə silindrik və konusşəkilli detalların hazırlanması\n11. Oduncaq və metal məmulatların bəzədilməsi\nIII.Metalların emalı texnologiyası\n12. Metal pəstahlann kəsilməsi\n13. Metal pəstahların yeyələnməsi. Ştangenpərgar\n14. Mexanikləşdirilmiş əl alətləri\n15. Elektrik enerjisinin ötürülməsi və istifadəsi yolları\n16. Sadə elektrik dövrəsi\n17. Detallann lehimləmə ilə birləşdirilməsi\nIV. Ərzaq məhsullarının emalı texnologiyası\n18. Mexanikləşdirilmiş mətbəx avadanlığının quruluşu və iş prinsipi\n19. İnsan həyatmda qida məhsulları\n20. Südlü xörəklərin hazırlanma texnologiyası\n21. Yarmadan, paxlalı bitkilərdən və makaron məmulatlarından xörəklərin hazırlanma texnologiyası\n22. Duru xəmirdən məmulatların hazırlanma texnologiyası\n23. Tərəvəz xörəklərinin hazırlanma texnologiyası\nV. Parçanın emalı texnologiyası və naxıştikmə\n24. Məişət tikiş maşınının quruluşu\n25. Tikiş maşınının işə hazırlunması\n26. Tikiş maşınında əməliyyatlar\n27. Naxıştikmə üçün alət və tərtibatlar. Hesab naxıştikməsinə hazırlıq\n28. Geyimin təmiri texnologiyası"
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
print("textbooks.json updated successfully for Phase 3.")
