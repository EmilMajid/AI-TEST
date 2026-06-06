const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'textbooks.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db['5'].forEach(b => {
    // If the topic starts with our mock data, clear it.
    if (b.topics && (b.topics.startsWith('FƏSİL 1. Şəxsiyyət və cəmiyyət') || b.topics.startsWith('Unit 1. Salamlaşma'))) {
        b.topics = "";
    }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Reverted mock topics.');
