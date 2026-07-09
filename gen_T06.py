import json
import random

questions_data = [
    # Simple
    {
        "bloom_level": "B1",
        "difficulty": "S",
        "question": "Şah I Abbasdan sonra Səfəvi taxtına kim çıxmışdır?",
        "options": ["I Səfi", "II Abbas", "Xosrov xan", "Ağa Məhəmməd xan Qacar"],
        "correct_index_raw": 0,
        "explanation": "Mətnə əsasən, Şah I Abbasdan sonra hakimiyyətə onun nəvəsi I Səfi gəlmişdir."
    },
    {
        "bloom_level": "B2",
        "difficulty": "S",
        "question": "Şah I Səfinin dövründə (1629-1642) Səfəvi dövlətinin iqtisadi gücünün artmasına səbəb olan əsas amil nə idi?",
        "options": [
            "Osmanlılarla sülh müqaviləsinin imzalanması və hərbi xərclərin azlığı",
            "Şimali Qafqazda rus qalalarının dağıdılması",
            "Böyük Moğol dövləti ilə ittifaqın qurulması",
            "Ağa Məhəmməd xanın yürüşləri"
        ],
        "correct_index_raw": 0,
        "explanation": "I Səfinin hakimiyyəti illərində Osmanlılarla sülh əmin-amanlıq yaratdı və hərbi xərcləri azaltdı, bu da iqtisadi gücü artırdı."
    },
    {
        "bloom_level": "B1",
        "difficulty": "S",
        "question": "Səfəvilərin Avropa ölkələrinə ixrac etdiyi mallar arasında hansı məhsul xüsusi yer tuturdu?",
        "options": [
            "Azərbaycan ustalarının toxuduqları xalçalar",
            "İpək və pambıq parçalar",
            "Dulusçuluq məmulatları",
            "Zərgərlik əşyaları və qablar"
        ],
        "correct_index_raw": 0,
        "explanation": "Mətndə qeyd olunur ki, Avropa ölkələrinə ixrac olunan mallar arasında Azərbaycan ustalarının toxuduqları xalçalar xüsusi yer tuturdu."
    },
    {
        "bloom_level": "B1",
        "difficulty": "S",
        "question": "1653-cü ildə Şimali Qafqazda rus-kazak dəstələrini darmadağın edən Səfəvi sərkərdəsi kim idi?",
        "options": [
            "Xosrov xan",
            "Şah II Abbas",
            "Ağa Məhəmməd xan Qacar",
            "Şah I Səfi"
        ],
        "correct_index_raw": 0,
        "explanation": "1653-cü ildə Şirvan bəylərbəyi Xosrov xanın başçılıq etdiyi Səfəvi ordusu rus-kazak dəstələrini darmadağın etmişdir."
    },
    {
        "bloom_level": "B1",
        "difficulty": "S",
        "question": "Ağa Məhəmməd xan Qacar Cənubi Qafqaz üzərinə yürüşə nə vaxt başlamışdır?",
        "options": [
            "1795-ci ildə",
            "1653-cü ildə",
            "1794-cü ildə",
            "1629-cu ildə"
        ],
        "correct_index_raw": 0,
        "explanation": "Ağa Məhəmməd xan Qacar Səfəvi və Əfşar dövlətlərinin tarixi sərhədlərini bərpa etmək üçün 1795-ci ilin əvvəllərində Cənubi Qafqaz üzərinə yürüşə başlamışdır."
    },
    # Medium
    {
        "bloom_level": "B3",
        "difficulty": "O",
        "question": "Şah I Səfinin hakimiyyət illərində ölkədə əmin-amanlığın yaranmasının Səfəvi dövlətinə hansı iqtisadi təsiri oldu?",
        "options": [
            "Sənətkarlıq inkişaf etdi və Avropa ilə ticarət əlaqələri genişləndi.",
            "Kazakların Səfəvi karvanlarına hücumları dayandırıldı.",
            "Şimali Qafqaza doğru yeni ərazilər işğal olundu.",
            "Böyük Moğol dövləti ilə ortaq ticarət ittifaqı quruldu."
        ],
        "correct_index_raw": 0,
        "explanation": "Sülh və hərbi xərclərin azlığı nəticəsində ənənəvi sənətkarlıq inkişaf etdi və xarici dövlətlərlə geniş ticarət əlaqələri yaradıldı."
    },
    {
        "bloom_level": "B3",
        "difficulty": "O",
        "question": "Səfəvi hökmdarı II Abbasın dövründə Səfəvilərlə Moskva çarlığı arasında münasibətlərin gərginləşməsinin səbəbi nə idi?",
        "options": [
            "Kazakların Səfəvilərin ticarət karvanlarına hücum etməsi",
            "Səfəvi ordusunun Həştərxana ticarət məqsədli yürüş etməsi",
            "Moskva çarlığının Osmanlılarla müttəfiq olması",
            "Rusiya ordusunun İrəvanı işğal etməsi"
        ],
        "correct_index_raw": 0,
        "explanation": "Moskva çarlığının təbəələri olan kazakların Səfəvilərin ticarət karvanlarına hücumları bu iki dövlət arasındakı münasibətləri gərginləşdirmişdi."
    },
    {
        "bloom_level": "B3",
        "difficulty": "O",
        "question": "Şirvan bəylərbəyi Xosrov xanın 1653-cü ildəki hərbi yürüşünün əsas nəticəsi nə oldu?",
        "options": [
            "Rus-kazak dəstələri darmadağın edildi və Şimali Qafqazdakı rus qalaları dağıdıldı.",
            "Tiflis üzərinə hücum edilərək Gürcüstan Səfəvilərə tabe edildi.",
            "Zəndlər sülaləsi hakimiyyətdən uzaqlaşdırıldı.",
            "Qəndəhar Böyük Moğol dövlətinin işğalından azad edildi."
        ],
        "correct_index_raw": 0,
        "explanation": "1653-cü ildə Xosrov xanın başçılıq etdiyi Səfəvi ordusu rus-kazak dəstələrini darmadağın edərək Şimali Qafqazda rusların inşa etdirdiyi qalaları dağıtdı."
    },
    {
        "bloom_level": "B3",
        "difficulty": "O",
        "question": "Ağa Məhəmməd xan Qacarın 1794-cü ildə Zəndlər sülaləsinin sonuncu nümayəndəsini hakimiyyətdən uzaqlaşdırmasında əsas məqsədi nə idi?",
        "options": [
            "Qızılbaş türkmanların keçmiş qüdrətini bərpa etmək",
            "Səfəvilərlə Rusiya arasındakı köhnə ticarət əlaqələrini canlandırmaq",
            "Həştərxana doğru böyük hərbi yürüşə hazırlaşmaq",
            "Qərbi Avropa dövlətlərinin ölkə daxilindəki təsirini məhdudlaşdırmaq"
        ],
        "correct_index_raw": 0,
        "explanation": "Mətndə qeyd edilir ki, Ağa Məhəmməd xan Qacar qızılbaş türkmanların keçmiş qüdrətini bərpa etmək üçün 1794-cü ildə Zəndlər sülaləsinin sonuncu nümayəndəsini hakimiyyətdən uzaqlaşdırdı."
    },
    {
        "bloom_level": "B3",
        "difficulty": "O",
        "question": "Ağa Məhəmməd xan Qacarın 1795-ci ildəki Cənubi Qafqaz yürüşünün hədəfləri hansı şəhərləri əhatə edirdi?",
        "options": [
            "İrəvan, Şuşa və Tiflis",
            "Şamaxı, Gəncə və Bakı",
            "Dərbənd, Həştərxan və Qəndəhar",
            "Təbriz, Qəzvin və Ərdəbil"
        ],
        "correct_index_raw": 0,
        "explanation": "1795-ci ilin əvvəllərində Ağa Məhəmməd xan İrəvanı tutdu, ordusunun bir hissəsini Şuşanın mühasirəsində saxlayıb Tiflis üzərinə hücum etdi."
    },
    # Hard
    {
        "bloom_level": "B4",
        "difficulty": "C",
        "question": "XVII əsrin birinci yarısında (I Səfi dövrü) Səfəvi dövlətinin inkişafına dair səbəb-nəticə əlaqələrindən hansı doğrudur?",
        "options": [
            "Osmanlılarla sülhün imzalanması -> Hərbi xərclərin azalması -> İqtisadi gücün artması və sənətkarlığın inkişafı",
            "Kazakların Səfəvi karvanlarına hücumu -> I Səfinin Moskva çarlığı ilə sülh bağlaması -> İqtisadi gücün artması",
            "Şimali Qafqazda rus qalalarının dağıdılması -> Böyük Moğol dövlətinin hücumu -> Hərbi xərclərin kəskin artması",
            "Xosrov xanın yürüşü -> Zəndlər sülaləsinin devrilməsi -> Qızılbaş qüdrətinin bərpası"
        ],
        "correct_index_raw": 0,
        "explanation": "Sülh müqaviləsinin imzalanması hərbi xərcləri azaltdı, əmin-amanlıq iqtisadi gücün, xüsusilə sənətkarlığın və ticarətin inkişafına səbəb oldu."
    },
    {
        "bloom_level": "B4",
        "difficulty": "C",
        "question": "XVII əsrin ortalarında (II Abbasın dövrü) Qafqazda Səfəvi-Rusiya qarşıdurmasının mahiyyəti və nəticəsi necə səciyyələndirilə bilər?",
        "options": [
            "Səfəvilər öz ticarət maraqlarını qorumaq üçün hərbi güc tətbiq etdi və rusların Şimali Qafqazdakı dayaqlarını (qalalarını) məhv edərək irəliləyişlərinin qarşısını aldı.",
            "Moskva çarlığı Səfəvi ordusunu məğlub edərək Qafqaz ticarətini tamamilə öz inhisarına aldı və Səfəviləri bölgədən sıxışdırdı.",
            "Qarşıdurma Səfəvi və Osmanlı ordularının birləşməsinə və Moskvanın tabe edilməsi üçün birgə yürüşə gətirib çıxardı.",
            "Rusiya Gürcüstana dəstək verərək Səfəvilərin Qafqazdakı bütün torpaqlarını ələ keçirdi və II Abbas sülh istəməyə məcbur oldu."
        ],
        "correct_index_raw": 0,
        "explanation": "Kazakların karvanlara hücumlarına cavab olaraq Xosrov xanın yürüşü təşkil edildi və Səfəvilər rus-kazak dəstələrini darmadağın edib rus qalalarını dağıtdılar."
    },
    {
        "bloom_level": "B5",
        "difficulty": "C",
        "question": "Ağa Məhəmməd xan Qacarın Cənubi Qafqaza hərbi yürüşünün (1795) tarixi məqsədi və mahiyyəti nədən ibarət idi?",
        "options": [
            "Səfəvi və Əfşar dövlətlərinin tarixi ərazi bütövlüyünü bərpa etmək və keçmiş qızılbaş dövlətinin qüdrətini yenidən canlandırmaq.",
            "Zəndlər sülaləsini dəstəkləyən Cənubi Qafqaz xalqlarından qisas almaq və onları imperiyadan kənarlaşdırmaq.",
            "Cənubi Qafqazı Osmanlı imperiyasından qorumaq üçün Rusiyanın himayəsinə vermək.",
            "Yalnız Gürcüstanı tutmaq və Rusiya valisinə tabe olaraq müştərək idarəçilik sistemi qurmaq."
        ],
        "correct_index_raw": 0,
        "explanation": "Mətndə vurğulanır ki, Ağa Məhəmməd xan Qacar Qızılbaş Səfəvi və Əfşar dövlətlərinin tarixi sərhədlərini tam bərpa etmək üçün bu yürüşü təşkil etmişdir."
    },
    {
        "bloom_level": "B4",
        "difficulty": "C",
        "question": "I Səfi və II Abbasın xarici siyasəti arasındakı fərqli yanaşma mətndə özünü necə göstərir?",
        "options": [
            "I Səfi Osmanlılarla sülh və iqtisadi inkişafa üstünlük vermiş, II Abbas isə Moskva çarlığının təhlükələrinə qarşı fəal hərbi güc (Şimali Qafqazda) tətbiq etmişdir.",
            "I Səfi bütün qonşularla müharibə aparmış, II Abbas isə əraziləri sülh yolu ilə Osmanlıya güzəştə getmişdir.",
            "I Səfi Moğol dövlətinə qarşı şərq sərhədlərini genişləndirmiş, II Abbas isə Zəndlərlə mübarizəyə diqqət ayırmışdır.",
            "I Səfi yalnız qərb ölkələri ilə ticarət etmiş, II Abbas isə xarici ticarət əlaqələrini tamamilə dayandırmışdır."
        ],
        "correct_index_raw": 0,
        "explanation": "I Səfi dövründə sülh müqaviləsi əmin-amanlıq yaradıb iqtisadiyyatı gücləndirdiyi halda, II Abbas rus-kazak hücumlarına qarşı hərbi qüvvədən istifadə edərək qalaları dağıtmışdır."
    },
    {
        "bloom_level": "B5",
        "difficulty": "C",
        "question": "Mətndəki tarixi inkişaf dinamikasına əsasən, Səfəvilərdən Qacarlara qədərki dövrdə siyasi xəttin varisliyini sübut edən ən mühüm amil nədir?",
        "options": [
            "Qacarların ordusunun əsas hissəsinin qızılbaşlardan təşkil olunması və əvvəlki (Səfəvi, Əfşar) tarixi sərhədləri bərpa etmək cəhdləri",
            "Hər iki sülalənin Qərbi Avropa dövlətləri ilə xalça ticarəti sayəsində dünya iqtisadiyyatını idarə etməsi",
            "Moskva çarlığı ilə eyni sülh müqavilələrinin Qacarlar dövründə də qüvvədə saxlanılması",
            "Zəndlər sülaləsinin hər iki dövlətin yaranmasında ideoloji rəhbər rolu oynaması"
        ],
        "correct_index_raw": 0,
        "explanation": "Mətndə qeyd olunur ki, Qacar ordusunun əsasını qızılbaş türkmanlar təşkil edirdi və o, Səfəvi və Əfşar dövlətlərinin tarixi sərhədlərini bərpa etməyə çalışırdı, bu da varisliyi və eyni hədəfləri göstərir."
    }
]

output = []
for i, q in enumerate(questions_data):
    num = str(i + 1).zfill(3)
    passport_id = f"08-UTAR-T06-{q['bloom_level']}-{q['difficulty']}-{num}"
    
    options = q["options"]
    correct_text = options[q["correct_index_raw"]]
    
    shuffled_options = options[:]
    random.shuffle(shuffled_options)
    
    correct_idx = shuffled_options.index(correct_text)
    
    out_q = {
        "passport_id": passport_id,
        "category": "Ümumi tarix 8",
        "topic": "Qafqaz",
        "difficulty": q["difficulty"],
        "bloom_level": q["bloom_level"],
        "question": q["question"],
        "options": shuffled_options,
        "correctAnswer": correct_idx,
        "explanation": q["explanation"]
    }
    output.append(out_q)

with open(r"C:\Users\User\Downloads\azerbaijanaiplatform\data\umumi_tarix_8_gen_T06.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=4)
