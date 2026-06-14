const fs = require('fs');
const path = require('path');

const manualFile = path.join(__dirname, '../scripts/manual-topics.json');
const chunksFile = path.join(__dirname, '../data/textbook-chunks.jsonl');
const outFile = path.join(__dirname, '../data/test_generation_queue_tebiet6.json'); 

const topicsData = JSON.parse(fs.readFileSync(manualFile, 'utf8'));
const infoTopics = topicsData['informatika-6'];

if (!infoTopics) {
    console.error("Informatika 6 topics not found.");
    process.exit(1);
}

// Load chunks
const chunks = [];
const lines = fs.readFileSync(chunksFile, 'utf8').split('\n');
for (const line of lines) {
    if (!line.trim()) continue;
    try {
        const c = JSON.parse(line);
        if (c.grade === 6 && c.subject === 'İnformatika') {
            chunks.push(c);
        }
    } catch(e) {}
}

console.log(`Loaded ${chunks.length} chunks for Informatika 6`);

// Flatten topics
let flatTopics = [];
for (const chapter of infoTopics) {
    if (chapter.chapter === "Əlavələr") continue; // Skip appendices
    for (const t of chapter.topics) {
        if (t.title.includes('Ümumi̇leşdi̇ri̇ci̇')) continue; // Skip revision
        flatTopics.push({
            title: t.title,
            start: t.page,
            chapter: chapter.chapter
        });
    }
}

const queue = [];

flatTopics.forEach((t, idx) => {
    const startP = t.start;
    const nextT = flatTopics[idx+1];
    const endP = nextT ? nextT.start - 1 : startP + 2;
    
    let topicText = '';
    const relevantChunks = chunks.filter(c => c.page >= startP && c.page <= endP);
    
    for (const rc of relevantChunks) {
        topicText += rc.text + '\n\n';
    }
    
    queue.push({
        topic_id: `info6_t${idx+1}`,
        topic_title: `${t.chapter} - ${t.title}`,
        grade: 6,
        subject: 'İnformatika',
        book_id: 'informatika-6',
        start_page: startP,
        end_page: endP,
        passport_prefix: `06-011-0101-B00${idx+1}-01-`,
        status: 'queued',
        count: 5, // Just 5 tests per topic to save quota!
        text: topicText
    });
});

fs.writeFileSync(outFile, JSON.stringify(queue, null, 2));
console.log(`Successfully generated queue with ${queue.length} topics for Informatika 6. Text length sample: ${queue[0].text.length} chars.`);
