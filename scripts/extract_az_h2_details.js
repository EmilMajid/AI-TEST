
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-dili-6-h2.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Known sections range
// 5-ci bölmə: Page 9
// 6-cı bölmə: Page 37 (based on "Amfibiya adam" story location?) No, let's trace properly.

// Reading texts based on "Fəsil" or typical layout
// Page 9: Danışan ilmələr
// Page 16: Rəqslərin dili
// Page 22: Heykəltaraş Mirəli Mirqasımov
// Page 26: Qoca aşpaz

// Let's create a list of potential titles to search for based on the TOC
const topics = [
    "Danışan ilmələr",
    "Rəqslərin dili",
    "Heykəltaraş Mirəli Mirqasımov",
    "Qoca aşpaz",
    "Amfibiya adam", // From prev output
    "Görünməz adam", // From Page 38
    "Skelliq",       // From Page 43
    "Yaddaş",        // From Page 48
    "Avtomobil necə yarandı?", // Page 54
    "Havada uçuş", // Page 60 or around -> "Ulduzlara doğru" actually
    "Gələcəyin nəqliyyatı",
    "Qədimdə kitab işi",
    "Kitab çapı",
    "Naşirlər və oxucular",
    "Müasir kitablar",
    "Ulduzlara doğru" // Page 60 title?
];

console.log("--- Detecting Topic Pages ---");
topics.forEach(t => {
    const tNorm = t.toLowerCase();
    for (const item of data) {
        const text = item.text.toLowerCase();
        if (text.includes(tNorm)) {
            // Heuristic: Topic title usually appears near top or is short line
            const lines = item.text.split('\n');
            const matchLine = lines.find(l => l.toLowerCase().includes(tNorm));
            if (matchLine) {
                console.log(`Topic "${t}" possibly on Page ${item.page}`);
                break; // assume first occurrence is start
            }
        }
    }
});

console.log("\n--- Detecting Sections ---");
// Looking for "x-cı bölmə"
for (const item of data) {
    const lines = item.text.split('\n');
    for (const line of lines) {
        if (line.match(/\d+-c[iü]\s+bölmə/i)) {
            console.log(`Section on Page ${item.page}: ${line.trim()}`);
        }
    }
}
