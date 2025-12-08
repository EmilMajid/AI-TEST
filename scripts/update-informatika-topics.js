const fs = require('fs');
const path = require('path');

const informatikaTopics = [
    {
        "chapter": "İNFORMASİYA",
        "topics": [
            { "title": "İnformasiyanın kodlaşdırılması", "page": 6 },
            { "title": "2-lik, 8-lik və 16-lıq say sistemləri", "page": 10 },
            { "title": "Bir say sistemindən başqasına keçid", "page": 14 },
            { "title": "İnformasiyanın ölçülməsi", "page": 18 },
            { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 22 }
        ]
    },
    {
        "chapter": "MULTİMEDİA",
        "topics": [
            { "title": "Multimedia qurğuları", "page": 26 },
            { "title": "Elektron təqdimatda animasiya", "page": 30 },
            { "title": "Təqdimatda səs və video", "page": 34 },
            { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 38 }
        ]
    },
    {
        "chapter": "PROQRAMLAŞDIRMA",
        "topics": [
            { "title": "Proqram necə hazırlanır", "page": 42 },
            { "title": "Python dilində ilk proqram", "page": 46 },
            { "title": "Proqramda kəmiyyətlər", "page": 50 },
            { "title": "Şərt operatoru", "page": 54 },
            { "title": "Proqramda dövr", "page": 58 },
            { "title": "Sayğaclı dövrlər", "page": 62 },
            { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 66 }
        ]
    },
    {
        "chapter": "KOMPÜTER",
        "topics": [
            { "title": "İş masasının nizamlanması", "page": 70 },
            { "title": "İnformasiya modelinin ağac forması", "page": 74 },
            { "title": "Faylların axtarışı", "page": 78 },
            { "title": "Ağacşəkilli struktur əsasında məsələ həlli", "page": 82 },
            { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 86 }
        ]
    },
    {
        "chapter": "TƏTBİQİ PROQRAMLAR",
        "topics": [
            { "title": "Üçölçülü qrafika", "page": 90 },
            { "title": "Tillər və üzlər", "page": 94 },
            { "title": "Üçölçülü modellərin qurulması", "page": 98 },
            { "title": "Mətn redaktorunun obyektləri", "page": 102 },
            { "title": "Elektron cədvəl", "page": 106 },
            { "title": "Düsturlarla iş", "page": 110 },
            { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 114 }
        ]
    },
    {
        "chapter": "İNFORMASİYA CƏMİYYƏTİ VƏ İNTERNET",
        "topics": [
            { "title": "Cəmiyyətin informasiyalaşdırılması", "page": 118 },
            { "title": "Kompüter şəbəkələri", "page": 122 },
            { "title": "İnternet xidmətləri", "page": 126 },
            { "title": "Ümumiləşdirici sual və tapşırıqlar", "page": 130 }
        ]
    }
];

const manualPath = path.join(process.cwd(), "scripts", "manual-topics.json");
let manualTopics = {};

if (fs.existsSync(manualPath)) {
    manualTopics = JSON.parse(fs.readFileSync(manualPath, "utf-8"));
}

manualTopics["informatika"] = informatikaTopics;

fs.writeFileSync(manualPath, JSON.stringify(manualTopics, null, 2));
console.log("Updated manual-topics.json with provided Informatika topics.");
