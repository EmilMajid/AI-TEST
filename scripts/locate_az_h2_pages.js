
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-dili-6-h2.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const titles = [
    "Avtomobil necə yarandı?",
    "Havada uçuş",
    "Ulduzlara doğru",
    "Relslər üzərində hərəkət",
    "Gələcəyin nəqliyyatı",
    "Qədimdə kitab işi",
    "Kitab çapı",
    "Naşirlər və oxucular",
    "Müasir kitablar"
];

console.log("--- Searching for Content Pages ---");
titles.forEach(t => {
    const tNorm = t.toLowerCase();
    for (const item of data) {
        if (item.page > 10) { // Skip TOC pages which are usually at the beginning
            if (item.text.toLowerCase().includes(tNorm)) {
                const lines = item.text.split('\n');
                // Check for exact match or close match on a line
                const matchLine = lines.find(l => l.toLowerCase().includes(tNorm));
                if (matchLine && matchLine.length < 100) { // Heuristic: headers are usually short
                    console.log(`Topic "${t}" found on Page ${item.page}: ${matchLine.trim()}`);
                    break;
                }
            }
        }
    }
});
