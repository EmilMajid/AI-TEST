const fs = require('fs');

const history6Topics = [
    {
        "chapter": "I BÖLMƏ. Azərbaycanda ibtidai cəmiyyət",
        "topics": [
            { "title": "1. Əsas tarixi anlayışlar və zaman ölçü vahidləri", "page": 8 },
            { "title": "2. İbtidai cəmiyyət", "page": 18 },
            { "title": "3. Erkən dövlətlər", "page": 64 }
        ]
    },
    {
        "chapter": "II BÖLMƏ. Azərbaycanda qədim dövlətlər",
        "topics": [
            { "title": "4. Manna dövləti", "page": 72 },
            { "title": "5. Azərbaycan e.ə. VII-IV yüzilliklərdə", "page": 86 },
            { "title": "6. Atropatena dövləti", "page": 94 },
            { "title": "7. Albaniya dövləti", "page": 108 }
        ]
    },
    {
        "chapter": "III BÖLMƏ. Azərbaycan III-VI yüzilliklərdə",
        "topics": [
            { "title": "8. Azərbaycanda feodal münasibətlərinin yaranması", "page": 122 },
            { "title": "9. Azərbaycan Sasanilər imperiyası dövründə", "page": 128 }
        ]
    }
];

// Integrate into manual-topics.json
const manualPath = 'scripts/manual-topics.json';
const manual = JSON.parse(fs.readFileSync(manualPath, 'utf8'));
manual["azerbaycan-tarixi-6"] = history6Topics;
fs.writeFileSync(manualPath, JSON.stringify(manual, null, 2), 'utf8');

// Integrate into textbooks.json
const textbooksPath = 'data/textbooks.json';
const textbooks = JSON.parse(fs.readFileSync(textbooksPath, 'utf8'));
const flatStr = history6Topics.map(g => g.chapter + "\n" + g.topics.map(t => t.title).join("\n")).join("\n");

textbooks["6"].forEach(book => {
    if (book.id === "azerbaycan-tarixi-6") book.topics = flatStr;
});
fs.writeFileSync(textbooksPath, JSON.stringify(textbooks, null, 2), 'utf8');

console.log("SUCCESS: Azerbaijan History 6 topics restored.");
