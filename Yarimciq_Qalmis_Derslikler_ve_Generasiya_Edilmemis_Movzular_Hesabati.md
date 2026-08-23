# 📑 Yarımçıq Qalmış Dərsliklər və Hələ Testi Generasiya Edilməmiş Mövzular üzrə Tam Dərin Hesabat

**Hesabat Tarixi:** 2026-cı il  
**Tədqiqat Metodologiyası:** Sistemdəki rəsmi dərsliklərin tam mündəricatı (TOC / RAG mənbələri) ilə hazırkı test bazasında (`offline_tests.json`) mövcud olan mövzuların 1-ə 1 dəqiq çarpaz müqayisəsi.  
**Məqsəd:** Dərslik üzrə yalnız **bir hissəsinə (məsələn, 1-ci yarımil və ya ilkin fəsillərinə)** test yazılmış, lakin qalan fəsilləri və mövzuları sistemdə və RAG datasında olmasına baxmayaraq **hələ testi generasiya edilməmiş** bütün yarımçıq dərsliklərin və onların dəqiq çatışmayan mövzularının aşkara çıxarılması.

---

## 1. Qlobal İcra Mənzərəsi və Diaqnostik Xülasə

Sistemdəki 121 aktiv fənn açarı üzrə aparılan təhlil göstərir ki:
1. **Tam Əhatə Olunmuş Fənlər:** Bütün ibtidai 3-cü və 4-cü sinif fənləri, eləcə də 5, 6, 7-ci siniflərin əsas fənləri (o cümlədən **Alman dili 5 (əsas) — 6 Lektion**, **İngilis dili 5 (əsas) — 8 Unit**) dərslik üzrə başdan-ayağa (bütün fəsillər) 100% əhatə olunmuşdur.
2. **Yarımçıq Qalmış (Yalnız 1-ci hissəsi/fəsilləri yazılmış) Fənlər:** **25 Əsas Fənn/Dərslikdə** yalnız ilkin bölmələr (adətən 1-ci yarımil proqramı) testləşdirilmiş, 2-ci yarımilin böyük fəsilləri və mövzuları isə RAG datasında olduğu halda hələ test generasiya edilməmişdir.

---

## 2. Yarımçıq Qalmış Dərsliklərin Siniflər üzrə İcmal Cədvəli

| Sinif | Fənnin Adı | Dərslikdəki Tam Mövzu Sayı | Hazırda Testi Olan Mövzu Sayı | Çatışmayan Mövzu Sayı | Tamamlanma Faizi |
| :---: | :--- | :---: | :---: | :---: | :---: |
| 🎓 **11** | **Riyaziyyat 11** | **36 mövzu** | 9 mövzu | **❌ 27 mövzu** | **25%** |
| 🎓 **11** | **Kimya 11** | **38 mövzu** | 10 mövzu | **❌ 28 mövzu** | **26%** |
| 🎓 **11** | **Fizika 11** | **45 mövzu** | 19 mövzu | **❌ 26 mövzu** | **42%** |
| 🎓 **11** | **Azərbaycan dili 11** | **28 mövzu** | 7 mövzu | **❌ 21 mövzu** | **25%** |
| 🎓 **11** | **Ümumi tarix 11** | **32 mövzu** | 8 mövzu | **❌ 24 mövzu** | **25%** |
| 🎓 **11** | **Coğrafiya 11** | **30 mövzu** | 11 mövzu | **❌ 19 mövzu** | **37%** |
| 🎓 **11** | **Ədəbiyyat 11** | **26 mövzu** | 10 mövzu | **❌ 16 mövzu** | **38%** |
| 🎓 **11** | **İngilis dili 11** | **12 Unit** | 6 Unit | **❌ 6 Unit** | **50%** |
| 📘 **10** | **Kimya 10** | **36 mövzu** | 14 mövzu | **❌ 22 mövzu** | **39%** |
| 📘 **10** | **Azərbaycan dili 10** | **28 mövzu** | 11 mövzu | **❌ 17 mövzu** | **39%** |
| 📘 **10** | **Coğrafiya 10** | **38 mövzu** | 17 mövzu | **❌ 21 mövzu** | **45%** |
| 📘 **10** | **Ədəbiyyat 10** | **28 mövzu** | 12 mövzu | **❌ 16 mövzu** | **43%** |
| 📘 **10** | **İngilis dili 10** | **14 Unit** | 9 Unit | **❌ 5 Unit** | **64%** |
| 📗 **9** | **Riyaziyyat 9** | **42 mövzu** | 19 mövzu | **❌ 23 mövzu** | **45%** |
| 📗 **9** | **Kimya 9** | **38 mövzu** | 16 mövzu | **❌ 22 mövzu** | **42%** |
| 📗 **9** | **Fizika 9** | **48 mövzu** | 30 mövzu | **❌ 18 mövzu** | **62%** |
| 📗 **9** | **Ədəbiyyat 9** | **28 mövzu** | 12 mövzu | **❌ 16 mövzu** | **43%** |
| 📗 **9** | **İngilis dili 9** | **12 Unit** | 6 Unit | **❌ 6 Unit** | **50%** |
| 📙 **8** | **Fizika 8** | **56 mövzu** | 24 mövzu | **❌ 32 mövzu** | **43%** |
| 📙 **8** | **Biologiya 8** | **53 mövzu** | 19 mövzu | **❌ 34 mövzu** | **36%** |
| 📙 **8** | **Kimya 8** | **48 mövzu** | 15 mövzu | **❌ 33 mövzu** | **31%** |
| 📙 **8** | **Coğrafiya 8** | **46 mövzu** | 18 mövzu | **❌ 28 mövzu** | **39%** |
| 📙 **8** | **Ümumi tarix 8** | **28 mövzu** | 11 mövzu | **❌ 17 mövzu** | **39%** |
| 📙 **8** | **İngilis dili 8** | **12 Unit** | 6 Unit | **❌ 6 Unit** | **50%** |
| 📕 **7** | **Alman dili 7** | **16 mövzu** | 6 mövzu | **❌ 10 mövzu** | **38%** |
| 📕 **7** | **Fransız dili 7** | **16 mövzu** | 8 mövzu | **❌ 8 mövzu** | **50%** |
| 📓 **6** | **Azərbaycan tarixi 6** | **24 mövzu** | 9 mövzu | **❌ 15 mövzu** | **38%** |
| 📓 **6** | **Ümumi tarix 6** | **26 mövzu** | 12 mövzu | **❌ 14 mövzu** | **46%** |
| 📓 **6** | **Coğrafiya 6** | **32 mövzu** | 12 mövzu | **❌ 20 mövzu** | **38%** |

---

## 3. Yarımçıq Qalmış Dərsliklərin Fənn-Fənn Detallı Analizi

### 🎓 11-ci SİNİF ÜZRƏ YARIMÇIQ DƏRSLİKLƏR

#### 1. 📐 Riyaziyyat 11 (Cəmi 36 mövzu | Testi var: 9 | ❌ Qalıb: 27 mövzu)
* **Testi yazılmış hissə (25%):** Fəsil 1 — Çoxhədlilər və rasional tənliklər (9 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Fəsil 2: Funksiyalar, limit və kəsilməzlik** *(Funksiyaların limiti, Görkəmli limitlər, Kəsilməzlik — 7 mövzu)*
  * ❌ **Fəsil 3: Törəmə və onun tətbiqləri** *(Törəmənin həndəsi və fiziki mənası, Funksiyanın ekstremumları, Toxunanın tənliyi — 8 mövzu)*
  * ❌ **Fəsil 4: İbtidai funksiya və qeyri-müəyyən/müəyyən inteqral** *(Nyuton-Leybnis düsturu, Əyrixətli trapesiyanın sahəsi — 6 mövzu)*
  * ❌ **Fəsil 5: Fəza fiqurları (Fırlanma cisimləri) və Ehtimal** *(Silindr, Konus, Kürə, Mürəkkəb hadisələrin ehtimalı — 6 mövzu)*

#### 2. 🧪 Kimya 11 (Cəmi 38 mövzu | Testi var: 10 | ❌ Qalıb: 28 mövzu)
* **Testi yazılmış hissə (26%):** Bölmə 1 — Spirtlər və fenollar (10 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Bölmə 2: Aldehidlər və ketonlar** *(Quruluşu, izomerliyi, alınması, kimyəvi xassələri — 5 mövzu)*
  * ❌ **Bölmə 3: Karbon turşuları, mürəkkəb efirlər və yağlar** *(Doymuş və doymamış birəsaslı turşular, Yağların sabunlaşması — 8 mövzu)*
  * ❌ **Bölmə 4: Karbohidratlar** *(Qlükoza, Fruktoza, Saxaroza, Nişasta, Sellüloza — 6 mövzu)*
  * ❌ **Bölmə 5: Azotlu üzvi birləşmələr** *(Aminlər, Anilin, Amin turşuları, Peptidlər, Zülallar — 5 mövzu)*
  * ❌ **Bölmə 6: Yüksəkmolekullu birləşmələr və sintetik polimerlər** *(Plastmaslar, Sintetik liflər — 4 mövzu)*

#### 3. ⚡ Fizika 11 (Cəmi 45 mövzu | Testi var: 19 | ❌ Qalıb: 26 mövzu)
* **Testi yazılmış hissə (42%):** Fəsil 1 — Elektrostatika və Sabit cərəyan qanunları (19 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Fəsil 2: Maqnit sahəsi və Elektromaqnit induksiyası** *(Faradey qanunu, Lorens qüvvəsi, Öz-özünə induksiya — 8 mövzu)*
  * ❌ **Fəsil 3: Elektromaqnit rəqsləri və dalğaları** *(Rəqs konturu, Dəyişən cərəyan, Transformator, Radiodalğalar — 7 mövzu)*
  * ❌ **Fəsil 4: Dalğa və həndəsi optika** *(İşığın interferensiyası, difraksiyası, polyarlaşması, dispersion — 6 mövzu)*
  * ❌ **Fəsil 5: Kvant fizikası, Atom və nüvə fizikası** *(Fotoeffekt, Bor postulatları, Radioaktivlik, Nüvə reaksiyaları — 5 mövzu)*

#### 4. 🇦🇿 Azərbaycan dili 11 (Cəmi 28 mövzu | Testi var: 7 | ❌ Qalıb: 21 mövzu)
* **Testi yazılmış hissə (25%):** Fonetika və Leksika ümumiləşdirməsi (7 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Morfologiya və Sintaksis normaları** *(Əsas və köməkçi nitq hissələri, Mürəkkəb cümlə sintaksisi və durğu işarələri — 8 mövzu)*
  * ❌ **Funksional üslublar** *(Bədii, Elmi, Publisistik, Rəsmi-işgüzar, Məişət üslubları — 7 mövzu)*
  * ❌ **Mətn üzərində iş və nitq mədəniyyəti** *(Mətndə fakt və münasibət, Abzas və struktur təhlili, Redaktə qaydaları — 6 mövzu)*

#### 5. 🏛️ Ümumi tarix 11 (Cəmi 32 mövzu | Testi var: 8 | ❌ Qalıb: 24 mövzu)
* **Testi yazılmış hissə (25%):** XIX əsrin sonu - XX əsrin əvvəllərində dünya dövlətləri (8 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Birinci Dünya müharibəsi və Versal-Vaşinqton sistemi (6 mövzu)**
  * ❌ **İkinci Dünya müharibəsi: Səbəbləri, gedişi və nəticələri (6 mövzu)**
  * ❌ **İkinci Dünya müharibəsindən sonra beynəlxalq münasibətlər ("Soyuq müharibə" və Hərbi bloklar - 6 mövzu)**
  * ❌ **Müasir dövrdə dünya dövlətləri və Qloballaşma prosesləri (6 mövzu)**

---

### 📘 10-cu SİNİF ÜZRƏ YARIMÇIQ DƏRSLİKLƏR

#### 1. 🧪 Kimya 10 (Cəmi 36 mövzu | Testi var: 14 | ❌ Qalıb: 22 mövzu)
* **Testi yazılmış hissə (39%):** Alkanlar və Alkenlər (14 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Alkadienlər və Sintetik kauçuklar (4 mövzu)**
  * ❌ **Alkinlər və Asetilenin kimyəvi xassələri (5 mövzu)**
  * ❌ **Aromatik karbohidrogenlər (Arenlər / Benzol homoloqları - 6 mövzu)**
  * ❌ **Təbii qaz, Neft və Daş kömürün sənaye emalı (7 mövzu)**

#### 2. 🌍 Coğrafiya 10 (Cəmi 38 mövzu | Testi var: 17 | ❌ Qalıb: 21 mövzu)
* **Testi yazılmış hissə (45%):** Kainat, Litosfer və Atmosfer hadisələri (17 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Hidrosfer və Dünya okeanının dinamikası (6 mövzu)**
  * ❌ **Biosfer və Coğrafi təbəqənin qanunauyğunluqları (5 mövzu)**
  * ❌ **Dünya əhalisi, Demoqrafik keçid və Urbanizasiya (5 mövzu)**
  * ❌ **Dünya təsərrüfatının sahə strukturu və təbii ehtiyatlar (5 mövzu)**

#### 3. 📚 Ədəbiyyat 10 (Cəmi 28 mövzu | Testi var: 12 | ❌ Qalıb: 16 mövzu)
* **Testi yazılmış hissə (43%):** Qədim dövrdən XVI əsrə qədər (Dədə Qorqud, N.Gəncəvi, İ.Nəsimi, M.Füzuli - 12 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **XVII – XIX əsrlər ədəbiyyatı:** M.P.Vaqif, M.V.Vidadi, Q.Zakir, M.F.Axundzadə ("Hacı Qara", "Aldanmış kəvakib"), S.Ə.Nəbəti, N.Vəzirov ("Müsibəti-Fəxrəddin" - 16 mövzu).

---

### 📗 9-cu SİNİF ÜZRƏ YARIMÇIQ DƏRSLİKLƏR

#### 1. 📐 Riyaziyyat 9 (Cəmi 42 mövzu | Testi var: 19 | ❌ Qalıb: 23 mövzu)
* **Testi yazılmış hissə (45%):** Həqiqi ədədlər, Kvadrat köklər və Kvadrat tənliklər (19 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Kvadratik funksiya və qrafiklər (6 mövzu)**
  * ❌ **Bərabərsizliklər və bərabərsizliklər sistemi (6 mövzu)**
  * ❌ **Ədədi ardıcıllıqlar və Silsilələr (Ədədi və Həndəsi silsilə - 5 mövzu)**
  * ❌ **Çevrə, Çoxbucaqlılar, Sahələr və Vektorlar (6 mövzu)**

#### 2. 🧪 Kimya 9 (Cəmi 38 mövzu | Testi var: 16 | ❌ Qalıb: 22 mövzu)
* **Testi yazılmış hissə (42%):** Metalların ümumi xarakteristikası və ərintilər (16 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Qələvi və Qələvi-torpaq metalları (Natrium, Kalium, Kalsium - 5 mövzu)**
  * ❌ **Alüminium, Dəmir və onların ərintiləri (6 mövzu)**
  * ❌ **Qeyri-metallar: Halogenlər, Oksigen, Kükürd (6 mövzu)**
  * ❌ **Azot, Fosfor, Karbon və Silisium (5 mövzu)**

---

### 📙 8-ci SİNİF ÜZRƏ YARIMÇIQ DƏRSLİKLƏR

#### 1. ⚡ Fizika 8 (Cəmi 56 mövzu | Testi var: 24 | ❌ Qalıb: 32 mövzu)
* **Testi yazılmış hissə (43%):** Fəsil 1 və 2 — İstilik hadisələri və Aqreqat halları (24 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Fəsil 3: Elektrik yükləri və Elektrostatik sahə (10 mövzu)**
  * ❌ **Fəsil 4: Sabit elektrik cərəyanı, Müqavimət və Om qanunu (12 mövzu)**
  * ❌ **Fəsil 5: Elektromaqnit və İşıq hadisələri (10 mövzu)**

#### 2. 🧬 Biologiya 8 (Cəmi 53 mövzu | Testi var: 19 | ❌ Qalıb: 34 mövzu)
* **Testi yazılmış hissə (36%):** İnsan bədəni, Dayaq-hərəkət və Qan-damar sistemi (19 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Tənəffüs və Həzm sistemi (9 mövzu)**
  * ❌ **İfrazat sistemi və Dəri (6 mövzu)**
  * ❌ **Sinir sistemi və Ali sinir fəaliyyəti (10 mövzu)**
  * ❌ **Duyğu orqanları və Analizatorlar (5 mövzu)**
  * ❌ **Endokrin vəzilər və Humoral tənzim (4 mövzu)**

#### 3. 🧪 Kimya 8 (Cəmi 48 mövzu | Testi var: 15 | ❌ Qalıb: 33 mövzu)
* **Testi yazılmış hissə (31%):** Dövri qanun və Atomun quruluşu (15 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Fəsil 2: Kimyəvi rabitə və Maddənin quruluşu (9 mövzu)**
  * ❌ **Fəsil 3: Maddə miqdarı, Avoqadro qanunu və Molyar həcm (8 mövzu)**
  * ❌ **Fəsil 4: Qeyri-üzvi birləşmələr (Oksidlər, Əsaslar, Turşular, Duzlar - 16 mövzu)**

---

### 📓 6-cı SİNİF ÜZRƏ YARIMÇIQ DƏRSLİKLƏR

#### 1. 🏛️ Azərbaycan tarixi 6 (Cəmi 24 mövzu | Testi var: 9 | ❌ Qalıb: 15 mövzu)
* **Testi yazılmış hissə (38%):** İbtidai icma və Erkən dövlət qurumları (Manna daxil - 9 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Midiya və Əhəmənilər imperiyası dövründə Azərbaycan (4 mövzu)**
  * ❌ **Atropatena dövləti, hökmdarları və mədəniyyəti (5 mövzu)**
  * ❌ **Qafqaz Albaniyası dövləti, şəhərləri və mədəniyyəti (6 mövzu)**

#### 2. 🌍 Ümumi tarix 6 (Cəmi 26 mövzu | Testi var: 12 | ❌ Qalıb: 14 mövzu)
* **Testi yazılmış hissə (46%):** Qədim Şərq ölkələri (Misir, Mesopotamiya, Hindistan, Çin - 12 mövzu).
* **Testi YAZILMAMIŞ yarımçıq hissələr:**
  * ❌ **Qədim Yunanıstan (Krit-Miken, Afina, Sparta, İsgəndər imperiyası - 7 mövzu)**
  * ❌ **Qədim Roma (Krallıq, Respublika, Spartak üsyanı, İmperiya və süqutu - 7 mövzu)**

---

## 4. Xarici Dillər üzrə Yarımçıq Qalmış Dərsliklər

* 🇬🇧 **İngilis dili 11:** 12 Unit-dən **6 Unit generasiya olunub** *(Unit 7–12 qalıb)*
* 🇬🇧 **İngilis dili 10:** 14 Unit-dən **9 Unit generasiya olunub** *(Unit 10–14 qalıb)*
* 🇬🇧 **İngilis dili 9:** 12 Unit-dən **6 Unit generasiya olunub** *(Unit 7–12 qalıb)*
* 🇬🇧 **İngilis dili 8:** 12 Unit-dən **6 Unit generasiya olunub** *(Unit 7–12 qalıb)*
* 🇩🇪 **Alman dili 7:** 16 Lektion-dan **6 Lektion generasiya olunub** *(Lektion 7–16 qalıb)*
* 🇫🇷 **Fransız dili 7:** 16 Unité-dən **8 Unité generasiya olunub** *(Unité 9–16 qalıb)*

> **Qeyd (100% Tamamlanmış Xarici Dillər):**  
> * **Alman dili 5 (əsas xarici dil):** Dərslikdə olan bütün **6 Lektion (30 Stunde)** 100% generasiya edilib (605 sual).  
> * **İngilis dili 5 (əsas xarici dil):** Dərslikdə olan bütün **8 Unit** 100% generasiya edilib (237 sual).
