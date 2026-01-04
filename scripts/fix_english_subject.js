const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Fixing Grade 5 English Subject Name...\n');

let updatedCount = 0;

data["5"] = data["5"].map(book => {
    if (book.id === 'ingilis-dili-5' && book.subject === 'Xarici dil') {
        book.subject = 'İngilis dili';
        console.log(`✅ Updated subject for: ${book.title} -> İngilis dili`);
        updatedCount++;
    }
    return book;
});

if (updatedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n✅ Successfully updated ${updatedCount} textbooks.`);
} else {
    console.log('\nNo textbooks required updates.');
}
