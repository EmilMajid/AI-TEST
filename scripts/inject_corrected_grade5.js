const fs = require('fs');

const path = 'scripts/manual-topics.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Fix English - convert flat array to TopicGroup structure
data['ingilis-dili-5'] = [
    {
        chapter: "Mövzular",
        topics: [
            { title: "UNIT 1. Who am I?", page: 1, path: "" },
            { title: "UNIT 2. English Everywhere!", page: 1, path: "" },
            { title: "UNIT 3. Where's home?", page: 1, path: "" },
            { title: "UNIT 4. Family Matters", page: 1, path: "" },
            { title: "UNIT 5. A Day in the Life", page: 1, path: "" },
            { title: "UNIT 6. School Time", page: 1, path: "" },
            { title: "UNIT 7. What's he wearing?", page: 1, path: "" },
            { title: "UNIT 8. Get Moving!", page: 1, path: "" }
        ]
    }
];

// Update Technology 5
data['texnologiya-5'] = [
    {
        chapter: "MƏİŞƏT MƏDƏNİYYƏTİ",
        topics: [
            { title: "4-cü mövzu. Tərəvəzlərin becərilmə texnologiyası", page: 1, path: "" },
            { title: "5-ci mövzu. Məişətdə sadə təmir işləri", page: 1, path: "" },
            { title: "6-cı mövzu. Ailədə davranış və ünsiyyət mədəniyyəti", page: 1, path: "" },
            { title: "7-ci mövzu. Ailə büdcəsinin formalaşması", page: 1, path: "" }
        ]
    },
    {
        chapter: "ODUNCAĞIN EMALI TEXNOLOGİYASI",
        topics: [
            { title: "8-ci mövzu. Oduncaq və mişar materialları", page: 1, path: "" },
            { title: "9-cu mövzu. Oduncağın emalı üçün iş yeri və alətlər", page: 1, path: "" },
            { title: "10-cu mövzu. Oduncaq materialların mişarlanması və təmizlənməsi", page: 1, path: "" },
            { title: "11-ci mövzu. Oduncağın yonulması", page: 1, path: "" },
            { title: "12-ci mövzu. Oduncağın əl alətləri ilə burğulanması", page: 1, path: "" },
            { title: "13-cü mövzu. Oduncaq hissələrinin birləşdirilməsi", page: 1, path: "" }
        ]
    },
    {
        chapter: "METALIN EMALI TEXNOLOGİYASI",
        topics: [
            { title: "14-cü mövzu. Metallar haqqında ümumi məlumat. Nazik təbəqə metal və məftil", page: 1, path: "" },
            { title: "15-ci mövzu. Metal ilə işləmək üçün iş yeri, alət və tərtibatlar", page: 1, path: "" },
            { title: "16-cı mövzu. Təbəqə metalın və məftilin düzəldilməsi", page: 1, path: "" },
            { title: "17-ci mövzu. Nazik təbəqə metalın və məftilin təmizlənməsi, əyilməsi", page: 1, path: "" },
            { title: "18-ci mövzu. Nazik təbəqə metal hissələrinin birləşdirilməsi", page: 1, path: "" },
            { title: "19-cu mövzu. Elektrik enerjisi və sadə elektrik dövrəsi", page: 1, path: "" }
        ]
    },
    {
        chapter: "PARÇANIN EMALI TEXNOLOGİYASI",
        topics: [
            { title: "20-ci mövzu. Parçadan məmulat hazırlamaq üçün iş yeri, alətlər və tərtibatlar", page: 1, path: "" },
            { title: "21-ci mövzu. Ülgünün hazırlanması və parçanın biçilməsi texnologiyaları", page: 1, path: "" },
            { title: "22-ci mövzu. Nəm-isti emal və parça qırıntılarından tutqacın hazırlanma texnologiyası", page: 1, path: "" },
            { title: "23-cü mövzu. Muncuq. Muncuqhörmə texnikası", page: 1, path: "" }
        ]
    },
    {
        chapter: "ƏRZAQ MƏHSULLARININ EMALI TEXNOLOGİYASI",
        topics: [
            { title: "24-cü mövzu. Mətbəx qab-qacağı və onlara qulluq", page: 1, path: "" },
            { title: "25-ci mövzu. Buterbrodların və isti içkilərin hazırlanma texnologiyası", page: 1, path: "" },
            { title: "26-cı mövzu. Yumurtadan yeməklərin hazırlanma texnologiyası", page: 1, path: "" }
        ]
    }
];

// Update Music 5
data['musiqi-5'] = [
    {
        chapter: "POEZİYA VƏ MUSİQİ",
        topics: [
            { title: "1. Mahnının yaranmasında poeziyanın rolu", page: 1, path: "" },
            { title: "2. Vokaliz", page: 1, path: "" },
            { title: "3. Sözsüz mahnı", page: 1, path: "" },
            { title: "4. Poeziya və kantata", page: 1, path: "" },
            { title: "5. Libretto və opera", page: 1, path: "" },
            { title: "6. Libretto və balet", page: 1, path: "" },
            { title: "7. Libretto və operetta", page: 1, path: "" },
            { title: "8. Özünüzü yoxlayın", page: 1, path: "" }
        ]
    },
    {
        chapter: "MUSİQİDƏ ŞEİRİN ROLU",
        topics: [
            { title: "9. Mahnı və poeziya", page: 1, path: "" },
            { title: "10. Aşıq musiqisi və poeziya", page: 1, path: "" },
            { title: "11. Muğamların növləri", page: 1, path: "" },
            { title: "12. Zərbi-muğam və poeziya", page: 1, path: "" },
            { title: "13. Romans və qəzəl", page: 1, path: "" },
            { title: "14. Özünüzü yoxlayın", page: 1, path: "" }
        ]
    },
    {
        chapter: "MUSİQİ VƏ TƏSVİRİ İNCƏSƏNƏT",
        topics: [
            { title: "15. Musiqidə dəniz mövzusu", page: 1, path: "" },
            { title: "16. Musiqili lövhələr və təsviri sənət", page: 1, path: "" },
            { title: "17. Muğam dəstgahları", page: 1, path: "" },
            { title: "18. Musiqidə sülh mövzusu", page: 1, path: "" },
            { title: "19. Musiqidə Nizami Gəncəvi obrazı", page: 1, path: "" },
            { title: "20. Musiqidə Məhəmməd Füzuli obrazı", page: 1, path: "" },
            { title: "21. Musiqidə ana obrazı", page: 1, path: "" },
            { title: "22. Musiqidə Novruz bayramı", page: 1, path: "" },
            { title: "23. Özünüzü yoxlayın", page: 1, path: "" }
        ]
    },
    {
        chapter: "MUSİQİDƏ OBRAZ",
        topics: [
            { title: "24. Musiqidə karvan obrazı", page: 1, path: "" },
            { title: "25. Musiqidə qəhrəmanlıq obrazı", page: 1, path: "" },
            { title: "26. Musiqidə Don Kixot obrazı", page: 1, path: "" },
            { title: "27. Musiqidə təbiət mənzərəsi", page: 1, path: "" },
            { title: "28. Musiqidə neftçi obrazı", page: 1, path: "" },
            { title: "29. Musiqidə Ulu öndər Heydər Əliyevin obrazı", page: 1, path: "" },
            { title: "30. Musiqidə Hindistan mövzusu", page: 1, path: "" },
            { title: "31—32. Özünüzü yoxlayın", page: 1, path: "" },
            { title: "Musiqi lüğəti", page: 1, path: "" },
            { title: "Dərsliyə daxil olan mahnıların notları", page: 1, path: "" }
        ]
    }
];

// Update Physical Education 5 (from OCR images - manual transcription)
data['fiziki-terbiye-5'] = [
    {
        chapter: "NƏZƏRİ BİLİKLƏR",
        topics: [
            { title: "Əziz dost", page: 6, path: "" },
            { title: "İdmanın yaranma tarixindən", page: 7, path: "" },
            { title: "Sağlam həyat tərzi", page: 8, path: "" },
            { title: "Fiziki və funksional inkişaf göstəriciləri", page: 9, path: "" },
            { title: "İdman zalı", page: 20, path: "" },
            { title: "Sıra hərəkətləri", page: 21, path: "" }
        ]
    },
    {
        chapter: "I BÖLMƏ - SÜRƏT",
        topics: [
            { title: "Dünyanın ən sürətli insanı", page: 25, path: "" },
            { title: "Sürət hərəkət qabiliyyəti", page: 26, path: "" },
            { title: "Atletika", page: 27, path: "" },
            { title: "Hərəkətin reaksiya tezliyinin inkişaf etdirilməsi", page: 28, path: "" },
            { title: "Mütəhərrik oyunlar", page: 32, path: "" },
            { title: "Hərəkətin icra tezliyinin inkişaf etdirilməsi", page: 33, path: "" },
            { title: "Maksimal qısa sürətinin inkişaf etdirilməsi", page: 34, path: "" },
            { title: "Sürət qabiliyyətinin təkmilləşdirilməsi", page: 35, path: "" },
            { title: "Milli rəqs - \"Yallı\"", page: 36, path: "" },
            { title: "Olimpiya oyunlarının tarixindən", page: 38, path: "" }
        ]
    },
    {
        chapter: "II BÖLMƏ - SÜRƏT-GÜC",
        topics: [
            { title: "Sürət-güc hərəkət qabiliyyəti", page: 41, path: "" },
            { title: "Yuxarı ətraf əzələlərində sürət-güc qabiliyyətinin inkişafı", page: 42, path: "" },
            { title: "Aşağı ətraf əzələlərində sürət-güc qabiliyyətinin inkişaf etdirilməsi", page: 45, path: "" },
            { title: "Olimpiya oyunlarının tarixindən", page: 50, path: "" }
        ]
    },
    {
        chapter: "III BÖLMƏ - BƏDƏNIN ƏYİLMƏ QABİLİYYƏTİ",
        topics: [
            { title: "Bədənin əyilmə qabiliyyəti", page: 53, path: "" },
            { title: "Gimnastika", page: 54, path: "" },
            { title: "BBQ-in statik və dinamik hərəkətlərlə inkişafı", page: 56, path: "" },
            { title: "BBQ-in təkmilləşdirilməsi", page: 57, path: "" },
            { title: "Olimpiya oyunlarının tarixindən", page: 62, path: "" },
            { title: "FLƏŞMOB - 1", page: 64, path: "" }
        ]
    },
    {
        chapter: "IV BÖLMƏ - QÜVVƏ",
        topics: [
            { title: "Qüvvə hərəkət qabiliyyəti", page: 67, path: "" },
            { title: "Yuxarı ətraf əzələ qüvvəsinin inkişaf etdirilməsi", page: 68, path: "" },
            { title: "Aşağı ətraf əzələ qüvvəsinin inkişaf etdirilməsi", page: 70, path: "" },
            { title: "Bədənin ön və arxa əzələlərində qüvvənin inkişaf etdirilməsi", page: 73, path: "" },
            { title: "Qüvvə qabiliyyətinin təkmilləşdirilməsi", page: 74, path: "" },
            { title: "Olimpiya oyunlarının tarixindən", page: 76, path: "" }
        ]
    },
    {
        chapter: "V BÖLMƏ - ÇEVİKLİK",
        topics: [
            { title: "Çeviklik hərəkət qabiliyyəti", page: 79, path: "" },
            { title: "İdman oyunları", page: 80, path: "" },
            { title: "Futbol", page: 81, path: "" },
            { title: "Dəqiq ərəfə inkişaf etdirilməsi", page: 83, path: "" },
            { title: "Basketbol", page: 89, path: "" },
            { title: "Çeviklik qabiliyyətinin təkmilləşdirilməsi", page: 92, path: "" },
            { title: "Olimpiya oyunlarının tarixindən", page: 94, path: "" },
            { title: "FLƏŞMOB - 2", page: 106, path: "" }
        ]
    },
    {
        chapter: "VI BÖLMƏ - DÖZÜMLÜLÜK",
        topics: [
            { title: "Dözümlülük hərəkət qabiliyyəti", page: 98, path: "" },
            { title: "Ümumi dözümlülük", page: 99, path: "" },
            { title: "Xüsusi dözümlülük", page: 100, path: "" },
            { title: "Dözümlülüyün təkmilləşdirilməsi", page: 102, path: "" },
            { title: "Olimpiya oyunlarının tarixindən", page: 104, path: "" },
            { title: "(VII Yay Olimpiya Oyunları)", page: 106, path: "" },
            { title: "Ailə, mən və idman", page: 108, path: "" },
            { title: "İdman gündəliyi", page: 111, path: "" },
            { title: "İstifadə edilmiş ədəbiyyat", page: 112, path: "" }
        ]
    }
];

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Successfully updated Grade 5 topics for English, Technology, Music, and Physical Education!');
