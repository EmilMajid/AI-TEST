// Təhsil Nazirliyinin vahid fənn siyahısı (19 fənn)
export const UNIFIED_SUBJECTS = [
    "Azərbaycan dili",
    "Ədəbiyyat",
    "Xarici dil",
    "İngilis dili",
    "Alman dili",
    "Fransız dili",
    "Rus dili",
    "İkinci xarici dil",
    "Riyaziyyat",
    "İnformatika",
    "Azərbaycan tarixi",
    "Ümumi tarix",
    "Fizika",
    "Kimya",
    "Biologiya",
    "Coğrafiya",
    "Təbiət",
    "Həyat bilgisi",
    "Texnologiya",
    "Təsviri İncəsənət",
    "Musiqi",
    "Fiziki tərbiyə",
    "Çağırışaqədərki hazırlıq",
    "Zəfər tarixi",
    "Ortaq türk tarixi"
] as const;

export type SubjectName = typeof UNIFIED_SUBJECTS[number];

export const subjectsByClass: Record<string, string[]> = {
    "1": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "2": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "3": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "4": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "5": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Təbiət", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "6": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Coğrafiya", "Təbiət", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "7": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "8": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Ortaq türk tarixi", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "9": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Zəfər tarixi", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "10": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Fiziki tərbiyə", "Çağırışaqədərki hazırlıq"],
    "11": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Fiziki tərbiyə", "Çağırışaqədərki hazırlıq"]
};


// 11-ci sinif ixtisar qrupları
export const groups = {
    "1": ["Riyaziyyat", "Fizika", "Kimya", "İnformatika", "Azərbaycan dili"],
    "2": ["Riyaziyyat", "Coğrafiya", "Tarix", "Azərbaycan dili", "Xarici dil"],
    "3": ["Azərbaycan dili", "Tarix", "Ədəbiyyat", "Riyaziyyat", "Xarici dil"],
    "4": ["Biologiya", "Kimya", "Fizika", "Azərbaycan dili", "Riyaziyyat"]
}

export const TOPICS: Record<string, string[]> = {
    "Ortaq türk tarixi": [
        "I BÖLMƏ. TÜRK DÜNYASI BƏŞƏR TARİXİ KONTEKSTİNDƏ",
        "1. Türk xalqlarının dünya tarixində yeri",
        "2. Türk dilləri",
        "\"Türk\" adının mənası",
        "4. Türk xalqlarının yayıldığı coğrafiya",
        "5. Türk xalqlarının ilk ulu vətəni",
        "6. Türk xalqlarının köç etməsinin (miqrasiya) səbəbləri və nəticələri",
        "7. Mərkəzi Asiyanın ən qədim mədəniyyətləri",
        "8. Prototürklər",
        "9. Sakların iqtisadiyyatı, ictimai həyatı və mədəniyyəti",
        "II BÖLMƏ. HUN İMPERİYALARI VƏ SONRAKI TÜRK DÖVLƏTLƏRİ",
        "1. Asiya hunlarının imperiyası",
        "2. Usunların dövləti",
        "3. Qədim qırğızlar",
        "4. Kanquy dövləti",
        "5. Parkana (Davan) dövləti",
        "6. Kuşan imperiyası",
        "7. Avropa Hun imperiyası",
        "8. Cənub hunlarının dövləti",
        "9. Ağ Hun (Eftallar) dövləti",
        "10. Jujan imperiyası",
        "11. Hun imperiyalarının və sonrakı türk dövlətlərinin dövründə iqtisadiyyat və mədəniyyət"
    ],
    "Azərbaycan dili": ["Orfoqrafiya", "Qrammatika", "Ədəbiyyat"],
    "Riyaziyyat": ["Cəbr", "Həndəsə", "Trigonometriya"],
    "Fizika": ["Mexanika", "Optika", "Elektromagnetizm"],
    "Kimya": ["Kimya əsasları", "Üzvi kimya", "Qeyri-üzvi kimya"],
    "Biologiya": ["Botanika", "Zoologiya", "Genetika"],
    "Coğrafiya": ["Fiziki coğrafiya", "İqtisadi coğrafiya", "Azərbaycanın coğrafiyası"],
    "Azərbaycan tarixi": ["Qədim dövr", "Orta əsrlər", "Yeni dövr", "Müasir dövr"],
    "Ümumi tarix": ["Qədim dünya", "Orta əsrlər", "Yeni dövr", "Ən yeni tarix"],
    "Zəfər tarixi": ["Giriş", "§1 Münaqişə başlayır", "§2 Birinci Qarabağ müharibəsi", "§3 Atəşkəs", "§4 Ermənistan-Azərbaycan münaqişəsi beynəlxalq müzakirələrdə", "§5 Böyük zəfərə doğru", "§6 Vətən müharibəsi", "§7 Qəhrəmanlar unudulmur", "§8 Müzəffər Ali Baş Komandan", "§9 Mədəniyyətimizin incisi - Şuşa"],
    "İngilis dili": ["UNIT 1. MY LANGUAGE - MY IDENTITY!", "UNIT 2. LOST IN A BOOK", "UNIT 3. WHY DO WE DO THAT?", "UNIT 4. THE SKY'S THE LIMIT", "UNIT 5. WORTH A THOUSAND WORDS", "UNIT 6. SHINE WITH THE RIGHT SKILLS"],
    "Alman dili": [
        "Lektion 1 - Thema 1. Familie und Verwandtschaft", "Lektion 1 - Thema 2. Mein Tagesablauf", "Lektion 1 - Thema 3. Eigenschaften", "Lektion 1 - Thema 4. Sprachen und Biografien",
        "Lektion 2 - Thema 1. Neue Bekanntschaften", "Lektion 2 - Thema 2. Freundschaft", "Lektion 2 - Thema 3. Bei der Arbeit", "Lektion 2 - Thema 4. Ausflüge und Aktivitäten",
        "Lektion 3 - Thema 1. Haushaltsgeräte", "Lektion 3 - Thema 2. Hausarbeit in der Familie", "Lektion 3 - Thema 3. Wie kann ich helfen?", "Lektion 3 - Thema 4. Zu Hause umweltfreundlich",
        "Lektion 4 - Thema 1. Konflikte und Stress", "Lektion 4 - Thema 2. Lebendig bewegt", "Lektion 4 - Thema 3. Süß aber ungesund", "Lektion 4 - Thema 4. Raus ins Grüne",
        "Lektion 5 - Thema 1. Das Leben in der Stadt", "Lektion 5 - Thema 2. Das Leben auf dem Land", "Lektion 5 - Thema 3. Freizeitangebote", "Lektion 5 - Thema 4. Ausflugsziele",
        "Lektion 6 - Thema 1. Die Richtungen", "Lektion 6 - Thema 2. Öffentlicher/privater Verkehr", "Lektion 6 - Thema 3. Die Architektur", "Lektion 6 - Thema 4. Die Sehenswürdigkeiten"
    ],
    "Rus dili": [
        "Раздел 1 - Урок 1. Язык - одежда мыслей", "Раздел 1 - Урок 2. Универсальный язык", "Раздел 1 - Урок 3. Словари", "Раздел 1 - Урок 4. «Смешные» выражения", "Раздел 1 - Урок 5. Лермонтов и Кавказ",
        "Раздел 2 - Урок 7. Каспийское море", "Раздел 2 - Урок 8. Одно из чудес Азербайджана", "Раздел 2 - Урок 9. Город имени великого поэта", "Раздел 2 - Урок 10. Прекрасный древний край", "Раздел 2 - Урок 11. «Гранатовая столица»",
        "Раздел 3 - Урок 13. Великий патриот", "Раздел 3 - Урок 14. «Почтовый ящик» (Дж.Мамедгулузаде)", "Раздел 3 - Урок 15. «Руки» (Мир Джалал)", "Раздел 3 - Урок 16. Басни (Л.Н.Толстой)", "Раздел 3 - Урок 17. «Маленький принц» (А. де Сент-Экзюпери)",
        "Раздел 4 - Урок 19. «Хлопковый замок»", "Раздел 4 - Урок 20. Сказочный город на воде", "Раздел 4 - Урок 21. Страна восходящего солнца", "Раздел 4 - Урок 22. «Земной рай»", "Раздел 4 - Урок 23. «Тропическая сказка»",
        "Раздел 5 - Урок 25. Спорт - это жизнь", "Раздел 5 - Урок 26. Древняя игра", "Раздел 5 - Урок 27. Шатрандж", "Раздел 5 - Урок 28. Восточная игра", "Раздел 5 - Урок 29. Первые Европейские игры"
    ],
    "Fransız dili": [
        "Unité 1 - Leçon 1 / À la salle de sport", "Unité 1 - Leçon 2 / Une pomme par jour éloigne le médecin !", "Unité 1 - Leçon 3 / En faveur de l’écologie", "Unité 1 - Leçon 4 / Page culture : Nouvelles de sport", "Unité 1 - Leçon 5 / Compréhension écrite: L’OMS",
        "Unité 2 - Leçon 1 / Santé mentale", "Unité 2 - Leçon 2 / Divertissements", "Unité 2 - Leçon 3 / Week-end passé", "Unité 2 - Leçon 4 / Page culture : Parc d’attraction à travers le monde", "Unité 2 - Leçon 5 / Compréhension écrite : Une visite à Planète Futuroscope",
        "Unité 3 - Leçon 1 / Pour ou contre Internet", "Unité 3 - Leçon 2 / La vie virtuelle a-t-elle détruit l’amitié de la vie réelle ?", "Unité 3 - Leçon 3 / La vie dans 10 ans", "Unité 3 - Leçon 4 / Page culture : Mars à l'année 2034", "Unité 3 - Leçon 5 / Compréhension écrite : Le soleil de la science du monde turc - Aziz Sandjar !",
        "Unité 4 - Leçon 1 / L’habit ne fait pas le moine !", "Unité 4 - Leçon 2 / L'héritage culturel - de génération en génération !", "Unité 4 - Leçon 3 / C’est la beauté intérieure qui compte !", "Unité 4 - Leçon 4 / Page culture : Semaine de la mode de Paris", "Unité 4 - Leçon 5 / Compréhension écrite : L'histoire du jean",
        "Unité 5 - Leçon 1 / Harmonie des couleurs", "Unité 5 - Leçon 2 / Art du tissage de tapis", "Unité 5 - Leçon 3 / Lahidj, un musée historico-culturel à ciel ouvert", "Unité 5 - Leçon 4 / Page culture : Photographie - témoignage de l’histoire !", "Unité 5 - Leçon 5 / Compréhension écrite : Lumière artistique brillant au front militaire : Samir Katchayev",
        "Unité 6 - Leçon 1 / Bonjour la France!", "Unité 6 - Leçon 2 / Nos plans pour les vacances", "Unité 6 - Leçon 3 / On s’est dirigés vers les régions", "Unité 6 - Leçon 4 / Page culture : Les gens célèbres français", "Unité 6 - Leçon 5 / Compréhension écrite : L’histoire de la Tour Eiffel"
    ],
    "İnformatika": ["Proqramlaşdırma", "Verilənlər bazası", "Şəbəkələr", "Alqoritmlər"],
    "Həyat bilgisi": ["Sağlam həyat tərzi", "İnsan və cəmiyyət", "Mədəniyyət və incəsənət"],
    "Təsviri incəsənət": ["Rəsm texnikaları", "Bəzək sənəti", "Rəng nəzəriyyəsi"],
    "Musiqi": ["Musiqi tarixi", "Nəzəriyyə", "Azərbaycan musiqisi"],
}

import { getAllTextbooks, getTextbooksByClass, Textbook } from './textbook-service';

export type { Textbook };

export const textbooks = getAllTextbooks();

export function getTextbooks(classNum: string, subject: string) {
    return getTextbooksByClass(classNum).filter(t => t.subject === subject);
}
