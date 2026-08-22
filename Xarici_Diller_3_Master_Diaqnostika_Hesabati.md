# 🌍 3-cü Sinif Xarici Dillər Üzrə Ümumi Müqayisəli Diaqnostika və Master Analiz Hesabatı

**Hesabat Tarixi:** 22 Avqust 2026  
**Əhatə Olunan Fənlər:** İngilis dili 3, Rus dili 3 (Русский язык 3), Alman dili 3, Fransız dili 3  
**Standart:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin İbtidai Təhsil Kurikulumu və CEFR Beynəlxalq Dil Standartları  
**Hədəf:** Gold Standard 4.1 (100% Dərslik İnteqrasiyası, 100% Variant Simmetriyası, 25% Balanslı Cavab Açarları)

---

## 1. Dörd Xarici Dil Üzrə Ümumi Müqayisəli Baza Auditi

Platformanın test bazasında (`offline_tests.json`) mövcud olan 3-cü sinif xarici dil fənlərinin müqayisəli statistikası:

### 📊 Müqayisəli Diaqnostika Cədvəli

| Fənn | Mövcud Sual Sayı | Mövcud Mövzu Sayı | Məlumat Strukturu | Hədəf Sual Sayı (Gold Standard 4.1) | Çatışmayan Sual (Kəsir) | Kəsir Faizi |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🇬🇧 **İngilis dili 3** | 120 | 8 (Adsız Unitlər) | `Array` (Düz siyahı) | **720 Sual** (48 Mövzu) | **600 sual** | **83.33%** |
| 🇷🇺 **Русский язык 3** | 330 | 32 (Xırda hərflər) | `Array` (Düz siyahı) | **720 Sual** (48 Mövzu) | **390 sual** | **54.17%** |
| 🇩🇪 **Alman dili 3** | 195 | 13 (Lektion 1-13) | `Array` (Düz siyahı) | **720 Sual** (48 Mövzu) | **525 sual** | **72.92%** |
| 🇫🇷 **Fransız dili 3** | 375 | 19 (Qeyri-bərabər) | `Array` (Düz siyahı) | **720 Sual** (48 Mövzu) | **345 sual** | **47.92%** |
| **CƏMİ / ÜMUMİ** | **1020** | **72** | — | **2880 Sual** (192 Mövzu) | **1860 sual** | **64.58%** |

---

## 2. Əsas Sistemik Qüsurlar və Həll Yolları

1. **Format Fərqi (Array vs Dictionary):**  
   Mövcud 4 xarici dilin hamısı köhnə `Array` (düz siyahı) formatındadır. Gold Standard 4.1 tələbinə əsasən, Azərbaycan dili 3, Riyaziyyat 3, Həyat bilgisi 3 və İnformatika 3-də olduğu kimi `{Mövzu_adı: [15_sual]}` tipli standart `Dictionary` strukturuna keçirilməlidir.

2. **Mövzu Standartlaşdırılması:**  
   Bütün dillərdə hər fənn üçün **8 Bölmə və 48 dəqiq mövzu** ($48 \times 15 = 720$ sual) arxitekturası tətbiq olunacaq.

3. **Variant Simmetriyası və Cavab Açar Balansı:**  
   Bütün variantlar vizual olaraq eyni uzunluqda və cümlə strukturunda olacaq. Hər fənn üzrə 720 sualda $A=180, B=180, C=180, D=180$ tam bərabər açar paylanması təmin ediləcək.

4. **İkili İzah Modeli:**  
   Xarici dildəki qrammatik qayda qeyd olunmaqla şagirdin ana dilində (Azərbaycan dilində) aydın və anlaşıqlı addım-addım izahat təqdim olunacaq.

---

## 3. Fərdi Dil Hesabatlarına Keçid

Hər bir xarici dil üzrə xüsusi hazırlanmış dərin diaqnostika hesabatları ilə aşağıdakı linklərdən tanış ola bilərsiniz:

1. 🇬🇧 [İngilis dili 3 — Dərin Diaqnostika Hesabatı](file:///C:/Users/User/OneDrive/Desktop/3-cu%20sinif%20testl%C9%99ri/Ingilis_dili_3_Diaqnostika_ve_Analiz_Hesabati.md)
2. 🇷🇺 [Rus dili 3 — Dərin Diaqnostika Hesabatı](file:///C:/Users/User/OneDrive/Desktop/3-cu%20sinif%20testl%C9%99ri/Rus_dili_3_Diaqnostika_ve_Analiz_Hesabati.md)
3. 🇩🇪 [Alman dili 3 — Dərin Diaqnostika Hesabatı](file:///C:/Users/User/OneDrive/Desktop/3-cu%20sinif%20testl%C9%99ri/Alman_dili_3_Diaqnostika_ve_Analiz_Hesabati.md)
4. 🇫🇷 [Fransız dili 3 — Dərin Diaqnostika Hesabatı](file:///C:/Users/User/OneDrive/Desktop/3-cu%20sinif%20testl%C9%99ri/Fransiz_dili_3_Diaqnostika_ve_Analiz_Hesabati.md)
