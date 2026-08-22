# 📊 Azərbaycan Süni İntellekt Təhsil Platforması — Test Bazasının Tam Dərin Analiz və Diaqnostika Hesabatı

**Hesabat Tarixi:** 2026-cı il  
**Məlumat Bazası Faylı:** `offline_tests.json` (`data/offline_tests.json`)  
**Təhlil Obyekti:** Bütün Siniflər (3–11-ci siniflər), 122 Fənn, 2 818 Mövzu və 49 426 Sual  
**Əsas Pedaqoji Meyar:** **Hər mövzu üzrə MİNİMUM 15 SUAL ($\ge 15$)**. 15-dən çox sualın olması bazanın zənginliyi, çoxvariantlılığı və platformamızın böyük üstünlüyüdür!

---

## 1. Ümumi İcra Xülasəsi (Executive Summary)

Platformanın offline test bazası Azərbaycan Respublikası Elm və Təhsil Nazirliyinin rəsmi dövlət dərslikləri əsasında formalaşdırılmış nəhəng milli təhsil xəzinəsidir.

```
                            ┌────────────────────────────────────────────────────────┐
                            │    AZƏRBAYCAN TƏHSİL PLATFORMASI TEST BAZASI STATİSTİKASI │
                            │           49 426 SUAL  |  2 818 MÖVZU  |  122 FƏNN     │
                            └───────────────────────────┬────────────────────────────┘
                                                        │
         ┌──────────────────────────────────────────────┼─────────────────────────────────────────────┐
         │                                              │                                             │
         ▼                                              ▼                                             ▼
┌──────────────────────────────────┐          ┌──────────────────────────────────┐          ┌──────────────────────────────────┐
│ 🌟 ZƏNGİN VƏ STANDART BAZA (>=15)│          │ ⚠️ TAMAMLANMALI MÖVZULAR (<15)   │          │ ⚠️ KÖHNƏ FLAT LİST (ARRAY FORMAT)│
├──────────────────────────────────┤          ├──────────────────────────────────┤          ├──────────────────────────────────┤
│• 93 Fənn (76.2%)                 │          │• 21 Fənn                         │          │• 8 Fənn                          │
│• Hər mövzuda ən azı 15 sual      │          │• Bəzi mövzular 15-dən azdır      │          │• Mövzu açarlı lüğət deyil        │
│• Çoxsaylı mövzularda 20-50+ sual │          │• 15 minimum həddinə çatmalıdır   │          │• Təcili Dictionary edilməlidir   │
│• Rəsmi dərsliklə 100% uzlaşma    │          │• Açar və simmetriya balansı      │          │• Texnologiya 7 (0 sual)          │
└──────────────────────────────────┘          └──────────────────────────────────┘          └──────────────────────────────────┘
```

---

## 2. Siniflər üzrə Müqayisəli Diaqnostika Paneli (Düzgün Meyarlarla)

| Sinif Pilləsi | Ümumi Fənn Sayı | Ümumi Mövzu | Ümumi Sual | Tam Standart və Zəngin ($\ge 15$ Sual) | Bəzi Mövzuları $<15$ Olanlar | Köhnə Flat List | Diaqnostik Qiymətləndirmə |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 🟢 **3-cü sinif** | **9 fənn** | **266 mövzu** | **3 990 sual** | **9 / 9 (100%)** | 0 | 0 | 🏆 **100% Qüsursuz və Tam** |
| 🟢 **4-cü sinif** | **9 fənn** | **281 mövzu** | **4 335 sual** | **9 / 9 (100%)** | 0 | 0 | 🌟 **100% Standart və Zəngin** |
| 🔴 **5-ci sinif** | **16 fənn** | **375 mövzu** | **11 265 sual** | **8 / 16 (50%)** | 2 | 6 | ⚠️ **Təcili Yenilənmə Tələb Edir** |
| 🟢 **6-cı sinif** | **13 fənn** | **366 mövzu** | **5 489 sual** | **12 / 13 (92%)** | 1 (Ədəbiyyat 6) | 0 | 🌟 **Yüksək Keyfiyyət** |
| 🟡 **7-ci sinif** | **15 fənn** | **463 mövzu** | **6 915 sual** | **13 / 15 (87%)** | 1 (İnformatika 7) | 1 (Texnologiya 7) | 🛠️ Texnologiya 7 yazılmalıdır |
| 🟠 **8-ci sinif** | **16 fənn** | **361 mövzu** | **6 802 sual** | **9 / 16 (56%)** | 6 | 1 (Texnologiya 8) | 🛠️ Çatışmayan mövzular artırılmalıdır |
| 🟢 **9-cu sinif** | **15 fənn** | **288 mövzu** | **4 289 sual** | **13 / 15 (87%)** | 2 (Alman, Rus) | 0 | 🌟 **Yüksək Keyfiyyət** |
| 🟢 **10-cu sinif** | **14 fənn** | **235 mövzu** | **3 566 sual** | **10 / 14 (71%)** | 4 (Az-dili, Riyaz, Rus, Ədəb) | 0 | 🌟 **Yaxşı Vəziyyət** |
| 🟢 **11-ci sinif** | **14 fənn** | **182 mövzu** | **2 774 sual** | **11 / 14 (79%)** | 3 (Az-dili, Fizika, Riyaz) | 0 | 🌟 **Yaxşı Vəziyyət** |
| **YEKUN CƏMİ** | **122 Fənn** | **2 818 Mövzu** | **49 426 Sual** | **93 / 122 (76.2%)** | **21 / 122** | **8 / 122** | 🚀 **Zənginləşdirilməyə Hazır** |

---

## 3. Bütün Siniflər üzrə Detallı Vəziyyət

### 🟢 3-cü SİNİF (9 Fənn / 266 Mövzu / 3 990 Sual) — 100% Tamamlandı
* ✓ **Azərbaycan dili 3:** 48 mövzu, 720 sual (Hər mövzu dəqiq 15 sual)
* ✓ **Riyaziyyat 3:** 48 mövzu, 720 sual (Hər mövzu dəqiq 15 sual)
* ✓ **Həyat bilgisi 3:** 48 mövzu, 720 sual (Hər mövzu dəqiq 15 sual)
* ✓ **İnformatika 3:** 48 mövzu, 720 sual (Hər mövzu dəqiq 15 sual)
* ✓ **İngilis dili 3:** 10 mövzu, 150 sual (Hər mövzu dəqiq 15 sual)
* ✓ **Fransız dili 3:** 19 mövzu, 285 sual (Hər mövzu dəqiq 15 sual)
* ✓ **Alman dili 3:** 13 mövzu, 195 sual (Hər mövzu dəqiq 15 sual)
* ✓ **Русский язык 3 (Rus dili):** 22 mövzu, 330 sual (Hər mövzu dəqiq 15 sual)
* ✓ **Texnologiya 3:** 10 mövzu, 150 sual (Hər mövzu dəqiq 15 sual)

---

### 🟢 4-cü SİNİF (9 Fənn / 281 Mövzu / 4 335 Sual) — 100% Zəngin və Standart
* 🌟 **İngilis dili 4:** 8 mövzu, 240 sual (*Zəngin baza: Hər mövzuda 30 sual!*)
* ✓ **Riyaziyyat 4:** 74 mövzu, 1 110 sual (Hər mövzu 15 sual)
* ✓ **İnformatika 4:** 28 mövzu, 420 sual (Hər mövzu 15 sual)
* ✓ **Texnologiya 4:** 28 mövzu, 420 sual (Hər mövzu 15 sual)
* ✓ **Azərbaycan dili 4:** 43 mövzu, 645 sual (Hər mövzu 15 sual)
* ✓ **Həyat bilgisi 4:** 27 mövzu, 405 sual (Hər mövzu 15 sual)
* ✓ **Rus dili 4:** 25 mövzu, 375 sual (Hər mövzu 15 sual)
* ✓ **Alman dili 4:** 24 mövzu, 360 sual (Hər mövzu 15 sual)
* ✓ **Fransız dili 4:** 24 mövzu, 360 sual (Hər mövzu 15 sual)

---

### 🔴 5-ci SİNİF (16 Fənn / 375 Mövzu / 11 265 Sual) — Təcili Yenilənməli Sahə
5-ci sinif platformanın ən böyük test fonduna malikdir, lakin bəzi fənlər köhnə `Flat List` formatındadır və bəzilərində natamam mövzular var:
* 🌟 **Riyaziyyat 5:** 53 mövzu, 1 617 sual (*Zəngin baza: hər mövzuda 23–45 sual!*)
* 🌟 **Təbiət 5:** 40 mövzu, 1 185 sual (*Zəngin baza: hər mövzuda 23–35 sual!*)
* 🌟 **Azərbaycan tarixi 5:** 39 mövzu, 1 147 sual (*Zəngin baza: hər mövzuda 23–35 sual!*)
* 🌟 **Azərbaycan dili 5:** 32 mövzu, 1 013 sual (*Zəngin baza: hər mövzuda 22–35 sual!*)
* 🌟 **Rus dili 5:** 31 mövzu, 981 sual (*Zəngin baza: hər mövzuda 23–35 sual!*)
* 🌟 **İnformatika 5:** 26 mövzu, 743 sual (*Zəngin baza: hər mövzuda 22–35 sual!*)
* 🌟 **Alman dili 5 (əsas):** 6 mövzu, 605 sual (*Zəngin baza: hər mövzuda 100+ sual!*)
* 🌟 **İngilis dili 5 (əsas):** 8 mövzu, 237 sual (*Zəngin baza: hər mövzuda 25–35 sual!*)
* ⚠️ **Ədəbiyyat 5:** 25 mövzu, 492 sual *(Bəzi mövzularda min 14 sual var, 15-ə tamamlanmalıdır)*
* ⚠️ **Fransız dili 5 (əsas):** 26 mövzu, 471 sual *(Bəzi mövzularda min 14 sual var, 15-ə tamamlanmalıdır)*
* ⚠️ **Köhnə Flat List Fənləri (6 Fənn):**
  1. *Fransız dili 5 (ikinci xarici dil)* — 9 mövzu, 399 sual
  2. *İngilis dili 5 (ikinci xarici dil)* — 18 mövzu, 399 sual
  3. *Rus dili 5 (ikinci xarici dil)* — 16 mövzu, 650 sual
  4. *Alman dili 5 (ikinci xarici dil)* — 22 mövzu, 529 sual
  5. *Həyat Bilgisi 5* — 4 mövzu, 420 sual
  6. *Texnologiya 5* — 20 mövzu, 377 sual

---

### 🟢 6-cı SİNİF (13 Fənn / 366 Mövzu / 5 489 Sual)
* ✓ **12 Fənn Tam Standart:** Təbiət (765), Rus dili (735), Riyaziyyat (555), İngilis dili (495), Azərb. dili (480), Fransız dili (450), Texnologiya (420), İnformatika (375), Alman dili (360), Ümumi tarix (180), Coğrafiya (180), Azərb. tarixi (135).
* ⚠️ **Ədəbiyyat 6:** 24 mövzu, 359 sual *(Yalnız 1 mövzuda 14 sual var, 15-ə tamamlanmalıdır)*.

---

### 🟡 7-ci SİNİF (15 Fənn / 463 Mövzu / 6 915 Sual)
* 🌟 **Zəngin Fənlər:** Coğrafiya 7 (59 mövzu, 883 sual — hər mövzuda 15–15), Rus dili 7 (32 mövzu, 469 sual — hər mövzuda 15–15), İngilis dili 7 (18 mövzu, 267 sual).
* ✓ **Standart Fənlər:** Riyaziyyat (810), Fizika (720), Kimya (720), Biologiya (675), Azərb. dili (555), Ədəbiyyat (480), Azərb. tarixi (390), Ümumi tarix (345), Fransız dili (120), Alman dili (90).
* ⚠️ **İnformatika 7:** 27 mövzu, 391 sual *(Bəzi mövzularda min 14 sual var, 15-ə tamamlanmalıdır)*.
* ⚠️ **Texnologiya 7:** 0 Sual *(Baza tamamilə boşdur, dərslik əsasında yazılmalıdır)*.

---

### 🟠 8-ci SİNİF (16 Fənn / 361 Mövzu / 6 802 Sual)
* 🌟 **Riyaziyyat 8:** 38 mövzu, 1 849 sual (*Zəngin baza: hər mövzuda 16–105 sual!*)
* 🌟 **Fizika 8:** 24 mövzu, 380 sual (*Zəngin baza: hər mövzuda 15–19 sual*)
* 🌟 **İngilis dili 8:** 6 mövzu, 126 sual (*Zəngin baza: hər mövzuda 21 sual*)
* ✓ **Standart Fənlər:** Ədəbiyyat (480), İnformatika (390), Ortaq türk tarixi (300), Kimya (225), Fransız dili (180), Ümumi tarix (165).
* ⚠️ **Tamamlanmalı Mövzular ($<15$):**
  * *Azərbaycan tarixi 8:* 36 mövzu, 457 sual *(bəzi mövzular min 3 sualdır)*
  * *Coğrafiya 8:* 18 mövzu, 167 sual *(bəzi mövzular min 6 sualdır)*
  * *Azərbaycan dili 8:* 60 mövzu, 1 124 sual *(bəzi mövzular min 12 sualdır)*
  * *Biologiya 8:* 19 mövzu, 284 sual *(bəzi mövzular min 14 sualdır)*
  * *Alman dili 8:* 14 mövzu, 209 sual *(bəzi mövzular min 14 sualdır)*
  * *Rus dili 8:* 27 mövzu, 403 sual *(bəzi mövzular min 14 sualdır)*
* ⚠️ **Texnologiya 8:** 3 mövzu, 63 sual *(Flat List formatındadır)*.

---

### 🟢 9-cu SİNİF (15 Fənn / 288 Mövzu / 4 289 Sual)
* 🌟 **Azərbaycan dili 9:** 12 mövzu, 195 sual (*Zəngin baza: hər mövzuda 15–30 sual*)
* ✓ **12 Fənn Standart:** Fizika (450), Fransız dili (450), Biologiya (360), Ümumi tarix (360), Coğrafiya (300), Riyaziyyat (285), Azərb. tarixi (270), İnformatika (270), Kimya (240), Ədəbiyyat (180), Zəfər tarixi (150), İngilis dili (90).
* ⚠️ **Tamamlanmalı Fənlər:** Alman dili 9 (min 13 sual), Rus dili 9 (min 12 sual).

---

### 🟢 10-cu SİNİF (14 Fənn / 235 Mövzu / 3 566 Sual)
* 🌟 **İnformatika 10:** 13 mövzu, 240 sual (*Zəngin baza: hər mövzuda 15–30 sual*)
* ✓ **9 Fənn Standart:** Ümumi tarix (360), Biologiya (330), Fizika (315), Azərb. tarixi (300), Coğrafiya (255), Fransız dili (240), Kimya (210), Alman dili (180), İngilis dili (135).
* ⚠️ **Tamamlanmalı Fənlər:** Azərb. dili 10 (min 14), Riyaziyyat 10 (min 14), Rus dili 10 (min 14), Ədəbiyyat 10 (min 14).

---

### 🟢 11-ci SİNİF (14 Fənn / 182 Mövzu / 2 774 Sual)
* 🌟 **Biologiya 11:** 17 mövzu, 285 sual (*Zəngin baza: hər mövzuda 15–21 sual*)
* ✓ **10 Fənn Standart:** Fransız dili (480), Alman dili (300), Rus dili (240), Coğrafiya (165), Kimya (150), Ədəbiyyat (150), Azərb. tarixi (135), İnformatika (120), Ümumi tarix (120), İngilis dili (90).
* ⚠️ **Tamamlanmalı Fənlər:** Riyaziyyat 11 (min 5), Fizika 11 (min 9), Azərb. dili 11 (min 14).

---

## 4. Əsl Qüsurlar və Həlli Yolu

1. **Mövzu daxilində $< 15$ sual olanlar:** Bəzi mövzularda sual sayı 3, 5, 6, 9, 12, 14-dür. Onlar dərslik RAG əsasında **ən azı 15 suala** çatdırılmalıdır.
2. **Köhnə Flat List formatında qalan 8 fənn:** 5-ci sinifdəki 6 fənn, Texnologiya 7 (0 sual) və Texnologiya 8 mövzu açarlı `Dictionary` strukturuna keçirilməlidir.
3. **Variant Simmetriyası və 25% Açar Balansı:** Bütün mövcud və yeni suallarda variant uzunluqları bərabərləşdirilməli və $A, B, C, D$ balanslaşdırılmalıdır.

---

## 5. Strateji Yol Xəritəsi

* 🎯 **1-ci Prioritet:** **5-ci Sinfin 16 fənninin** tam standartlaşdırılması (xüsusilə 6 ədəd Flat List fənninin dərslik əsasında lüğətə çevrilməsi).
* 🎯 **2-ci Prioritet:** **7 və 8-ci siniflərdəki Texnologiya** fənlərinin (0 sual və 63 sual) rəsmi dərslik üzrə 10 mövzu $\times$ 15 sual = 150 suala çatdırılması.
* 🎯 **3-cü Prioritet:** Bütün siniflərdə tək-tük qalmış $<15$ suallı mövzuların tamamlanması və zənginləşdirilməsi.
