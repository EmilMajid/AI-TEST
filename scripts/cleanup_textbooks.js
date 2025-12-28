const fs = require('fs');
const path = require('path');

const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🧹 Starting textbooks.json cleanup...\n');

// Track changes
let duplicatesRemoved = 0;
let pathsFixed = 0;
let entriesRemoved = 0;

// 1. Remove duplicate Grade 5 entries
console.log('📋 Phase 1: Removing Grade 5 duplicates');
const grade5Seen = new Set();
const grade5Unique = [];

data["5"].forEach(book => {
    if (!grade5Seen.has(book.id)) {
        grade5Seen.add(book.id);
        grade5Unique.push(book);
    } else {
        console.log(`  🗑️ Removed duplicate: ${book.id} - ${book.title}`);
        duplicatesRemoved++;
    }
});

data["5"] = grade5Unique;
console.log(`  ✅ Removed ${duplicatesRemoved} duplicate entries\n`);

// 2. Fix Informatika 8 - check if PDF exists, otherwise use EPUB/HTML
console.log('📋 Phase 2: Fixing İnformatika 8');
const informatika8 = data["8"].find(b => b.id === 'informatika-8');
if (informatika8) {
    const pdfPath = path.join('public', informatika8.path.replace(/^\//, ''));

    if (!fs.existsSync(pdfPath)) {
        console.log(`  ⚠️ PDF not found: ${pdfPath}`);
        console.log(`  🔄 Converting to HTML/EPUB format`);

        // Check if EPUB directory exists
        const epubDir = 'public/textbooks/8/informatika';
        if (fs.existsSync(epubDir)) {
            informatika8.type = 'html';
            informatika8.path = '/textbooks/8/informatika/cover.xhtml';
            console.log(`  ✅ Updated to HTML: ${informatika8.path}`);
            pathsFixed++;
        } else {
            console.log(`  ⚠️ EPUB directory not found either, keeping as-is for now`);
        }
    } else {
        console.log(`  ✅ PDF exists, no changes needed`);
    }
}
console.log();

// 3. Remove İkinci xarici dil entries (Grade 5 & 8) - files don't exist
console.log('📋 Phase 3: Handling İkinci xarici dil entries');

// Remove from Grade 5
const grade5Before = data["5"].length;
data["5"] = data["5"].filter(book => {
    if (book.id === 'rus-dili-5') {
        console.log(`  🗑️ Removed from Grade 5: ${book.title} (file not found)`);
        entriesRemoved++;
        return false;
    }
    return true;
});

// Remove from Grade 8
const grade8Before = data["8"].length;
data["8"] = data["8"].filter(book => {
    if (book.id === 'i-kinci-xarici-dil-8') {
        console.log(`  🗑️ Removed from Grade 8: ${book.title} (file not found)`);
        entriesRemoved++;
        return false;
    }
    return true;
});

console.log(`  ✅ Removed ${entriesRemoved} İkinci xarici dil entries\n`);

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log('📊 Summary:');
console.log(`  • Duplicates removed: ${duplicatesRemoved}`);
console.log(`  • Paths fixed: ${pathsFixed}`);
console.log(`  • Entries removed: ${entriesRemoved}`);
console.log(`  • Grade 5 entries: ${grade5Before} → ${data["5"].length}`);
console.log(`  • Grade 8 entries: ${grade8Before} → ${data["8"].length}`);
console.log('\n✅ textbooks.json cleanup completed!');
