# 📋 Sistemdə Dərslik və Mövzusu Olan, Lakin Hələ Testi Generasiya Edilməmiş Fənlər üzrə Tam Diaqnostika Hesabatı

**Hesabat Tarixi:** 2026-cı il  
**Mənbə Məlumatları:** `data/textbooks.json`, `data/textbook-chunks.jsonl`, `public/textbooks/` və `data/offline_tests.json`  
**Məqsəd:** Sistemdə dərslik faylları, OCR mətnləri və ya kurikulum mövzuları mövcud olan, lakin test bazasında (`offline_tests.json`) hələ testləri generasiya edilməmiş bütün sinif və fənlərin tam aşkara çıxarılması.

---

## 1. Ümumi Diaqnostik Xülasə

Aparılan tam çarpaz təhlil nəticəsində məlum olmuşdur ki:
* 📚 **Sistemdə qeydiyyatda olan ümumi dərslik/fənn sayı:** **205 dərslik**
* ✅ **Test bazasında testi generasiya edilmiş və aktiv olan:** **154 dərslik/fənn bloku** (121 test bazası açarı, 50 413 sual)
* ❌ **Sistemdə dərslik/mövzusu olan, lakin testi HƏLƏ GENERASİYA EDİLMƏMİŞ:** **51 dərslik / fənn**

```
                     ┌────────────────────────────────────────────────────────┐
                     │    SİSTEMDƏ MÖVCUD DƏRSLİKLƏR VƏ TEST BAZASI ANALİZİ   │
                     │                 CƏMİ 205 RƏSMİ DƏRSLİK                 │
                     └───────────────────────────┬────────────────────────────┘
                                                 │
         ┌───────────────────────────────────────┴───────────────────────────────────────┐
         │                                                                               │
         ▼                                                                               ▼
┌──────────────────────────────────────────┐                   ┌──────────────────────────────────────────┐
│  ✅ TESTİ GENERASİYA EDİLMİŞ (154 Dərslik)│                   │  ❌ TESTİ HƏLƏ YAZILMAMIŞ (51 Dərslik)   │
├──────────────────────────────────────────┤                   ├──────────────────────────────────────────┤
│• 3-11-ci siniflərin əsas akademik fənləri│                   │• 1-ci və 2-ci siniflərin bütün fənləri   │
│• 121 Fənn açarı / 2 854 Mövzu            │                   │• Musiqi və Təsviri İncəsənət (3-9-cu s.) │
│• 50 413 Zəngin Sual fondu (>=15 sual)    │                   │• Fiziki tərbiyə (5, 6, 8-ci siniflər)    │
│• 100% Dictionary Format                  │                   │• Həyat bilgisi (8 və 9-cu siniflər)      │
│• 100% Rəsmi dərsliklərlə inteqrasiya     │                   │• Texnologiya 9                           │
└──────────────────────────────────────────┘                   └──────────────────────────────────────────┘
```

---

## 2. Siniflər üzrə Müqayisəli Diaqnostika Cədvəli

| Sinif | Sistemdəki Dərslik Sayı | Testi Olan Fənlər | Testi Olmayan Dərslik Sayı | Test Təminatı Faizi | Əsas Çatışmayan İstiqamətlər |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 🔴 **1-ci sinif** | **13 dərslik** | 0 fənn | **❌ 13 dərslik** | **0%** | Bütün ibtidai 1-ci sinif fənləri |
| 🔴 **2-ci sinif** | **13 dərslik** | 0 fənn | **❌ 13 dərslik** | **0%** | Bütün ibtidai 2-ci sinif fənləri |
| 🟢 **3-cü sinif** | **13 dərslik** | 10 dərslik (9 fənn) | **❌ 3 dərslik** | **77%** | Musiqi 3, Təsviri incəsənət 3, Rus dili 3 (əsas) |
| 🟢 **4-cü sinif** | **13 dərslik** | 11 dərslik (9 fənn) | **❌ 2 dərslik** | **85%** | Musiqi 4, Təsviri incəsənət 4 |
| 🟡 **5-ci sinif** | **22 dərslik** | 19 dərslik (16 fənn)| **❌ 3 dərslik** | **86%** | Musiqi 5, Təsviri incəsənət 5, Fiziki tərbiyə 5 |
| 🟢 **6-cı sinif** | **24 dərslik** | 21 dərslik (13 fənn)| **❌ 3 dərslik** | **88%** | Musiqi 6, Təsviri incəsənət 6, Fiziki tərbiyə 6 |
| 🟡 **7-ci sinif** | **25 dərslik** | 19 dərslik (15 fənn)| **❌ 6 dərslik** | **76%** | Musiqi 7, Təsviri incəsənət 7, 2-ci xarici dillər |
| 🟡 **8-ci sinif** | **27 dərslik** | 23 dərslik (16 fənn)| **❌ 4 dərslik** | **85%** | Həyat bilgisi 8, Musiqi 8, Təsviri incəsənət 8, Fiziki tərbiyə 8 |
| 🟡 **9-cu sinif** | **23 dərslik** | 19 dərslik (15 fənn)| **❌ 4 dərslik** | **83%** | Texnologiya 9, Həyat bilgisi 9, Musiqi 9, Təsviri incəsənət 9 |
| 🟢 **10-cu sinif**| **18 dərslik** | 18 dərslik (14 fənn)| **✅ 0 dərslik** | **100%** | Bütün fənlərin testləri mövcuddur |
| 🟢 **11-ci sinif**| **14 dərslik** | 14 dərslik (14 fənn)| **✅ 0 dərslik** | **100%** | Bütün fənlərin testləri mövcuddur |
| **CƏMİ** | **205 Dərslik** | **154 Dərslik** | **❌ 51 Dərslik** | **75.1%** | — |

---

## 3. Siniflər üzrə Testi Generasiya Edilməmiş Fənlərin Tam Siyahısı

### 🔴 1-ci SİNİF (13 Dərslik — Test bazası: 0%)
Sistemdə dərslikləri və mövzu strukturları var, lakin testləri hələ yaradılmayıb:
1. ❌ **Azərbaycan dili 1 (1-ci hissə)** *(Fənn: Azərbaycan dili)*
2. ❌ **Azərbaycan dili 1 (2-ci hissə)** *(Fənn: Azərbaycan dili)*
3. ❌ **Riyaziyyat 1 (1-ci hissə)** *(Fənn: Riyaziyyat)*
4. ❌ **Riyaziyyat 1 (2-ci hissə)** *(Fənn: Riyaziyyat)*
5. ❌ **Həyat bilgisi 1** *(Fənn: Həyat bilgisi)*
6. ❌ **İnformatika 1** *(Fənn: İnformatika)*
7. ❌ **İngilis dili 1 (əsas xarici dil)** *(Fənn: Xarici dil)*
8. ❌ **Alman dili 1 (əsas xarici dil)** *(Fənn: Xarici dil)*
9. ❌ **Fransız dili 1 (əsas xarici dil)** *(Fənn: Xarici dil)*
10. ❌ **Rus dili 1 (əsas xarici dil)** *(Fənn: Xarici dil)*
11. ❌ **Texnologiya 1** *(Fənn: Texnologiya)*
12. ❌ **Musiqi 1** *(Fənn: Musiqi)*
13. ❌ **Təsviri İncəsənət 1** *(Fənn: Təsviri İncəsənət)*

---

### 🔴 2-ci SİNİF (13 Dərslik — Test bazası: 0%)
Sistemdə dərslikləri və mövzu strukturları var, lakin testləri hələ yaradılmayıb:
1. ❌ **Azərbaycan dili 2 (1-ci hissə)** *(Fənn: Azərbaycan dili)*
2. ❌ **Azərbaycan dili 2 (2-ci hissə)** *(Fənn: Azərbaycan dili)*
3. ❌ **Riyaziyyat 2 (1-ci hissə)** *(Fənn: Riyaziyyat)*
4. ❌ **Riyaziyyat 2 (2-ci hissə)** *(Fənn: Riyaziyyat)*
5. ❌ **Həyat bilgisi 2** *(Fənn: Həyat bilgisi)*
6. ❌ **İnformatika 2** *(Fənn: İnformatika)*
7. ❌ **İngilis dili 2** *(Fənn: Xarici dil)*
8. ❌ **Alman dili 2 (əsas xarici dil)** *(Fənn: Xarici dil)*
9. ❌ **Fransız dili 2 (əsas xarici dil)** *(Fənn: Xarici dil)*
10. ❌ **Rus dili 2 (əsas xarici dil)** *(Fənn: Xarici dil)*
11. ❌ **Texnologiya 2** *(Fənn: Texnologiya)*
12. ❌ **Musiqi 2** *(Fənn: Musiqi)*
13. ❌ **Təsviri İncəsənət 2** *(Fənn: Təsviri İncəsənət)*

---

### 🟢 3-cü SİNİF (3 Dərslikdə test yoxdur)
*Əsas 9 fənn üzrə 3 990 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Musiqi 3** *(Dərslik mövcuddur)*
2. ❌ **Təsviri İncəsənət 3** *(Dərslik mövcuddur)*
3. ❌ **Rus dili 3 (əsas məktəblər üçün)** *(Qeyd: Rus bölməsi üçün `Русский язык 3` testi var, lakin Azərb. bölməsi əsas dərslik testi ayrıca fərqləndirilməlidir)*

---

### 🟢 4-cü SİNİF (2 Dərslikdə test yoxdur)
*Əsas 9 fənn üzrə 4 335 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Musiqi 4** *(Dərslik mövcuddur)*
2. ❌ **Təsviri İncəsənət 4** *(Dərslik mövcuddur)*

---

### 🟡 5-ci SİNİF (3 Dərslikdə test yoxdur)
*Əsas 16 fənn üzrə 11 306 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Musiqi 5** *(Dərslik mövcuddur)*
2. ❌ **Təsviri incəsənət 5** *(Dərslik mövcuddur)*
3. ❌ **Fiziki Tərbiyə 5** *(Dərslik mövcuddur)*

---

### 🟢 6-cı SİNİF (3 Dərslikdə test yoxdur)
*Əsas 13 fənn üzrə 5 490 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Musiqi 6** *(Dərslik mövcuddur)*
2. ❌ **Təsviri incəsənət 6** *(Dərslik mövcuddur)*
3. ❌ **Fiziki tərbiyə 6** *(Dərslik mövcuddur)*

---

### 🟡 7-ci SİNİF (6 Dərslikdə test yoxdur)
*Əsas 15 fənn üzrə 7 095 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Musiqi - 7** *(Dərslik mövcuddur)*
2. ❌ **Təsviri incəsənət - 7** *(Dərslik mövcuddur)*
3. ❌ **English - 7 (əsas xarici dil - alternativ dərslik komplekti)**
4. ❌ **English - 7 (ikinci xarici dil)** *(Ayrıca ikinci dil testi kimi)*
5. ❌ **Русский язык - 7 (əsas xarici dil - alternativ komplekt)**
6. ❌ **Русский язык - 7 (ikinci xarici dil)** *(Ayrıca ikinci dil testi kimi)*

---

### 🟡 8-ci SİNİF (4 Dərslikdə test yoxdur)
*Əsas 16 fənn üzrə 7 320 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Həyat bilgisi 8** *(Dərslik və mövzular var, test bazada yoxdur)*
2. ❌ **Musiqi 8** *(Dərslik mövcuddur)*
3. ❌ **Təsviri incəsənət 8** *(Dərslik mövcuddur)*
4. ❌ **Fiziki tərbiyə 8** *(Dərslik mövcuddur)*

---

### 🟡 9-cu SİNİF (4 Dərslikdə test yoxdur)
*Əsas 15 fənn üzrə 4 335 sual tam hazırdır.* Testi olmayan fənlər:
1. ❌ **Texnologiya 9** *(Dərslik və mövzular var, test bazada yoxdur)*
2. ❌ **Həyat bilgisi 9** *(Dərslik və mövzular var, test bazada yoxdur)*
3. ❌ **Musiqi 9** *(Dərslik mövcuddur)*
4. ❌ **Təsviri İncəsənət 9** *(Dərslik mövcuddur)*

---

### 🟢 10 və 11-ci SİNİFLƏR (0 Çatışmazlıq — 100% Tamamlanıb)
10 və 11-ci siniflərdə sistemdəki bütün 32 dərslik üzrə testlər generasiya edilmişdir və test bazasında aktivdir!

---

## 4. Çatışmayan Fənlərin Kateqoriyalar üzrə İcmalı

```
┌───────────────────────────────────────────────┬───────────────────┬──────────────────────────────────────────┐
│ KATEQORİYA                                    │ DƏRSLİK SAYI      │ ƏHATƏ EDİLDİYİ SİNİFLƏR                  │
├───────────────────────────────────────────────┼───────────────────┼──────────────────────────────────────────┤
│ 👶 1 və 2-ci Sinif İbtidai Bütün Fənlər       │ 26 Dərslik        │ 1-ci sinif (13), 2-ci sinif (13)         │
│ 🎨 Təsviri İncəsənət (Bütün siniflər)         │ 7 Dərslik         │ 3, 4, 5, 6, 7, 8, 9-cu siniflər          │
│ 🎵 Musiqi (Bütün siniflər)                    │ 7 Dərslik         │ 3, 4, 5, 6, 7, 8, 9-cu siniflər          │
│ 🏃 Fiziki Tərbiyə                             │ 3 Dərslik         │ 5, 6, 8-ci siniflər                      │
│ 🌍 Həyat Bilgisi (Yuxarı siniflər)            │ 2 Dərslik         │ 8 və 9-cu siniflər                       │
│ 🛠️ Texnologiya (Yuxarı sinif)                │ 1 Dərslik         │ 9-cu sinif                               │
│ 🌐 İkinci Xarici Dillər (Xüsusi dərsliklər)   │ 5 Dərslik         │ 3, 7-ci siniflər                         │
├───────────────────────────────────────────────┼───────────────────┼──────────────────────────────────────────┤
│ CƏMİ GENERASİYA GÖZLƏYƏN DƏRSLİK              │ 51 DƏRSLİK        │ —                                        │
└───────────────────────────────────────────────┴───────────────────┴──────────────────────────────────────────┘
```

---

## 5. Təklif Olunan Növbəti İcra Planı

Platformanın 100% tamlıq səviyyəsinə çatdırılması üçün aşağıdakı ardıcıllıqla testlərin generasiya edilməsi tövsiyə olunur:

1. **1-ci Mərhələ (Akademik Fənlər):**
   * `Həyat bilgisi 8` və `Həyat bilgisi 9`
   * `Texnologiya 9`
2. **2-ci Mərhələ (İbtidai Baza — 1 və 2-ci Siniflər):**
   * 1-ci sinif: Azərbaycan dili, Riyaziyyat, Həyat bilgisi, İnformatika, Xarici dillər.
   * 2-ci sinif: Azərbaycan dili, Riyaziyyat, Həyat bilgisi, İnformatika, Xarici dillər.
3. **3-cü Mərhələ (İncəsənət və İdman Bloku):**
   * Musiqi (1–9-cu siniflər)
   * Təsviri İncəsənət (1–9-cu siniflər)
   * Fiziki Tərbiyə (5, 6, 8-ci siniflər)
