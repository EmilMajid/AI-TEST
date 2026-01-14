
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-tarixi-6.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Known Chapters approximate titles
const chapterTitles = [
    { id: 1, title: "Əsas tarixi anlayışlar və zaman ölçü vahidləri" },
    { id: 2, title: "İbtidai cəmiyyət" },
    { id: 3, title: "Erkən dövlət qurumları" }, // Title guess
    { id: 4, title: "Manna dövləti" },
    { id: 5, title: "Azərbaycan e.ə. VII—IV yüzilliklərdə" },
    { id: 6, title: "Atropatena dövləti" },
    { id: 7, title: "Albaniya dövləti" },
    { id: 8, title: "Azərbaycanda feodal münasibətlərinin yaranması" },
    { id: 9, title: "Azərbaycan Sasanilər imperiyası dövründə" }
];

console.log("--- Finding Chapter Start Pages ---");
const chapters = [];
chapterTitles.forEach(ch => {
    // Search for "1. Title" or just Title roughly
    // The TOC says "1. ...", "2. ..."
    // In text it might be "1. Title" or just big text.
    // Let's look for the specific pattern "X. Title"
    const search = `${ch.id}. ${ch.title}`;
    // Simple inclusion search might fail if OCR puts newlines.
    // Let's try to match the title part primarily.

    // Heuristic: Search for the title string, and see if it looks like a header (short line)
    // Also Chapter 1 starts around page 8.

    // We will scan all pages for these titles.
    for (const item of data) {
        if (item.text.includes(ch.title)) {
            // Confirm it's a header
            const lines = item.text.split('\n');
            const match = lines.find(l => l.includes(ch.title));
            if (match) {
                console.log(`Chapter ${ch.id} found on Page ${item.page}: ${match.trim()}`);
                chapters.push({ ...ch, page: item.page });
                break;
            }
        }
    }
});

// If we miss some, we might need manual check.
// Now, let's extract potential topics between chapters.
// Valid topic heuristic:
// - Start with capital letter
// - Not a question (ends with ?)
// - Not "Suallar", "Tapşırıqlar"
// - Short length (< 60 chars)
// - Often Bold (OCRed text doesn't show bold, but often is isolated line)

console.log("\n--- Extracting Potential Topics ---");

// Helper to filter noise
function isTopic(line) {
    if (line.length < 5 || line.length > 50) return false;
    if (line.includes("Suallar") || line.includes("Tapşırıqlar")) return false;
    if (line.match(/^\d+$/)) return false; // Page number
    if (line.includes(".......")) return false; // TOC line
    if (line.includes("Dərs")) return false;
    // Check for mostly uppercase (Chapter headers often are) -> actually topics might be sentence case
    return true;
}

// We iterate through chapters relative to each other
for (let i = 0; i < chapters.length; i++) {
    const startPage = chapters[i].page;
    const endPage = (i < chapters.length - 1) ? chapters[i + 1].page : data[data.length - 1].page;

    console.log(`\nScanning Chapter ${chapters[i].id}: "${chapters[i].title}" (Page ${startPage} - ${endPage})`);

    const relevantPages = data.filter(p => p.page >= startPage && p.page < endPage);
    relevantPages.forEach(p => {
        const lines = p.text.split('\n').filter(l => l.trim().length > 0);
        // This is tricky without font info.
        // Let's just dump first 2-3 lines of each page, and maybe isolated lines?
        // Or specific known keywords from previous inspection?
        // Let's look for lines that appear to be headings.
        // For history books, headings are often questions: "Tarixi nə üçün öyrənirik?" 
        // Wait, text showed "Tarixi nə üçün öyrənirik?" as a heading.

        lines.forEach(line => {
            const tr = line.trim();
            // Just filtering for potential headings
            // Maybe search for lines that end with "?" (which I thought were questions, but here might be headings)
            // or lines that are short.
            if (tr.length > 3 && tr.length < 60) {
                console.log(`  [P${p.page}] ${tr}`);
            }
        });
    });
}
