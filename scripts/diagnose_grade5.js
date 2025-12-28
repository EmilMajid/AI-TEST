const fs = require('fs');
const path = require('path');

const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔍 Grade 5 Textbook Diagnostic\n');
console.log('='.repeat(60));

const grade5 = data["5"];
const issues = [];
const working = [];

grade5.forEach(book => {
    const status = {
        id: book.id,
        title: book.title,
        hasFile: false,
        hasTopics: false,
        filePath: null,
        issue: null
    };

    // Check if file exists
    if (book.type === 'pdf') {
        const pdfPath = path.join('public', book.path.replace(/^\//, ''));
        status.hasFile = fs.existsSync(pdfPath);
        status.filePath = pdfPath;
        if (!status.hasFile) {
            status.issue = `PDF missing: ${pdfPath}`;
        }
    } else if (book.type === 'html') {
        if (book.path.startsWith('http')) {
            // External link
            status.hasFile = true;
            status.filePath = book.path;
        } else {
            const htmlPath = path.join('public', book.path.replace(/^\//, ''));
            status.hasFile = fs.existsSync(htmlPath);
            status.filePath = htmlPath;
            if (!status.hasFile) {
                status.issue = `HTML missing: ${htmlPath}`;
            }
        }
    }

    // Check if has topics
    if (book.topics && book.topics !== 'Mövzular' && book.topics.length > 10) {
        status.hasTopics = true;
    } else {
        if (!status.issue) {
            status.issue = 'Topics missing or generic';
        } else {
            status.issue += ' + Topics missing';
        }
    }

    if (status.hasFile && status.hasTopics) {
        working.push(status);
    } else {
        issues.push(status);
    }
});

console.log(`\n✅ WORKING (${working.length}):`);
working.forEach(s => {
    console.log(`  • ${s.title}`);
    console.log(`    File: ✓ | Topics: ✓`);
});

console.log(`\n❌ ISSUES (${issues.length}):`);
issues.forEach(s => {
    console.log(`  • ${s.title} (${s.id})`);
    console.log(`    File: ${s.hasFile ? '✓' : '✗'} | Topics: ${s.hasTopics ? '✓' : '✗'}`);
    console.log(`    Issue: ${s.issue}`);
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`  Total: ${grade5.length}`);
console.log(`  Working: ${working.length}`);
console.log(`  Issues: ${issues.length}`);
