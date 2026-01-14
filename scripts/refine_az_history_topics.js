
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-tarixi-6.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const chapterTitles = [
    { id: 1, title: "Əsas tarixi anlayışlar və zaman ölçü vahidləri", page: 8 },
    { id: 2, title: "İbtidai cəmiyyət", page: 18 },
    { id: 3, title: "Erkən dövlət qurumları", page: 58 }, // Guessing start page based on TOC pattern or previous
    { id: 4, title: "Manna dövləti", page: 68 }, // Guess
    { id: 5, title: "Azərbaycan e.ə. VII—IV yüzilliklərdə", page: 86 },
    { id: 6, title: "Atropatena dövləti", page: 94 },
    { id: 7, title: "Albaniya dövləti", page: 108 },
    { id: 8, title: "Azərbaycanda feodal münasibətlərinin yaranması", page: 122 },
    { id: 9, title: "Azərbaycan Sasanilər imperiyası dövründə", page: 128 }
];

// Let's first verify start pages for 3 and 4, as I guessed them
chapterTitles.forEach(ch => {
    if (ch.id === 3 || ch.id === 4) {
        // Find rough page
        const match = data.find(p => p.text.includes(ch.title) || p.text.toLowerCase().includes(ch.title.toLowerCase()));
        if (match) {
            ch.page = match.page;
            console.log(`CONFIRMED Chapter ${ch.id} on Page ${match.page}`);
        }
    }
});

console.log("\n--- Extracted Structure ---");

for (let i = 0; i < chapterTitles.length; i++) {
    const ch = chapterTitles[i];
    const endPage = (i < chapterTitles.length - 1) ? chapterTitles[i + 1].page : data[data.length - 1].page;

    console.log(`\nCHAPTER: ${ch.title} (Pages ${ch.page}-${endPage})`);

    // Look at first few lines of each page in the chapter to find headers
    const potentialTopics = [];
    const pages = data.filter(p => p.page >= ch.page && p.page < endPage);

    pages.forEach(p => {
        const lines = p.text.split('\n').filter(l => l.trim().length > 3);
        // Heuristic: Headers are often short, not ending in punctuation (except ?), maybe all caps or title case
        lines.forEach(line => {
            const tr = line.trim();
            if (tr.length < 50 && !tr.includes('.....')) {
                // Filter out common noise
                if (tr.match(/^\d+$/)) return;
                if (tr.toLowerCase().includes("suallar")) return;
                if (tr.toLowerCase().includes("tapşırıqlar")) return;
                if (tr.toLowerCase().includes("dərslik")) return;

                // Valid candidates
                // Question headers
                if (tr.endsWith('?')) {
                    potentialTopics.push({ title: tr, page: p.page });
                }
                // Short phrases that look like titles
                else if (!tr.endsWith('.') && !tr.endsWith(',')) {
                    // Check if it's not part of a sentence
                    // Often headers are "Tarixi mənbələr"
                    if (tr.length > 5 && isNaN(tr[0])) {
                        potentialTopics.push({ title: tr, page: p.page });
                    }
                }
            }
        });
    });

    // Deduplicate and print top candidates
    // We only want unique titles
    const unique = [];
    const seen = new Set();
    potentialTopics.forEach(t => {
        if (!seen.has(t.title)) {
            unique.push(t);
            seen.add(t.title);
        }
    });

    // Heuristic: Limit to standard number of topics per chapter (approx 5-10)
    // Just printing them for manual selection
    unique.slice(0, 15).forEach(t => console.log(`  - [P${t.page}] ${t.title}`));
}
