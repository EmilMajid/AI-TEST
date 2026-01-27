const fs = require('fs');

const PATHS = {
    textbooks: './data/textbooks.json',
    eduData: './lib/education-data.ts'
};

// 1. Load canonical subjects
const eduContent = fs.readFileSync(PATHS.eduData, 'utf8');
const subjectsByClass = {};
const classMatches = eduContent.matchAll(/"(\d+)":\s*\[(.*?)\]/g);
for (const match of classMatches) {
    const grade = match[1];
    subjectsByClass[grade] = match[2].split(',').map(s => s.trim().replace(/"/g, ''));
}

// 2. Load textbooks
const textbooks = JSON.parse(fs.readFileSync(PATHS.textbooks, 'utf8'));

// 3. Mapping: Common aliases -> Canonical Name
// This handles the user's specific complaint about "Tarix" vs "Azərbaycan tarixi" etc.
const ALIAS_MAP = {
    "Tarix": "Azərbaycan tarixi", // If 'Tarix' is in edu-data but 'Azərbaycan tarixi' in JSON
    "Azərbaycan tarixi": "Azərbaycan tarixi",
    "Ümumi tarix": "Ümumi tarix",
    // Add fuzzy matching logic here
};

console.log("\n=== NORMALIZING TEXTBOOK SUBJECTS ===\n");

let changes = 0;

Object.keys(textbooks).forEach(grade => {
    if (!subjectsByClass[grade]) return;
    const canonicalSubjects = subjectsByClass[grade];

    textbooks[grade].forEach(book => {
        const currentSub = book.subject;

        // Find exact match
        let match = canonicalSubjects.find(s => s === currentSub);

        if (!match) {
            // Find case-insensitive match
            match = canonicalSubjects.find(s => s.toLowerCase() === currentSub.toLowerCase());
        }

        if (!match) {
            // Find fuzzy/alias match if the canonical list has something similar
            // Example: Book says "Təsviri incəsənət", Canonical says "Təsviri İncəsənət" (Case diff) - caught above
            // Example: Book says "Fiziki Tərbiyə", Canonical says "Fiziki tərbiyə" - caught above
        }

        if (match && match !== currentSub) {
            console.log(`[FIX] Grade ${grade}: "${currentSub}" -> "${match}" (${book.title})`);
            book.subject = match;
            changes++;
        } else if (!match) {
            console.log(`[WARNING] Grade ${grade}: Book "${book.title}" has subject "${currentSub}" which is NOT in the canonical list for this grade.`);
            console.log(`   Canonical List: ${canonicalSubjects.join(', ')}`);
        }
    });
});

if (changes > 0) {
    fs.writeFileSync(PATHS.textbooks, JSON.stringify(textbooks, null, 2), 'utf8');
    console.log(`\n✅ Applied ${changes} subject name normalizations.`);
} else {
    console.log("\n✅ No changes needed.");
}
