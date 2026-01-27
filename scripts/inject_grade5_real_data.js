const fs = require('fs');
const path = require('path');

const MANUAL_PATH = 'scripts/manual-topics.json';
let manualData = {};

if (fs.existsSync(MANUAL_PATH)) {
    manualData = JSON.parse(fs.readFileSync(MANUAL_PATH, 'utf8'));
}

// Data from User
const grade5Updates = {
    // Azərbaycan Tarixi 5
    "azerbaycan-tarixi-5": [
        {
            "chapter": "I Bölmə. Qədim Azərbaycan",
            "topics": [
                "1. Tarix necə öyrənilir?",
                "2. Vətənim Azərbaycan",
                "3. Azərbaycanda ilk insan məskənləri",
                "4. Əmək alətləri necə yarandı?",
                "5. Dövlətlər nə üçün lazımdır?",
                "6. Azərbaycanın qədim dövlətləri"
            ]
        },
        {
            "chapter": "II Bölmə. Azərbaycan dövlətləri",
            "topics": [
                "7. Əsarətlə barışmayan qəhrəman",
                "8. Azərbaycanı birləşdirən ilk hökmdar",
                "9. Səlcuqlar və Azərbaycan",
                "10. Atabəy Şəmsəddin Eldəniz",
                "11. Qara Yusif kim idi?",
                "12. Həsən padşah Bayandur",
                "13. Şeyx necə şah oldu?",
                "14. Tariximizdə qadınlar",
                "15. Şərqin son fatehi",
                "16. Birlik yoxdursa, dirilik də yoxdur",
                "17. Azərbaycan necə parçalandı?"
            ]
        },
        {
            "chapter": "III Bölmə. Qalalar və şəhərlər",
            "topics": [
                "18. Daş keşikçilər",
                "19. Şəhərlər necə yarandı?",
                "20. Qədim Azərbaycan şəhərləri",
                "21. Azərbaycanın taxtı - Təbriz"
            ]
        },
        {
            "chapter": "IV Bölmə. Azərbaycan respublikaları",
            "topics": [
                "22. Müsəlman Şərqinin ilk Cümhuriyyəti",
                "23. Sovet işğalı",
                "24. Azərbaycan xalqı faşizmə qarşı",
                "25. Dövlət müstəqilliyinin bərpası",
                "26. Birinci Qarabağ müharibəsi",
                "27. Dövlətin xilaskarı",
                "28. Müzəffər Ali Baş Komandan",
                "29. Böyük Zəfərin ilk qaranquşu - Aprel döyüşləri",
                "30. Qanı ilə tarix yazan qəhrəmanlar",
                "31. Vətən müharibəsi",
                "32. Qarabağda quruculuq"
            ]
        },
        {
            "chapter": "V Bölmə. Mədəniyyət inciləri",
            "topics": [
                "33. “Kitabi-Dədə Qorqud”",
                "34. Nizami Gəncəvi",
                "35. Elmlə siyasət yürüdən alimlər",
                "36. Azərbaycan tarixinin atası",
                "37. “Əkinçi”dən başlanan yol",
                "38. Milli operanın banisi",
                "39. Lütfi Zadə"
            ]
        }
    ],

    // İngilis dili 5
    "ingilis-dili-5": [
        "UNIT 1. Who am I?",
        "UNIT 2. English Everywhere!",
        "UNIT 3. Where’s home?",
        "UNIT 4. Family Matters",
        "UNIT 5. A Day in the Life",
        "UNIT 6. School Time",
        "UNIT 7. What's he wearing?",
        "UNIT 8. Get Moving!"
    ],

    // Alman dili 5 (əsas)
    "alman-dili-5": [
        {
            "chapter": "Lektion 1. Kennenlernen",
            "topics": [
                "Stunde 1. Ich heiße Murad.",
                "Stunde 2. Das ist ein Kind.",
                "Stunde 3. Mein Freunde? kommt aus Japan.",
                "Stunde 4. Spielt das Mädchen Tennis?",
                "Stunde 5. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 2. Hey, Leute!",
            "topics": [
                "Stunde 1. Seine Oma ist Ärztin.",
                "Stunde 2. Unsere Klasse ist super!",
                "Stunde 3. Kannst du Deutsch sprechen?",
                "Stunde 4. Am Vormittag oder am Nachmittag?",
                "Stunde 5. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 3. Im Zimmer",
            "topics": [
                "Stunde 1. Was ist im Zimmer?",
                "Stunde 2. Wie ist der Schrank?",
                "Stunde 3. Das ist Paulas Zimmer.",
                "Stunde 4. Um 17:00 Uhr spielen wir Fußball.",
                "Stunde 5. Wiederholung",
                "Projektarbeit: Wir und die Wochentage",
                "Das kannst du jetzt!"
            ]
        },
        {
            "chapter": "Lektion 4. Produkte",
            "topics": [
                "Stunde 1. Ich mag Wasser.",
                "Stunde 2. Isst du gern Banane?",
                "Stunde 3. Wie viel ist 2 plus 3?",
                "Stunde 4. Wie viel kostet ein Kilo Tomaten?",
                "Stunde 5. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 5. Modewelt",
            "topics": [
                "Stunde 1. Die Schuhe sind cool!",
                "Stunde 2. Ich trage einen Rock.",
                "Stunde 3. Ich möchte eine Bluse kaufen.",
                "Stunde 4. Wir sind im Zirkus.",
                "Stunde 5. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 6. Gestern oder heute?",
            "topics": [
                "Stunde 1. Gestern war ich im Kino.",
                "Stunde 2. Was hattest du noch?",
                "Stunde 3. Seine Haare sind blond.",
                "Stunde 4. Hast du Zeit?",
                "Stunde 5. Wiederholung",
                "Projektarbeit: Was wissen wir über unsere Freunde?",
                "Das kannst du jetzt!",
                "Wortliste"
            ]
        }
    ],

    // Alman dili 5 (ikinci)
    "alman-dili-2-5": [
        {
            "chapter": "Lektion 1. Wie bitte?",
            "topics": [
                "Stunde 1. Wie schreibt man das?",
                "Stunde 2. Hallo, ich bin Hesen.",
                "Stunde 3. Das ist ein Buch.",
                "Stunde 4. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 2. Meine Familie",
            "topics": [
                "Stunde 1. Wer sind die Personen?",
                "Stunde 2. Was macht sie gern?",
                "Stunde 3. Ist er im Park?",
                "Stunde 4. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 3. Meine Schulsachen",
            "topics": [
                "Stunde 1. Ich habe einen Bleistift.",
                "Stunde 2. Wie ist der Ball?",
                "Stunde 3. Was möchtest du machen?",
                "Stunde 4. Wiederholung",
                "Das kannst du jetzt!"
            ]
        },
        {
            "chapter": "Lektion 4. Meine Kleider",
            "topics": [
                "Stunde 1. Mein Kleid ist schön.",
                "Stunde 2. Was brauchst du?",
                "Stunde 3. Wie findest du den Rock?",
                "Stunde 4. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 5. Lebensmittel",
            "topics": [
                "Stunde 1. Isst du gern Fleisch?",
                "Stunde 2. Ich mag lieber Wasser.",
                "Stunde 3. Wie viel kostet ein Kilo Tomaten?",
                "Stunde 4. Wiederholung"
            ]
        },
        {
            "chapter": "Lektion 6. Wann ist das?",
            "topics": [
                "Stunde 1. Wie spät ist es?",
                "Stunde 2. Wann beginnt die Schule?",
                "Stunde 3. Wann hast du Ferien?",
                "Stunde 4. Wiederholung",
                "Projektarbeit: Was mögen unsere Freunde?",
                "Das kannst du jetzt!",
                "Training: Lesen",
                "Training: Schreiben",
                "Training: Hören",
                "Training: Sprechen",
                "Grammatik mit Tabellen",
                "Lernwortschatz"
            ]
        }
    ],

    // Fransız dili 5 (əsas)
    "fransiz-dili-5": [
        {
            "chapter": "UNITÉ 1. TOUT SUR MOI",
            "topics": [
                "Leçon 1. Je me présente",
                "Leçon 2. Ma famille",
                "Leçon 3. Mon pays",
                "Leçon 4. Mon emploi du temps",
                "Leçon 5. J’aime faire du sport",
                "Révision"
            ]
        },
        {
            "chapter": "UNITÉ 2. VIE QUOTIDIENNE",
            "topics": [
                "Leçon 1. Ma journée",
                "Leçon 2. Mes loisirs",
                "Leçon 3. Les valises sont prêtes!",
                "Leçon 4. Au magasin",
                "Leçon 5. Le bulletin météo",
                "Révision"
            ]
        },
        {
            "chapter": "UNITÉ 3. LOCALISATION",
            "topics": [
                "Leçon 1. Où se situe?",
                "Leçon 2. En ville",
                "Leçon 3. Au village",
                "Leçon 4. Parc des Trophées Militaires",
                "Leçon 5. Voyage en France",
                "Révision"
            ]
        },
        {
            "chapter": "UNITÉ 4. DESCRIPTION",
            "topics": [
                "Leçon 1. Qui est qui?",
                "Leçon 2. Mes amis",
                "Leçon 3. Les personnages des dessins animés",
                "Leçon 4. Mon animal préféré",
                "Leçon 5. Les amis autour du monde",
                "Révision",
                "L’atelier de lecture",
                "Mon dictionnaire"
            ]
        }
    ],

    // Fransız dili 5 (ikinci)
    "fransiz-dili-2-5": [
        {
            "chapter": "Étape 1. Faisons connaissance!",
            "topics": [
                "Leçon 1. Moi, c'est...",
                "Leçon 2. Salut ! Ça va?",
                "Leçon 3. Qu'est-ce que c'est?",
                "Leçon 4. Tu as quel âge?",
                "Je révise"
            ]
        },
        {
            "chapter": "Étape 2. J'aime l'école!",
            "topics": [
                "Leçon 1. Comment est ta salle de classe?",
                "Leçon 2. Qu'est-ce qu'il y a dans ton sac à dos?",
                "Leçon 3. Ma classe de français",
                "Leçon 4. À la cantine : hum, c'est bon!",
                "Je révise"
            ]
        },
        {
            "chapter": "Étape 3. J'habite ici!",
            "topics": [
                "Leçon 1. Mon pays, c'est I'Azerbaïdjan!",
                "Leçon 2. Tu habites où?",
                "Leçon 3. Ma famille et moi",
                "Leçon 4. Chez moi",
                "Je révise"
            ]
        },
        {
            "chapter": "Étape 4. Mes préférences",
            "topics": [
                "Leçon 1. Je fais du sport!",
                "Leçon 2. En hiver, je porte...",
                "Leçon 3. Joyeux anniversaire!",
                "Leçon 4. Bonnes vacances!",
                "Je révise",
                "Ma lecture",
                "Mes actes de parole",
                "Mon dico visuel",
                "Mes extra exercices à pratiquer"
            ]
        }
    ],

    // Rus dili 5 (əsas)
    "rus-dili-5": [
        {
            "chapter": "Разде́л I. Путеше́ствие а «страну́ Зна́ний»",
            "topics": [
                "Уро́к 1. Здра́вствуй, шкóла! Приве́тствие и знако́мство",
                "Уро́к 2. Моя́ семья́",
                "Уро́к 3. Путеше́ствие в страну́ «Грамма́тика». Алфави́т",
                "Уро́к 4. Капри́зы Маме́да",
                "Уро́к 5. Кова́рные согла́сные",
                "Уро́к 6. Насто́ящие чудеса́",
                "Уро́к 7. Дру́жба со все́ми шко́льными предме́тами",
                "Уро́к 8. Волшебство́"
            ]
        },
        {
            "chapter": "Разде́л II. Полиста́й календа́рь!",
            "topics": [
                "Уро́к 9. Жизнь по часа́м",
                "Уро́к 10. Ка́ждый день неде́ли ва́жен",
                "Уро́к 11. Ва́жная да́та",
                "Уро́к 12. Пробужде́ние приро́ды",
                "Уро́к 13. Ле́то - прекра́сная пора́",
                "Уро́к 14. Люби́мая о́сень",
                "Уро́к 15. Ско́ро Но́вый год!",
                "Уро́к 16. Год",
                "Уро́к 17. Век - э́то столе́тие"
            ]
        },
        {
            "chapter": "Разде́л III. Прия́тного аппети́та!",
            "topics": [
                "Уро́к 18. Я накрыва́ю стол",
                "Уро́к 19. Приготовле́ние блюд",
                "Уро́к 20. Я собира́ю хончу́",
                "Уро́к 21. Найди́те это на кухне",
                "Уро́к 22. Люби́мые напи́тки",
                "Уро́к 23. Сего́дня мы идём в рестора́н",
                "Уро́к 24. Соблюда́йте этике́т за столо́м"
            ]
        },
        {
            "chapter": "Разде́л IV. Узна́й меня!",
            "topics": [
                "Уро́к 25. Ча́сти те́ла",
                "Уро́к 26. Мои́ хара́ктер",
                "Уро́к 27. Эмо́ции и чу́вства",
                "Уро́к 28. Интере́сы",
                "Уро́к 29. Интелле́кт и жела́ния",
                "Уро́к 30. Люби́мая оде́жда",
                "Уро́к 31. Мо́дная о́бувь:",
                "Уро́к 32. Занима́юсь спо́ртом и отдыха́ю",
                "Уро́к 33. Автобиогра́фия"
            ]
        },
        {
            "chapter": "Разде́л V. Мой мир",
            "topics": [
                "Уро́к 34. Мой дом",
                "Уро́к 35. На́ша ме́бель",
                "Уро́к 36. Мой двор",
                "Уро́к 37. Моё село́",
                "Уро́к 38. Мой го́род",
                "Уро́к 39. Сувени́р",
                "Уро́к 40. Шуша́",
                "Уро́к 41. Моя́ люби́мая страна́"
            ]
        },
        {
            "chapter": "Разде́л VI. Как прекра́сен э́тот мир!",
            "topics": [
                "Уро́к 42. В лес за гриба́ми",
                "Уро́к 43. Ди́кие и дома́шние живо́тные",
                "Уро́к 44. Морски́е обита́тели",
                "Уро́к 45. На́ши запове́дники",
                "Уро́к 46. Ре́ки Азербайджа́на",
                "Уро́к 47. Ви́ды тра́нспорта",
                "Уро́к 48. Тури́зм в Азербайджа́не",
                "Уро́к 49. Защища́ем эколо́гию",
                "Уро́к 50. Земля́ - наш о́бщий дом"
            ]
        }
    ],

    // Rus dili 5 (ikinci)
    "rus-dili-2-5": [
        {
            "chapter": "Разде́л 1. Нача́ло путеше́ствия в но́вый мир",
            "topics": [
                "1. Приве́тствие и проща́ние",
                "2. Дава́йте познако́мимся",
                "3. На́ша семья́",
                "4. Все профе́ссии важны́",
                "5. Ци́фры и чи́сла в на́шей жи́зни",
                "Обобща́ющие зада́ния"
            ]
        },
        {
            "chapter": "Разде́л 2. Вот он - я",
            "topics": [
                "6. В ми́ре зна́ний",
                "7. На́ше здоро́вье в на́ших рука́х",
                "8. Наряди́те себя́",
                "9. Вы́берите о́бувь",
                "Обобща́ющие зада́ния"
            ]
        },
        {
            "chapter": "Разде́л 3. Окружа́ющая нас приро́да",
            "topics": [
                "10. Улыбни́тесь ра́дуге",
                "11. Когда́ э́то быва́ет?",
                "12. Лесны́е жи́тели",
                "13. Дома́шние живо́тные",
                "14. На́ши перна́тые друзья́",
                "Обобща́ющие зада́ния"
            ]
        },
        {
            "chapter": "Разде́л 4. Э́то вку́сно и поле́зно",
            "topics": [
                "15. Где найти́ витами́ны?",
                "16. Что растёт в огоро́де?",
                "17. В суперма́ркете",
                "18. Где чи́стые кастрю́ли у на́шей маму́ли?",
                "Обобща́ющие зада́ния"
            ]
        },
        {
            "chapter": "Разде́л 5. Копи́лка тради́ций",
            "topics": [
                "19. Пра́здник мам и ба́бушек",
                "20. Пра́здник Новру́з",
                "21. Наро́дные и́гры",
                "22. На́ше гостеприи́мство",
                "23. Ичеришехе́р",
                "Обобща́ющие зада́ния"
            ]
        },
        {
            "chapter": "Разде́л 6. Мир, в кото́ром я живу́",
            "topics": [
                "24. Азербайджа́н - мой край родно́й",
                "25. Столи́ца Азербайджа́на",
                "26. Береги́те приро́ду",
                "27. Гла́вный го́род Росси́и",
                "28. Традицио́нный ру́сский сувени́р",
                "Обобща́ющие зада́ния",
                "Ска́зки: «Ку́рочка Ря́ба», «Ре́пка»"
            ]
        }
    ]
};

// Merge
Object.assign(manualData, grade5Updates);

fs.writeFileSync(MANUAL_PATH, JSON.stringify(manualData, null, 2), 'utf8');
console.log('Successfully injected Grade 5 real data!');
