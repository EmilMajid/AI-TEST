# 🛠️ Texnologiya 3 — Rəsmi Dərslik Əsasında Tam Dərin Analiz və Diaqnostika Hesabatı

**Dərslik Mənbəyi:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin Rəsmi Dərsliyi:  
📖 **"Texnologiya – 3-cü sinif"**  
✍️ **Müəlliflər:** **Natiq Axundov, Hümeyir Əhmədov, Svetlana Yahyayeva, Xuraman Səlimova**  
🏢 **Nəşriyyat:** "Şərq-Qərb" / "Bakınəşr" nəşriyyatı  
🌐 **Elektron Dərslik Portalı:** [e-derslik.edu.az — Texnologiya 3](https://e-derslik.edu.az)

---

## 1. Rəsmi Dərslik Arxitekturası və Fəsillərin Təhlili

3-cü sinif "Texnologiya" dərsliyi şagirdlərdə əmək vərdişləri, təhlükəsiz iş texnikası, materialşünaslıq, bədii konstruksiyaetmə, özünəxidmət və süfrə mədəniyyətini formalaşdıran **2 əsas bölmədən və 10 baza Mövzudan** ibarətdir:

```
                            ┌────────────────────────────────────────────────────────┐
                            │    N. AXUNDOV, H. ƏHMƏDOV — TEXNOLOGİYA 3-CÜ SİNİF     │
                            │              RƏSMİ DƏRSLİK STRUKTURU                   │
                            └───────────────────────────┬────────────────────────────┘
                                                        │
         ┌──────────────────────────────────────────────┴─────────────────────────────────────────────┐
         │                                                                                            │
         ▼                                                                                            ▼
┌──────────────────────────────────────────────────┐        ┌──────────────────────────────────────────────────┐
│ I BÖLMƏ: TEXNOLOJİ VASİTƏLƏR VƏ MATERİALLARLA İŞ │        │ II BÖLMƏ: MƏİŞƏT MƏDƏNİYYƏTİ VƏ SAĞLAM HƏYAT TƏRZİ│
├──────────────────────────────────────────────────┤        ├──────────────────────────────────────────────────┤
│• Əmək alətləri və təhlükəsizlik texnikası        │        │• Özünəxidmət və gigiyena qaydaları               │
│• Kəsici və deşici alətlərlə iş (qayçı, biz, iynə)│        │• Geyimə və ayaqqabıya gündəlik qulluq            │
│• Detalların nişanlanması və pərgardan istifadə   │        │• Süfrə mədəniyyəti (səhər, nahar, şam servisi)   │
│• Kağız, karton və mütəhərrik detallar            │        │• Masa arxasında nəzakətli davranış etikası       │
│• Plastilinlə heykəltaraşlıq (ilbiz, tank, zebr)  │        │• Otaq bitkilərinə qulluq və yaşıllaşdırma        │
│• Toxuculuq materialları və düymə tikilməsi       │        │• Ətraf mühitin mühafizəsi və əməksevərlik        │
└──────────────────────────────────────────────────┘        └──────────────────────────────────────────────────┘
```

---

## 2. Dərslik Mövzuları ilə Mövcud Baza Suallarının Dəqiq Auditi

Platformanın test bazasında (`offline_tests.json`) mövcud olan 150 sual məhz bu 10 mövzunu əhatə edir, lakin sualların dərslər üzrə bölgüsü qeyri-bərabər və pərakəndədir:

### 🔍 Dərslik üzrə Mövzu və Sual Paylanması Cədvəli

| Mövzu № | Dərslikdəki Rəsmi Mövzu Başlığı | Əhatə Etdiyi Əmək və Texnoloji Biliklər | Mövcud Qeyri-bərabər Say | Planlaşdırılan Gold 4.1 |
| :---: | :--- | :--- | :---: | :---: |
| **Mövzu 1** | *Texnologiya bizim əhatəmizdə. Əmək alətləri* | İnsan əməyi, texnoloji proseslər, iş yerinin təşkili, təhlükəsizlik | 28 sual | **15 Sual** |
| **Mövzu 2** | *Kəsici və deşici alətlərlə iş qaydaları* | Qayçı, biz, dəftərxana bıçağı, iynə ilə təhlükəsiz iş qaydaları | 17 sual | **15 Sual** |
| **Mövzu 3** | *Detalların nişanlanması və pərgardan istifadə* | Xətkeş, günyə, pərgar ilə çevrə və radiusun nişanlanması | 11 sual | **15 Sual** |
| **Mövzu 4** | *Təbii və süni materialların xassələri* | Ağac, metal, plastmas, şüşə, gil, təbii materiallar (yarpaq, qoz) | 9 sual | **15 Sual** |
| **Mövzu 5** | *Kağız və kartonla iş (Konstruksiyaetmə)* | Qilaf, zərf, qatlama (orqami), yapışdırma, mütəhərrik birləşmələr | 10 sual | **15 Sual** |
| **Mövzu 6** | *Plastilindən modelləşdirmə (İlbiz, tank, zebr)* | Plastilinlə iş üsulları (diyirləmə, yığma, dartma, relyef, karkas) | 40 sual (pərakəndə) | **15 Sual** |
| **Mövzu 7** | *Toxuculuq materialları və tikiş texnologiyası* | Parça, təbii və süni liflər, saplar, ilgək tikişi, düymə tikilməsi | 6 sual | **15 Sual** |
| **Mövzu 8** | *Özünəxidmət və sanitariya-gigiyena qaydaları* | Şəxsi gigiyena, otaq təmizliyi, paltara və ayaqqabıya düzgün qulluq | 16 sual | **15 Sual** |
| **Mövzu 9** | *Süfrə mədəniyyəti və masa arxasında etika* | Səhər, nahar, şam süfrəsinin tərtibatı, çəngəl-bıçaqdan istifadə | 29 sual (pərakəndə) | **15 Sual** |
| **Mövzu 10** | *Otaq bitkilərinə qulluq və yaşıllaşdırma* | Otaq bitkilərinin sulanması, dibinin yumşaldılması, insan sağlamlığı | 9 sual | **15 Sual** |
| **CƏMİ** | **10 Rəsmi Mövzu** | **Bütün 3-cü Sinif Dərslik Proqramı** | **150 Sual (Qeyri-bərabər)** | **150 Sual (10x15 Standart)** |

---

## 3. Mövcud Bazadakı Qüsurlar və Həlli Yolları

1. **Qeyri-Bərabər Sual Bölgüsü:** Bəzi mövzularda 28-29 sual olduğu halda, bəzilərində cəmi 3-6 sual var. Bütün 10 mövzu dəqiq **15 suallıq bərabər standarta** gətirilməlidir ($10 \times 15 = 150$).
2. **Məlumat Strukturu:** Düz siyahı (`Array`) formatı standart **Mövzu Açarlı Lüğət (`Dictionary`)** formatına çevrilməlidir.
3. **Variant Simmetriyası:** Variant uzunluqları bərabərləşdirilməli (uzunluq nisbəti $\le 1.40$), düzgün cavabın gözəçarpan fərqliliyi aradan qaldırılmalıdır.
4. **Cavab Açarları Balansı:** 150 sual üzrə $A, B, C, D$ variantları dəqiq bərabər paylanmalıdır ($150 / 4 \rightarrow 38, 38, 37, 37$).
5. **Pedaqoji və Təhlükəsizlik İzahları:** Hər sualın altında dərslik səhifəsi, təhlükəsizlik texnikası və texnoloji əməliyyatın ardıcıllığı ətraflı şərh olunmalıdır.

---

## 4. Dərslik Əsasında 10 Mövzunun Məzmun Xəritəsi

### 🛠️ I BÖLMƏ: Texnoloji Vasitələr, Materiallar və Əmək (Mövzu 1 – 7)
1. **Mövzu 1: Texnologiya bizim əhatəmizdə. Əmək alətləri**
   * Texnologiya nədir? Əmək prosesi və insanın yaratdığı maddi nemətlər.
   * Əmək alətləri: iş masası, alətlərin yerləşdirilməsi, iş yerinin nizam-intizamı.
2. **Mövzu 2: Kəsici və deşici alətlərlə iş qaydaları**
   * Qayçı, biz, dəftərxana bıçağı və iynə ilə iş zamanı təhlükəsizlik texnikası.
   * Alətlərin ötürülməsi (qayçını halqaları irəli uzatmaq), qapalı qutularda saxlanması.
3. **Mövzu 3: Detalların nişanlanması və pərgardan istifadə**
   * Xətkeşlə düz xəttin çəkilməsi, bucaqların günyə ilə yoxlanması.
   * Pərgarın quruluşu (iynəli ayaq, qələmli ayaq), radius və diametr anlayışı, çevrənin nişanlanması.
4. **Mövzu 4: Təbii və süni materialların xassələri**
   * Təbii materiallar: ağac, gil, yarpaqlar, qozalar, saman, qum, çınqıl.
   * Süni materiallar: kağız, karton, plastilin, polietilen, süni dəri.
5. **Mövzu 5: Kağız və kartonla iş (Konstruksiyaetmə)**
   * Kağızın qatlanması (orqami sənəti), bükülməsi, kəsilməsi və yapışdırılması.
   * Qilaf və zərflərin hazırlanması, mütəhərrik birləşməli (hərəkətli) oyuncaq modelləri.
6. **Mövzu 6: Plastilindən modelləşdirmə (İlbiz, tank, zebr)**
   * Plastilinin xassələri (yumşaqlıq, plastiklik, rənglərin qarışdırılması).
   * Əsas heykəltaraşlıq priyomları: diyirləmə, yastılama, dartma, yapışdırma, steklə naxışvurma.
   * Mürəkkəb fiqurların (ilbiz, tank, heyvanlar) karkas və detallar üzrə yığılması.
7. **Mövzu 7: Toxuculuq materialları və tikiş texnologiyası**
   * Parçanın növləri (pambıq, yun, ipək), toxunma quruluşu (əriş və arğac sapları).
   * İki və dörd dəlikli düymələrin tikilməsi, ilgək tikişi, təhlükəsiz iynə vərdişləri.

### 🏡 II BÖLMƏ: Məişət Mədəniyyəti, Özünəxidmət və Süfrə Etikası (Mövzu 8 – 10)
8. **Mövzu 8: Özünəxidmət və sanitariya-gigiyena qaydaları**
   * Şəxsi gigiyena və gündəlik rejim.
   * Paltarlara qulluq (təmizləmə, asılqandan istifadə, qatlama) və ayaqqabılara gündəlik qulluq.
9. **Mövzu 9: Süfrə mədəniyyəti və masa arxasında etika**
   * Səhər, nahar və şam süfrəsinin tərtibatı (servis qaydaları).
   * Çəngəl, bıçaq və qaşıqdan düzgün istifadə (bıçaq sağ əldə, çəngəl sol əldə), süfrə etikası.
10. **Mövzu 10: Otaq bitkilərinə qulluq və yaşıllaşdırma**
    * Məktəb və ev otaq bitkilərinin insan sağlamlığında rolu (oksigen mənbəyi).
    * Bitkilərin sulanması, yarpaqlarının tozdan silinməsi, dibinin yumşaldılması.

---

## 5. Gold Standard 4.1 İcra Qaydaları

1. **Dərslik Mətninə 100% Sadiqlik:** Bütün suallar bilavasitə rəsmi "Texnologiya 3" dərsliyinin tədris proqramına əsaslanacaq.
2. **Kəmiyyət Bölgüsü:** 10 Rəsmi Mövzu $\times$ 15 Sual = **Dəqiq 150 Sual**.
3. **100% Simmetriya:** Variantların uzunluqları bərabərləşdiriləcək.
4. **25% Balanslı Açarlar:** $A, B, C, D$ variantları bərabər paylanacaq ($150 / 4 \rightarrow A:38, B:38, C:37, D:37$).
5. **İzahlar:** Hər bir sualın altında əmək təhlükəsizliyi qaydaları və texnoloji ardıcıllıq dərslik səhifəsinə istinadla aydın izah ediləcək.
