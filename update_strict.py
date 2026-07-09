import json
import re

with open('scripts/manual-topics.json', 'r', encoding='utf-8') as f:
    topics_db = json.load(f)

raw_data = {
"azerbaycan-dili-3-h1": """
1 FƏRD VƏ TOPLUM
1 • DÜRÜSTLÜK
2 • DOSTLUQ
3 • MƏRHƏMƏT
4 • MƏSULİYYƏT
5 • NİKBİNLİK
Ümumiləşdirici təkrar
2 DÜNYAMIZI TANIYAQ
1 • BİZ AZƏRBAYCANLIYIQ
2 • DÜNYA XALQLARI
3 • TARİXİ ABİDƏLƏR
4 • MİLLİ BAYRAMLAR
5 • SƏYAHƏT
Ümumiləşdirici təkrar
3 QƏRİBƏ HEYVANLAR
1 • MAMONT VƏ FİL
2 • NADİR MEŞƏ HEYVANLARI
3 • MANQUST
4 • ANTARKTİDA SAKİNLƏRİ
5 • DELFİN
Ümumiləşdirici təkrar
4 TƏBİİ FƏLAKƏTLƏR
1 • SEL
2 • MEŞƏ YANĞINLARI
3 • DƏNİZDƏ FIRTINA
4 • SUNAMİ
5 • DAŞQIN
Ümumiləşdirici təkrar
""",

"azerbaycan-dili-3-h2": """
5 İXTİRALAR
1 • ZƏKAVƏ İXTİRA
2 • ƏN MÜHÜM İXTİRA
3 • İXTİRAÇI UŞAQLAR
4 • ÖZÜN DÜZƏLT
5 • RƏQƏMLƏRİN TARİXİ
Ümumiləşdirici təkrar
6 UNUDULMAZ QƏHRƏMANLAR
1 • HÜNƏR GÖSTƏR, AD QAZAN
2 • EL İGİDLƏRİ İLƏ TANINAR
3 • İGİD DÖYÜŞDƏ BƏLLİ OLAR
4 • QƏHRƏMANLAR UNUDULMUR
5 • MÖHTƏŞƏM DÖNÜŞ
Ümumiləşdirici təkrar
7 ODLAR YURDU
1 • ODLAR OĞLU
2 • GÖYÇƏ GÖLÜ
3 • AZƏRBAYCAN MUSİQİSİ
4 • QIZ QALASI
5 • AZƏRBAYCAN QALALARI
Ümumiləşdirici təkrar
8 HİKMƏT XƏZİNƏSİ
1 • ƏMƏKSEVƏRLİK
2 • NƏSİHƏT
3 • BİRLİK
4 • YUMOR VƏ HİKMƏT
5 • MƏHARƏT
Ümumiləşdirici təkrar
""",

"hayat-bilgisi-3": """
1 MƏN VƏ CƏMİYYƏT
1. Hüquqlarımız
2. Müsbət keyfiyyətlərimiz
3. Eşitmək və dinləmək
4. Biz və dostlarımız
5. Birlikdə yaşamaq
6. Milli birlik
Ümumiləşdirici tapşırıqlar
2 İNSAN VƏ SAĞLAMLIQ
7. Canlılar və fosillər
8. Bədən üzvləri
9. Skelet və əzələlər
10. Sağlamlıq və qidalanma
11. Qida məhsulları
12. Xəstəlik və sağlamlıq
Ümumiləşdirici tapşırıqlar
3 YER VƏ AY
13. Yer kürəsi və Ay
14. Yerin fırlanması
15. İşıq və kölgə
16. Kölgənin yerini dəyişməsi
Ümumiləşdirici tapşırıqlar
4 MATERİALLAR VƏ XASSƏLƏRİ
17. Materialların xassələri
18. Materialların istifadəsi
19. İstilik və temperatur
20. İstiliyi yaxşı və pis keçirən materiallar
Ümumiləşdirici tapşırıqlar
5 BAYRAMLAR VƏ QƏNAƏT
21. Bayramlar
22. 28 May
23. Ehtiyaclarımız və istəklərimiz
Ümumiləşdirici tapşırıqlar
6 TƏHLÜKƏSİZLİK VƏ QAYDALAR
24. Təbii fəlakətlər
25. Diqqətli və ehtiyatlı olaq
26. Təhlükəsizlik nişanları
27. Danışan nişanlar
Ümumiləşdirici tapşırıqlar
Lüğət
""",

"riyaziyyat-3-h1": """
1 Ədədlər (1000-ə qədər)
1. Üçrəqəmli ədədlər
2. Ədədin yazılış formaları
3. Ədədlərin müqayisəsi və sıralama
4. Yuvarlaqlaşdırma
2 Toplama (1000-ə qədər)
5. Üçrəqəmli ədədlərin toplanması
6. Üçrəqəmli ədədlərin toplanması (yeni onluğun yaranması)
7. Üçrəqəmli ədədlərin toplanması (yeni yüzlüyün yaranması)
8. Üçrəqəmli ədədlərin toplanması (yeni onluq və yüzlüyün yaranması)
9. Üç və daha çox ədədin toplanması
10. Toplamanın digər üsulları
3 Çıxma (1000-ə qədər)
11. Üçrəqəmli ədədlərin çıxılması
12. Üçrəqəmli ədədlərin çıxılması (onluğun ayrılması)
13. Üçrəqəmli ədədlərin çıxılması (yüzlüyün ayrılması)
14. Üçrəqəmli ədədlərin çıxılması (onluq və yüzlüyün ayrılması)
15. Çıxmanın digər üsulları
16. Təqribi toplama və çıxma
4 Vurma və bölmə
17. 6-ya və 7-yə vurma
18. 8, 9 və 10-a vurma
19. 2, 3, 4 və 5-ə bölmə
20. 6-ya və 7-yə bölmə
21. 8, 9 və 10-a bölmə
22. Məchulun tapılması
5 Riyazi ifadələr. Tənlik
23. Əməllər ardıcıllığı
24. Dəyişəni olan ifadələr
25. Tənlik
1-ci yarımil üzrə ümumiləşdirici tapşırıqlar
""",

"riyaziyyat-3-h2": """
6 Həndəsi fiqurlar
26. Kəsişən və paralel düz xətlər
27. Müstəvi fiqurlar
28. Simmetriya və yerdəyişmə
29. Fəza fiqurları
30. Müstəvi və fəza fiqurlarının əlaqəsi
7 Vurma və bölmə
31. Vurmanın xassələri
32. İkirəqəmli ədədin birrəqəmli ədədə vurulması
33. Üçrəqəmli ədədin birrəqəmli ədədə vurulması
34. Qalıqlı bölmə
35. İkirəqəmli ədədin birrəqəmli ədədə bölünməsi
36. Üçrəqəmli ədədin birrəqəmli ədədə bölünməsi
37. Vurma və bölmənin digər üsulları
8 Kəsrlər
38. Tam və bərabər hissələr. Kəsr
39. Ədədin hissəsi
40. Kəsrlərin müqayisəsi
9 Ədədlər (10 000-ə qədər) Pullar
41. Dördrəqəmli ədədlər
42. Pullarla hesablamalar
43. Gəlir, xərc, qazanc
10 Ölçmə
44. Uzunluq
45. Perimetr və sahə
46. Kütlə
47. Tutum
48. Saat
11 Məlumatların təsviri. Hadisələr
49. Xətti diaqram
50. Hadisələr
51. Məlumatların təsviri.Praktik dərs
3-cü sinif üzrə ümumiləşdirici tapşırıqlar
""",

"informatika-3": """
1 İNFORMASİYA
1. İNSAN VƏ İNFORMASİYA
2. TƏBİƏTDƏ İNFORMASİYA
3. İNFORMASİYA PROSESLƏRİ
4. İNFORMASİYANIN ÖTÜRÜLMƏSİ
5. İNFORMASİYANIN KODLAŞDIRILMASI
6. REBUS
7. İNFORMASİYANIN EMALI
2 ALQORİTM
8 OBYEKTLƏR QRUPU
9 OBYEKTİN FƏRQLƏNDİRİCİ ƏLAMƏTLƏRİ
10 “HAMISI”, “HEÇ BİRİ”, “BƏZİSİ”
11 QANUNAUYĞUNLUQ
12. ALQORİTM
13. XƏTTİ ALQORİTM
14. BUDAQLANMA
15. MƏQSƏDƏUYĞUN YOLUN SEÇİLMƏSİ
16. TƏKRARLANAN HƏRƏKƏTLƏR
3 KOMPÜTER
17. KOMPÜTER VƏ İNFORMASİYA
18. İŞ MASASI
19. QOVLUQ
20. PAINT PROQRAMI
21. PALİTRA
22. ŞƏKLİN FRAQMENTİ İLƏ İŞ
23. ŞƏKİLLƏRİN KOMPÜTERDƏ SAXLANMASI
24. WORDPAD PROQRAMI
25. MƏTNLƏRLƏ İŞ
26. MƏTNƏ ŞƏKLİN ƏLAVƏ EDİLMƏSİ
27. MƏTNDƏ SÖZLƏRİN ƏVƏZ OLUNMASI
28. KOMPÜTERDƏ HESABLAMALARIN APARILMASI
""",

"texnologiya-3": """
1. Texnoloji vasitələr
1.Texnologiya bizim əhatəmizdə. Əmək alətləri
2.Kəsici və deşici alətlərlə iş
3.Detalları nişanlama qaydaları. Pərgar vasitəsilə nişanlama
2. Məişət mədəniyyəti
4.Özünəxidmət. Sanitariya-gigiyena qaydaları
5.Bitkilər və onların insan sağlamlığında rolu
6.Səhər süfrəsi. Nahar süfrəsi
7.Şam süfrəsi. Yemək masası arxasında davranış qaydaları
3. Plastilindən yapma işləri
8.Plastilindən səkkizayaqlı ilbiz
9.Plastilindən tank
10.Plastilindən zebr
4. Aplikasiya işləri
11.Kağız zolaqlardan çiçək aplikasiyası
12.Heyvan siluetləri. Panda
13.Simmetrik naxışkəsmə
14.Qar dənəciyi aplikasiyasının hazırlanması
15.Həndəsi fiqurlardan aplikasiya. Məzəli köpək
5. Mozaika işləri
16.Rəngli kağızlardan Azərbaycan bayrağı mozaikası
17.Plastilindən xarıbülbül mozaikası
18.Muncuqdan tovuzquşu mozaikası
19.Pambıqlı çöplərdən quzu mozaikası
6. Kağızqatlama
20.Kağız fırlanğıc
21.Kağız modullardan ürəkşəkilli çərçivə
22.Kağızı qatlayırıq və kəsirik. Mamont fiquru
7. İpliklə iş
23.“Kənar” və “ilgək” tikişləri
24.İplikdən “Şən aslan” oyuncağı
25.Hərəkətli detalları olan oyuncaqlar. Şən ayı balası
8. Texnoloji maşınlar və yeraltı nəqliyyat vasitələri
26.Texnoloji maşınlar. Yerüstü və yeraltı nəqliyyat vasitələri
27.Nəqledici maşınlar. Hava nəqliyyatı.Su nəqliyyatı
28.Məişət avadanlığı. Elektron maşınlar
""",

"ingilis-dili-3": """
Scope and Sequence
Welcome
Unit 1
Unit 2
Unit 3
Unit 4
Unit 5
Unit 6
Unit 7
Unit 8
""",

"rus-dili-esas-3": """
1.ПУТЕШЕ́СТВИЕ В МИР ЗНА́НИЙ
Уро́к 1 Бу́квы А, М
Уро́к 2.Бу́квы П, К
Уро́к 3.Бу́квы Н, О
Уро́к 4.Бу́квы Д, Т
2.ОТ БУ́КВЫ К СЛО́ВУ
Уро́к 5.Бу́квы И, Й
Уро́к 6.Бу́квы У, Р
Уро́к 7.Бу́квы В, Ы
Уро́к 8.Бу́квы Л, С
Уро́к 9.Бу́квы Ж, 3
3.ЧТЕ́НИЕ - ВОТ ЛУ́ЧШЕЕ УЧЕ́НИЕ
Уро́к 10.Бу́квы Е, Ё
Уро́к 11.Бу́квы Б, Г
Уро́к 12.Бу́квы ъ, ь
Уро́к 13.Бу́квы Ш, Щ
4.ЗНА́НИЕ - ГЛАЗА́ ЧЕЛОВЕ́КА
Уро́к 14.Бу́квы Ч, Ц
Уро́к 15.Бу́квы Э, Ю.
Уро́к 16.Бу́квы Х, Ф
Уро́к 17.Бу́квы Я
5.ПУТЕШЕ́СТВИЕ В МИР СКА́ЗОК
Уро́к 18.Бу́квы ́Азбука - к му́дрости ступе́нька
Уро́к 19.Бу́квы Ре́пка
Уро́к 20.Бу́квы Глу́пая лис́а
6.ВОЛШЕ́БНЫЙ МИР СКА́ЗОК
Уро́к 21.Бу́квы Теремо́к
Уро́к 22.Бу́квы Семь грана́товых пру́тьев
""",

"alman-dili-esas-3": """
Lektion 1. Was ist das? Wer ist das?
Lektion 2. Wer bist du? Wie heißt du?
Lektion 3. Die Zahlen und die Farben
Lektion 4. Wie alt bist du?
Lektion 5. Wie geht' s?
Lektion 6. Meine Schulsachen
Lektion 7. In der Schule. Mein Klassenzimmer
Lektion 8. In der Schule. In der Pause
Lektion 9. Meine Familie
Lektion 10. Berufe
Lektion 11. Unsere Wohnung. Die Zimmer
Lektion 12. Unsere Wohnung. Die Möbel
Lektion 13. Essen und Trinken
Wortliste
""",

"fransiz-dili-esas-3": """
Module 1
Leçon 1. Mon alphabet
Leçon 2. Comment t'appelles-tu?
Leçon 3. Quel âge as-tu?
Leçon 4. Ça va très bien!
Module 2
Leçon 1. Mon alphabet
Leçon 2. Je présente ma famille
Leçon 3. Mes parents
Leçon 4. Chez mon oncle
Module 3
Leçon 1. Mon alphabet
Leçon 2. Ma classe
Leçon 3. Dans mon cartable
Leçon 4. J'aime le français et toi?
Module 4
Leçon 1. Mon alphabet
Leçon 2. Notre jardin
Leçon 3. Des vitamines
Leçon 4. Le supermarché
Module 5
Leçon 1. Mon alphabet
Leçon 2. Les quatre saisons
Leçon 3. Bon anniversaire!
Leçon 4. Il fait beau aujourd'hui
Module 6
Leçon 1. Les drapeaux
Leçon 2. Les enfants différents
Leçon 3. Mes amis
Leçon 4. Hourraa! Je lis en français
Bilan
Mon dictionnaire sonore
Jeux
"""
}

def parse_strict(key, text):
    lines = [l.strip() for l in text.strip().split('\n') if l.strip()]
    groups = []
    
    if key in ["ingilis-dili-3", "alman-dili-esas-3"]:
        cg = {"chapter": "Mövzular", "topics": []}
        for l in lines:
            title = re.sub(r'^Lektion\s+\d+\.\s*', 'Lektion ', l).strip()
            cg["topics"].append({"title": title, "page": len(cg["topics"])+1, "path": ""})
        return [cg]
    
    cg = None
    for line in lines:
        if line.lower() == 'mövzular': continue
        
        is_chapter = False
        if key in ["azerbaycan-dili-3-h1", "azerbaycan-dili-3-h2", "hayat-bilgisi-3", "riyaziyyat-3-h1", "riyaziyyat-3-h2", "informatika-3"]:
            # Correct chapter regex for informatika and others. It should be "number [SPACE] UPPERCASE_LETTERS"
            if re.match(r'^\d+\s+[A-ZƏÖĞIİŞÇÜ]', line):
                is_chapter = True
        elif key == "texnologiya-3":
            if re.match(r'^\d+\.\s+[A-ZƏÖĞIİŞÇÜa-zəöğıişçü]', line) and not line.startswith("1.Texnologiya"):
                if line.split('.')[1].startswith(' '):
                    is_chapter = True
        elif key == "rus-dili-esas-3":
            if re.match(r'^\d+\.[А-Я]', line):
                is_chapter = True
        elif key == "fransiz-dili-esas-3":
            if line.startswith("Module"):
                is_chapter = True

        if is_chapter:
            if cg and len(cg["topics"]) > 0: 
                groups.append(cg)
            cg = {"chapter": line, "topics": []}
        else:
            if not cg: cg = {"chapter": "Mövzular", "topics": []}
            title = re.sub(r'^(\d+[\.\•]\s*|Уро́к\s+\d+\.?|Leçon\s+\d+\.?\,?\s*)', '', line).strip()
            if line.startswith("Ümumiləşdirici") or line == "Sözlük" or line == "Lüğət":
                title = line
                
            # Extra cleanup specifically for informatika 3, lines starting with 8, 9, 10, 11 (no dot)
            title = re.sub(r'^\d+\s+', '', title).strip()
            
            cg["topics"].append({"title": title, "page": len(cg["topics"])+1, "path": ""})
            
    if cg and len(cg["topics"]) > 0: 
        groups.append(cg)
    return groups

for k, txt in raw_data.items():
    topics_db[k] = parse_strict(k, txt)

with open('scripts/manual-topics.json', 'w', encoding='utf-8') as f:
    json.dump(topics_db, f, indent=2, ensure_ascii=False)

print("Topics FIXED in manual-topics.json")
