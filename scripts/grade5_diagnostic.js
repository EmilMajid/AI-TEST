const fs = require('fs');
const path = require('path');

// 1. Data Sources
const TEXTBOOKS_FILE = './data/textbooks.json';
const MANUAL_TOPICS_FILE = './scripts/manual-topics.json';
const EXTRACTED_TOPICS_FILE = './scripts/extracted-topics.json';
const EDUCATION_DATA_FILE = './lib/education-data.ts';

function loadJSON(filepath) {
    try {
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (e) {
        return {};
    }
}

// 2. Load Data
const textbooks = loadJSON(TEXTBOOKS_FILE);
const manualTopics = loadJSON(MANUAL_TOPICS_FILE);
const extractedTopics = loadJSON(EXTRACTED_TOPICS_FILE);

// Extract subjects by class from lib/education-data.ts using simple regex
const educationDataContent = fs.readFileSync(EDUCATION_DATA_FILE, 'utf8');
const grade5SubjectsMatch = educationDataContent.match(/"5":\s*\[(.*?)\]/);
const grade5Subjects = grade5SubjectsMatch
    ? grade5SubjectsMatch[1].split(',').map(s => s.trim().replace(/"/g, ''))
    : [];

console.log(`\n=== GRADE 5 DIAGNOSTIC REPORT ===\n`);
console.log(`Defined Subjects in lib/education-data.ts: ${grade5Subjects.length}`);

const grade5Books = textbooks["5"] || [];
const subjectCoverage = {};
grade5Subjects.forEach(s => subjectCoverage[s] = []);

// 3. Validation Logic
const issues = [];
const stats = {
    totalSubjects: grade5Subjects.length,
    coveredSubjects: 0,
    brokenFiles: 0,
    missingTopics: 0
};

grade5Books.forEach(book => {
    if (subjectCoverage[book.subject]) {
        subjectCoverage[book.subject].push(book);
    }

    // A. Check Physical File
    let fullPath = '';
    if (book.path && book.path.startsWith('/')) {
        fullPath = path.join(process.cwd(), 'public', book.path);
        if (!fs.existsSync(fullPath)) {
            issues.push(`[FILE MISSING] ${book.title} (${book.id}): path "${book.path}" not found.`);
            stats.brokenFiles++;
        }
    }

    // B. Check Topics
    const hasManual = manualTopics[book.id];
    const hasExtracted = extractedTopics[book.id];
    const hasInline = book.topics && book.topics.length > 50; // Simple heuristic for "real" vs placeholder

    if (!hasManual && !hasExtracted && !hasInline) {
        issues.push(`[TOPICS MISSING] ${book.title} (${book.id}): No real topics found in manual/extracted/inline data.`);
        stats.missingTopics++;
    }
});

// 4. Summarize Results
console.log(`\nCoverage Status:`);
grade5Subjects.forEach(s => {
    const books = subjectCoverage[s];
    if (books.length > 0) {
        console.log(`✅ [${s}] -> ${books.length} book(s) found.`);
        stats.coveredSubjects++;
    } else {
        console.log(`❌ [${s}] -> NO TEXTBOOK DEFINED IN textbooks.json`);
        issues.push(`[SUBJECT GAP] No textbooks defined for subject "${s}" in Grade 5.`);
    }
});

console.log(`\n--- Issues Found: ${issues.length} ---`);
issues.forEach(iss => console.log(iss));

console.log(`\n--- Final Stats ---`);
console.log(`Subject Coverage: ${stats.coveredSubjects}/${stats.totalSubjects}`);
console.log(`Broken Links: ${stats.brokenFiles}`);
console.log(`Books without Topics: ${stats.missingTopics}`);

if (issues.length === 0) {
    console.log(`\nSUCCESS: Grade 5 structure is 100% valid!`);
}
