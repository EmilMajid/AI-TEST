const fs = require('fs');

const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🧹 Removing final Grade 5 duplicates (suffixless entries)...\n');

const idsToRemove = [
    'azerbaycan-dili-5',  // Keep azerbaycan-dili-5-h1 and h2
    'riyaziyyat-5',       // Keep riyaziyyat-5-h1 and h2
    'tebiet-5',           // Keep tebiet-5-h1 and h2
    'tesviri-incesenet-5' // Already removed in previous cleanup
];

const before = data["5"].length;

data["5"] = data["5"].filter(book => {
    if (idsToRemove.includes(book.id)) {
        console.log(`  🗑️ Removed: ${book.id} - ${book.title}`);
        return false;
    }
    return true;
});

const removed = before - data["5"].length;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n✅ Removed ${removed} duplicate entries`);
console.log(`📊 Grade 5 entries: ${before} → ${data["5"].length}`);
