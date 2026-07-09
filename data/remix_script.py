import json
import os

input_file = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\duplicate_chunk_10.json"
output_file = r"C:\Users\User\Downloads\azerbaijanaiplatform\data\remixed_chunk_10.json"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

updates = {
    "11-003-1.2-xatırlama-sadə-05-58ca": {
        "question": "Elektrik yükünün yaratdığı sahənin intensivliyinin hər hansı bir dielektrik mühitdə, vakuumla müqayisədə nə qədər zəiflədiyini ifadə edən kəmiyyət necə adlanır?",
        "options": ["Potensiallar fərqi", "Dielektrik nüfuzluğu", "Sahənin gərginliyi", "Sərbəst yük sıxlığı"],
        "correctAnswer": 1,
        "explanation": "Dielektrik nüfuzluğu bir mühitdə elektrik sahəsinin vakuumla müqayisədə neçə dəfə zəiflədiyini göstərir (ε = E0 / E)."
    },
    "11-003-1.3-anlama-orta-06-459c": {
        "question": "Müsbət sınaq yükünün sahə tərəfindən itələnməsi prosesini nəzərə alaraq, elektrik sahəsinin potensialı ilə intensivlik vektorunun istiqaməti arasında hansı əlaqə mövcuddur?",
        "options": ["İntensivlik vektoru azalan potensial istiqamətində (böyükdən kiçiyə) yönəlir.", "İntensivlik vektoru həmişə ekvipotensial səthlərə toxunan istiqamətdə yönəlir.", "Sahənin intensivlik vektoru potensialı kiçik olan nöqtədən böyük olan nöqtəyə doğru baxır.", "Potensiallar fərqindən asılı olmayaraq, intensivlik sınaq yükünün kütlə mərkəzinə doğru yönəlir."],
        "correctAnswer": 0,
        "explanation": "Kontekstdə qeyd edilir ki, sahənin intensivliyinin istiqaməti potensialın azaldığı, yəni böyük olan nöqtədən kiçik olan nöqtəyə doğru yönəlir."
    },
    "11-003-1.3-anlama-orta-07-22d6": {
        "question": "Müsbət nöqtəvi yük tərəfindən yaradılmış elektrostatik sahədə eyni potensiala malik olan nöqtələrin həndəsi yeri nəyi əmələ gətirir?",
        "options": ["Yalnız qüvvə xətləri boyunca düz xətləri", "Mərkəzi verilmiş yük olan, lakin qeyri-müntəzəm formalı səthləri", "Müxtəlif istiqamətlərdə yönəlmiş paralel müstəviləri", "Mərkəzi həmin yükdə yerləşən konsentrik sferaları"],
        "correctAnswer": 3,
        "explanation": "Nöqtəvi yük üçün eyni potensiallı (ekvipotensial) nöqtələr çoxluğu mərkəzi bu yükdə olan konsentrik sferalardır."
    },
    "11-003-1.4-təhlil-orta-5-d19f": {
        "question": "Elektrik dövrəsində enerji mənbəyi kimi akkumulyator və kondensatorun iş prinsiplərini müqayisə etdikdə kondensatorun üstün xüsusiyyəti nədən ibarətdir?",
        "options": ["Uzun müddət ərzində elektrik enerjisini heç bir itki olmadan özündə saxlaya bilməsi", "Çox kiçik müqavimətə malik dövrələrdə topladığı enerjini anidən boşalda bilməsi", "Enerjini daim mexaniki işə çevirmək xüsusiyyətinin olması", "Sabit cərəyan mənbəyi kimi saatlarla istifadə oluna bilməsi"],
        "correctAnswer": 1,
        "explanation": "Kondensator enerjini uzun müddət saxlaya bilməsə də, akkumulyatordan fərqli olaraq kiçik müqavimətli dövrələrdə enerjini anidən boşalda bilmək üstünlüyünə malikdir."
    },
    "11-003-1_5-A-sadə-3-e213": {
        "question": "Əgər dövrəyə qoşulmuş C₁ və C₂ tutumlu iki kondensator paralel şəkildə bağlanmışsa, ekvivalent tutumu necə tapmaq olar?",
        "options": ["İki tutumun fərqi kimi", "İki tutumun həndəsi ortası kimi", "İki kondensatorun tutumları cəmi şəklində", "Hər iki tutumun tərsinin cəmi şəklində"],
        "correctAnswer": 2,
        "explanation": "Kondensatorların paralel birləşməsi zamanı ekvivalent tutum ayrı-ayrı kondensatorların tutumlarının cəminə bərabərdir (C = C₁ + C₂)."
    },
    "11-004-01-1-S-03-4e41": {
        "question": "Mətnə əsasən, gündəlik istifadə olunan kağız, plastik, şüşə qablar və təmir zamanı atılan qalıqlar tullantıların hansı qrupuna aid edilir?",
        "options": ["İstehsalat tullantılarına", "Məişət tullantılarına", "Yalnız tibbi tullantılara", "Radioaktiv tullantılara"],
        "correctAnswer": 1,
        "explanation": "Mətndə açıq şəkildə qeyd olunur ki, gündəlik istifadə olunan kağız, plastik, şüşə qablar və təmir tullantıları məişət tullantıları qrupuna aiddir."
    },
    "11-004-01-04-orta-09-aca1": {
        "question": "Xəritədə iki nöqtə arasında məsafənin nə dərəcədə təhrif edildiyini müəyyənləşdirmək üçün ardıcıllıq necə olmalıdır?",
        "options": ["Əvvəlcə dərəcə toru ləğv edilir, sonra yalnız baş miqyas tətbiq olunur.", "Yalnız 1°-lik paralel qövsünün uzunluğu 100-ə vurulur və xəritə miqyası nəzərə alınmır.", "Baş miqyasa əsasən məsafə tapılır, sonra bu məsafə 1°-lik meridian/paralel qövsləri ilə hesablanaraq aralarındakı fərq tapılır.", "Xəritədəki uzunluq ölçülmədən birbaşa meridian üzrə dərəcə fərqi hesablanır."],
        "correctAnswer": 2,
        "explanation": "Mətndə bildirilir ki, məsafənin nə qədər təhrif olunduğunu bilmək üçün əvvəlcə xəritənin baş miqyasına əsasən məsafə tapılır, sonra 1°-lik qövslər vasitəsilə hesablanır və fərq tapılır."
    },
    "11-004-1.1-tetbiq-orta-09-24ca": {
        "question": "Qrafik təhlil metodundan istifadə edən tədqiqatçı torpaq qatlarının və süxurların yatım formasını göstərmək üçün hansı təsvir növünü qurmalıdır?",
        "options": ["Yalnız xüsusi miqyaslı xəritəni", "Dairəvi diaqramı", "Kartoqrafik anamorfozu", "Relyef profilini"],
        "correctAnswer": 3,
        "explanation": "Süxur laylarının və torpaq qatlarının şaquli kəsiyini, yəni yatım formasını vizuallaşdırmaq üçün ərazinin profili qurulmalıdır. Bu, qrafik təhlilə aiddir."
    },
    "11-004-1.2-ANL-C-13-3d46": {
        "question": "\"Keyfiyyət-fon üsulu ilə tərtib edilmişdir\" ifadəsi vizual təhlil aparan şəxsin hansı təhlil mərhələsini yerinə yetirdiyini göstərir?",
        "options": ["Riyazi əsasların və koordinatların dəqiq hesablanması mərhələsini", "Xəritədə tətbiq olunmuş təsvir üsullarının aydınlaşdırılması mərhələsini", "Ümumi elmi nəticələrin və coğrafi qanunauyğunluqların çıxarılması mərhələsini", "Obyektlərin rəqəmsal profilinin yaradılması mərhələsini"],
        "correctAnswer": 1,
        "explanation": "\"Keyfiyyət-fon üsulu\" xəritədəki təsvir üsuludur. Bunun müəyyən edilməsi vizual təhlilin \"xəritədə obyekt və hadisələrin təsvir olunduğu üsulun aydınlaşdırılması\" mərhələsinə aiddir."
    },
    "11-004-02-1-1-02-81c3": {
        "question": "Bütövün hissələri arasında olan kəmiyyət nisbətini əyani şəkildə (360 dərəcəlik bölgü daxilində) nümayiş etdirmək üçün hansı qrafik təsvir növü ən uyğundur?",
        "options": ["Dairəvi diaqram", "Xətti qrafik", "Relyef profili", "Hipsometrik əyri"],
        "correctAnswer": 0,
        "explanation": "Dairəvi diaqram bir neçə kəmiyyət arasındakı nisbəti bütövün hissələri kimi (çox vaxt faiz və ya dərəcə ilə) göstərmək üçün istifadə olunur."
    },
    "11-004-1.4-tətbiq-orta-06-64bf": {
        "question": "Mətnə əsasən, qrafik təhlil metodunun mühüm tətbiqlərindən biri kimi ərazinin hansı növ qrafik təsviri qurulur?",
        "options": ["Sütunlu diaqram", "Xətti vizualizasiya", "Dairəvi diaqram", "Ərazinin profili"],
        "correctAnswer": 3,
        "explanation": "Mətndə birbaşa qeyd olunur ki, ərazinin profili qrafik təhlil vasitəsilə qurulur."
    },
    "11-004-0105-ANL-1-05-1043": {
        "question": "Sənaye xəritələrini təhlil edərkən sellüloz-kağız və ağac emalı sənayesi müəssisələrinin yerləşməsində hansı coğrafi amilin həlledici rol oynadığı görünür?",
        "options": ["Ərazi relyefinin mütləq şəkildə düzənlik olması", "İri meşə massivlərinə və xammal mənbələrinə yaxınlıq", "Neft və qaz yataqlarının mövcudluğu", "Yüksək ixtisaslı şəhər əhalisinin sıxlığı"],
        "correctAnswer": 1,
        "explanation": "Ağac emalı və sellüloz-kağız sənayesi bilavasitə xammala (meşə massivlərinə) yaxın ərazilərdə yerləşdirilir."
    },
    "11-004-CIS-TEH-O-10-f11a": {
        "question": "Tədris prosesində \"Genomumodifikasiya olunmuş orqanizmlər (GMO)\" mövzusunu tədris edərkən əsas məqsəd nə olmalıdır?",
        "options": ["Şagirdlərə GMO məhsullarının mənşəyini, fayda və zərərlərini təhlil etməyi öyrətmək", "Bütün bitkilərin genetik strukturunu laboratoriyada dəyişməyi tapşırmaq", "Yalnız kənd təsərrüfatında istifadə olunan ənənəvi gübrələrin faydasını göstərmək", "GMO-nun iqlim dəyişikliyinə təsirini tamamilə inkar etmək"],
        "correctAnswer": 0,
        "explanation": "GMO mövzusunun məqsədi adətən bu orqanizmlərin xüsusiyyətlərini, bio-texnoloji əsaslarını, həmçinin insan və təbiətə potensial təsirlərini analiz etməyi öyrətməkdir."
    },
    "11-alman-gold-4-2": {
        "question": "Laut der Anweisung im Text, was sollen die Schüler im zweiten Schritt tun?",
        "options": ["Sie sollen sofort eine eigene Tradition erfinden und präsentieren.", "Sie sollen Sitten und Bräuche in Nachbarländern recherchieren und ihre Meinung dazu äußern.", "Sie müssen alle alten Traditionen ihres eigenen Landes auswendig lernen.", "Sie sollen ein Bild über die Traditionen im Ausland malen."],
        "correctAnswer": 1,
        "explanation": "Im Text steht eindeutig: 'Recherchieren Sie verschiedene Sitten und Bräuche in Nachbarländern. Entscheiden Sie, ob Sie für oder gegen Tradition sind...' Dies entspricht genau der Recherche und der Meinungsäußerung."
    },
    "11-alman-gold-3-5": {
        "question": "Was ist die Hauptaufgabe in Bezug auf die Bundesländer und deren Hauptstädte im gegebenen Text?",
        "options": ["Man soll die Bevölkerung jeder Landeshauptstadt berechnen.", "Man soll die längsten Flüsse Deutschlands aufzählen.", "Man soll die Landeshauptstädte den entsprechenden Bundesländern zuordnen.", "Man soll neue Sehenswürdigkeiten für jedes Bundesland entwerfen."],
        "correctAnswer": 2,
        "explanation": "Der Text verlangt eindeutig: 'Finden Sie die Landeshauptstädte den Bundesländern zu.' Das bedeutet, die Hauptstädte zuzuordnen."
    },
    "11-alman-gold-4-5": {
        "question": "Wie sollen die Schüler nach der Recherche über die Traditionen in den Nachbarländern vorgehen?",
        "options": ["Sie sollen ihre eigene Liste machen, in der sie festhalten, ob sie für oder gegen Traditionen sind.", "Sie sollen einen langen Aufsatz über die Geschichte der Bundesrepublik schreiben.", "Sie sollen die Bräuche aus den Bildern ignorieren und nur das Internet nutzen.", "Sie sollen die Nachbarländer besuchen, um die Sitten direkt zu beobachten."],
        "correctAnswer": 0,
        "explanation": "Im Abschnitt 2B heißt es: 'Entscheiden Sie, ob Sie für oder gegen Tradition sind und machen Sie Ihre eigene Liste.'"
    },
    "11-alman-gold-4-6": {
        "question": "Welches Thema wird in der Aufgabe 1 im Text angesprochen?",
        "options": ["Die politischen Parteien in den Nachbarländern.", "Die wirtschaftliche Entwicklung in Deutschland.", "Das Erkennen und das Vorwissen über Sitten und Bräuche auf Bildern.", "Die Geschichte der deutschen Literatur im 20. Jahrhundert."],
        "correctAnswer": 2,
        "explanation": "In der Aufgabe 1 steht: 'Welche Sitten und Bräuche kann man auf den Bildern erkennen? Was wissen Sie über diese Traditionen?'"
    },
    "11-alman-gold-4-7": {
        "question": "Was ist das ultimative Ziel der Aufgabenreihe 'Bräuche' im Text?",
        "options": ["Eine Debatte über fremde Kulturen zu vermeiden.", "Die Lernenden dazu anzuregen, Bräuche zu erkennen, darüber zu recherchieren und eine eigene Meinung zu bilden.", "Den Schülern beizubringen, wie man traditionelle Kleidung näht.", "Alle alten Bräuche in Europa gesetzlich abzuschaffen."],
        "correctAnswer": 1,
        "explanation": "Der Text führt die Lernenden vom Erkennen (Bilder) über die Recherche (Nachbarländer) hin zur Reflexion und Meinungsbildung."
    },
    "3-az-1720113165-1": {
        "question": "Mətndəki 'sayəsində biz qalib gəldik...' cümləsi hansı fikri ifadə edir?",
        "options": ["Kiminsə və ya nəyinsə köməyi, dəstəyi ilə uğur qazanıldığını", "Komandanın heç bir kömək olmadan təkbaşına qalib gəldiyini", "Yarışda məğlubiyyətə uğradıqlarını", "Qalib gəlmək üçün qaydaların pozulduğunu"],
        "correctAnswer": 0,
        "explanation": "'Sayəsində' sözü adətən müsbət mənada, kiminsə və ya nəyinsə dəstəyi ilə əldə edilən nailiyyəti bildirmək üçün istifadə olunur."
    },
    "3-az-1720113165-2": {
        "question": "'Biz qalib gəldik' ifadəsi mətndə hansı hissə uyğun gəlir?",
        "options": ["Məyusluq və kədər hissinə", "Qələbə qazanmağa və uğur əldə etməyə", "Yarışdan imtina etməyə", "Rəqibin güclü olduğunu etiraf etməyə"],
        "correctAnswer": 1,
        "explanation": "'Qalib gəlmək' bir yarışda, mübarizədə üstünlük qazanmaq və zəfər əldə etmək mənasını daşıyır."
    },
    "3-az-1720113165-4": {
        "question": "'Sayəsində biz qalib gəldik' cümləsində cümlənin mübtədası hansıdır?",
        "options": ["Qalib", "Sayəsində", "Biz", "Gəldik"],
        "correctAnswer": 2,
        "explanation": "Cümlədə işi görən, yəni qalib gələn tərəf 'biz' əvəzliyi ilə ifadə olunub, buna görə də 'biz' mübtədadır."
    },
    "3-az-1720113165-5": {
        "question": "'Qalib' sözünün əks mənası (antonimi) hansıdır?",
        "options": ["Zəfər", "Uğur", "Məğlub", "Cəsur"],
        "correctAnswer": 2,
        "explanation": "Qalib sözü zəfər qazanan mənasındadır, onun tam əksi isə məğlub, yəni uduzan tərəfdir."
    },
    "3-az-1720113165-6": {
        "question": "'Sayəsində biz qalib gəldik' ifadəsini tamamlayan ən məntiqli başlanğıc hansı ola bilər?",
        "options": ["Tənbəlliyimizin", "Zəif hazırlığımızın", "Yaxşı məşq etməyimizin və birliyimizin", "Rəqibin çox güclü olmasının"],
        "correctAnswer": 2,
        "explanation": "Qələbə (qalib gəlmək) müsbət nəticə olduğundan, 'sayəsində' qoşması ilə birləşən səbəb də müsbət (yaxşı məşq və birlik) olmalıdır."
    },
    "3-az-1720113165-7": {
        "question": "'Qalib gəlmək' ifadəsi neçə sözdən ibarət mürəkkəb feldir?",
        "options": ["3", "1", "2", "4"],
        "correctAnswer": 2,
        "explanation": "'Qalib gəlmək' ifadəsi 'qalib' və 'gəlmək' olmaqla iki sözdən ibarət mürəkkəb feldir."
    },
    "3-az-1720113165-8": {
        "question": "Verilmiş 'sayəsində biz qalib gəldik' cümləsindəki 'biz' əvəzliyi hansı şəxsi bildirir?",
        "options": ["II şəxsin təki", "I şəxsin cəmi", "III şəxsin təki", "III şəxsin cəmi"],
        "correctAnswer": 1,
        "explanation": "Azərbaycan dilində 'mən' birinci şəxsin təki, 'biz' isə birinci şəxsin cəmini bildirən şəxs əvəzliyidir."
    },
    "3-az-1720113165-11": {
        "question": "Aşağıdakı cümlələrdən hansında 'sayəsində' sözü yuxarıdakı cümlədəki kimi müsbət mənada işlənib?",
        "options": ["Quraqlıq sayəsində məhsul məhv oldu.", "Sənin köməyin sayəsində çətinliyi aşdıq.", "Fırtına sayəsində gəmi batdı.", "Gecikməyim sayəsində avtobusu qaçırtdım."],
        "correctAnswer": 1,
        "explanation": "'Sayəsində' sözü adətən müsbət nəticə verən səbəblərlə işlənir ('köməyin sayəsində' olduğu kimi). Mənfi hallarda adətən 'üzündən' və ya 'səbəbindən' istifadə edilir."
    },
    "3-az-1720113165-12": {
        "question": "'Sayəsində biz qalib gəldik' cümləsi tələffüz zamanı hansı intonasiya ilə deyilməlidir?",
        "options": ["Təəssüf və kədər", "Qorxu və təlaş", "Qürur və sevinc", "Şikayət və narazılıq"],
        "correctAnswer": 2,
        "explanation": "Qalibiyyət fərəh və müvəffəqiyyət bildirdiyi üçün belə cümlələr təbii olaraq qürur və sevinc intonasiyası ilə ifadə olunur."
    },
    "3-az-1720113165-14": {
        "question": "'Sayəsində biz qalib gəldik' frazası bir hekayədə keçirsə, bu hekayənin əsas mövzusu nə ola bilər?",
        "options": ["Dostluq, dəstək və zəfər", "Ümidsizlik və tənha yaşamaq", "Xəstəliklər və onların müalicəsi", "Təbiət hadisələrinin qorxulu tərəfləri"],
        "correctAnswer": 0,
        "explanation": "'Kiminsə sayəsində qalib gəlmək' əməkdaşlıq, kömək (dostluq/dəstək) və nəticədə qazanılan uğurdan (zəfər) bəhs edir."
    },
    "3-az-1720113165-15": {
        "question": "'Qalib gəldik' sözündəki 'gəldik' feli hansı zamandadır?",
        "options": ["Gələcək zaman", "Şühudi keçmiş zaman", "İndiki zaman", "Nəqli keçmiş zaman"],
        "correctAnswer": 1,
        "explanation": "'Gəldik' felindəki '-di' şəkilçisi şühudi (görülən) keçmiş zamanın göstəricisidir."
    }
}

remixed_data = []
for item in data:
    pid = item.get("passport_id")
    if pid in updates:
        upd = updates[pid]
        item["question"] = upd["question"]
        item["options"] = upd["options"]
        item["correctAnswer"] = upd["correctAnswer"]
        item["explanation"] = upd["explanation"]
        item["passport_id"] = pid + "-r1"
        
        if "context_chunk" in item:
            del item["context_chunk"]
        if "_duplicate_of" in item:
            del item["_duplicate_of"]
            
        remixed_data.append(item)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(remixed_data, f, ensure_ascii=False, indent=2)

print(f"Successfully processed {len(remixed_data)} objects.")
