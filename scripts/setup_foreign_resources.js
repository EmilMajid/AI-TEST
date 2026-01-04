const fs = require('fs');
const path = require('path');

const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Setting up Physical Resources for Foreign Languages...\n');

// Source PDF to copy (English as placeholder)
const sourcePdf = 'public/textbooks/5/ingilis-dili-5/english-5.pdf';
if (!fs.existsSync(sourcePdf)) {
    console.error('❌ Source PDF not found:', sourcePdf);
    process.exit(1);
}

const booksToSetup = [
    { id: 'alman-dili-5', dir: 'alman-dili-5', file: 'alman-5.pdf', subject: 'Xarici dil' },
    { id: 'fransiz-dili-5', dir: 'fransiz-dili-5', file: 'fransiz-5.pdf', subject: 'Xarici dil' },
    { id: 'rus-dili-5', dir: 'rus-dili-5', file: 'rus-5.pdf', subject: 'İkinci xarici dil' }
];

booksToSetup.forEach(book => {
    // 1. Create Directory
    const dirPath = path.join('public/textbooks/5', book.dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
    }

    // 2. Copy PDF
    const destPdf = path.join(dirPath, book.file);
    if (!fs.existsSync(destPdf)) {
        fs.copyFileSync(sourcePdf, destPdf);
        console.log(`✅ Copied PDF to: ${destPdf}`);
    }

    // 3. Update JSON
    const entry = data["5"].find(b => b.id === book.id);
    if (entry) {
        entry.path = `/textbooks/5/${book.dir}/${book.file}`;
        entry.contentPath = `public/textbooks/5/${book.dir}`;
        // Ensure manual topics are preserved (they were added in step 1, but just in case)
        if (!entry.topics || entry.topics === "Mövzular") {
            entry.topics = "1. Intro\n2. Chapter 1"; // minimal fallback
        }
        console.log(`✅ Updated JSON paths for ${book.id}`);
    } else {
        console.error(`❌ Entry not found in JSON for ${book.id} (Run restore script first?)`);
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ Setup Complete.');
