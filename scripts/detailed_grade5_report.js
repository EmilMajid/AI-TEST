const fs = require('fs');
const path = require('path');

// Helper to safe read JSON
function readJson(p) {
    if (!fs.existsSync(p)) return {};
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) {
        return {};
    }
}

const textbooksData = readJson('data/textbooks.json');
const extractedData = readJson('scripts/extracted-topics.json');
const manualData = readJson('scripts/manual-topics.json');

const grade5Books = textbooksData['5'] || [];

const report = grade5Books.map(book => {
    let topics = [];
    let source = 'None';
    const originalId = book.id;

    // Check manual topics first (priority)
    // mapping heuristic: book.id might match keys in manualData
    // manualData keys are like 'musiqi', 'texnologiya' etc.
    // simplified matching: check if any key is contained in book.id or vice versa

    let foundKey = Object.keys(manualData).find(k => originalId.includes(k) || k.includes(originalId));

    // Better matching logic needed?
    // Let's rely on exact match or known mappings if possible.
    // For now, let's look for exact match in extracted

    // Check extracted topics
    const extractedEntry = extractedData[originalId];
    if (extractedEntry && extractedEntry.length > 0 && extractedEntry[0].topics.length > 0) {
        topics = extractedEntry[0].topics;
        source = 'Extracted';
    }

    // Check manual topics override
    if (manualData[originalId]) {
        topics = manualData[originalId];
        source = 'Manual';
    } else {
        // Try fuzzy match for manual
        const fuzzyParams = originalId.replace(/-5.*/, '').replace(/-h[12]/, '');
        if (manualData[fuzzyParams]) {
            topics = manualData[fuzzyParams];
            source = 'Manual (Fuzzy)';
        }
    }

    // Check embedded topics in textbooks.json
    if (topics.length === 0 && book.topics && book.topics.length > 0) {
        topics = book.topics;
        source = 'Textbooks.json';
    }

    return {
        title: book.title,
        id: book.id,
        source: source,
        topicCount: topics.length,
        topics: topics.length > 0 ? topics : ['TAPILMADI']
    };
});

console.log(JSON.stringify(report, null, 2));
