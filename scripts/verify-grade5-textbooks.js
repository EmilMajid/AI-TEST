const fs = require('fs');
const path = require('path');

const GRADE = '5';
const BASE_DIR = path.join(process.cwd(), 'public', 'textbooks', GRADE);

// List of expected subdirectories based on download script
const EXPECTED_DIRS = [
    'informatika',
    'azerbaycan-dili-hisse-1',
    'azerbaycan-dili-hisse-2',
    'riyaziyyat-hisse-1',
    'riyaziyyat-hisse-2',
    'azerbaycan-tarixi',
    'edebiyyat',
    'tebiet-hisse-1',
    'tebiet-hisse-2',
    'ingilis-dili'
];

async function verifyGrade5Textbooks() {
    console.log(`\n📚 Verifying Grade ${GRADE} Textbooks\n${'='.repeat(50)}\n`);

    if (!fs.existsSync(BASE_DIR)) {
        console.error(`❌ Base directory not found: ${BASE_DIR}`);
        return;
    }

    const results = [];

    for (const dirName of EXPECTED_DIRS) {
        const dirPath = path.join(BASE_DIR, dirName);
        // Sometimes it's in OEBPS/toc.xhtml, sometimes just toc.xhtml. 
        // Let's check both or search.
        let tocPath = path.join(dirPath, 'OEBPS', 'toc.xhtml');
        if (!fs.existsSync(tocPath)) {
            tocPath = path.join(dirPath, 'toc.xhtml');
        }

        const result = {
            name: dirName,
            exists: false,
            hasToc: false,
            topicCount: 0,
            error: null
        };

        // Check if directory exists
        if (!fs.existsSync(dirPath)) {
            result.error = 'Directory not found';
            results.push(result);
            continue;
        }

        result.exists = true;

        // Check if toc.xhtml exists
        if (!fs.existsSync(tocPath)) {
            result.error = 'toc.xhtml not found';
            results.push(result);
            continue;
        }

        result.hasToc = true;

        // Try to parse and count topics using regex
        try {
            const tocContent = fs.readFileSync(tocPath, 'utf-8');
            // Count <navPoint or <li in xhtml
            const navPointMatches = tocContent.match(/<navPoint/g);
            const liMatches = tocContent.match(/<li/g);

            result.topicCount = (navPointMatches ? navPointMatches.length : 0) || (liMatches ? liMatches.length : 0);

            if (result.topicCount === 0) {
                result.error = 'No topics found in toc.xhtml';
            }

        } catch (err) {
            result.error = `Parse error: ${err.message}`;
        }

        results.push(result);
    }

    // Print results
    console.log('Status Report:');
    console.log('-'.repeat(70));

    let successCount = 0;
    let failCount = 0;

    results.forEach(r => {
        const status = r.hasToc && r.topicCount > 0 ? '✅' : '❌';
        const info = r.error
            ? `ERROR: ${r.error}`
            : `${r.topicCount} topics`;

        console.log(`${status} ${r.name.padEnd(30)} | ${info}`);

        if (r.hasToc && r.topicCount > 0) successCount++;
        else failCount++;
    });

    console.log('-'.repeat(70));
    console.log(`\n📊 Summary: ${successCount}/${EXPECTED_DIRS.length} textbooks verified successfully`);

    if (failCount > 0) {
        console.log(`\n⚠️  ${failCount} textbook(s) need attention`);
    } else {
        console.log('\n🎉 All Grade 5 textbooks are ready!');
    }
}

verifyGrade5Textbooks().catch(console.error);
