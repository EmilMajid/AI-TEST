# 📐 Riyaziyyat 3 (3-cü Sinif) — Tam Dərin Analiz və Diaqnostika Hesabatı

**Hesabat Tarixi:** 22 Avqust 2026  
**Fənn:** Riyaziyyat 3-cü sinif  
**Standart:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin Milli Kurikulumu və Dərslik Standartları  
**Hədəf Keyfiyyət Səviyyəsi:** Gold Standard 4.1 (100% Dərslik İnteqrasiyası, 100% Variant Simmetriyası, 25% Balanslaşdırılmış Cavab Açarları)

---

## 1. Mövcud Baza Vəziyyətinin Audit və Diaqnostikası

Platformanın test bazasında (`offline_tests.json`) və layihə mühitində **Riyaziyyat 3** üzrə aparılan dərin texniki diaqnostikanın nəticələri:

### 🔍 Diaqnostik Audit Göstəriciləri

| Göstərici | Mövcud Vəziyyət | Gold Standard 4.1 Tələbi | Kəsir / Uyğunsuzluq |
| :--- | :---: | :---: | :--- |
| **Məlumat Strukturu** | `Array` (Düz siyahı) | `Dictionary` (Mövzu açarlı obyekt) | Digər siniflərlə arxitektura uyğunsuzluğu |
| **Bölmə Əhatəsi** | Qeyri-müəyyən (qarışıq) | **8 Tam Bölmə** (I və II Yarımil) | II yarımil mövzularının 70%-i natamamdır |
| **Mövzu Sayı** | ~29 dağınıq mövzu | **48 Standart Mövzu** (Hər bölmədə 6 mövzu) | 19 rəsmi mövzu tamamilə yoxdur |
| **Ümumi Sual Sayı** | **388 Sual** | **720 Sual** ($48 \times 15$) | **332 sual çatışmır** |
| **Mövzu Başına Sual** | 1 ilə 30 arasında dəyişkən | **Hər mövzuda sabit 15 sual** | Bəzi mövzularda cəmi 1-2 sual var |
| **Variant Simmetriyası** | Zəif (vizual fərqlər var) | **100% Simmetrik** ($\pm 10-15\%$) | Cavablar vizual olaraq seçilir |
| **Cavab Açarları Balansı** | Təsadüfi paylanma | **Dəqiq 25%** (180 A, 180 B, 180 C, 180 D) | Təsadüfi təxmin etmə riski yüksəkdir |
| **Məsələ Həlli İzahları** | Qısa / Natamam | **Addım-addım riyazi izah** | Metodik əsaslandırma zəifdir |

---

## 2. 3-cü Sinif Riyaziyyat Fənn Kurikulumu və Məzmun Xətləri

Azərbaycan Respublikası Elm və Təhsil Nazirliyinin 3-cü sinif Riyaziyyat dərslik proqramı 5 əsas məzmun xətti üzərində qurulmuşdur:

```
                               ┌─────────────────────────────────────────┐
                               │       3-CÜ SİNİF RİYAZİYYAT             │
                               │           MƏZMUN XƏTLƏRİ                │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌──────────────────┬───────────────────────┼───────────────────────┬──────────────────┐
         │                  │                       │                       │                  │
         ▼                  ▼                       ▼                       ▼                  ▼
┌─────────────────┐┌─────────────────┐    ┌───────────────────┐   ┌───────────────────┐┌─────────────────┐
│ 1. ƏDƏDLƏR VƏ   ││   2. CƏBR VƏ    │    │    3. HƏNDƏSƏ     │   │     4. ÖLÇMƏ      ││ 5. STATİSTİKA   │
│   ƏMƏLLƏR       ││  FUNKSİYALAR    │    │                   │   │                   ││   VƏ EHTİMAL    │
├─────────────────┤├─────────────────┤    ├───────────────────┤   ├───────────────────┤├─────────────────┤
│• 1000 dairəsində││• Dəyişənli      │    │• Fəza fiqurları   │   │• Uzunluq (km, m)  ││• Piktoqram,     │
│  ədədlər        ││  ifadələrin     │    │• Müstəvi fiqurları│   │• Kütlə (t, kq, q) ││  Barqraf        │
│• Toplama/Çıxma  ││  hesablanması   │    │• Bucaqlar         │   │• Tutum (l, ml)    ││• Cədvəllər      │
│• Vurma/Bölmə    ││• Sadə tənliklər │    │• Simmetriya       │   │• Zaman və Pul     ││• Hadisələrin    │
│• Kəsrlər        ││• Asılılıqlar    │    │• Çoxbucaqlılar    │   │• Perimetr və Sahə ││  ehtimalı       │
└─────────────────┘└─────────────────┘    └───────────────────┘   └───────────────────┘└─────────────────┘
```

---

## 3. Bölmələr və 48 Standart Mövzunun Tam Xəritəsi (I və II Yarımil)

Hər bölmə 6 mövzudan və hər mövzu 15 xüsusi hazırlanmış Gold Standard test sualından ibarət olmaqla ümumilikdə **720 suallıq** kamil arxitektura:

### 📘 I YARIMİL (BÖLMƏ 1 – 4: 24 Mövzu / 360 Sual)

#### 🔸 BÖLMƏ 1: 1000 dairəsində ədədlər (6 Mövzu / 90 Sual)
1. **1000 DAİRƏSİNDƏ ƏDƏDLƏR - Üçrəqəmli ədədlər və mərtəbə vahidləri** *(Təkliklər, onluqlar, yüzlüklər, mərtəbə qiyməti)*
2. **1000 DAİRƏSİNDƏ ƏDƏDLƏR - Ədədin modelləşdirilməsi və yazılış formaları** *(Onluq bloklar, açıq yazılış, sözlə və rəqəmlə yazılış)*
3. **1000 DAİRƏSİNDƏ ƏDƏDLƏR - Ədədlərin müqayisəsi və sıralama** *(Mərtəbələr üzrə müqayisə, artan və azalan sıra)*
4. **1000 DAİRƏSİNDƏ ƏDƏDLƏR - Ədədlərin yuvarlaqlaşdırılması** *(Onluqlara və yüzlüklərə qədər yuvarlaqlaşdırma qaydası)*
5. **1000 DAİRƏSİNDƏ ƏDƏDLƏR - Pullarımız və manat-qəpik hesablamaları** *(Məbləğin hesablanması, qəpiyin manata çevrilməsi)*
6. **1000 DAİRƏSİNDƏ ƏDƏDLƏR - 1-ci Bölmə üzrə ümumiləşdirici təkrar** *(Kompleks təkrar və məntiqi riyazi məsələlər)*

#### 🔸 BÖLMƏ 2: 1000 dairəsində toplama və çıxma (6 Mövzu / 90 Sual)
7. **1000 DAİRƏSİNDƏ TOPLAMA VƏ ÇIXMA - Təklik, onluq və yüzlüklərin toplanması** *(Sadə toplama, sütunla toplama)*
8. **1000 DAİRƏSİNDƏ TOPLAMA VƏ ÇIXMA - Yeni onluq və yüzlüyün yaranması** *(Təklikdən onluğa, onluqdan yüzlüyə keçidlə toplama)*
9. **1000 DAİRƏSİNDƏ TOPLAMA VƏ ÇIXMA - Üçrəqəmli ədədlərin çıxılması** *(Onluğun və ya yüzlüyün ayrılması ilə çıxma)*
10. **1000 DAİRƏSİNDƏ TOPLAMA VƏ ÇIXMA - Çıxmanın xüsusi halları (Sıfır olan hallar)** *(Məs: $500 - 247$, $604 - 138$ tipli çıxmalar)*
11. **1000 DAİRƏSİNDƏ TOPLAMA VƏ ÇIXMA - Toplama və çıxmanın əlverişli üsulları** *(Yuvarlaq ədədə tamamlama, hissə-hissə toplama və çıxma)*
12. **1000 DAİRƏSİNDƏ TOPLAMA VƏ ÇIXMA - 2-ci Bölmə üzrə ümumiləşdirici təkrar** *(Mətnli və çoxaddımlı məsələlər)*

#### 🔸 BÖLMƏ 3: Vurma və bölmə vərdişləri (6 Mövzu / 90 Sual)
13. **VURMA VƏ BÖLMƏ - Vurma cədvəli (6, 7, 8, 9-a vurma)** *(Vurma və bölmə cədvəlinin tam mənimsənilməsi)*
14. **VURMA VƏ BÖLMƏ - 0 və 1 ilə vurma və bölmə xassələri** *(0-a vurma, 1-ə vurma, 0-ı ədədə bölmə qaydaları)*
15. **VURMA VƏ BÖLMƏ - Vurmanın xassələri** *(Yerdəyişmə, qruplaşdırma və paylama xassələri)*
16. **VURMA VƏ BÖLMƏ - Məchul vuruğun və bölünənin tapılması** *(Tənlik qurmaqla məchul komponentin hesablanması)*
17. **VURMA VƏ BÖLMƏ - Əməllər sırası və mötərizəli ifadələr** *(Mötərizəli və mötərizəsiz ifadələrdə əməl ardıcıllığı)*
18. **VURMA VƏ BÖLMƏ - 3-cü Bölmə üzrə ümumiləşdirici təkrar** *(Vurma-bölmə tətbiqli real həyati məsələlər)*

#### 🔸 BÖLMƏ 4: Həndəsi fiqurlar və Simmetriya (6 Mövzu / 90 Sual)
19. **HƏNDƏSİ FİQURLAR - Müstəvi fiqurları və onların elementləri** *(Üçbucaq, dördbucaqlı, kvadrat, düzbucaqlı, çoxbucaqlılar)*
20. **HƏNDƏSİ FİQURLAR - Fəza fiqurları** *(Kub, düzbucaqlı paralelepiped, konus, silindr, piramida, kürə)*
21. **HƏNDƏSİ FİQURLAR - Bucaq və onun növləri** *(Düz bucaq, iti bucaq, kor bucaq, açıq bucaq)*
22. **HƏNDƏSİ FİQURLAR - Çevrə və Dairə** *(Mərkəz, radius, diametr anlayışları)*
23. **HƏNDƏSİ FİQURLAR - Simmetriya və simmetriya oxu** *(Müstəvi fiqurlarında simmetriya oxu, güzgü əksi)*
24. **HƏNDƏSİ FİQURLAR - 4-cü Bölmə üzrə ümumiləşdirici təkrar** *(Həndəsi fiqurlar və fəza təsəvvürləri)*

---

### 📙 II YARIMİL (BÖLMƏ 5 – 8: 24 Mövzu / 360 Sual)

#### 🔸 BÖLMƏ 5: Çoxrəqəmli ədədlərin vurulması və bölünməsi (6 Mövzu / 90 Sual)
25. **VURMA VƏ BÖLMƏNİN İNKİŞAFI - Onluq və yüzlüklərin şifahi vurulması və bölünməsi** *(Məs: $40 \times 6$, $600 : 3$)*
26. **VURMA VƏ BÖLMƏNİN İNKİŞAFI - İkirəqəmli ədədin birrəqəmli ədədə vurulması** *(Mərtəbə toplananları və sütun üsulu)*
27. **VURMA VƏ BÖLMƏNİN İNKİŞAFI - Üçrəqəmli ədədin birrəqəmli ədədə vurulması** *(Onluq və yüzlük yaranan sütunla vurma)*
28. **VURMA VƏ BÖLMƏNİN İNKİŞAFI - İkirəqəmli və üçrəqəmli ədədin bölünməsi** *(Qalıqsız bölmə, sütunla bölmə alqoritmi)*
29. **VURMA VƏ BÖLMƏNİN İNKİŞAFI - Qalıqlı bölmə** *(Qalığın böləndən kiçik olması qaydası, yoxlama)*
30. **VURMA VƏ BÖLMƏNİN İNKİŞAFI - 5-ci Bölmə üzrə ümumiləşdirici təkrar** *(Çoxaddımlı vurma-bölmə məsələləri)*

#### 🔸 BÖLMƏ 6: Kəsrlər və Hissələr (6 Mövzu / 90 Sual)
31. **KƏSRLƏR - Bütöv, yarım və dörddə bir (çərək)** *(Hissə anlayışı, bərabər hissələrə bölmə)*
32. **KƏSRLƏR - Kəsrlərin yazılışı və oxunuşu** *(Surət, məxrəc və kəsr xətti anlayışları)*
33. **KƏSRLƏR - Ədədin hissəsinin tapılması** *(Ədədi məxrəcə bölüb surətə vurmaq alqoritmi)*
34. **KƏSRLƏR - Hissəsinə görə ədədin tapılması** *(Ədədi surətə bölüb məxrəcə vurmaq)*
35. **KƏSRLƏR - Məxrəcləri eyni olan kəsrlərin müqayisəsi** *(Model üzərində və rəqəmlə müqayisə)*
36. **KƏSRLƏR - 6-cı Bölmə üzrə ümumiləşdirici təkrar** *(Kəsrlər və hissə məsələləri)*

#### 🔸 BÖLMƏ 7: Ölçmələr (Uzunluq, Kütlə, Tutum, Zaman, Sahə) (6 Mövzu / 90 Sual)
37. **ÖLÇMƏLƏR - Uzunluq vahidləri** *(Millimetr, santimetr, desimetr, metr, kilometr və qarşılıqlı çevirmələr)*
38. **ÖLÇMƏLƏR - Kütlə vahidləri** *(Qram, kiloqram, ton və kütlə hesablamaları)*
39. **ÖLÇMƏLƏR - Tutum vahidləri** *(Litr, millilitr və maye qablarının tutumu)*
40. **ÖLÇMƏLƏR - Zaman vahidləri və Saat** *(Saat, dəqiqə, saniyə, ay, il, əsr, zaman fasilələri)*
41. **ÖLÇMƏLƏR - Perimetr və Sahə anlayışı** *(Çoxbucaqlının perimetri, düzbucaqlının sahəsi, kvadrat santimetr)*
42. **ÖLÇMƏLƏR - 7-ci Bölmə üzrə ümumiləşdirici təkrar** *(Praktik ölçmə məsələləri və çevirmələr)*

#### 🔸 BÖLMƏ 8: Məlumatların təhlili və Məsələ həlli (6 Mövzu / 90 Sual)
43. **MƏLUMATLARIN TƏHLİLİ - Məlumatın toplanması və Cədvəllər** *(Teleqraf cədvəlləri, tezlik cədvəli)*
44. **MƏLUMATLARIN TƏHLİLİ - Piktoqram və Barqraf (Sütunlu diaqram)** *(Qrafik məlumatların oxunması və təhlili)*
45. **MƏLUMATLARIN TƏHLİLİ - Hadisələr və Ehtimal** *(Yəqin hadisə, mümkün hadisə, qeyri-mümkün hadisə)*
46. **MƏLUMATLARIN TƏHLİLİ - Məsələ həlli strategiyaları** *(Sxem çəkməklə, cədvəl qurmaqla, sondan başlamaqla həll)*
47. **MƏLUMATLARIN TƏHLİLİ - Məntiqi və kombinator məsələlər** *(Seçim variantları, ardıcıllıqlar və qanunauyğunluqlar)*
48. **MƏLUMATLARIN TƏHLİLİ - 3-cü Sinif İlin Yekun Təkrarı** *(Bütün il üzrə böyük inteqrativ sınaq)*

---

## 4. Test Suallarının Pedaqoji və Texniki Tələbləri (Gold Standard 4.1)

Riyaziyyat 3 test bankının hazırlanmasında tətbiq olunacaq meyarlar:

1. **Riyazi və Məntiqi Dəqiqlik:**  
   Bütün ədədi hesablamalar, mətnli məsələlər, həndəsi fiqur təsvirləri və kəsr əməliyyatları 100% dəqiq olmalı, ziddiyyətli şərtlərə yol verilməməlidir.

2. **100% Variant Uzunluq və Quruluş Simmetriyası:**  
   Heç bir sualda düzgün cavab uzunluğuna və ya qrafik görünüşünə görə fərqlənməməlidir.  
   - Ədədi cavablarda bütün 4 variant eyni formatda və yaxın ölçüdə olmalıdır (Məs: `A) 245`, `B) 265`, `C) 275`, `D) 285`).  
   - İzahlı variantlarda bütün 4 variant eyni qrammatik strukturda və simmetrik uzunluqda ($\pm 10-15\%$) olmalıdır.

3. **Plauzibil (Məntiqli) Çəkindiricilər (Distractors):**  
   Səhv variantlar təsadüfi rəqəmlər deyil, şagirdlərin ən çox etdiyi tipik hesablama və diqqət xətalarına əsaslanmalıdır (məs: onluq yadda saxlanılmadıqda, kəsrin surət və məxrəci qarışdırıldıqda alınan nəticələr).

4. **Dəqiq 25% Balanslaşdırılmış Cavab Açarları:**  
   Bütün 720 sual üzrə variantlar bərabər paylanmalıdır:
   $$\text{A: 180}, \quad \text{B: 180}, \quad \text{C: 180}, \quad \text{D: 180}$$

5. **Ətraflı Həll Alqoritmi və İzah:**  
   Hər bir sualın altında həll addımları, riyazi düstur və dərslik qaydası metodik olaraq tam izah edilməlidir.

---

## 5. Tətbiq və İcra Planı (Roadmap)

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   MƏRHƏLƏ 1 (BÖLMƏ 1-2) │───>│   MƏRHƏLƏ 2 (BÖLMƏ 3-4) │───>│   MƏRHƏLƏ 3 (BÖLMƏ 5-6) │
│  • 1000 dairəsində      │    │  • Vurma və bölmə       │    │  • Çoxrəqəmli vurma/böl │
│    ədədlər              │    │  • Həndəsi fiqurlar     │    │  • Kəsrlər və hissələr  │
│  • 12 Mövzu / 180 Sual  │    │  • 12 Mövzu / 180 Sual  │    │  • 12 Mövzu / 180 Sual  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
                                                                           │
                                                                           ▼
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   YEKUN İNTEQRASİYA     │<───│   MƏRHƏLƏ 4 (BÖLMƏ 7-8) │<───┘                         │
│  • JSON Baza yenilənməsi│    │  • Ölçmələr və Sahə     │                              │
│  • Markdown ixracı      │    │  • Məlumat təhlili      │                              │
│  • 720 Sual / 100% Tam  │    │  • 12 Mövzu / 180 Sual  │                              │
└─────────────────────────┘    └─────────────────────────┘                              
```
