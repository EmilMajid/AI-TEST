const fs = require('fs');

const textbooksData = JSON.parse(fs.readFileSync('./data/textbooks.json', 'utf8'));
const eduContent = fs.readFileSync('./lib/education-data.ts', 'utf8');

const classMatches = eduContent.matchAll(/"(\d+)":\s*\[(.*?)\]/g);
const subjectsByClass = {};
for (const match of classMatches) {
    const grade = match[1];
    subjectsByClass[grade] = match[2].split(',').map(s => s.trim().replace(/"/g, ''));
}

console.log("\n=== CASING MISMATCH AUDIT ===\n");

Object.keys(subjectsByClass).forEach(grade => {
    console.log(`Class ${grade}:`);
    const definedSubjects = subjectsByClass[grade];
    const actualBooks = textbooksData[grade] || [];
    const actualSubjects = [...new Set(actualBooks.map(b => b.subject))];

    definedSubjects.forEach(ds => {
        const match = actualSubjects.find(as => as === ds);
        const caseInsensitiveMatch = actualSubjects.find(as => as.toLowerCase() === ds.toLowerCase());

        if (!match) {
            if (caseInsensitiveMatch) {
                console.log(`❌ MISMATCH: Defined "${ds}" vs Actual "${caseInsensitiveMatch}"`);
            } else {
                console.log(`⚠️ MISSING: Subject "${ds}" has no books at all.`);
            }
        } else {
            // console.log(`✅ MATCH: ${ds}`);
        }
    });
});
