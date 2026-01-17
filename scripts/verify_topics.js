const fs = require('fs');
const path = require('path');

// Configuration
const CLASS_LEVELS = ["5", "6", "8"];
const TEXTBOOKS_DATA_PATH = path.join(process.cwd(), "data", "textbooks.json");
const MANUAL_TOPICS_PATH = path.join(process.cwd(), "scripts", "manual-topics.json");
const EXTRACTED_TOPICS_PATH = path.join(process.cwd(), "scripts", "extracted-topics.json");

const SUBJECT_MAPPING = {
    "azerbaycan-dili": "Azərbaycan dili",
    "azerbaycan-tarixi": "Azərbaycan tarixi",
    "biologiya": "Biologiya",
    "cografiya": "Coğrafiya",
    "edebiyyat": "Ədəbiyyat",
    "fizika": "Fizika",
    "informatika": "İnformatika",
    "kimya": "Kimya",
    "riyaziyyat": "Riyaziyyat",
    "texnologiya": "Texnologiya",
    "umumi-tarix": "Ümumi tarix",
    "musiqi": "Musiqi",
    "ingilis-dili": "İngilis dili",
    "alman-dili-esas": "Alman dili",
    "alman-dili-ikinci": "Alman dili",
    "fransiz-dili-esas": "Fransız dili",
    "fransiz-dili-ikinci": "Fransız dili",
    "rus-dili-esas": "Rus dili",
    "rus-dili-ikinci": "Rus dili",
    "azerbaycan-dili-hisse-1": "Azərbaycan dili",
    "azerbaycan-dili-hisse-2": "Azərbaycan dili",
    "riyaziyyat-hisse-1": "Riyaziyyat",
    "riyaziyyat-hisse-2": "Riyaziyyat",
    "tebiet-hisse-1": "Təbiət",
    "tebiet-hisse-2": "Təbiət",
    "ingilis-dili-5": "İngilis dili",
    "alman-dili-5": "Alman dili",
    "alman-dili-5-asas": "Alman dili",
    "fransiz-dili-5": "Fransız dili",
    "fransiz-dili-5-ikinci": "Fransız dili",
    "rus-dili-5": "Rus dili",
    "rus-dili-2-5": "Rus dili",
    "musiqi-5": "Musiqi",
    "texnologiya-5": "Texnologiya",
    "tebiet-5": "Təbiət",
    "hayat-bilgisi-5": "Həyat bilgisi"
};

function loadAllTopics() {
    const merged = {};
    if (fs.existsSync(EXTRACTED_TOPICS_PATH)) {
        Object.assign(merged, JSON.parse(fs.readFileSync(EXTRACTED_TOPICS_PATH, 'utf8')));
    }
    if (fs.existsSync(MANUAL_TOPICS_PATH)) {
        Object.assign(merged, JSON.parse(fs.readFileSync(MANUAL_TOPICS_PATH, 'utf8')));
    }
    return merged;
}

function verify() {
    console.log("=== Textbook Topics Verification Report ===\n");
    const allTopics = loadAllTopics();
    const textbooksData = JSON.parse(fs.readFileSync(TEXTBOOKS_DATA_PATH, 'utf8'));

    let totalBooks = 0;
    let booksWithTopics = 0;
    let booksMissingTopics = 0;

    for (const classLevel of CLASS_LEVELS) {
        console.log(`\nGrade ${classLevel}:`);
        const books = textbooksData[classLevel] || [];

        for (const book of books) {
            totalBooks++;
            const dirName = path.basename(book.contentPath || "");
            let displayName = SUBJECT_MAPPING[dirName] || dirName;

            // Normalize Display Name
            displayName = displayName.replace(/\s*\(Hissə \d+\)/i, "").trim();

            let source = "None";
            let topicCount = 0;

            // Check Strategy 0: Manual/Extracted
            const classKey = `${dirName}-${classLevel}`;
            if (allTopics[classKey]) {
                source = "Manual (Class Specific)";
                topicCount = allTopics[classKey].reduce((sum, g) => sum + (g.topics ? g.topics.length : 0), 0);
            } else if (dirName.includes('hisse-')) {
                const hissMatch = dirName.match(/(.*)-hisse-(\d+)/);
                if (hissMatch) {
                    const mappedKey = `${hissMatch[1]}-${classLevel}-h${hissMatch[2]}`;
                    if (allTopics[mappedKey]) {
                        source = "Manual (Mapped Hissə)";
                        topicCount = allTopics[mappedKey].reduce((sum, g) => sum + (g.topics ? g.topics.length : 0), 0);
                    }
                }
            } else if (classLevel === "8" && allTopics[dirName]) {
                source = "Manual (Generic - Grade 8 Only)";
                topicCount = allTopics[dirName].reduce((sum, g) => sum + (g.topics ? g.topics.length : 0), 0);
            }

            // Strategy 1: textbooks.json
            if (topicCount === 0 && book.topics && book.topics !== "Mövzular") {
                const isGarbage = (text) => text && (text.includes('§') || text.includes('°'));

                if (Array.isArray(book.topics) && book.topics.length > 0) {
                    const firstTopic = typeof book.topics[0] === 'string' ? book.topics[0] : "";
                    if (!isGarbage(firstTopic)) {
                        source = "textbooks.json (Array)";
                        topicCount = book.topics.length;
                    }
                } else if (typeof book.topics === 'string' && book.topics.length > 30) {
                    if (!isGarbage(book.topics)) {
                        source = "textbooks.json (String)";
                        topicCount = book.topics.split('\n').length;
                    }
                }
            }

            // Strategy 2: TOC
            if (topicCount === 0) {
                const tocPath = path.join(process.cwd(), book.contentPath, "OEBPS", "toc.xhtml");
                const rootTocPath = path.join(process.cwd(), book.contentPath, "toc.xhtml");
                if (fs.existsSync(tocPath) || fs.existsSync(rootTocPath)) {
                    source = "TOC File (Detected)";
                    topicCount = "TBD (at runtime)";
                }
            }

            if (topicCount !== 0) {
                booksWithTopics++;
                console.log(`  ✓ [${dirName}] ${displayName}: Found via ${source} (${topicCount} items)`);
            } else {
                booksMissingTopics++;
                console.log(`  ⚠ [${dirName}] ${displayName}: NO TOPICS FOUND`);
            }
        }
    }

    console.log(`\nSummary:`);
    console.log(`Total Textbooks: ${totalBooks}`);
    console.log(`Books with Topics: ${booksWithTopics}`);
    console.log(`Books Missing Topics: ${booksMissingTopics}`);

    if (booksMissingTopics > 0) {
        process.exit(1);
    }
}

verify();
