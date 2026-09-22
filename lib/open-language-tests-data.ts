export type ForeignLang = "en" | "de" | "fr" | "ru"

export interface OpenQuestion {
  id: string
  question: string
  context?: string
  options: string[]
  correctIndex: number
  bloomLevel: "Anlama" | "Tətbiqetmə" | "Təhliletmə"
  explanation: string
}

export interface GradeLanguageTest {
  grade: number
  language: ForeignLang
  languageName: string
  flag: string
  topicTitle: string
  unitName: string
  description: string
  questions: OpenQuestion[]
}

export const OPEN_LANGUAGE_TESTS: GradeLanguageTest[] = [
  // ==================== ENGLISH (🇬🇧) ====================
  {
    grade: 1,
    language: "en",
    languageName: "İngilis dili (English)",
    flag: "🇬🇧",
    unitName: "Unit 1",
    topicTitle: "Greetings & Classroom Objects",
    description: "Salamlaşma ifadələri və sinif ləvazimatlarının adları üzrə tətbiqi testlər.",
    questions: [
      {
        id: "en-1-1",
        question: "When you meet your teacher in the morning, what do you say?",
        options: ["Good night", "Good morning", "Goodbye", "Thank you"],
        correctIndex: 1,
        bloomLevel: "Tətbiqetmə",
        explanation: "Səhər saatlarında müəllimlə və ya dostlarla qarşılaşdıqda 'Good morning' (Sabahınız xeyir) deyilir.",
      },
      {
        id: "en-1-2",
        question: "Which item do you use to write in your notebook?",
        options: ["A desk", "A pencil", "An apple", "A chair"],
        correctIndex: 1,
        bloomLevel: "Anlama",
        explanation: "Dəftərə yazı yazmaq üçün 'A pencil' (qələm) istifadə olunur.",
      },
      {
        id: "en-1-3",
        question: "Look at the dialogue:\n- Hello, what is your name?\n- ...",
        options: ["I am fine.", "My name is Ali.", "Yes, it is.", "Good evening."],
        correctIndex: 1,
        bloomLevel: "Tətbiqetmə",
        explanation: "'What is your name?' sualına 'My name is [Ad]' formasında cavab verilir.",
      },
      {
        id: "en-1-4",
        question: "Which of these is a number?",
        options: ["Book", "Seven", "School", "Door"],
        correctIndex: 1,
        bloomLevel: "Anlama",
        explanation: "'Seven' (7) rəqəmdir; digərləri isə məktəb əşyaları və binalardır.",
      },
      {
        id: "en-1-5",
        question: "When leaving the classroom, you say:",
        options: ["Goodbye!", "Hello!", "Good morning!", "Nice to meet you!"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Ayrılarkən və ya sağollaşarkən 'Goodbye!' deyilir.",
      },
    ],
  },
  {
    grade: 5,
    language: "en",
    languageName: "İngilis dili (English)",
    flag: "🇬🇧",
    unitName: "Unit 1",
    topicTitle: "All About Me & Daily Routines (Present Simple)",
    description: "Gündəlik rejim, fərdi xüsusiyyətlər və Present Simple zamanının düzgün tətbiqi.",
    questions: [
      {
        id: "en-5-1",
        question: "Choose the correct sentence for a daily habit:",
        options: [
          "She go to school by bus every day.",
          "She goes to school by bus every day.",
          "She going to school by bus every day.",
          "She is go to school by bus every day.",
        ],
        correctIndex: 1,
        bloomLevel: "Tətbiqetmə",
        explanation: "Present Simple zamanında III şəxsin təkində (She) felin sonuna -s/-es şəkilçisi əlavə olunur: 'She goes'.",
      },
      {
        id: "en-5-2",
        question: "Complete the sentence: 'Murad is very hardworking. He ... his homework on time.'",
        options: ["always finishes", "never finish", "finish always", "is finish"],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Tezlik zərfləri (always) əsas feldən əvvəl gəlir və III şəxs üçün fel şəkilçi qəbul edir: 'always finishes'.",
      },
      {
        id: "en-5-3",
        question: "Which question asks about someone's origin?",
        options: [
          "Where do you come from?",
          "What do you do?",
          "How old are you?",
          "When is your birthday?",
        ],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Where do you come from?' şəxsin haradan olduğunu və mənşəyini soruşur.",
      },
      {
        id: "en-5-4",
        question: "Identify the logical distractor: 'Aytan likes reading, but she ... watch TV.'",
        options: ["doesn't", "don't", "isn't", "aren't"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Aytan (she) üçün Present Simple inkar forması 'doesn't' köməkçi feli ilə düzəlir.",
      },
      {
        id: "en-5-5",
        question: "Read the context: 'Kamran gets up at 7:00, brushes his teeth, and has breakfast.' What is this passage describing?",
        options: [
          "Kamran's morning routine",
          "Kamran's summer holidays",
          "Kamran's favorite hobby",
          "Kamran's school subjects",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Mətndə oyanmaq, diş fırçalamaq və səhər yeməyi yemək ardıcıllığı səhər rejimini (morning routine) təsvir edir.",
      },
    ],
  },
  {
    grade: 9,
    language: "en",
    languageName: "İngilis dili (English)",
    flag: "🇬🇧",
    unitName: "Unit 1",
    topicTitle: "Intercultural Communication & Complex Tenses",
    description: "Mədəniyyətlərarası ünsiyyət, Present Perfect və Past Simple zamanlarının müqayisəli təhlili.",
    questions: [
      {
        id: "en-9-1",
        question: "Choose the grammatically correct sentence comparing past experience with a specific time:",
        options: [
          "I have visited Shusha two years ago.",
          "I visited Shusha two years ago.",
          "I have been visiting Shusha two years ago.",
          "I visit Shusha two years ago.",
        ],
        correctIndex: 1,
        bloomLevel: "Təhliletmə",
        explanation: "Keçmişdə konkret vaxt göstəricisi ('two years ago') olduqda Present Perfect deyil, Past Simple ('visited') işlədilir.",
      },
      {
        id: "en-9-2",
        question: "Complete: 'Leyla ... in Baku since she was born, so she knows every corner of the city.'",
        options: ["has lived", "lived", "is living", "lives"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "'Since' bağlayıcısı ilə keçmişdən indiyə qədər davam edən vəziyyəti bildirmək üçün Present Perfect ('has lived') istifadə olunur.",
      },
      {
        id: "en-9-3",
        question: "Which prefix changes the word 'polite' into its antonym?",
        options: ["un-", "im-", "in-", "dis-"],
        correctIndex: 1,
        bloomLevel: "Anlama",
        explanation: "'p' və 'm' hərfləri ilə başlayan bir çox sifətlərin inkarı 'im-' önşəkilçisi ilə yaranır: polite -> impolite.",
      },
      {
        id: "en-9-4",
        question: "Select the sentence with the correct passive voice transformation:\n'The ministry approved the new national curriculum.'",
        options: [
          "The new national curriculum was approved by the ministry.",
          "The new national curriculum is approved by the ministry.",
          "The new national curriculum has approved by the ministry.",
          "The new national curriculum were approved by the ministry.",
        ],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Cümlə Past Simple zamanında olduğu üçün məchul növ 'was/were + V3' düsturu ilə düzəlir: 'was approved'.",
      },
      {
        id: "en-9-5",
        question: "In intercultural dialogue, what is the best strategy when you misunderstand someone's accent?",
        options: [
          "Politely ask them to clarify or repeat.",
          "Pretend you understood everything.",
          "Stop talking and leave the room.",
          "Correct their pronunciation aggressively.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Mədəniyyətlərarası effektiv ünsiyyətdə qarşı tərəfdən nəzakətlə fikrini dəqiqləşdirməyi xahiş etmək ('clarify or repeat') əsas etik qaydadır.",
      },
    ],
  },
  {
    grade: 11,
    language: "en",
    languageName: "İngilis dili (English)",
    flag: "🇬🇧",
    unitName: "Unit 1",
    topicTitle: "Academic Writing, Conditionals & Advanced Syntax",
    description: "Mürəkkəb sintaksis, Conditionals (II və III növ şərt cümlələri) və elmi mətn təhlili.",
    questions: [
      {
        id: "en-11-1",
        question: "Choose the correct Third Conditional sentence reflecting an unreal past condition:",
        options: [
          "If the researchers had analyzed the sample earlier, they would have discovered the anomaly.",
          "If the researchers analyzed the sample earlier, they would discover the anomaly.",
          "If the researchers have analyzed the sample earlier, they would have discovered the anomaly.",
          "If the researchers had analyzed the sample earlier, they will discover the anomaly.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Third Conditional keçmişdə baş verməmiş hadisələri ifadə edir: 'If + Past Perfect, would have + V3'.",
      },
      {
        id: "en-11-2",
        question: "Identify the sentence that uses inversion for rhetorical emphasis:",
        options: [
          "Hardly had the keynote speaker begun when the projector malfunctioned.",
          "The keynote speaker had hardly begun when the projector malfunctioned.",
          "The projector malfunctioned because the keynote speaker had begun.",
          "When the keynote speaker began, the projector had malfunctioned.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "'Hardly', 'Scarcely' kimi inkar/məhdudiyyət bildirən zərflər cümlənin əvvəlinə keçdikdə mübtəda və köməkçi felin yeri dəyişir (inversion).",
      },
      {
        id: "en-11-3",
        question: "Select the most appropriate academic transition to introduce a contrasting argument:",
        options: ["Notwithstanding these findings", "Consequently", "In addition to this", "Similarly"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "'Notwithstanding these findings' (Bu nəticələrə baxmayaraq) akademik üslubda ziddiyyətli arqument təqdim etmək üçün istifadə olunur.",
      },
      {
        id: "en-11-4",
        question: "Choose the correct subjunctive mood form: 'The committee recommended that every participant ... in the symposium.'",
        options: ["register", "registers", "registered", "will register"],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "'Recommend that', 'insist that' kimi tələb/tövsiyə bildirən fellərdən sonra gələn budaq cümlədə felin ilkin (bare infinitive) forması ('register') işlənir.",
      },
      {
        id: "en-11-5",
        question: "Which statement best synthesizes the primary objective of the National AI Diagnostic Framework?",
        options: [
          "Transforming rote knowledge assessment into verified competency and diagnostic clarity.",
          "Maximizing student testing frequency regardless of curriculum alignment.",
          "Eliminating the need for human teachers in public classrooms.",
          "Standardizing multiple-choice memorization across all regional schools.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Milli AI diaqnostika çərçivəsinin əsas məqsədi əzbərçiliyi aradan qaldıraraq bacarıq əsaslı və dəqiq diaqnostik qiymətləndirməni təmin etməkdir.",
      },
    ],
  },

  // ==================== GERMAN (🇩🇪) ====================
  {
    grade: 5,
    language: "de",
    languageName: "Alman dili (Deutsch)",
    flag: "🇩🇪",
    unitName: "Einheit 1",
    topicTitle: "Hallo! Wer bist du? (Begrüßung & Personalpronomen)",
    description: "Salamlaşma, özünü təqdim etmə və 'sein' felinin indiki zamanda təsriflənməsi.",
    questions: [
      {
        id: "de-5-1",
        question: "Welche Begrüßung passt am Morgen?",
        options: ["Guten Morgen!", "Gute Nacht!", "Auf Wiedersehen!", "Guten Abend!"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "Alman dilində səhər saatlarında 'Guten Morgen!' (Sabahınız xeyir) deyilir.",
      },
      {
        id: "de-5-2",
        question: "Ergänze das Verb 'sein': 'Ich ... Schüler in Baku.'",
        options: ["bin", "bist", "ist", "sind"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "'Sein' felinin 'Ich' şəxs əvəzliyi ilə forması 'bin' olur: 'Ich bin'.",
      },
      {
        id: "de-5-3",
        question: "Wie fragt man nach dem Namen?",
        options: ["Wie heißt du?", "Woher kommst du?", "Wie alt bist du?", "Wo wohnst du?"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Wie heißt du?' sualı bir şəxsin adını öyrənmək üçün verilir.",
      },
      {
        id: "de-5-4",
        question: "Welches Wort ist ein Schulsache (məktəb ləvazimatı)?",
        options: ["Das Buch", "Der Apfel", "Das Haus", "Der Hund"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Das Buch' kitab deməkdir və məktəb ləvazimatıdır.",
      },
      {
        id: "de-5-5",
        question: "Ergänze: 'Das ist Anna. ... kommt aus Berlin.'",
        options: ["Sie", "Er", "Es", "Wir"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Anna qadın cinsi olduğu üçün uyğun əvəzlik 'Sie' (o) seçilir.",
      },
    ],
  },
  {
    grade: 9,
    language: "de",
    languageName: "Alman dili (Deutsch)",
    flag: "🇩🇪",
    unitName: "Einheit 1",
    topicTitle: "Jugend und Medien & Perfekt mit 'haben'/'sein'",
    description: "Gənclər və media, Perfekt keçmiş zamanının 'haben' və 'sein' köməkçi felləri ilə tətbiqi.",
    questions: [
      {
        id: "de-9-1",
        question: "Wähle das richtige Hilfsverb im Perfekt: 'Wir ... gestern nach Ganja gefahren.'",
        options: ["sind", "haben", "werden", "waren"],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Hərəkət və məkan dəyişikliyi bildirən fellər ('fahren') Perfekt zamanında 'sein' köməkçi feli ilə düzəlir: 'Wir sind gefahren'.",
      },
      {
        id: "de-9-2",
        question: "Welcher Satz drückt eine persönliche Meinung aus?",
        options: [
          "Meiner Meinung nach ist digitale Bildung sehr nützlich.",
          "Das Buch liegt auf dem Schreibtisch.",
          "Der Zug fährt um acht Uhr ab.",
          "Heute ist Montag.",
        ],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Meiner Meinung nach' (Mənim fikrimcə) ifadəsi şəxsi mülahizəni bildirmək üçün istifadə edilir.",
      },
      {
        id: "de-9-3",
        question: "Ergänze das Modalverb: 'Schüler ... im Unterricht aktiv mitmachen.'",
        options: ["sollten", "wollten", "konnten", "durften"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Tövsiyə və pedaqoji öhdəlik bildirmək üçün 'sollten' (etməlidirlər) uyğundur.",
      },
      {
        id: "de-9-4",
        question: "Welche Konjunktion verlangt das Verb am Ende des Nebensatzes?",
        options: ["weil", "denn", "aber", "und"],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "'Weil' (çünki) bağlayıcısı budaq cümlə yaradır və əsas feli cümlənin ən sonuna aparır.",
      },
      {
        id: "de-9-5",
        question: "Was bedeutet das Wort 'die Verlässlichkeit' im Kontext von Lernplattformen?",
        options: ["Etibarlılıq / Güvənirlilik", "Sürətsizlik", "Təsadüfilik", "Çətinlik"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Die Verlässlichkeit' alman dilində sistemin etibarlılığı və güvənirliliyi deməkdir.",
      },
    ],
  },

  // ==================== FRENCH (🇫🇷) ====================
  {
    grade: 5,
    language: "fr",
    languageName: "Fransız dili (Français)",
    flag: "🇫🇷",
    unitName: "Unité 1",
    topicTitle: "Bonjour la classe! (Les salutations & Le verbe 'être')",
    description: "Görüşmə və salamlaşma etiketləri, 'être' (olmaq) felinin indiki zamanda çəkilməsi.",
    questions: [
      {
        id: "fr-5-1",
        question: "Comment salue-t-on poliment le professeur le matin?",
        options: ["Bonjour, Monsieur!", "Bonne nuit!", "Au revoir!", "À bientôt!"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "Səhər saatlarında müəllimə nəzakətlə 'Bonjour, Monsieur!' (Sabahınız xeyir, cənab!) deyilir.",
      },
      {
        id: "fr-5-2",
        question: "Complétez avec le verbe 'être': 'Je ... élève en 5e classe.'",
        options: ["suis", "es", "est", "sommes"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "'Être' felinin I şəxs təki 'Je suis' (Mən ...-am) formasıdır.",
      },
      {
        id: "fr-5-3",
        question: "Quelle question permet de demander le prénom?",
        options: [
          "Comment tu t'appelles?",
          "Quel âge as-tu?",
          "Où habites-tu?",
          "D'où viens-tu?",
        ],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Comment tu t'appelles?' sualı ad öyrənmək üçün verilir.",
      },
      {
        id: "fr-5-4",
        question: "Quel objet se trouve dans le cartable (məktəbli çantası)?",
        options: ["Le cahier", "La voiture", "Le lit", "L'arbre"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Le cahier' dəftər deməkdir və çantada daşınan əsas ləvazimatdır.",
      },
      {
        id: "fr-5-5",
        question: "Complétez: 'Voici Sophie. ... est très intelligente.'",
        options: ["Elle", "Il", "Ils", "Nous"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Sophie qadın cinsi olduğu üçün şəxs əvəzliyi 'Elle' (o) seçilir.",
      },
    ],
  },
  {
    grade: 9,
    language: "fr",
    languageName: "Fransız dili (Français)",
    flag: "🇫🇷",
    unitName: "Unité 1",
    topicTitle: "La vie des adolescents & Le Passé Composé",
    description: "Yeniyetmələrin məktəb həyatı və Passé Composé keçmiş zamanının 'avoir'/'être' ilə tətbiqi.",
    questions: [
      {
        id: "fr-9-1",
        question: "Choisissez la phrase correcte au passé composé avec le verbe de mouvement:",
        options: [
          "Nous sommes allés à Choucha l'été dernier.",
          "Nous avons allé à Choucha l'été dernier.",
          "Nous sommes aller à Choucha l'été dernier.",
          "Nous avons allés à Choucha l'été dernier.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "'Aller' hərəkət feli keçmiş zamanda 'être' ilə uzlaşır və cəm şəkilçisi (-s) qəbul edir: 'sommes allés'.",
      },
      {
        id: "fr-9-2",
        question: "Quel connecteur logique exprime la cause (səbəb)?",
        options: ["parce que", "donc", "mais", "cependant"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Parce que' fransız dilində 'çünki' deməkdir və səbəb bildirir.",
      },
      {
        id: "fr-9-3",
        question: "Complétez: 'Si nous étudions régulièrement, nous ... de bons résultats.'",
        options: ["aurons", "avons eu", "avions", "aurions"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "1-ci növ şərt cümləsində 'Si + présent' ardınca gələcək zaman ('Futur simple' -> 'aurons') tələb olunur.",
      },
      {
        id: "fr-9-4",
        question: "Quelle phrase illustre le respect mutuel en classe?",
        options: [
          "Écouter attentivement l'opinion de ses camarades.",
          "Interrompre le professeur sans lever la main.",
          "Ignorer les consignes de sécurité.",
          "Refuser de participer aux travaux de groupe.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Sinifdə qarşılıqlı hörmət yoldaşların fikirlərini diqqətlə dinləməyi ('Écouter attentivement') tələb edir.",
      },
      {
        id: "fr-9-5",
        question: "Que signifie l'expression 'faire des progrès'?",
        options: ["İnkişaf etmək, irəliləyiş qazanmaq", "Geriləmək", "Tələsmək", "İmtina etmək"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Faire des progrès' akademik və fərdi inkişaf əldə etmək deməkdir.",
      },
    ],
  },

  // ==================== RUSSIAN (🇷🇺) ====================
  {
    grade: 5,
    language: "ru",
    languageName: "Rus dili (Русский язык)",
    flag: "🇷🇺",
    unitName: "Тема 1",
    topicTitle: "Здравствуй, школа! (Имя существительное & Род)",
    description: "Məktəb mühiti, isimlərin qrammatik cinsi (kişi, qadın, orta) və vurğu qaydaları.",
    questions: [
      {
        id: "ru-5-1",
        question: "Какое приветствие используют при официальной встрече?",
        options: ["Здравствуйте!", "Привет!", "Пока!", "Спокойной ночи!"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "Rəsmi və nəzakətli salamlaşmada 'Здравствуйте!' (Salam) işlədilir.",
      },
      {
        id: "ru-5-2",
        question: "Определите существительное мужского рода:",
        options: ["Учебник", "Книга", "Окно", "Тетрадь"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "'Учебник' samitlə bitir və kişi cinsinə (он / мой учебник) aiddir.",
      },
      {
        id: "ru-5-3",
        question: "Вставьте правильное местоимение: 'Это Лейла. ... отлично учится.'",
        options: ["Она", "Он", "Оно", "Они"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "Leyla qadın cinsi olduğu üçün 'Она' (o) əvəzliyi tələb olunur.",
      },
      {
        id: "ru-5-4",
        question: "Какое слово обозначает школьный предмет?",
        options: ["Математика", "Телевизор", "Автобус", "Яблоко"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "'Математика' (Riyaziyyat) tədris fənnidir.",
      },
      {
        id: "ru-5-5",
        question: "Найдите предложение с правильным порядком слов и смыслом:",
        options: [
          "Ученики внимательно слушают объяснение учителя.",
          "Ученики учителя слушают внимательно стол.",
          "Внимательно книга читает ученика.",
          "Класс пишет тетрадью ручку.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Yalnız birinci variant qrammatik və məntiqi baxımdan tam düzgündür.",
      },
    ],
  },
  {
    grade: 9,
    language: "ru",
    languageName: "Rus dili (Русский язык)",
    flag: "🇷🇺",
    unitName: "Тема 1",
    topicTitle: "Культура речи & Сложноподчинённые предложения",
    description: "Nitq mədəniyyəti, tabeli mürəkkəb cümlələr və durğu işarələrinin təhlili.",
    questions: [
      {
        id: "ru-9-1",
        question: "Укажите сложноподчинённое предложение с придаточным причины (səbəb budaq cümləsi):",
        options: [
          "Мы успешно сдали экзамен, потому что усердно готовились по учебнику.",
          "Когда прозвенел звонок, все зашли в класс.",
          "Если будет хорошая погода, мы поедем на экскурсию.",
          "Я знаю, что знания открывают любые двери.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "'Потому что' bağlayıcısı səbəb bildirən budaq cümlə (придаточное причины) yaradır.",
      },
      {
        id: "ru-9-2",
        question: "В каком слове пишется удвоенная 'НН'?",
        options: ["Образованный", "Кожаный", "Песчаный", "Глиняный"],
        correctIndex: 0,
        bloomLevel: "Tətbiqetmə",
        explanation: "'-ованн-/-еванн-' şəkilçili feli sifətlər iki 'нн' ilə yazılır: 'образованный'.",
      },
      {
        id: "ru-9-3",
        question: "Какое слово является синонимом к понятию 'компетентность'?",
        options: ["Осведомлённость и мастерство", "Механическая память", "Случайная догадка", "Неуверенность"],
        correctIndex: 0,
        bloomLevel: "Anlama",
        explanation: "Kompetentlik (компетентность) yalnız bilik deyil, bacarıq, peşəkarlıq və tətbiq qabiliyyətidir.",
      },
      {
        id: "ru-9-4",
        question: "Выберите верное согласование деепричастного оборота:",
        options: [
          "Решая тест по стандарту SITG, ученик развивает логическое мышление.",
          "Решая тест по стандарту SITG, у меня заболела голова.",
          "Прочитав учебник, тест был решён легко.",
          "Закончив урок, зазвенел звонок.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "Feli bağlama tərkibindəki hərəkətlə əsas cümlədəki hərəkət eyni şəxs (şagird) tərəfindən icra olunmalıdır.",
      },
      {
        id: "ru-9-5",
        question: "Какова основная цель платформы TESTAI.AZ в преподавании языков?",
        options: [
          "Формирование навыков живого общения и глубокого грамматического анализа.",
          "Заучивание готовых шаблонов без понимания контекста.",
          "Тестирование без учета национального куррикулума.",
          "Ограничение доступа учащихся к современным ИИ-инструментам.",
        ],
        correctIndex: 0,
        bloomLevel: "Təhliletmə",
        explanation: "TESTAI.AZ platformasının məqsədi şablon əzbərçilik deyil, canlı ünsiyyət və dərin qrammatik təhlil bacarığını inkişaf etdirməkdir.",
      },
    ],
  },
]

export function getAvailableGrades(): number[] {
  return Array.from(new Set(OPEN_LANGUAGE_TESTS.map((t) => t.grade))).sort((a, b) => a - b)
}

export function getTestForGradeAndLang(grade: number, language: ForeignLang): GradeLanguageTest | undefined {
  return OPEN_LANGUAGE_TESTS.find((t) => t.grade === grade && t.language === language)
}
