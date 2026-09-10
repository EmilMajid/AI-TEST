
const fs = require('fs');
const path = require('path');

// Simulate route.ts GET handler logic directly in Node
const textbooksData = JSON.parse(fs.readFileSync('data/textbooks.json', 'utf8'));
const textbooksMetadata = textbooksData['2'] || [];

let extractedTopics = {};
if (fs.existsSync('scripts/extracted-topics.json')) {
    extractedTopics = JSON.parse(fs.readFileSync('scripts/extracted-topics.json', 'utf8'));
}
let manualTopics = {};
if (fs.existsSync('scripts/manual-topics.json')) {
    manualTopics = JSON.parse(fs.readFileSync('scripts/manual-topics.json', 'utf8'));
}
const mergedExtracted = { ...extractedTopics, ...manualTopics };

const MOCK_PATTERNS = [/mocked/i, /tam m[əe]tn/i, /d[əe]rslik\s?\(pdf\)/i];
function isMockContent(text) {
    if (!text) return true;
    if (text === "Mövzular") return false;
    return MOCK_PATTERNS.some(p => p.test(text));
}

for (const book of textbooksMetadata) {
    const bookId = book.id;
    const targetBookId = bookId; // when student selects this textbook in dashboard
    
    // Filter matching
    const matches = (bookId === targetBookId);
    if (!matches) continue;

    let rawTopics = mergedExtracted[bookId];
    let bookTopics = [];
    if (rawTopics && rawTopics.length > 0) {
        if (typeof rawTopics[0] === 'string') {
            console.log(`ERROR: raw string found for ${bookId}`);
        } else {
            bookTopics = rawTopics;
        }
    }

    let cleanGroups = bookTopics
        .filter(g => !isMockContent(g.chapter))
        .map(g => ({ ...g, topics: (g.topics || []).filter(t => !isMockContent(t.title)) }))
        .filter(g => g.topics.length > 0);

    const topicGroups = cleanGroups;
    const hasTopics = topicGroups.some(g => g.topics.length > 0);
    const totalTopicsCount = topicGroups.reduce((acc, g) => acc + g.topics.length, 0);

    console.log(`Textbook: ${book.title} (id: ${bookId})`);
    console.log(`  -> hasTopics: ${hasTopics}, chapters: ${topicGroups.length}, total topics: ${totalTopicsCount}`);
    for (const g of topicGroups) {
        console.log(`     Chapter: '${g.chapter}' (${g.topics.length} topics)`);
        for (const t of g.topics.slice(0, 2)) {
            console.log(`        • ${t.title}`);
        }
        if (g.topics.length > 2) {
            console.log(`        ... and ${g.topics.length - 2} more`);
        }
    }
}
