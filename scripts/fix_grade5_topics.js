const fs = require('fs');
const path = require('path');

const dataPath = 'data/textbooks.json';
const extractedTopicsPath = 'data/extracted-topics.json';

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
let extractedTopics = {};

// Try to load extracted topics
if (fs.existsSync(extractedTopicsPath)) {
    extractedTopics = JSON.parse(fs.readFileSync(extractedTopicsPath, 'utf8'));
}

console.log('🔧 Fixing Grade 5 Textbooks and Topics\n');

// Fix each textbook
data["5"] = data["5"].map(book => {
    const bookKey = `5-${book.id}`;

    // Check if we have extracted topics for this book
    if (extractedTopics[bookKey] && Array.isArray(extractedTopics[bookKey])) {
        const topics = extractedTopics[bookKey];
        if (topics.length > 0) {
            book.topics = topics.join('');
            console.log(`✅ ${book.title}: Added ${topics.length} topics from extracted-topics.json`);
            return book;
        }
    }

    // If no extracted topics, keep as is but log
    if (book.topics === 'Mövzular' || !book.topics) {
        console.log(`⚠️  ${book.title}: No topics available (keeping "Mövzular")`);
    } else {
        console.log(`✓  ${book.title}: Topics already exist`);
    }

    return book;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ Grade 5 textbooks updated!');
