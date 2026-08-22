# 💻 İnformatika 3 (3-cü Sinif) — Tam Dərin Analiz və Diaqnostika Hesabatı

**Hesabat Tarixi:** 22 Avqust 2026  
**Fənn:** İnformatika (Rəqəmsal bacarıqlar) 3-cü sinif  
**Standart:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin Milli Kurikulumu və Dərslik Standartları  
**Hədəf Keyfiyyət Səviyyəsi:** Gold Standard 4.1 (100% Dərslik İnteqrasiyası, 100% Variant Simmetriyası, 25% Balanslaşdırılmış Cavab Açarları)

---

## 1. Mövcud Baza Vəziyyətinin Audit və Diaqnostikası

Platformanın test bazasında (`offline_tests.json`) və layihə mühitində **İnformatika 3** üzrə aparılan dərin texniki diaqnostikanın nəticələri:

### 🔍 Diaqnostik Audit Göstəriciləri

| Göstərici | Mövcud Vəziyyət | Gold Standard 4.1 Tələbi | Kəsir / Uyğunsuzluq |
| :--- | :---: | :---: | :--- |
| **Məlumat Strukturu** | `Array` (Düz siyahı) | `Dictionary` (Mövzu açarlı obyekt) | Standart arxitekturaya uyğunlaşdırılmalıdır |
| **Bölmə Əhatəsi** | Natamam (yalnız I yarımilin ilk mövzuları) | **8 Tam Bölmə** (I və II Yarımil) | Kompüter qurğuları, ƏS, Paint, Mətn redaktoru, Alqoritmlər çatışmır |
| **Mövzu Sayı** | Cəmi 7 natamam mövzu | **48 Standart Mövzu** (Hər bölmədə 6 mövzu) | 41 rəsmi mövzu tamamilə yoxdur |
| **Ümumi Sual Sayı** | **105 Sual** | **720 Sual** ($48 \times 15$) | **615 sual çatışmır (85.42% kəsir)** |
| **Mövzu Başına Sual** | 15 sual (yalnız 7 mövzuda) | **Hər 48 mövzuda sabit 15 sual** | İlin əsas proqramı bazada əks olunmayıb |
| **Variant Simmetriyası** | Qeyri-bərabər uzunluqlar | **100% Simmetrik** ($\pm 10-15\%$) | Şagird cavabı uzunluğuna görə təxmin edə bilir |
| **Cavab Açarları Balansı** | Təsadüfi paylanma | **Dəqiq 25%** (180 A, 180 B, 180 C, 180 D) | Şagirdin təxmin etmə ehtimalı yüksəkdir |
| **Pedaqoji İzahlar** | Qısa | **Dərslik səhifəsinə istinadlı addım-addım izah** | Metodik və alqoritmik əsaslandırma vacibdir |

---

## 2. 3-cü Sinif İnformatika Məzmun Xətləri və Təlim Standartları

Azərbaycan Respublikası Elm və Təhsil Nazirliyinin 3-cü sinif İnformatika və Rəqəmsal Bacarıqlar kurikulumu 4 əsas məzmun xətti üzərində qurulmuşdur:

```
                               ┌─────────────────────────────────────────┐
                               │         3-CÜ SİNİF İNFORMATİKA          │
                               │           MƏZMUN XƏTLƏRİ                │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌──────────────────┬───────────────────────┴───────────────────────┬──────────────────┐
         │                  │                                               │                  │
         ▼                  ▼                                               ▼                  ▼
┌─────────────────┐┌─────────────────┐                            ┌───────────────────┐┌─────────────────┐
│ 1. İNFORMASİYA  ││  2. KOMPÜTER VƏ │                            │ 3. PROQRAM TƏMİNATI││ 4. ALQORİTMLƏR │
│ VƏ PROSESLƏR    ││   QURĞULAR      │                            │  (QRAFİK VƏ MƏTN) ││ VƏ KODLAŞDIRMA  │
├─────────────────┤├─────────────────┤                            ├───────────────────┤├─────────────────┤
│• Növləri/Duyğular││• Əsas qurğular │                            │• ƏS və İş masası  ││• Komandalar     │
│• Qəbul, ötürmə  ││• Daxiletmə/     │                            │• Fayl və Qovluq   ││• Xətti alqoritm │
│• Saxlama, daşıy.││  xaricetmə      │                            │• Paint alətləri   ││• Budaqlanan/şərt│
│• Emal və kodlaş.││• Yaddaş növləri │                            │• Mətn redaktoru   ││• Dövri alqoritm │
│• Rebus/şifrələr ││• Təhlükəsizlik  │                            │• Klaviatura/Şrift ││• İnternet/Təhlük│
└─────────────────┘└─────────────────┘                            └───────────────────┘└─────────────────┘
```

---

## 3. Bölmələr və 48 Standart Mövzunun Tam Xəritəsi (I və II Yarımil)

Hər bölmə 6 mövzudan və hər mövzu 15 xüsusi hazırlanmış Gold Standard test sualından ibarət olmaqla ümumilikdə **720 suallıq** kamil arxitektura:

### 📘 I YARIMİL (BÖLMƏ 1 – 4: 24 Mövzu / 360 Sual)

#### 🔸 BÖLMƏ 1: İnformasiya və Duyğu Üzvlərimiz (6 Mövzu / 90 Sual)
1. **İNFORMASİYA VƏ PROSESLƏR - İnformasiya nədir və duyğu üzvlərimiz** *(Görmə, eşitmə, dad, qoxu, toxunma informasiyaları)*
2. **İNFORMASİYA VƏ PROSESLƏR - İnformasiyanın təqdimolunma formaları** *(Mətn, ədədi, qrafik, səs və video informasiya)*
3. **İNFORMASİYA VƏ PROSESLƏR - Təbiətdə və cəmiyyətdə informasiya** *(Canlıların informasiya mübadiləsi, siqnallar və işarələr)*
4. **İNFORMASİYA VƏ PROSESLƏR - Dəqiq, tam və faydalı informasiya anlayışı** *(İnformasiyanın xassələri və etibarlılığı)*
5. **İNFORMASİYA VƏ PROSESLƏR - İnformasiya mənbəyi və qəbuledicisi** *(Mənbə, rabitə kanalı və qəbuledici zənciri)*
6. **İNFORMASİYA VƏ PROSESLƏR - 1-ci Bölmə üzrə ümumiləşdirici təkrar** *(Kompleks məntiqi və situativ testlər)*

#### 🔸 BÖLMƏ 2: İnformasiya Prosesləri və Kodlaşdırma (6 Mövzu / 90 Sual)
7. **İNFORMASİYA PROSESLƏRİ - İnformasiyanın saxlanması və daşıyıcılar** *(Qədim daşlar, perqament, kitab, disk, fleş-kart)*
8. **İNFORMASİYA PROSESLƏRİ - İnformasiyanın ötürülməsi və rabitə** *(Telefon, teleqraf, poçt, radio və internet)*
9. **İNFORMASİYA PROSESLƏRİ - İnformasiyanın emalı və axtarışı** *(Məsələ həlli, tərcümə, çeşidləmə və axtarış prosesi)*
10. **İNFORMASİYA PROSESLƏRİ - Kodlaşdırma və şifrələmə üsulları** *(Morze əlifbası, işarələr, rəqəmli kodlar və gizli yazılar)*
11. **İNFORMASİYA PROSESLƏRİ - Rebuslar və məntiqi tapmacalar** *(Şəkilli rebuslar, kompozisiya qaydaları və həll yolları)*
12. **İNFORMASİYA PROSESLƏRİ - 2-ci Bölmə üzrə ümumiləşdirici təkrar** *(İnformasiya prosesləri üzrə möhkəmləndirmə)*

#### 🔸 BÖLMƏ 3: Kompüterin Quruluşu və Təhlükəsizlik (6 Mövzu / 90 Sual)
13. **KOMPÜTER VƏ QURĞULAR - Kompüterin əsas qurğuları** *(Sistem bloku, monitor, klaviatura, siçan və onların rolu)*
14. **KOMPÜTER VƏ QURĞULAR - İnformasiyanı daxiledən qurğular** *(Klaviatura, siçan, mikrofon, skaner, veb-kamera, coystik)*
15. **KOMPÜTER VƏ QURĞULAR - İnformasiyanı xaricedən qurğular** *(Monitor, printer, proyektor, səs ucaldan və qulaqlıq)*
16. **KOMPÜTER VƏ QURĞULAR - Yaddaş qurğuları və daşıyıcılar** *(Əməli yaddaş, sərt disk (HDD/SSD), fleş-kart, optik disk)*
17. **KOMPÜTER VƏ QURĞULAR - Kompüter otağında təhlükəsizlik və erqonomika** *(Elektrik təhlükəsizliyi, düzgün oturuş, göz gimnastikası)*
18. **KOMPÜTER VƏ QURĞULAR - 3-cü Bölmə üzrə ümumiləşdirici təkrar** *(Aparat təminatı və texniki savadlılıq)*

#### 🔸 BÖLMƏ 4: Əməliyyat Sistemi və Fayl İdarəetməsi (6 Mövzu / 90 Sual)
19. **ƏMƏLİYYAT SİSTEMİ - Əməliyyat sistemi və İş masası (Desktop)** *(Windows mühiti, piktoqramlar, tapşırıqlar paneli, «Start» menyusu)*
20. **ƏMƏLİYYAT SİSTEMİ - Pəncərələr və idarəetmə düymələri** *(Pəncərənin quruluşu, bükmək, böyütmək və bağlamaq düymələri)*
21. **ƏMƏLİYYAT SİSTEMİ - Fayl və Qovluq (Folder) anlayışı** *(Faylın adı və genişlənməsi, qovluqların strukturu və rolu)*
22. **ƏMƏLİYYAT SİSTEMİ - Fayl və qovluqlar üzərində əməliyyatlar** *(Yaratmaq, adını dəyişmək, nüsxələmək, köçürmək və silmək)*
23. **ƏMƏLİYYAT SİSTEMİ - Zibil qutusu (Recycle Bin) və bərpa** *(Silinmiş faylların müvəqqəti saxlanması və geri qaytarılması)*
24. **ƏMƏLİYYAT SİSTEMİ - 4-cü Bölmə üzrə ümumiləşdirici təkrar** *(Fayl sistemi və kompüter savadlılığı)*

---

### 📙 II YARIMİL (BÖLMƏ 5 – 8: 24 Mövzu / 360 Sual)

#### 🔸 BÖLMƏ 5: Qrafik Redaktor (Paint) və Rəqəmsal Rəsm (6 Mövzu / 90 Sual)
25. **QRAFİK REDAKTOR - Paint proqramının pəncərəsi və alətlər paneli** *(Başlıq zolağı, menyu lenti, rəsm kətanı və miqyas)*
26. **QRAFİK REDAKTOR - Əsas rəsm alətləri** *(Qələm, fırçalar, rəng qutusu (doldurma), pozan və rəngseçən)*
27. **QRAFİK REDAKTOR - Həndəsi fiqurların çəkilməsi və rənglənməsi** *(Düz xətt, düzbucaqlı, çevrə, ulduz, kontur və daxili rənglər)*
28. **QRAFİK REDAKTOR - Şəkil fraqmentləri ilə iş** *(Düzbucaqlı və sərbəst seçmə, kəsmək, nüsxələmək, yapışdırmaq)*
29. **QRAFİK REDAKTOR - Şəkillərin döndərilməsi, əyilməsi və mətn əlavəsi** *(90/180 dərəcə fırlatma, güzgü əksi, mətn aləti)*
30. **QRAFİK REDAKTOR - 5-ci Bölmə üzrə ümumiləşdirici təkrar** *(Kompüter qrafikası və yaradıcılıq bacarıqları)*

#### 🔸 BÖLMƏ 6: Mətn İnformasiyası və Klaviatura Vərdişləri (6 Mövzu / 90 Sual)
31. **MƏTN REDAKTORU - Mətn redaktorları (WordPad / Bloknot)** *(Mətn pəncərəsi, kursor, sətir və abzas anlayışları)*
32. **MƏTN REDAKTORU - Klaviatura qrupları və əsas idarəetmə düymələri** *(Hərf-rəqəm, Enter, Boşluq (Space), Backspace, Delete)*
33. **MƏTN REDAKTORU - Böyük hərflər, durğu işarələri və Shift** *(Caps Lock, Shift ilə yuxarı simvollar, nöqtə və vergül)*
34. **MƏTN REDAKTORU - Mətnin formatlanması və şriftlər** *(Şrift növü, ölçüsü, rəngi, qalın (Bold), maili (Italic), xətli (Underline))*
35. **MƏTN REDAKTORU - Sənədin yaddaşda saxlanması və çapı** *(Faylı yaddaşa yazmaq (Save), açmaq (Open) və çapa vermək)*
36. **MƏTN REDAKTORU - 6-cı Bölmə üzrə ümumiləşdirici təkrar** *(Mətn hazırlama və klaviatura mədəniyyəti)*

#### 🔸 BÖLMƏ 7: Alqoritmlər və Proqramlaşdırmanın İlkin Əsasları (6 Mövzu / 90 Sual)
37. **ALQORİTM VƏ PROQRAMLAŞDIRMA - Alqoritm nədir? Addımlar ardıcıllığı** *(Alqoritm anlayışı, gündəlik həyat alqoritmləri və xassələri)*
38. **ALQORİTM VƏ PROQRAMLAŞDIRMA - İcraçı və komandalar sistemi** *(İcraçı kimdir? Komandalar sistemi və icra mühiti)*
39. **ALQORİTM VƏ PROQRAMLAŞDIRMA - Xətti alqoritmlər** *(Addım-addım ardıcıl yerinə yetirilən əmrlər)*
40. **ALQORİTM VƏ PROQRAMLAŞDIRMA - Budaqlanan alqoritmlər** *(«Əgər ... onda ... əks halda» şərtləri və qərarvermə)*
41. **ALQORİTM VƏ PROQRAMLAŞDIRMA - Dövri alqoritmlər** *(Təkrarlanan əməliyyatlar və dövr komandaları)*
42. **ALQORİTM VƏ PROQRAMLAŞDIRMA - 7-ci Bölmə üzrə ümumiləşdirici təkrar** *(Alqoritmik düşüncə və məntiq)*

#### 🔸 BÖLMƏ 8: İnternet, Şəbəkə və İlin Yekun Təkrarı (6 Mövzu / 90 Sual)
43. **İNTERNET VƏ TƏHLÜKƏSİZLİK - İnternet şəbəkəsi və Veb-brauzerlər** *(Veb-sayt, ünvan zolağı, brauzer proqramları və naviqasiya)*
44. **İNTERNET VƏ TƏHLÜKƏSİZLİK - Axtarış sistemləri və faydalı məlumat axtarışı** *(Axtarış sözləri, açar sözlər və etibarlı saytlar)*
45. **İNTERNET VƏ TƏHLÜKƏSİZLİK - Rəqəmsal etika (Netiket) və kibertəhlükəsizlik** *(Fərdi məlumatların qorunması, güclü şifrələr, zərərli linklər)*
46. **İNTERNET VƏ TƏHLÜKƏSİZLİK - Scratch mühitində vizual bloklarla iş** *(Səhnə, sprit (personaj), bloklar və sadə animasiyalar)*
47. **İNTERNET VƏ TƏHLÜKƏSİZLİK - 3-cü Sinif İlin Yekun Təkrarı (İnteqrativ Sınaq 1)** *(Bütün ilin rəqəmsal bacarıqlar sınağı)*
48. **İNTERNET VƏ TƏHLÜKƏSİZLİK - 3-cü Sinif İlin Yekun Təkrarı (İnteqrativ Sınaq 2)** *(Kompleks nəzəri və praktiki imtahan)*

---

## 4. Test Suallarının Pedaqoji və Texniki Tələbləri (Gold Standard 4.1)

1. **Məzmun və Terminoloji Dəqiqlik:**  
   Bütün kompüter terminləri, qurğuların təyinatı, alqoritmik qanunauyğunluqlar dərslik proqramına tam uyğun olmalıdır.
2. **100% Variant Uzunluq və Quruluş Simmetriyası:**  
   Bütün 4 variant ($A, B, C, D$) eyni qrammatik strukturda və simmetrik uzunluqda ($\pm 10-15\%$) tərtib ediləcək. Şagird variantın uzunluğuna görə cavabı təxmin edə bilməz.
3. **Məntiqi Çəkindiricilər (Plauzibil Distraktorlar):**  
   Yanlış variantlar şagirdlərin kompüter istifadəsində etdiyi tipik xətalara və yanlış təsəvvürlərə əsaslanmalıdır.
4. **Dəqiq 25% Balanslaşdırılmış Cavab Açarları:**  
   Bütün 720 sual üzrə variantlar bərabər paylanacaq:
   $$\text{A: 180}, \quad \text{B: 180}, \quad \text{C: 180}, \quad \text{D: 180}$$
5. **Addım-Addım İzah:**  
   Hər sualın altında dərslik səhifəsinə istinadla aydın alqoritmik və texniki izahat veriləcək.

---

## 5. Tətbiq və İcra Planı (Roadmap)

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   MƏRHƏLƏ 1 (BÖLMƏ 1-2) │───>│   MƏRHƏLƏ 2 (BÖLMƏ 3-4) │───>│   MƏRHƏLƏ 3 (BÖLMƏ 5-6) │
│  • İnformasiya və Duyğu │    │  • Kompüter və Qurğular │    │  • Paint Qrafik Redaktor│
│  • Proseslər və Kodlaşma│    │  • Əməliyyat Sistemi/Fay│    │  • Mətn və Klaviatura   │
│  • 12 Mövzu / 180 Sual  │    │  • 12 Mövzu / 180 Sual  │    │  • 12 Mövzu / 180 Sual  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
                                                                           │
                                                                           ▼
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   YEKUN İNTEQRASİYA     │<───│   MƏRHƏLƏ 4 (BÖLMƏ 7-8) │<───┘                         │
│  • JSON Baza yenilənməsi│    │  • Alqoritmlər / Scratch│                              │
│  • Markdown ixracı      │    │  • İnternet və İlin Yeku│                              │
│  • 720 Sual / 100% Tam  │    │  • 12 Mövzu / 180 Sual  │                              │
└─────────────────────────┘    └─────────────────────────┘                              
```
