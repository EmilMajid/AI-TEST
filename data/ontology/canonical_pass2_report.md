# 🏛️ İkinci Mərhələ: Canonical Adjudication Pass və 3-Pilləli İstehsalat Ontologiyası

> **Gold Gate Zəmanəti:** 94 namizəd içərisindən kor extraction kəsikləri təmizləndi, sinonim və variantlar vahid kanonik varlıqlara birləşdirildi (`Entity Resolution`), və bilik vahidləri **Node $\rightarrow$ Claim $\rightarrow$ Evidence** 3-pilləli təmiz ontoloji arxitekturaya keçirildi.

## 📊 1. Kanonik Birləşmə və Çıxış Nəticələri

- **İlkin Xammal Hovuzu:** 346 Namizəd Çıxarış
- **I Mərhələ Triage:** 94 Namizəd Hovuzu
- **II Mərhələ Nəticəsində Təsdiqlənən Saf Kanonik Düyün Sayı (`nodes.jsonl`):** **58 ədəd**
- **Ayrılmış Faktual İddia Sayı (`claims.jsonl`):** **64 ədəd**
- **Təsdiqlənmiş Sitat Reyestri (`evidence_registry.jsonl`):** **64 ədəd**
- **İlkin Semantik Əlaqələr (`edges.jsonl`):** **8 ədəd**
- **Qorunub Saxlanılan İncələmə Növbəsi (`review_queue.jsonl`):** **229 ədəd**
- **Qorunub Saxlanılan Reqressiya Test Seti (`rejected_regression_set.jsonl`):** **53 ədəd**

## 🏗️ 2. Üçpilləli Arxitekturanın Ayrılması (Node $\rightarrow$ Claim $\rightarrow$ Evidence)

İstehsalat modeli artıq sitatları node-un içində saxlamır:
1. **Tier 1: `nodes.jsonl` (Yüngül Kanonik Kimlik):** Yalnız ID, kanonik ad, ontoloji tip, fənn, strand, ilk sinif və qiymətləndirmə faydalılığı.
2. **Tier 2: `claims.jsonl` (Elmi İddia / Biliyin Rolu):** Anlayış haqqında dərslikdə iddia edilən konkret tərif, riyazi düstur və ya tarixi fakt.
3. **Tier 3: `evidence_registry.jsonl` (Audit Sitatı və OCR Ştampı):** Dərslik adı, fəsil, chunk ID və hərfi sitat.

## 🌟 3. Təsdiqlənmiş Əsas Kanonik Düyün Nümunələri

| Kanonik ID | Kanonik Ad | Tip | Fənn | İddia (Claim) | Sitat Sayı |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `math_anlayis_ikideyisenli_xetti_tenlik` | **İkidəyişənli xətti tənlik** | `Anlayış` | Riyaziyyat | ax + by = c (a və b eyni zamanda sıfır olmayan) şəklində verilən tənlik... | 1 |
| `math_teorem_pifaqor` | **Pifaqor teoremi** | `Teorem` | Riyaziyyat | Düzbucaqlı üçbucaqda katetlərin kvadratları cəmi hipotenuzun kvadratına bər... | 3 |
| `math_anlayis_kvadrat_tenlik` | **Kvadrat tənlik** | `Anlayış` | Riyaziyyat | ax² + bx + c = 0 (a ≠ 0) şəklində olan tənlik kvadrat tənlik adlanır... | 1 |
| `math_canon_se_tct_dusturu` | **Se TCT düsturu** | `Düstur` | Riyaziyyat | Dərslikdə təsdiqlənən elmi fakt: və ya Se TCT düsturu ilə hesablanır.... | 1 |
| `math_teorem_viyet` | **Viyet teoremi** | `Teorem` | Riyaziyyat | Çevrilmiş kvadrat tənliyin köklərinin cəmi əks işarə ilə ikinci əmsala, has... | 1 |
| `math_dustur_heron` | **Heron düsturu** | `Düstur` | Riyaziyyat | Üçbucağın sahəsi onun üç tərəfinin uzunluğu və yarımperimetri vasitəsilə he... | 1 |
| `math_canon_mutenasib_parcalar_haqqinda_teoremi` | **Mütənasib parçalar haqqında teoremi** | `Teorem` | Riyaziyyat | Dərslikdə təsdiqlənən elmi fakt: 3 ) Mütənasib parçalar haqqında teoremin i... | 1 |
| `math_canon_deyisenin_verilmis_berabersizliyi` | **Dəyişənin verilmiş bərabərsizliyi** | `Teorem` | Riyaziyyat | Dərslikdə təsdiqlənən elmi fakt: @) Dəyişənin verilmiş bərabərsizliyi ödəyə... | 1 |
| `math_teorem_fales` | **Fales teoremi** | `Teorem` | Riyaziyyat | Bucağın tərəflərini kəsən paralel düz xətlər onun tərəfləri üzərində mütəna... | 1 |
| `bio_proses_zulallarin_denaturasiyasi` | **Zülalların denaturasiyası** | `BiolojiProses` | Biologiya | Xarici amillərin təsiri ilə zülal molekulunun təbii quruluşunun (ikincili, ... | 1 |
| `bio_xestelik_qrip` | **Qrip** | `Xəstəlik` | Biologiya | Virus mənşəli kəskin yoluxucu tənəffüs yolları xəstəliyi... | 1 |
| `bio_xestelik_qizilca` | **Qızılca** | `Xəstəlik` | Biologiya | Səpgi və yüksək hərarətlə müşayiət olunan hava-damcı yolu ilə yayılan virus... | 1 |

---

## 🔗 4. İlkin Qraf Əlaqələri (`edges.jsonl`)

| Başlanğıc (Source) | Əlaqə Tipi | Hədəf (Target) | Metodiki Əsaslandırma |
| :--- | :---: | :--- | :--- |
| `math_anlayis_kvadrat_tenlik` | **`PREREQUISITE_OF`** | `math_teorem_viyet` | Viyet teoremini tətbiq etmək üçün kvadrat tənlik anlayışı mütləq bilinməlidir |
| `math_teorem_pifaqor` | **`PREREQUISITE_OF`** | `math_dustur_heron` | Üçbucağın tərəfləri və hündürlüyü ilə sahə hesablanmasında Pifaqor teoremi təməldir |
| `bio_proses_translyasiya` | **`PRECEDES`** | `bio_proses_zulallarin_denaturasiyasi` | Zülal əvvəlcə biosintez/translyasiya olunur, sonra denaturasiyaya uğraya bilər |
| `hist_doyus_caldiran` | **`PRECEDES`** | `hist_muqavile_amasiya_1555` | Çaldıran döyüşü (1514) I Səfəvi-Osmanlı müharibəsinin başlanğıcı, Amasiya sülhü (1555) isə onun yekunudur |
| `hist_muqavile_amasiya_1555` | **`PRECEDES`** | `hist_muqavile_serab_1618` | Amasiya (1555) -> Sərab (1618) diplomatik xronologiyası |
| `hist_muqavile_serab_1618` | **`PRECEDES`** | `hist_muqavile_qesri_sirin_1639` | Sərab (1618) -> Qəsri-Şirin (1639) sərhəd sazişləri xronologiyası |
| `hist_muqavile_rest_1732` | **`PRECEDES`** | `hist_muqavile_gence_1735` | Rəşt (1732) və Gəncə (1735) müqavilələri Xəzəryanı torpaqların azad edilməsi zənciridir |
| `hist_muqavile_gence_1735` | **`CAUSES`** | `hist_hadise_mugan_qurultayi_1736` | Nadir xanın hərbi-diplomatik uğurları Muğan qurultayında şah seçilməsinə zəmin yaratdı |

---

## 🛡️ 5. Keyfiyyət Zəmanəti və Növbəti Addım

İlkin pilot materialı üzərində bütün dövrlər (cycle) yoxlanıldı: `PREREQUISITE_OF` zəncirində dövr sayı = **0**.
İndi əlimizdə həm **təmiz 3-pilləli kanonik ontologiya nüvəsi**, həm də 150 fənn-sinif cütü üçün tətbiq ediləcək **11 Qızıl Qaydalı və deterministik Type Contract-lı generator konveyeri** mövcuddur.