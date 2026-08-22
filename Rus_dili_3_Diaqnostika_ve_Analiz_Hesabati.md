# 🇷🇺 Rus dili 3 — Rəsmi Dərslik Əsasında Tam Dərin Analiz və Diaqnostika Hesabatı

**Dərslik Mənbəyi:** Azərbaycan Respublikası Elm və Təhsil Nazirliyinin Rəsmi Dərsliyi:  
📖 **"Rus dili – 3-cü sinif" (Русский язык как иностранный, 3 класс)**  
✍️ **Müəlliflər:** **Nailə Tağıyeva, Mehriban Quliyeva, İradə Vəliyeva, Sevinc Sadıqova**  
🏢 **Nəşriyyat:** "Kövsər" / "Şərq-Qərb" nəşriyyatı  
🌐 **Elektron Dərslik Portalı:** [e-derslik.edu.az — Rus dili 3](https://e-derslik.edu.az)

---

## 1. Rəsmi Dərslik Arxitekturası və Fəsillərin Təhlili

Azərbaycan bölməsi məktəbləri üçün nəzərdə tutulmuş rəsmi **"Rus dili 3"** dərsliyi 2 əsas mərhələdən və **22 rəsmi Dərsdən (Урок)** ibarətdir:

```
                            ┌────────────────────────────────────────────────────────┐
                            │    N. TAĞIYEVA, M. QULİYEVA — RUS DİLİ 3 (РУССКИЙ ЯЗЫК)│
                            │              RƏSMİ DƏRSLİK STRUKTURU                   │
                            └───────────────────────────┬────────────────────────────┘
                                                        │
         ┌──────────────────────────────────────────────┴─────────────────────────────────────────────┐
         │                                                                                            │
         ▼                                                                                            ▼
┌──────────────────────────────────────────────────┐        ┌──────────────────────────────────────────────────┐
│ I HİSSƏ: ƏLİFBA, SƏSLƏR VƏ İLKİN NİTQ (УРОКИ 1-17)│        │ II HİSSƏ: NAĞILLAR, MƏTNLƏR VƏ HİKMƏT (УРОКИ 18-22)│
├──────────────────────────────────────────────────┤        ├──────────────────────────────────────────────────┤
│• 33 rus hərfi (А-Я), sait və samitlər            │        │• Урок 18: Азбука - к мудрости ступенька          │
│• Qalın və incə səslər (ь, ъ)                     │        │• Урок 19: Сказка «Репка» (Ailə və kömək)         │
│• Tək və cəm isimlər (-ы, -и)                     │        │• Урок 20: Сказка «Глупая лиса» (Vəhşi təbiət)    │
│• Şəxs əvəzlikləri (Он, Она, Оно, Они)            │        │• Урок 21: Сказка «Теремок» (Dostluq və birlik)   │
│• Orfoqrafiya qaydaları (жи-ши, ча-ща, чу-щу)     │        │• Урок 22: Притча «Семь гранатовых прутьев»       │
└──────────────────────────────────────────────────┘        └──────────────────────────────────────────────────┘
```

---

## 2. Dərslik Mövzuları ilə Mövcud Baza Suallarının Dəqiq Auditi

Platformanın test bazasında (`offline_tests.json`) mövcud olan 330 sual məhz bu 22 dərsin məzmunu əsasında formalaşmışdır. Lakin bəzi dərslər pərakəndə şəkildə alt-hissələrə parçalanmışdır:

### 🔍 Dərslik üzrə Mövzu və Sual Paylanması Cədvəli

| Dərs Nömrəsi | Dərslikdəki Orijinal Dərs Başlığı (Урок) | Əhatə Etdiyi Leksik-Qrammatik Mövzular | Bazadakı Mövcud Vəziyyət | Planlaşdırılan Gold 4.1 |
| :---: | :--- | :--- | :---: | :---: |
| **Урок 1** | *Буквы А, М* | Саит А, самит М, sözlər (*мама, мак, дом*), hecalar | 15 sual | 15 Sual |
| **Урок 2** | *Буквы П, К* | Самитlər П, К, sözlər (*папа, кот, парк, полка*) | 15 sual | 15 Sual |
| **Урок 3** | *Буквы Н, О* | Cins əvəzlikləri (*он, она, оно*), sözlər (*нос, окно*) | 15 sual | 15 Sual |
| **Урок 4** | *Буквы Д, Т* | Kar-cingiltili cütlük (*Д-Т*), sözlər (*дом, кот, тут*) | 15 sual | 15 Sual |
| **Урок 5** | *Буквы И, Й* | Саит И, qısa Й, mənsubiyyət (*мой, твой*), sözlər | 15 sual | 15 Sual |
| **Урок 6** | *Буквы У, Р* | Саит У, самит Р, sözlər (*рука, рыба, урок, утро*) | 16 sual (pərakəndə) | 15 Sual (Bütöv) |
| **Урок 7** | *Буквы В, Ы* | Cəm şəkilçisi (*-ы: столы, шкафы*), sözlər (*вода, сыр*) | 14 sual (pərakəndə) | 15 Sual (Bütöv) |
| **Урок 8** | *Буквы Л, С* | Самитlər Л, С, sözlər (*луна, сад, стол, стул, лес*) | 15 sual | 15 Sual |
| **Урок 9** | *Буквы Ж, З* | Cingiltili Ж, З, qayda (*жи-ши пиши с буквой и*) | 15 sual | 15 Sual |
| **Урок 10** | *Буквы Е, Ё* | Yotlaşmış saitlər Е, Ё, sözlər (*ель, ёж, лето, мел*) | 15 sual | 15 Sual |
| **Урок 11** | *Буквы Б, Г* | Cingiltili Б, Г, sözlər (*барабан, гриб, книга, гусь*) | 15 sual | 15 Sual |
| **Урок 12** | *Буквы Ь, Ъ* | İncəlik işarəsi Ь (*конь, соль*), ayırıcı Ъ (*подъезд*) | 15 sual | 15 Sual |
| **Урок 13** | *Буквы Ш, Щ* | Kar fışıltılı Ş, ŞŞ, qaydalar (*ча-ща, чу-щу*) | 15 sual | 15 Sual |
| **Урок 14** | *Буквы Ч, Ц* | Samitlər Ч, Ц, sözlər (*часы, цапля, мяч, солнце*) | 15 sual | 15 Sual |
| **Урок 15** | *Буквы Э, Ю* | Saitlər Э, Ю, sözlər (*экран, юбка, юг, пою*) | 15 sual | 15 Sual |
| **Урок 16** | *Буквы Х, Ф* | Samitlər Х, Ф, sözlər (*хлеб, флаг, шарф, кофта*) | 15 sual | 15 Sual |
| **Урок 17** | *Буква Я* | Sait Я, şəxs (*я ученик, яблоко, мяч, семья*) | 15 sual | 15 Sual |
| **Урок 18** | *Азбука — к мудрости ступенька* | Əlifba bayramı, atalar sözləri, məktəb sevgisi | 15 sual | 15 Sual |
| **Урок 19** | *Сказка «Репка»* | «Turp» nağılı, ailə birliyi, köməkləşmə | 15 sual | 15 Sual |
| **Урок 20** | *Сказка «Глупая лиса»* | Tülkü nağılı, ağıl və hiyləgərlik, vəhşi təbiət | 15 sual | 15 Sual |
| **Урок 21** | *Сказка «Теремок»* | «Daxmacıq» nağılı, dostluq, mehriban birgəyaşayış | 15 sual | 15 Sual |
| **Урок 22** | *Притча «Семь гранатовых прутьев»* | «Yeddi nar çubuğu» rəvayəti, birlik və Vətən gücü | 15 sual | 15 Sual |
| **CƏMİ** | **22 Rəsmi Dərs** | **Bütün 3-cü Sinif Dərslik Proqramı** | **330 Sual** | **330 Sual (Gold 4.1)** |

---

## 3. Mövcud Bazadakı Problemlər və Aradan Qaldırılma Yolları

1. **Pərakəndə Dərslərin Birləşdirilməsi:** Урок 6 (Буквы У, Р) və Урок 7 (Буквы В, Ы) mövzularında 6-7 fərqli qırıq başlıq yaranmışdı. Onlar dərslikdəki kimi bütöv **Урок 6** və **Урок 7** standartına gətirilməlidir.
2. **Məlumat Strukturu:** Düz siyahı (`Array`) formatından çıxarılıb hər biri 15 sualdan ibarət **22 Mövzu Açarlı Lüğət (`Dictionary`)** formatına çevrilməlidir.
3. **Variant Simmetriyası:** Bütün sualların 4 variantının həcmi bərabərləşdirilməlidir (nisbət $\le 1.40$).
4. **Cavab Açarları Balansı:** 330 sual üzrə $A, B, C, D$ variantları dəqiq 25% (təqribən hər biri 82–83 dəfə) paylanmalıdır.
5. **İkidilli Qrammatik İzahlar:** Rus dili orfoqrafiya qaydaları (*жи-ши, ча-ща, чу-щу, он/она/оно, род, число*) Azərbaycan dilində dərslik səhifəsi qeyd olunmaqla addım-addım izah edilməlidir.

---

## 4. Dərslik Əsasında 22 Dərsin Məzmun Xəritəsi

### 🇷🇺 I HİSSƏ: Əlifba, Fonetika və Söz Ehtiyatı (Уроки 1 – 17)
1. **Урок 1: Буквы А, М** — Саит А və самит М, hecaların oxunuşu (*ма-ма, мак, дом*).
2. **Урок 2: Буквы П, К** — Kar samitlər П və К, məktəb və ev sözləri (*папа, кот, полка, парк*).
3. **Урок 3: Буквы Н, О** — Саит О, самит Н, cinslər: *Он* (kişi), *Она* (qadın), *Оно* (orta) (*нос, окно, он тут*).
4. **Урок 4: Буквы Д, Т** — Cingiltili Д və kar Т samitləri (*дом, кот, стол, стул, тут, там*).
5. **Урок 5: Буквы И, Й** — Саит И, qısa Й, mənsubiyyət əvəzlikləri: *мой* (mənim - kişi), *моя* (mənim - qadın) (*игла, чай, мой дом*).
6. **Урок 6: Буквы У, Р** — Саит У, самит Р, hərəkət və təbiət (*рука, рыба, рак, урок, утро, ручка*).
7. **Урок 7: Буквы В, Ы** — Самит В, qalın sait Ы, isimlərin cəm forması (*-ы: стол — столы, шкаф — шкафы, сыр, вода*).
8. **Урок 8: Буквы Л, С** — Samitlər Л və С, mebel və təbiət sözləri (*луна, сад, лес, стол, стул, лимон*).
9. **Урок 9: Буквы Ж, З** — Cingiltili Ж və З, orfoqrafiya qaydası: **ЖИ-ШИ пиши с буквой И** (*жук, зима, роза, лыжи, машина*).
10. **Урок 10: Буквы Е, Ё** — Yotlaşmış saitlər Е [йэ] və Ё [йо], fəsillər və təbiət (*ель, ёж, лето, мел, ёлка*).
11. **Урок 11: Буквы Б, Г** — Cingiltili samitlər Б və Г (*барабан, гриб, книга, гусь, банан*).
12. **Урок 12: Буквы Ь, Ъ** — Yumşaldıcı işarə Ь (*конь, соль, пальто*) və ayırıcı Ъ (*подъезд, объявление*).
13. **Урок 13: Буквы Ш, Щ** — Kar samitlər Ш və Щ, orfoqrafiya qaydaları: **ЧА-ЩА пиши с А**, **ЧУ-ЩУ пиши с У** (*школа, щука, роща, чашка*).
14. **Урок 14: Буквы Ч, Ц** — Samitlər Ч və Ц (*часы, цапля, мяч, цветы, овца*).
15. **Урок 15: Буквы Э, Ю** — Saitlər Э və Ю [йу] (*экран, юбка, юг, пою, рисую*).
16. **Урок 16: Буквы Х, Ф** — Samitlər Х və Ф (*хлеб, флаг, шарф, кофта, хорошо*).
17. **Урок 17: Буква Я** — Əlifbanın sonuncu hərfi Я [йа], şəxs: *Я ученик. Я люблю школу.* (*яблоко, семья, мяч*).

### 🇷🇺 II HİSSƏ: Nağıllar, Mətnlər və İlin Yekun Təkrarları (Уроки 18 – 22)
18. **Урок 18: Азбука — к мудрости ступенька** — Əlifbanın tamamlanması, kitab və elm haqqında atalar sözləri.
19. **Урок 19: Сказка «Репка»** — «Turp» xalq nağılı: ailə birliyi, babaya, nənəyə və heyvanlara kömək.
20. **Урок 20: Сказка «Глупая лиса»** — «Axmaq tülkü» nağılı: ağıl, ehtiyatlılıq və meşə heyvanları.
21. **Урок 21: Сказка «Теремок»** — «Daxmacıq» nağılı: səmimi dostluq, qonaqpərvərlik və həmrəylik.
22. **Урок 22: Притча «Семь гранатовых прутьев»** — «Yeddi nar çubuğu» rəvayəti: birliyin, həmrəyliyin və bölünməz Vətən gücünün təcəssümü.

---

## 5. Gold Standard 4.1 İcra Qaydaları

1. **Dərslik Mətninə 100% Sadiqlik:** Bütün suallar bilavasitə N.Tağıyevanın "Rus dili 3" dərsliyindəki dərslər, sözlər və nağıllardan tərtib ediləcək.
2. **Kəmiyyət Bölgüsü:** 22 Dərs $\times$ 15 Sual = **Dəqiq 330 Sual**.
3. **100% Simmetriya:** Variantların uzunluqları bərabərləşdiriləcək.
4. **25% Balanslı Açarlar:** $A, B, C, D$ variantları bərabər paylanacaq ($330 / 4 \approx 82-83$).
5. **İkidilli İzahlar:** Rus dili qrammatik qaydası və dərslik səhifəsinə istinadla Azərbaycan dilində tam aydın izah veriləcək.
