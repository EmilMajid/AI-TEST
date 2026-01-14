
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-dili-6-h2.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const titles = [
    "Avtomobil necə yarandı?",
    "Ulduzlara doğru",
    "Havada uçuş",
    "Relslər üzərində hərəkət",
    "Gələcəyin nəqliyyatı",
    "Qədimdə kitab işi",
    "Kitab çapı",
    "Naşirlər və oxucular",
    "Müasir kitablar"
];

titles.forEach(t => {
    const tNorm = t.toLowerCase();
    for (const item of data) {
        if (item.text.toLowerCase().includes(tNorm)) {
            console.log(`Title "${t}" found on Page ${item.page}`);
            // print snippet
            const lines = item.text.split('\n');
            const match = lines.find(l => l.toLowerCase().includes(tNorm));
            if (match) console.log(`  > ${match.trim()}`);
            break;
        }
    }
});
