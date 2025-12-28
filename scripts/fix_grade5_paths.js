const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Fixing Grade 5 Content Paths...\n');

let updatedCount = 0;

data["5"] = data["5"].map(book => {
    if (book.id === 'fiziki-terbiye-5') {
        if (book.contentPath !== 'public/textbooks/5/fiziki-terbiye-5') {
            book.contentPath = 'public/textbooks/5/fiziki-terbiye-5';
            console.log(`✅ Fixed contentPath for ${book.title}`);
            updatedCount++;
        }
    }
    if (book.id === 'musiqi-5') {
        if (book.contentPath !== 'public/textbooks/5/musiqi-5') {
            book.contentPath = 'public/textbooks/5/musiqi-5';
            console.log(`✅ Fixed contentPath for ${book.title}`);
            updatedCount++;
        }
    }
    return book;
});

if (updatedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n✅ Successfully updated ${updatedCount} paths.`);
} else {
    console.log('\nNo path updates needed.');
}
