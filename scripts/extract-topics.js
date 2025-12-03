const fs = require('fs');
const path = require('path');

// Textbook directories for grade 8
const textbooksDir = path.join(__dirname, '../public/textbooks/8');

// Mapping of directory names to display names
const subjectMapping = {
    'azerbaycan-dili': 'Azərbaycan dili',
    'azerbaycan-tarixi': 'Azərbaycan tarixi',
    'biologiya': 'Biologiya',
    'cografiya': 'Coğrafiya',
    'edebiyyat': 'Ədəbiyyat',
    'fizika': 'Fizika',
    'informatika': 'İnformatika',
    'ingilis-dili': 'İngilis dili',
    'kimya': 'Kimya',
    'riyaziyyat': 'Riyaziyyat',
    'texnologiya': 'Texnologiya',
    'umumi-tarix': 'Ümumi tarix'
};

function extractTopicsFromTOC(tocPath) {
    try {
        const content = fs.readFileSync(tocPath, 'utf-8');

        // Extract main topics (looking for patterns like "I.", "II.", or "Bölmə")
        const topics = [];
        const lines = content.split('\n');

        for (const line of lines) {
            // Match main chapter/unit titles
            // Pattern 1: Roman numerals (I., II., III., etc.)
            const romanMatch = line.match(/>\s*([IVX]+\.\s+[^<]+)</);
            if (romanMatch) {
                const topic = romanMatch[1].trim();
                // Remove numbering for cleaner display
                const cleanTopic = topic.replace(/^[IVX]+\.\s+/, '');
                if (cleanTopic && !topics.includes(cleanTopic)) {
                    topics.push(cleanTopic);
                }
            }

            // Pattern 2: "Bölmə" (Section)
            const bolmeMatch = line.match(/>Bölmə\s+\d+\.\s+([^<]+)</);
            if (bolmeMatch) {
                const topic = bolmeMatch[1].trim();
                if (topic && !topics.includes(topic)) {
                    topics.push(topic);
                }
            }
        }

        return topics;
    } catch (error) {
        console.error(`Error reading TOC from ${tocPath}:`, error.message);
        return [];
    }
}

function generateTopicsObject() {
    const topics = {};

    // Read all textbook directories
    const subjects = fs.readdirSync(textbooksDir);

    for (const subjectDir of subjects) {
        const subjectPath = path.join(textbooksDir, subjectDir);

        // Skip if not a directory
        if (!fs.statSync(subjectPath).isDirectory()) continue;

        // Get the display name
        const displayName = subjectMapping[subjectDir] || subjectDir;

        // Path to toc.xhtml
        const tocPath = path.join(subjectPath, 'OEBPS', 'toc.xhtml');

        if (fs.existsSync(tocPath)) {
            const extractedTopics = extractTopicsFromTOC(tocPath);

            if (extractedTopics.length > 0) {
                topics[displayName] = extractedTopics;
                console.log(`✓ ${displayName}: ${extractedTopics.length} topics found`);
            } else {
                console.log(`⚠ ${displayName}: No topics found, using fallback`);
                // Fallback to generic topics
                topics[displayName] = [`${displayName} - Mövzu 1`, `${displayName} - Mövzu 2`];
            }
        } else {
            console.log(`✗ ${displayName}: toc.xhtml not found`);
            // Fallback
            topics[displayName] = [`${displayName} - Mövzu 1`, `${displayName} - Mövzu 2`];
        }
    }

    return topics;
}

// Generate the topics
const topics = generateTopicsObject();

// Output as TypeScript/JavaScript object
console.log('\n\n=== TOPICS OBJECT ===\n');
console.log('const TOPICS = {');
for (const [subject, topicList] of Object.entries(topics)) {
    console.log(`  "${subject}": [`);
    topicList.forEach((topic, index) => {
        const comma = index < topicList.length - 1 ? ',' : '';
        console.log(`    "${topic}"${comma}`);
    });
    console.log('  ],');
}
console.log('}\n');

// Also save to a JSON file
const outputPath = path.join(__dirname, 'extracted-topics.json');
fs.writeFileSync(outputPath, JSON.stringify(topics, null, 2), 'utf-8');
console.log(`\n✓ Topics saved to: ${outputPath}`);
