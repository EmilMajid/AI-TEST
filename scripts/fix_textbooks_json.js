const fs = require('fs');
const path = require('path');

const dataPath = path.resolve('data/textbooks.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function dedupeGrade(grade) {
    const seen = new Set();
    const unique = [];
    data[grade].forEach(entry => {
        if (!seen.has(entry.id)) {
            seen.add(entry.id);
            unique.push(entry);
        } else {
            console.log(`🗑️ Duplicate removed: ${entry.id}`);
        }
    });
    data[grade] = unique;
}

// 1. Remove duplicate Grade 5 entries
if (data['5']) dedupeGrade('5');

// 2. Fix Informatika 8 PDF if file missing
const inform8 = data['8'].find(e => e.id === 'informatika-8');
if (inform8) {
    const pdfPath = path.join('public', inform8.path.replace(/^\/textbooks/, 'textbooks'));
    if (!fs.existsSync(pdfPath)) {
        console.log('⚠️ Informatika 8 PDF missing, falling back to EPUB/HTML');
        // Keep epubUrl, change type to html and path to cover.xhtml if exists
        inform8.type = 'html';
        inform8.path = '/textbooks/8/informatika/cover.xhtml';
        // Ensure contentPath exists
        const contentDir = path.join('public', inform8.contentPath.replace(/^public\//, ''));
        if (!fs.existsSync(contentDir)) {
            console.log('Creating placeholder directory for Informatika 8');
            fs.mkdirSync(contentDir, { recursive: true });
        }
    }
}

// 3. Ensure second foreign language entries have proper paths (grade 8 already present)
// No action needed currently; placeholder for future handling.

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ textbooks.json cleanup completed');
