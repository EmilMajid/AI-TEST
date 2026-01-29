const fs = require('fs');
const path = require('path');

// Load all data sources
const textbooksPath = path.join(process.cwd(), 'data', 'textbooks.json');
const extractedPath = path.join(process.cwd(), 'scripts', 'extracted-topics.json');
const manualPath = path.join(process.cwd(), 'scripts', 'manual-topics.json');

const allTextbooks = JSON.parse(fs.readFileSync(textbooksPath, 'utf8'));
const extractedData = fs.existsSync(extractedPath) ? JSON.parse(fs.readFileSync(extractedPath, 'utf8')) : {};
const manualData = fs.existsSync(manualPath) ? JSON.parse(fs.readFileSync(manualPath, 'utf8')) : {};

const grade6Books = allTextbooks['6'] || [];

console.log('='.repeat(60));
console.log('📊 GRADE 6 DETAILED DATA AUDIT REPORT');
console.log('='.repeat(60));
console.log(`Total Grade 6 Textbooks: ${grade6Books.length}\n`);

const report = grade6Books.map(book => {
    let topics = [];
    let source = 'None';
    const originalId = book.id;

    // Check manual topics first (highest priority)
    if (manualData[originalId]) {
        const manualEntry = manualData[originalId];
        if (Array.isArray(manualEntry)) {
            if (manualEntry.length > 0) {
                if (typeof manualEntry[0] === 'string') {
                    topics = manualEntry;
                } else if (manualEntry[0].topics) {
                    topics = manualEntry.flatMap(g => g.topics || []);
                }
            }
        }
        source = 'Manual';
    }

    // Check extracted topics
    if (topics.length === 0) {
        const extractedEntry = extractedData[originalId];
        if (extractedEntry && extractedEntry.length > 0) {
            topics = extractedEntry.flatMap(g => g.topics || []);
            source = 'Extracted';
        }
    }

    // Check embedded topics in textbooks.json
    if (topics.length === 0 && book.topics) {
        if (Array.isArray(book.topics)) {
            topics = book.topics;
        } else if (typeof book.topics === 'string' && book.topics !== 'Mövzular') {
            topics = book.topics.split('\n').filter(t => t.trim().length > 0);
        }
        source = 'Textbooks.json';
    }

    // Determine status
    let status = '✅ OK';
    if (topics.length === 0) {
        status = '❌ NO-TOPICS';
    } else if (topics.length < 10) {
        status = `⚠️ SUSPICIOUS-LOW (${topics.length})`;
    }

    return {
        title: book.title,
        id: book.id,
        subject: book.subject || 'Unknown',
        source: source,
        topicCount: topics.length,
        status: status,
        topics: topics.length > 0 ? topics.slice(0, 5) : ['TAPILMADI'],
        hasMore: topics.length > 5
    };
});

// Group by status
const byStatus = {
    ok: report.filter(r => r.status === '✅ OK'),
    suspicious: report.filter(r => r.status.includes('SUSPICIOUS')),
    noTopics: report.filter(r => r.status === '❌ NO-TOPICS')
};

console.log('📈 STATUS SUMMARY:');
console.log(`  ✅ OK: ${byStatus.ok.length}`);
console.log(`  ⚠️  SUSPICIOUS: ${byStatus.suspicious.length}`);
console.log(`  ❌ NO TOPICS: ${byStatus.noTopics.length}\n`);

console.log('='.repeat(60));
console.log('⚠️  SUSPICIOUS & MISSING TOPICS (Requires Attention)');
console.log('='.repeat(60));

[...byStatus.suspicious, ...byStatus.noTopics].forEach(book => {
    console.log(`\n${book.status} ${book.title}`);
    console.log(`  ID: ${book.id}`);
    console.log(`  Subject: ${book.subject}`);
    console.log(`  Source: ${book.source}`);
    console.log(`  Topic Count: ${book.topicCount}`);
    if (book.topicCount > 0) {
        console.log(`  Sample Topics:`);
        book.topics.forEach((t, idx) => {
            const topicText = typeof t === 'string' ? t : (t.title || JSON.stringify(t));
            console.log(`    ${idx + 1}. ${topicText}`);
        });
        if (book.hasMore) {
            console.log(`    ... and ${book.topicCount - 5} more`);
        }
    }
});

console.log('\n' + '='.repeat(60));
console.log('✅ BOOKS WITH ADEQUATE TOPICS');
console.log('='.repeat(60));

byStatus.ok.forEach(book => {
    console.log(`\n✅ ${book.title} (${book.topicCount} topics)`);
    console.log(`  Source: ${book.source}`);
});

console.log('\n' + '='.repeat(60));
console.log('📋 RECOMMENDED ACTIONS:');
console.log('='.repeat(60));
console.log(`
1. Foreign Languages (Alman, Fransız):
   - Extract TOC from PDF files
   - Or request manual topic lists from user

2. Rus dili 6 (both):
   - Currently has only 3 topics - verify if complete
   - May need full TOC extraction

3. Ümumi tarix 6:
   - Has 12 topics - verify if this is the complete list
   - Check if textbook has more chapters

Priority: Start with most critical subjects (History, then Languages)
`);

// Save JSON report
const jsonReport = {
    grade: 6,
    totalBooks: grade6Books.length,
    summary: {
        ok: byStatus.ok.length,
        suspicious: byStatus.suspicious.length,
        noTopics: byStatus.noTopics.length
    },
    issues: [...byStatus.suspicious, ...byStatus.noTopics],
    timestamp: new Date().toISOString()
};

fs.writeFileSync('grade6_audit_report.json', JSON.stringify(jsonReport, null, 2), 'utf8');
console.log('\n✅ Detailed JSON report saved to: grade6_audit_report.json');
