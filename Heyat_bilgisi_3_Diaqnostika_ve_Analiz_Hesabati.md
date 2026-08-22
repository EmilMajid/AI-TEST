# 🌍 Həyat Bilgisi 3 (3-cü Sinif) — Tam Dərin Analiz və Diaqnostika Hesabatı

**Hesabat Tarixi:** 22 Avqust 2026  
**Fənn:** Həyat bilgisi 3-cü sinif  
**Standart:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin Milli Kurikulumu və Dərslik Standartları  
**Hədəf Keyfiyyət Səviyyəsi:** Gold Standard 4.1 (100% Dərslik İnteqrasiyası, 100% Variant Simmetriyası, 25% Balanslaşdırılmış Cavab Açarları)

---

## 1. Mövcud Baza Vəziyyətinin Audit və Diaqnostikası

Platformanın test bazasında (`offline_tests.json`) və layihə mühitində **Həyat bilgisi 3** üzrə aparılan dərin texniki diaqnostikanın nəticələri:

### 🔍 Diaqnostik Audit Göstəriciləri

| Göstərici | Mövcud Vəziyyət | Gold Standard 4.1 Tələbi | Kəsir / Uyğunsuzluq |
| :--- | :---: | :---: | :--- |
| **Məlumat Strukturu** | `Array` (Düz siyahı) | `Dictionary` (Mövzu açarlı obyekt) | Standart arxitekturaya uyğunlaşdırılmalıdır |
| **Bölmə Əhatəsi** | Natamam (yalnız 3-4 mövzu sahəsi) | **8 Tam Bölmə** (I və II Yarımil) | Təbiət, Ekologiya, Təhlükəsizlik və Texnika yox dərəcəsindədir |
| **Mövzu Sayı** | ~15 qeyri-bərabər mövzu | **48 Standart Mövzu** (Hər bölmədə 6 mövzu) | 33 rəsmi mövzu tamamilə çatışmır |
| **Ümumi Sual Sayı** | **189 Sual** | **720 Sual** ($48 \times 15$) | **531 sual çatışmır (73.75% kəsir)** |
| **Mövzu Başına Sual** | 2 ilə 17 arasında dağınıq | **Hər mövzuda sabit 15 sual** | Bəzi mövzularda cəmi 2-3 sual var |
| **Variant Simmetriyası** | Qeyri-bərabər (doğru cavab daha uzundur) | **100% Simmetrik** ($\pm 10-15\%$) | Vizual olaraq doğru cavab seçilir |
| **Cavab Açarları Balansı** | Təsadüfi paylanma | **Dəqiq 25%** (180 A, 180 B, 180 C, 180 D) | Şagirdin təxmin etmə riski yüksəkdir |
| **Pedaqoji İzahlar** | Natamam / Standartsız | **Dərslik səhifəsinə istinadlı tam izah** | Metodik əsaslandırma gücləndirilməlidir |

---

## 2. 3-cü Sinif Həyat Bilgisi Məzmun Xətləri və Təlim Standartları

Azərbaycan Respublikası Elm və Təhsil Nazirliyinin 3-cü sinif Həyat Bilgisi dərslik proqramı 4 əsas məzmun xətti üzərində qurulmuşdur:

```
                               ┌─────────────────────────────────────────┐
                               │       3-CÜ SİNİF HƏYAT BİLGİSİ          │
                               │           MƏZMUN XƏTLƏRİ                │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌──────────────────┬───────────────────────┴───────────────────────┬──────────────────┐
         │                  │                                               │                  │
         ▼                  ▼                                               ▼                  ▼
┌─────────────────┐┌─────────────────┐                            ┌───────────────────┐┌─────────────────┐
│ 1. İNSAN VƏ     ││   2. İNSAN VƏ   │                            │    3. İNSAN VƏ    ││ 4. İNSAN VƏ     │
│   CƏMİYYƏT      ││     TƏBİƏT      │                            │    SAĞLAMLIQ      ││   TƏHLÜKƏSİZLİK │
├─────────────────┤├─────────────────┤                            ├───────────────────┤├─────────────────┤
│• Hüquq/Vəzifələr││• Canlı/Cansız   │                            │• Bədən orqanları  ││• Məişət təhlük. │
│• Mənəvi dəyərlər││  təbiət         │                            │• Skelet və əzələ  ││• Yol hərəkəti   │
│• Vətən, Rəmzlər ││• Fosillər/süxur │                            │• Düzgün qamət     ││• Təbii fəlakət  │
│• Qəhrəmanlarımız││• Su, hava, torp.│                            │• Qidalanma rejimi ││• İlk tibbi      │
│• Milli birlik   ││• Qoruq/Ekologiya│                            │• Gigiyena qaydaları│   yardım (112)  │
└─────────────────┘└─────────────────┘                            └───────────────────┘└─────────────────┘
```

---

## 3. Bölmələr və 48 Standart Mövzunun Tam Xəritəsi (I və II Yarımil)

Hər bölmə 6 mövzudan və hər mövzu 15 xüsusi hazırlanmış Gold Standard test sualından ibarət olmaqla ümumilikdə **720 suallıq** kamil arxitektura:

### 📘 I YARIMİL (BÖLMƏ 1 – 4: 24 Mövzu / 360 Sual)

#### 🔸 BÖLMƏ 1: Fərd və Cəmiyyət (Mən və İnsanlar) (6 Mövzu / 90 Sual)
1. **FƏRD VƏ CƏMİYYƏT - Uşaq hüquqları və vəzifələrimiz** *(Təhsil, istirahət, sağlamlıq hüquqları və məktəbli vəzifələri)*
2. **FƏRD VƏ CƏMİYYƏT - Mənəvi dəyərlərimiz və xarakter** *(Dürüstlük, mərhəmət, vətənpərvərlik, ədalətlilik)*
3. **FƏRD VƏ CƏMİYYƏT - Ünsiyyət və dinləmə mədəniyyəti** *(Nəzakətli davranış, söz kəsməmək, qarşılıqlı hörmət)*
4. **FƏRD VƏ CƏMİYYƏT - Biz və dostlarımız** *(Dostluq qaydaları, komandada işləmək, xeyirxahlıq)*
5. **FƏRD VƏ CƏMİYYƏT - Birlikdə yaşamaq qaydaları** *(İctimai yerlərdə davranış, qonşuluq münasibətləri)*
6. **FƏRD VƏ CƏMİYYƏT - 1-ci Bölmə üzrə ümumiləşdirici təkrar** *(Kompleks situativ və məntiqi testlər)*

#### 🔸 BÖLMƏ 2: Vətənimiz və Dövlətimiz (6 Mövzu / 90 Sual)
7. **VƏTƏNİMİZ VƏ DÖVLƏTİMİZ - Dövlət rəmzlərimiz (Bayraq, Gerb, Himn)** *(Rəmzlərimizin tarixi, rənglərin və simvolların mənası)*
8. **VƏTƏNİMİZ VƏ DÖVLƏTİMİZ - Azərbaycanın paytaxtı və qədim şəhərləri** *(Bakı, Gəncə, Şuşa, Şəki, Naxçıvan)*
9. **VƏTƏNİMİZ VƏ DÖVLƏTİMİZ - Milli birliyimiz və həmrəylik** *(31 Dekabr Həmrəylik günü, çoxmillətli Azərbaycan xalqı)*
10. **VƏTƏNİMİZ VƏ DÖVLƏTİMİZ - Zəfər tariximiz və unudulmaz qəhrəmanlar** *(44 günlük Vətən müharibəsi, şəhidlərimiz və qazilərimiz)*
11. **VƏTƏNİMİZ VƏ DÖVLƏTİMİZ - Milli bayramlarımız və adət-ənənələrimiz** *(Novruz bayramı, Qurban və Ramazan bayramları)*
12. **VƏTƏNİMİZ VƏ DÖVLƏTİMİZ - 2-ci Bölmə üzrə ümumiləşdirici təkrar** *(Vətənpərvərlik və dövlətçilik bilikləri)*

#### 🔸 BÖLMƏ 3: Bədənimiz və Sağlamlığımız (6 Mövzu / 90 Sual)
13. **BƏDƏNİMİZ VƏ SAĞLAMLIĞIMIZ - Bədən quruluşu və daxili orqanlar** *(Ürək, ağciyərlər, mədə, beyin və qaraciyər)*
14. **BƏDƏNİMİZ VƏ SAĞLAMLIĞIMIZ - Skelet və əzələ sistemi** *(Sümüklərin rolu, oynaqlı birləşmələr, hərəkət mexanizmi)*
15. **BƏDƏNİMİZ VƏ SAĞLAMLIĞIMIZ - Düzgün qamət və idmanın rolu** *(Onurğa sütununun qorunması, partada düzgün əyləşmə)*
16. **BƏDƏNİMİZ VƏ SAĞLAMLIĞIMIZ - Sağlam və rasional qidalanma** *(Vitaminlər, zülallar, yağlar, zərərli qidalardan uzaq durmaq)*
17. **BƏDƏNİMİZ VƏ SAĞLAMLIĞIMIZ - Şəxsi gigiyena və xəstəliklərdən qorunma** *(Mikroblar, əl yuma qaydaları, peyvəndlər və immunitet)*
18. **BƏDƏNİMİZ VƏ SAĞLAMLIĞIMIZ - 3-cü Bölmə üzrə ümumiləşdirici təkrar** *(Sağlam həyat tərzi və tibbi savadlılıq)*

#### 🔸 BÖLMƏ 4: Canlılar Aləmi və Təbiət (6 Mövzu / 90 Sual)
19. **CANLILAR ALƏMİ - Canlı və cansız təbiətin vəhdəti** *(Qidalanma, tənəffüs, böyümə, çoxalma və inkişaf əlamətləri)*
20. **CANLILAR ALƏMİ - Qədim canlılar və fosillər** *(Daşlaşmış qalıqlar, dinozavrlar və mamontların paleontoloji izləri)*
21. **CANLILAR ALƏMİ - Bitkilərin quruluşu və həyatı** *(Kök, gövdə, yarpaq, çiçək, toxum və fotosintez prosesi)*
22. **CANLILAR ALƏMİ - Heyvanların müxtəlifliyi və uyğunlaşması** *(Məməlilər, quşlar, balıqlar, sürünənlər, suda-quruda yaşayanlar)*
23. **CANLILAR ALƏMİ - Təbiətdə qida zənciri və tarazlıq** *(Bitkiyeyənlər, yırtıcılar və qarışıq qidalananlar)*
24. **CANLILAR ALƏMİ - 4-cü Bölmə üzrə ümumiləşdirici təkrar** *(Canlılar aləmi və bioloji müxtəliflik)*

---

### 📙 II YARIMİL (BÖLMƏ 5 – 8: 24 Mövzu / 360 Sual)

#### 🔸 BÖLMƏ 5: Yerin Təbii Sərvətləri (6 Mövzu / 90 Sual)
25. **TƏBİİ SƏRVƏTLƏR - Süxurlar, minerallar və torpaq** *(Qranit, qum, gil və münbit torpaq qatı)*
26. **TƏBİİ SƏRVƏTLƏR - Su — Həyat mənbəyidir** *(Təbiətdə suyun dövranı, şirin su ehtiyatları və suyun qorunması)*
27. **TƏBİİ SƏRVƏTLƏR - Hava və atmosferin rolu** *(Oksigen, havanın təmizliyi, külək və hava hadisələri)*
28. **TƏBİİ SƏRVƏTLƏR - Günəş — İstilik və işıq mənbəyidir** *(Günəş enerjisi, fəsillərin və gecə-gündüzün yaranması)*
29. **TƏBİİ SƏRVƏTLƏR - Azərbaycanın faydalı qazıntıları** *(Neft, təbii qaz, qızıl, dəmir filizi, mineral sular)*
30. **TƏBİİ SƏRVƏTLƏR - 5-ci Bölmə üzrə ümumiləşdirici təkrar** *(Təbii ehtiyatlar və xammal bazası)*

#### 🔸 BÖLMƏ 6: Təhlükəsiz Həyat Qaydaları (6 Mövzu / 90 Sual)
31. **TƏHLÜKƏSİZ HƏYAT - Məişətdə təhlükəsizlik qaydaları** *(Qaz cihazları, elektrik avadanlıqları, kəsici-deşici alətlər)*
32. **TƏHLÜKƏSİZ HƏYAT - Yol hərəkəti qaydaları və nişanlar** *(Svetofor, piyada keçidi, sərnişin və velosipedçi qaydaları)*
33. **TƏHLÜKƏSİZ HƏYAT - Təbiətdə təhlükəsizlik** *(Meşədə tonqal, dənizdə çimmə qaydaları, zəhərli göbələklər və həşəratlar)*
34. **TƏHLÜKƏSİZ HƏYAT - Fövqəladə hallar və Təbii fəlakətlər** *(Zəlzələ, yanğın, sel, tufan zamanı davranış alqoritmi)*
35. **TƏHLÜKƏSİZ HƏYAT - İlk tibbi yardım və Təcili xidmətlər** *(101-Yanğın, 102-Polis, 103-Təcili yardım, 112-FHN)*
36. **TƏHLÜKƏSİZ HƏYAT - 6-cı Bölmə üzrə ümumiləşdirici təkrar** *(Həyat təhlükəsizliyi və fövqəladə hazırlıq)*

#### 🔸 BÖLMƏ 7: Ətraf Mühitin Mühafizəsi və Ekologiya (6 Mövzu / 90 Sual)
37. **EKOLOGİYA - Meşələrin və bitki örtüyünün qorunması** *(Ağacəkmə, meşələrin ağciyər funksiyası, meşə yanğınlarının qarşısını almaq)*
38. **EKOLOGİYA - Qırmızı Kitab və Milli Parklarımız** *(Göygöl, Şirvan, Hirkan, Şahdağ və nadir fauna nümunələri)*
39. **EKOLOGİYA - Tullantıların çeşidlənməsi və Təkrar emal** *(Plastik, şüşə, kağız tullantılarının təbiətə zərəri və təkrar istifadəsi)*
40. **EKOLOGİYA - Ekoloji mədəniyyət və Yaşıl enerji** *(Külək və Günəş enerjisi, resurslara qənaət)*
41. **EKOLOGİYA - Su hövzələrinin və Xəzər dənizinin mühafizəsi** *(Dəniz və çayların çirklənməsinin qarşısını almaq)*
42. **EKOLOGİYA - 7-ci Bölmə üzrə ümumiləşdirici təkrar** *(Ekoloji tərbiyə və vətəndaşlıq məsuliyyəti)*

#### 🔸 BÖLMƏ 8: Texnika, İxtiralar və İlin Yekunu (6 Mövzu / 90 Sual)
43. **TEXNİKA VƏ İXTİRALAR - Məişət texnikası və rabitə vasitələri** *(Soyuducu, tozsoran, telefon, televizor və kompüterin iş prinsipi)*
44. **TEXNİKA VƏ İXTİRALAR - Nəqliyyat növləri və inkişafı** *(Quru, su, hava və dəmiryol nəqliyyatı)*
45. **TEXNİKA VƏ İXTİRALAR - İnternet və İnformasiya təhlükəsizliyi** *(Kibertəhlükəsizlik qaydaları, fərdi məlumatların qorunması)*
46. **TEXNİKA VƏ İXTİRALAR - Gələcəyin peşələri və əməksevərlik** *(Mühəndislik, həkimlik, ekoloqluq, İT sahəsi)*
47. **TEXNİKA VƏ İXTİRALAR - 3-cü Sinif İlin Yekun Təkrarı (İnteqrativ Sınaq 1)** *(Bütün ilin təməl fənlərarası sınağı)*
48. **TEXNİKA VƏ İXTİRALAR - 3-cü Sinif İlin Yekun Təkrarı (İnteqrativ Sınaq 2)** *(Kompleks qabiliyyət və bilik sınağı)*

---

## 4. Test Suallarının Pedaqoji və Texniki Tələbləri (Gold Standard 4.1)

Həyat bilgisi 3 test bankının hazırlanmasında tətbiq olunacaq meyarlar:

1. **Məzmun və Faktiki Dəqiqlik:**  
   Bütün bioloji, ekoloji, tarixi, hüquqi və təhlükəsizlik qaydaları 100% elmi və dövlət kurikulumu standartlarına əsaslanmalıdır.
2. **100% Variant Uzunluq və Quruluş Simmetriyası:**  
   Bütün 4 variant ($A, B, C, D$) eyni cümlə strukturunda və simmetrik simvol uzunluğunda ($\pm 10-15\%$) olmalıdır. Şagird vizual uzunluğa görə cavabı təxmin edə bilməz.
3. **Məntiqi Çəkindiricilər (Plauzibil Distraktorlar):**  
   Yanlış variantlar şagirdlərin ən çox etdiyi yanlış stereotiplərə və təhlükəli davranış vərdişlərinə əsaslanmalıdır (məs: zəlzələdə liftdən istifadə etmək kimi xətalar).
4. **Dəqiq 25% Balanslaşdırılmış Cavab Açarları:**  
   Bütün 720 sual üzrə variantlar bərabər paylanmalıdır:
   $$\text{A: 180}, \quad \text{B: 180}, \quad \text{C: 180}, \quad \text{D: 180}$$
5. **Ətraflı Həyati və Pedaqoji İzah:**  
   Hər bir sualın altında dərslik qaydası və həyati davranış məntiqi ətraflı qeyd edilməlidir.

---

## 5. Tətbiq və İcra Planı (Roadmap)

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   MƏRHƏLƏ 1 (BÖLMƏ 1-2) │───>│   MƏRHƏLƏ 2 (BÖLMƏ 3-4) │───>│   MƏRHƏLƏ 3 (BÖLMƏ 5-6) │
│  • Fərd və Cəmiyyət     │    │  • Bədən və Sağlamlıq   │    │  • Təbii Sərvətlər      │
│  • Vətən və Dövlət      │    │  • Canlılar Aləmi       │    │  • Təhlükəsiz Həyat     │
│  • 12 Mövzu / 180 Sual  │    │  • 12 Mövzu / 180 Sual  │    │  • 12 Mövzu / 180 Sual  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
                                                                           │
                                                                           ▼
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   YEKUN İNTEQRASİYA     │<───│   MƏRHƏLƏ 4 (BÖLMƏ 7-8) │<───┘                         │
│  • JSON Baza yenilənməsi│    │  • Ekologiya və Mühafizə│                              │
│  • Markdown ixracı      │    │  • Texnika və İlin Yekun│                              │
│  • 720 Sual / 100% Tam  │    │  • 12 Mövzu / 180 Sual  │                              │
└─────────────────────────┘    └─────────────────────────┘                              
```
