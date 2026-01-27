const fs = require('fs');
const path = require('path');

// --- PATH CONFIG ---
const ROOT = process.cwd();
const PATHS = {
    textbooks: path.join(ROOT, 'data/textbooks.json'),
    manualTopics: path.join(ROOT, 'scripts/manual-topics.json'),
    extractedTopics: path.join(ROOT, 'scripts/extracted-topics.json'),
    educationData: path.join(ROOT, 'lib/education-data.ts')
};

function loadJSON(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return {}; }
}

// --- CORE LOGIC ---
async function runAudit() {
    console.log(`\n=========================================`);
    console.log(`🚀 UNIVERSAL PLATFORM AUDIT STARTING...`);
    console.log(`=========================================\n`);

    const textbooks = loadJSON(PATHS.textbooks);
    const manualTopics = loadJSON(PATHS.manualTopics);
    const extractedTopics = loadJSON(PATHS.extractedTopics);

    // Extract subject list using regex from TypeScript file
    const eduContent = fs.readFileSync(PATHS.educationData, 'utf8');
    const subjectsByClass = {};
    const classMatches = eduContent.matchAll(/"(\d+)":\s*\[(.*?)\]/g);
    for (const match of classMatches) {
        const grade = match[1];
        subjectsByClass[grade] = match[2].split(',').map(s => s.trim().replace(/"/g, ''));
    }

    const grades = Object.keys(subjectsByClass).sort((a, b) => parseInt(a) - parseInt(b));
    let globalIssues = 0;

    for (const grade of grades) {
        console.log(`\n--- Class ${grade} ---`);
        const gradeSubjects = subjectsByClass[grade];
        const gradeBooks = textbooks[grade] || [];

        let gradeIssues = 0;

        for (const subject of gradeSubjects) {
            const subjectBooks = gradeBooks.filter(b => b.subject === subject);

            if (subjectBooks.length === 0) {
                console.log(`❌ [Subject Gap] "${subject}": No textbook assigned.`);
                gradeIssues++;
                continue;
            }

            // Check each book for this subject
            for (const book of subjectBooks) {
                const bookStatus = [];

                // 1. File Check
                if (book.path) {
                    const fullP = path.join(ROOT, 'public', book.path);
                    if (!fs.existsSync(fullP)) {
                        bookStatus.push(`FILE-MISSING`);
                    }
                } else {
                    bookStatus.push(`PATH-UNDEFINED`);
                }

                // 2. Topic Check
                const hasManual = manualTopics[book.id];
                const hasExtracted = extractedTopics[book.id];
                const hasInline = (book.topics && (Array.isArray(book.topics) ? book.topics.length > 2 : book.topics.length > 40));

                if (!hasManual && !hasExtracted && !hasInline) {
                    bookStatus.push(`NO-REAL-TOPICS`);
                } else {
                    // Content Density Check
                    let topicCount = 0;
                    if (hasManual) {
                        const mEntry = manualTopics[book.id];
                        if (Array.isArray(mEntry)) {
                            // It can be array of strings or array of objects with 'topics'
                            if (typeof mEntry[0] === 'string') {
                                topicCount = mEntry.length;
                            } else {
                                topicCount = mEntry.reduce((acc, g) => acc + (g.topics ? g.topics.length : 0), 0);
                            }
                        }
                    }
                    else if (hasExtracted) topicCount = extractedTopics[book.id].reduce((acc, g) => acc + g.topics.length, 0);
                    else if (book.topics) topicCount = Array.isArray(book.topics) ? book.topics.length : book.topics.split('\n').filter(t => t.trim().length > 0).length;

                    if (topicCount < 15) {
                        bookStatus.push(`SUSPICIOUS-LOW-CONTENT (${topicCount} topics)`);
                    }
                }

                if (bookStatus.length > 0) {
                    console.log(`⚠️  [Book Issue] "${book.title}" (${book.id}): ${bookStatus.join(', ')}`);
                    gradeIssues++;
                } else {
                    // Optional: success log for core books only to keep output clean
                    if (["Riyaziyyat", "Azərbaycan dili", "Təbiət", "Azərbaycan tarixi"].includes(subject)) {
                        // console.log(`✅ ${book.title}: OK`);
                    }
                }
            }
        }

        if (gradeIssues === 0) {
            console.log(`✔️ Grade ${grade} is 100% valid.`);
        } else {
            console.log(`❌ Grade ${grade} has ${gradeIssues} issue(s).`);
            globalIssues += gradeIssues;
        }
    }

    console.log(`\n=========================================`);
    if (globalIssues === 0) {
        console.log(`🎉 AUDIT PASSED: All verified subjects are 100% ready!`);
    } else {
        console.log(`🛑 AUDIT FAILED: Found ${globalIssues} total issues.`);
    }
    console.log(`=========================================\n`);
}

runAudit();
