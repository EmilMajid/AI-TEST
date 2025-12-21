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
    // PDF based books
    'tebiet-hisse-1',
    'tebiet-hisse-2',
    'ingilis-dili-5',
    'texnologiya-5',
    'tesviri-incesenet-5',
    'fiziki-terbiye-5',
    'musiqi-5'
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
        let tocPath = path.join(dirPath, 'OEBPS', 'toc.xhtml');
        if (!fs.existsSync(tocPath)) {
            tocPath = path.join(dirPath, 'toc.xhtml');
        }

        const result = {
            name: dirName,
            exists: false,
            hasToc: false,
            hasPdf: false,
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

        // Check for PDF file first (prioritize if known PDF subject)
        const pdfFiles = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));
        if (pdfFiles.length > 0) {
            result.hasPdf = true;
            result.topicCount = 1; // Treat PDF as having at least "content"
        }

        // Check for toc.xhtml
        if (fs.existsSync(tocPath)) {
            result.hasToc = true;

            // Try to parse and count topics using regex
            try {
                const tocContent = fs.readFileSync(tocPath, 'utf-8');
                const navPointMatches = tocContent.match(/<navPoint/g);
                const liMatches = tocContent.match(/<li/g);

                result.topicCount = (navPointMatches ? navPointMatches.length : 0) || (liMatches ? liMatches.length : 0);
            } catch (err) {
                if (!result.hasPdf) result.error = `Parse error: ${err.message}`;
            }
        }

        if (!result.hasToc && !result.hasPdf) {
            result.error = 'No toc.xhtml or PDF found';
        }

        results.push(result);
    }

    // Print results
    console.log('Status Report:');
    console.log('-'.repeat(70));

    let successCount = 0;
    let failCount = 0;

    results.forEach(r => {
        const isSuccess = (r.hasToc && r.topicCount > 0) || r.hasPdf;
        const status = isSuccess ? '✅' : '❌';
        const info = r.error
            ? `ERROR: ${r.error}`
            : r.hasPdf
                ? 'PDF Content Available'
                : `${r.topicCount} topics`;

        console.log(`${status} ${r.name.padEnd(30)} | ${info}`);

        if (isSuccess) successCount++;
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
