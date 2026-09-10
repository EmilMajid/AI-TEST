
const fs = require('fs');
const path = require('path');

// Read textbooks.json
const textbooks = JSON.parse(fs.readFileSync('data/textbooks.json', 'utf8'))['2'] || [];

// Read manual-topics.json
let manualTopics = {};
if (fs.existsSync('scripts/manual-topics.json')) {
    manualTopics = JSON.parse(fs.readFileSync('scripts/manual-topics.json', 'utf8'));
}

// Read extracted-topics.json
let extractedTopics = {};
if (fs.existsSync('scripts/extracted-topics.json')) {
    extractedTopics = JSON.parse(fs.readFileSync('scripts/extracted-topics.json', 'utf8'));
}

const mergedTopics = { ...extractedTopics, ...manualTopics };

const MOCK_PATTERNS = [/mocked/i, /tam m[əe]tn/i, /d[əe]rslik\s?\(pdf\)/i];
function isMockContent(text) {
    if (!text) return true;
    if (text === "Mövzular") return false;
    return MOCK_PATTERNS.some(p => p.test(text));
}

for (const book of textbooks) {
    const bookId = book.id;
    const raw = mergedTopics[bookId];
    console.log(`\nBook: ${bookId} (${book.title})`);
    if (!raw) {
        console.log('  No entry in mergedTopics!');
        continue;
    }
    console.log(`  Raw items count: ${raw.length}, item[0] type: ${typeof raw[0]}`);
    try {
        let cleanGroups = raw
            .filter(g => !isMockContent(g.chapter))
            .map(g => ({ ...g, topics: (g.topics || []).filter(t => !isMockContent(t.title)) }))
            .filter(g => g.topics.length > 0);
        console.log(`  Clean groups count: ${cleanGroups.length}`);
        let totalTopics = cleanGroups.reduce((acc, g) => acc + g.topics.length, 0);
        console.log(`  Total topics inside cleanGroups: ${totalTopics}`);
        if (cleanGroups.length > 0) {
            console.log(`    First chapter: '${cleanGroups[0].chapter}', first topic: '${cleanGroups[0].topics[0]?.title}'`);
        }
    } catch (e) {
        console.log(`  CRASHED with: ${e.message}`);
    }
}
