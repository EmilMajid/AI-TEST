# 🌐 IV və V Mərhələ Hesabatı: Spiral Kurikulum, Fənlərarası Körpülər, Distraktor Əlaqələri və Asiklik Qraf Topologiyası

> **Standart Tələbi:** Ontologiya sadəcə təcrid olunmuş düyünlər siyahısı deyil; anlayışların fənlərarası asılılıqlarını (`PREREQUISITE_OF`), testologiya distraktor cütlüklərini (`CONTRASTS_WITH`) və tarixi/proses ardıcıllıqlarını (`PRECEDES`) əhatə edən **sərt asiklik (cycle-free DAG)** bilik şəbəkəsidir.

## 📊 1. Qraf Əlaqələrinin Ümumi İcmalı

- **YEKUN QRAF ƏLAQƏLƏRİ (`edges.jsonl`):** **20 ədəd**
- **Iyerarxik DAG Düyün Sayı:** 21 ədəd
- **Qrafda Dövr (Cycle) Sayı:** **0 (Tam Asiklik Sübut Olundu)**

### Əlaqə Tiplərinin Bölgüsü:
- **`CAUSES`:** 1 ədəd
- **`CONTRASTS_WITH`:** 6 ədəd
- **`PART_OF`:** 1 ədəd
- **`PRECEDES`:** 4 ədəd
- **`PREREQUISITE_OF`:** 6 ədəd
- **`SUPPORTS`:** 2 ədəd

---

## 🌉 2. Fənlərarası Körpülər (Cross-Subject Bridges)

Riyaziyyat, Fizika, Kimya və Biologiya arasındakı təbii tədris zəncirləri:

| Başlanğıc (Source) | Əlaqə | Hədəf (Target) | Fənlərarası Əsaslandırma |
| :--- | :---: | :--- | :--- |
| **Valentlik** (Kimya) | `PREREQUISITE_OF` | **chem_qanun_kutlenin_saxlanmasi** () | Kimyəvi tənlikləri tərtib etmək və kütlənin saxlanmasını tətbiq etmək üçün valentlik anlayışı zəruridir |
| **chem_qanun_dovri_qanun** () | `PREREQUISITE_OF` | **Oksidləşmə dərəcəsi** (Kimya) | Dövri sistemdə elementin qrupu onun mümkün oksidləşmə dərəcələrinin müəyyən edilməsinin əsasını təşkil edir |
| **İkidəyişənli xətti tənlik** (Riyaziyyat) | `PREREQUISITE_OF` | **Ohm qanunu** (Fizika) | Fizikada Ohm qanunu (U = IR) riyaziyyatın xətti asılılıq və iki dəyişənli tənliklər aparatına əsaslanır |
| **Oksidləşmə dərəcəsi** (Kimya) | `PREREQUISITE_OF` | **Qlükozanın oksidləşməsi** (Biologiya) | Biologiyada hüceyrə tənəffüsü və qlükozanın oksidləşməsini anlamaq üçün kimyəvi oksidləşmə anlayışı ön-şərtdir |

---

## 🎯 3. Testologiya və Distraktor Əlaqələri (`CONTRASTS_WITH`)

Test generatoru və diaqnostika üçün şagirdlərin ən çox qarışdırdığı qızıl cütlüklər (DİM imtahan təhlillərinə əsaslanan distraktor mənbəyi):

| Anlayış A | Əlaqə | Anlayış B | Tipik Tələbə Qarışıqlığı və Ayırıcı Meyar |
| :--- | :---: | :--- | :--- |
| **Ampermetr** | `CONTRASTS_WITH` | **Voltmetr** | Dövrəyə qoşulma qaydası (ardıcıl vs paralel) və ölçülən kəmiyyət (cərəyan vs gərginlik) üzrə ən çox qarışdırılan cütlük |
| **Musson küləkləri** | `CONTRASTS_WITH` | **Passat küləkləri** | Küləklərin rejim xarakteri: Musson mövsümi (ildə 2 dəfə istiqamət dəyişən) vs Passat daimi ilboyu əsən küləkdir |
| **Pifaqor teoremi** | `CONTRASTS_WITH` | **Tərs teorem** | Düz teorem (katetlər -> hipotenuz) ilə tərs teorem (a²+b²=c² -> düzbucaqlı üçbucaq) arasındakı məntiqi qarışıqlıq |
| **Təkamül** | `CONTRASTS_WITH` | **Makrotəkamül** | Mikrotəkamül/ümumi təkamül (növ daxili) ilə makrotəkamül (növdən yuxarı taksonlar) sərhədinin fərqləndirilməsi |
| **Amasiya sülhü** | `CONTRASTS_WITH` | **Qəsri-Şirin sülhü** | Səfəvi-Osmanlı müharibələrini yekunlaşdıran iki əsas sülh: I müharibənin yekunu (1555) vs qəti sərhədləri müəyyən edən sülh (1639) |
| **Qrip** | `CONTRASTS_WITH` | **Qızılca** | Hava-damcı virusları: Tənəffüs yolları xəstəliyi (qrip) vs səpgili uşaq infeksiyası (qızılca) |

---

## 🔍 4. Topoloji Asiklik Yoxlanışı (Kahn Alqoritmi Sübutu)

Bütün iyerarxik istiqamətləndirilmiş kənarlar (`PREREQUISITE_OF`, `PRECEDES`, `CAUSES`, `PART_OF`) üzərində tam asiklik testi aparıldı:

```text
Kahn DAG Traversal: 100% ziddiyyətsiz asiklik təsdiqləndi.
Topoloji ardıcıllıq zənciri:
chem_qanun_dovri_qanun -> 
hist_muqavile_rest_1732 -> 
math_anlayis_kvadrat_tenlik -> 
math_anlayis_ikideyisenli_xetti_tenlik -> 
bio_proses_translyasiya -> 
geo_qanunauygunluq_enlik_zonalligi -> 
chem_anlayis_valentlik -> 
geo_obyekt_kur_cayi -> ...
```

Heç bir anlayış öz-özünün və ya törəməsinin ön-şərti deyil. Bu, TestAI KAG mühərrikində tələbənin zəif nöqtəsini geriyə izləyərkən (backward traversal) sonsuz dövrə düşmə riskini **0%-ə** endirir.
