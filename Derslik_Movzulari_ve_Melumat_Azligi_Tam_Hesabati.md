# 🔍 Dərsliklərin Faktiki Vəziyyəti, Sübut Əsaslı Yarımçıq Fənlər və Məlumat Dəqiqləşdirmə Hesabatı

**Hesabat Tarixi:** 2026-cı il  
**Metodoloji Standart:** **0% Ehtimal / 100% Faktiki Sübut Əsaslı Təhlil**. Heç bir subyektiv təxmin edilməmiş, yalnız platformadakı yerli TOC faylları və `offline_tests.json` bazasındakı mövcud mövzular əsas götürülmüşdür.  
**Məqsəd:** `Alman dili 5`-də olduğu kimi yanlış təxminlərə yol vermədən:
1. Hansı fənlərin **faktiki olaraq 100% tam** olduğunu təsdiqləmək;
2. Hansı fənlərin **sistemdəki TOC faylları ilə yarımçıq qaldığının sübut edildiyini** göstərmək;
3. Hansı fənlər üzrə **yerli mündəricat (TOC) çatışmadığı üçün istifadəçidən dəqiqləşdirmə tələb olunduğunu** açıq və şəffaf siyahı ilə təqdim etmək.

---

## 1. Qlobal Audit Xülasəsi (121 Fənn üzrə)

```
                    ┌────────────────────────────────────────────────────────┐
                    │    121 FƏNN ÜZRƏ TAM FAKTİKİ VƏ SÜBUT ƏSASLI BÖLGÜ    │
                    └───────────────────────────┬────────────────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         │                                      │                                      │
         ▼                                      ▼                                      ▼
┌──────────────────────────────────┐ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│  🟢 1. 100% TAM VƏ BÜTÖV DƏRSLİK │ │  🔴 2. FAKTİKİ YARIMÇIQ (SÜBUTLU)│ │  🟡 3. DƏQİQLƏŞDİRMƏ TƏLƏB OLUNAN│
├──────────────────────────────────┤ ├──────────────────────────────────┤ ├──────────────────────────────────┤
│• 93 Fənn                         │ │• 5 Fənn (8-ci sinif təbiət/dəqiq)│ │• 23 Fənn (8-11-ci sinif fənləri) │
│• Dərslik mündəricatı ilə 100%    │ │• Yerli TOC faylları ilə qalan    │ │• Sistemdə yerli TOC faylı yoxdur │
│  tam üst-üstə düşür.             │ │  fəsillər faktiki təsdiqlənib.   │ │• Mövcud mövzu sayı azdır (6-14)  │
│• Məsələn: Alman 5 (6 Lektion),   │ │• Məsələn: Fizika 8 (58 vs 24),   │ │• İstifadəçidən dərslik mövzu     │
│  İngilis 5 (8 Unit), Riyaz 5-7   │ │  Biologiya 8, Kimya 8, Riyaz 8   │ │  siyahısı tələb olunur!          │
└──────────────────────────────────┘ └──────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 2. Qrup 2: Faktiki Yarımçıq Olduğu Yerli Dərslik TOC Faylı ilə Təsdiqlənən Fənlər (5 Fənn)

Bu fənlərin `public/textbooks/` qovluğunda yerləşən rəsmi dərslik TOC (mündəricat) faylları aşkar edilmiş və bazadakı mövzularla müqayisədə qalan fəsillərin hələ testləşdirilmədiyi **100% faktiki sübut olunmuşdur**:

| Sinif | Fənn | Sistemdəki TOC Başlıq Sayı | Bazada Testi Olan Mövzu Sayı | Dərslikdə Qalan və Testi Yazılmamış Hissələr (Sübutlu) |
| :---: | :--- | :---: | :---: | :--- |
| 📙 **8** | **Fizika 8** | **58 başlıq** | **24 mövzu** | *Bazada yalnız İstilik hadisələri var.* **Qalan hissələr:** Fəsil 3 (Elektrik yükləri), Fəsil 4 (Sabit cərəyan), Fəsil 5 (Elektromaqnit və İşıq). |
| 📙 **8** | **Biologiya 8** | **62 başlıq** | **19 mövzu** | *Bazada yalnız Dayaq-hərəkət və Qan sistemi var.* **Qalan hissələr:** Tənəffüs, Həzm, İfrazat, Sinir sistemi, Analizatorlar, Vəzilər. |
| 📙 **8** | **Kimya 8** | **49 başlıq** | **15 mövzu** | *Bazada yalnız Dövri cədvəl var.* **Qalan hissələr:** Kimyəvi rabitə, Maddə miqdarı, Oksidlər, Əsaslar, Turşular, Duzlar. |
| 📙 **8** | **Riyaziyyat 8** | **83 başlıq** | **38 mövzu** | *Bazada 38 mövzu var.* **Qalan hissələr:** Triqonometrik nisbətlər, Koordinatlar üsulu, Fiqurların çevrilməsi. |
| 📙 **8** | **Alman dili 8** | **25 başlıq** | **14 mövzu** | *Bazada 14 mövzu var.* **Qalan hissələr:** Lektion 1-in bəzi bölmələri və 2-ci yarımil dərsləri. |

---

## 3. Qrup 3: Məlumat Azlığı Olan və İstifadəçidən Dəqiqləşdirmə Tələb Olunan Fənlər (23 Fənn)

> [!IMPORTANT]
> Bu fənlər üzrə sistemdə yerli TOC/HTML faylı olmadığı üçün subyektiv təxmin yürütmürük. Aşağıda hər bir fənn üzrə **hal-hazırda bazada olan mövzuların dəqiq siyahısı** təqdim edilir.
> **Xahiş edirik, bu fənlərdən hansılarının yarımçıq olduğunu və əsl dərslik mündəricatını tamamlayasınız:**

### 🎓 11-ci Sinif (9 Fənn):
1. **Riyaziyyat 11 (Bazada 9 mövzu var):**
   * *Mövcud mövzular:* `Çoxhədlinin çoxhədliyə bölünməsi`, `Rasional köklərin tapılması`, `Qalıq haqqında teorem`, `Çoxhədlinin vuruqları haqqında teorem`, `Cəbri kəsrlərin ixtisarı`, `Həqiqi ədədlər və əməllər`, `Ədədi ardıcıllıqlar`, `Limit anlayışı`, `Ümumiləşdirici tapşırıqlar`.
   * *Dəqiqləşdirmə:* Bu dərslikdə Törəmə, İnteqral, Fırlanma cisimləri dərsləri varmı?
2. **Kimya 11 (Bazada 10 mövzu var):**
   * *Mövcud mövzular:* `İlkin yoxlama (Spirtlər və Fenollar)`, `1.1.1. Adlandırılması və izomerliyi`, `1.1.2. Alınması`, `1.1.3. Quruluşu və fiziki xassələri`, `1.1.4. Kimyəvi xassələri`, `1.1.5. Tətbiqi`, `1.2. Çoxatomlu spirtlər`, `1.3. Fenollar`, `1.4. Təkrar və ümumiləşdirmə`, `Ümumi bölmə testi`.
   * *Dəqiqləşdirmə:* Dərslikdə Aldehidlər, Turşular, Karbohidratlar, Zülallar varmı?
3. **Azərbaycan dili 11 (Bazada 7 mövzu var):**
   * *Mövcud mövzular:* `Böyük ömrün dan yeri`, `Şəbi-hicran`, `Sizin də bir basketbol səbətiniz varmı?`, `Hər uşağın ən yaxşı tərəfini üzə çıxarmaq`, `Qobustan - tarixin daş yaddaşı`, `Mətn üzərində iş`, `Ümumi təkrar`.
   * *Dəqiqləşdirmə:* 11-ci sinif Azərbaycan dili dərsliyinin tam mövzu siyahısı necədir?
4. **Ümumi tarix 11 (Bazada 8 mövzu var):**
   * *Mövcud mövzular:* `1. ABŞ və Böyük Britaniya (XIX əsr - XX əsrin əvvəlləri)`, `2. Fransa və Almaniya`, `3. Rusiya`, `4. Osmanlı imperiyası. Qacarlar dövləti`, `5. Yaponiya və Çin`, `6. Beynəlxalq münasibətlər`, `7. Mədəniyyət`, `8. Ümumiləşdirici dərs`.
   * *Dəqiqləşdirmə:* Dərslikdə I və II Dünya müharibələri, Müasir dövr fəsilləri varmı?
5. **Coğrafiya 11 (Bazada 11 mövzu var):**
   * *Mövcud mövzular:* `1.1. Kartoqrafik tədqiqat metodları`, `1.4. Qrafik təsvirlər`, `1.5. Təsərrüfat sahələrinin yerləşməsinin xəritələrə əsasən təhlili`, `1.6. CİS`, `1.7. Aerokosmik metodlar`, `1.8. Relyefin təhlili`, `1.9. İqlim xəritələri`, `1.10. Su ehtiyatları`, `1.11. Torpaq xəritələri`, `1.12. Təbii zonalar`, `1.13. Ümumiləşdirmə`.
6. **İnformatika 11 (Bazada 8 mövzu var):**
   * *Mövcud mövzular:* `1.1. İnformasiya sistemi və onun elementləri`, `1.2. İnformasiya sistemlərinin təsnifatı`, `1.3. Coğrafi informasiya sistemləri`, `1.4. Süni intellekt`, `1.5. Verilənlər bazası`, `1.6. Şəbəkə təhlükəsizliyi`, `1.7. Veb-proqramlaşdırma`, `1.8. Ümumi təkrar`.
7. **İngilis dili 11 (Bazada 6 Unit var):**
   * *Mövcud mövzular:* `UNIT 1. THE WHYS AND WHEREFORES`, `UNIT 2. LIFETIME EXPERIENCES`, `UNIT 3. THE ART OF CONVERSATION`, `UNIT 4. NO REGRETS`, `UNIT 5. CHANGES`, `UNIT 6. CELEBRATIONS`.
   * *Dəqiqləşdirmə:* Dərsliyin cəmi 6 Unit-dir, yoxsa davamı var?
8. **Ədəbiyyat 11 (Bazada 10 mövzu var):**
   * *Mövcud mövzular:* `Cəlil Məmmədquluzadə (Həyatı və Anamın kitabı)`, `Mirzə Ələkbər Sabir (Neylərdin, ilahi?!)`, `Hüseyn Cavid (İblis)`, `Məhəmməd Hadi`, `Əhməd Cavad`, `Məhəmmədhüseyn Şəhriyar`, `Səməd Vurğun (Vaqif)`, `Mikayıl Müşfiq`, `İlyas Əfəndiyev`, `Bəxtiyar Vahabzadə`.
9. **Azərbaycan tarixi 11 (Bazada 9 mövzu var):**
   * *Mövcud mövzular:* `1. Rusiya tərəfindən Şimali Azərbaycanın işğalı`, `2. Rusiya-Qacar müharibələri`, `3. Müstəmləkə siyasəti`, `4. 1840-cı illər islahatları`, `5. Komendant idarə üsulu`, `6. Kəndli islahatı`, `7. Neft sənayesi`, `8. Maarifçilik və mətbuat`, `9. Ümumiləşdirici dərs`.

---

### 📘 10-cu Sinif (6 Fənn):
10. **Kimya 10 (Bazada 14 mövzu var):**
    * *Mövcud mövzular:* `Alkanların quruluşu, homoloji sırası, izomerliyi, adlandırılması, alınması, fiziki və kimyəvi xassələri`, `Tsikloalkanlar`, `Alkenlərin quruluşu, izomerliyi, adlandırılması, alınması, xassələri`.
    * *Dəqiqləşdirmə:* Dərslikdə Alkinlər, Alkadienlər, Arenlər, Neft varmı?
11. **Azərbaycan dili 10 (Bazada 11 mövzu var):**
    * *Mövcud mövzular:* `1. Dil`, `2. Cəmi 40 söz`, `3. Hər şey su ilə başladı`, `4. Bəşəriyyətin yaddaşı - yazı`, `5. Mətn və onun strukturu`, `6. Mətndə abzas`, `7. Mətndə açar sözlər`, `8. Mətnin planı`, `9. Mətnin xülasəsi`, `10. Nitq mədəniyyəti`, `11. Ümumiləşdirmə`.
12. **İngilis dili 10 (Bazada 9 Unit var):**
    * *Mövcud mövzular:* `UNIT 1. KINDNESS`, `UNIT 2. WE ARE VICTORIOUS!`, `UNIT 3. CULTURES`, `UNIT 4. ENVIRONMENTAL PROBLEMS`, `UNIT 5. TRAVELING`, `UNIT 6. HEALTH`, `UNIT 7. INNOVATIONS`, `UNIT 8. SPORTS`, `UNIT 9. ART`.
13. **Alman dili 10 (Bazada 12 mövzu var):**
    * *Mövcud mövzular:* `Soziale Netzwerke`, `Bin ich Smartphone süchtig?`, `Fernseher und Radio`, `Mein Computer`, `Sport und Gesundheit`, `Freizeit und Hobbys`, `Reisen`, `Klima und Umwelt`, `Berufe`, `Feste in Deutschland`, `Aserbaidschan`, `Wiederholung`.
14. **Ədəbiyyat 10 (Bazada 12 mövzu var):**
    * *Mövcud mövzular:* `Söz sənətimiz`, `Şifahi xalq yaradıcılığı`, `"Kitabi-Dədə Qorqud"`, `Nizami Gəncəvi ("Sirlər xəzinəsi", "İsgəndərnamə")`, `İmadəddin Nəsimi`, `Şah İsmayıl Xətai`, `Məhəmməd Füzuli ("Leyli və Məcnun", "Söz")`.
15. **İnformatika 10 (Bazada 13 mövzu var):**
    * *Mövcud mövzular:* `1.1: İnformasiya və informatika`, `1.2: İnformasiya prosesləri`, `1.3: İnformasiyanın miqdarı`, `1.4: İnformasiyanın qorunması`, `2.1: Say sistemləri`, `2.2: İkilik say sistemi`, `3.1: Alqoritmlər`, `3.2: Python proqramlaşdırma`, `3.3: Dövrlər`, `3.4: Massivlər`, `4.1: Şəbəkələr`, `4.2: İnternet`, `Ümumiləşdirmə`.

---

### 📗 9-cu Sinif (4 Fənn):
16. **Azərbaycan dili 9 (Bazada 12 mövzu var):**
    * *Mövcud mövzular:* `Ana qucağı`, `Mətn`, `Üçüncü il`, `Amalım millətimi səadətə qovuşdurmaqdır`, `Mürəkkəb cümlə`, `Tabesiz mürəkkəb cümlə`, `Tabeli mürəkkəb cümlə`, `Bağlayıcılı və bağlayıcısız tabelilik`, `Budaq cümlənin növləri`, `Vasitəsiz və vasitəli nitq`, `Sitadlar`, `Ümumiləşdirici təkrar`.
17. **İngilis dili 9 (Bazada 6 Unit var):**
    * *Mövcud mövzular:* `UNIT 1. MY LANGUAGE - MY IDENTITY!`, `UNIT 2. LOST IN A BOOK`, `UNIT 3. WHY DO WE DO THAT?`, `UNIT 4. THE SKY'S THE LIMIT`, `UNIT 5. ENVIRONMENT`, `UNIT 6. CELEBRATING SUCCESS`.
18. **Ədəbiyyat 9 (Bazada 12 mövzu var):**
    * *Mövcud mövzular:* `Əhməd Cavad. Azərbaycan bayrağına`, `Cəfər Cabbarlı. Ana`, `Abdulla Şaiq. Anabacı`, `Yusif Vəzir Çəmənzəminli. Zeybək qızı`, `Səməd Vurğun. Azərbaycan`, `Mir Cəlal. Kəmtərovlar ailəsi`, `İlyas Əfəndiyev. Xurşidbanu Natəvan`, `Bəxtiyar Vahabzadə. Vətən daşı`, `Məmməd Araz. Azərbaycan - dünyam mənim`, `Xəlil Rza Ulutürk. Qaytar ana borcunu`, `Şahmar Əkbərzadə. Ağlama, Şuşam, ağlama`, `Ümumiləşdirmə`.
19. **Zəfər tarixi 9 (Bazada 10 mövzu var):**
    * *Mövcud mövzular:* `Giriş`, `§1 Münaqişə başlayır`, `§2 Birinci Qarabağ müharibəsi`, `§3 Atəşkəs`, `§4 Aprel döyüşləri və Günnüt əməliyyatı`, `§5 Tovuz döyüşləri`, `§6 İkinci Qarabağ müharibəsinin başlanması`, `§7 Döyüş əməliyyatları və Şuşanın azad edilməsi`, `§8 Tarixi Zəfər və Bəyanat`, `§9 Qələbənin əbədiləşdirilməsi`.

---

### 📙 8-ci Sinif (4 Fənn):
20. **Ümumi tarix 8 (Bazada 11 mövzu var):**
    * *Mövcud mövzular:* `Böyük Moğol dövləti`, `Fransa`, `Mədəniyyət`, `Osmanlı imperiyası`, `Səfəvilər və qonşuları`, `Almaniya`, `İngiltərə`, `Rusiya`, `ABŞ-ın yaranması`, `Böyük Fransa İnqilabı`, `Ümumiləşdirmə`.
21. **İngilis dili 8 (Bazada 6 Unit var):**
    * *Mövcud mövzular:* `UNIT 1. FREE TIME FUN`, `UNIT 2. FOOD AROUND THE WORLD`, `UNIT 3. NATURE`, `UNIT 4. MANNERS AND RULES`, `UNIT 5. HEROES`, `UNIT 6. TRADITIONS`.
22. **Fransız dili 8 (Bazada 12 mövzu var):**
    * *Mövcud mövzular:* `UNITÉ 1 / Leçon 1. Les retrouvailles!`, `UNITÉ 1 / Leçon 2. On se dépêche`, `UNITÉ 1 / Leçon 3. Ici, on parle français!`, `UNITÉ 1 / Leçon 4. Douze bonnes raisons d'apprendre le français`, `UNITÉ 2 / Leçon 1. Bienvenue en France`, `UNITÉ 2 / Leçon 2. Paris`, `UNITÉ 3. Les loisirs`, `UNITÉ 4. La météo`, `UNITÉ 5. Les fêtes`, `UNITÉ 6. Les animaux`, `UNITÉ 7. La santé`, `UNITÉ 8. Révision`.
23. **Texnologiya 8 (Bazada 10 mövzu var):**
    * *Mövcud mövzular:* `Mövzu 1: Xidmət sahələrində davranış və ünsiyyət mədəniyyəti`, `Mövzu 2: Büdcəyə qənaət. Şəxsi və ailə büdcəsi`, `Mövzu 3: Ev heyvanlarına qulluq`, `Mövzu 4: Konstruksiya materiallarının emalı`, `Mövzu 5: Mühəndis kommunikasiyaları`, `Mövzu 6: Radiotexnika və elektronika`, `Mövzu 7: Qənnadı məmulatları`, `Mövzu 8: Geyimin modelləşdirilməsi`, `Mövzu 9: Sahibkarlıq`, `Mövzu 10: Aqrotexnologiyalar`.

---

## 4. Nəticə və Çağırış

* **Alman dili 5** nümunəsində olduğu kimi, heç bir sübutsuz fərziyyə irəli sürülmür.
* Yuxarıda sadalanan **23 fənn** üzrə bazada olan mövzular göstərilmişdir. 
* Əgər bu fənlərdən hər hansı birinin rəsmi dərslik mündəricatını tamamlasanız, dərhal 1-ə 1 həmin rəsmi dərslik üzrə testlər generasiya ediləcək və bazaya daxil olunacaqdır!
