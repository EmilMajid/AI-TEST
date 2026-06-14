const fs = require('fs');

const manualTopics = JSON.parse(fs.readFileSync('scripts/manual-topics.json', 'utf8'))['tesviri-incesenet-6'];
const chunksFile = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');

const chunks = [];
chunksFile.forEach(line => {
    if (!line.trim()) return;
    try {
        const j = JSON.parse(line);
        if ((j.grade === 6 || j.grade === "6") && j.subject === "Təsviri incəsənət") {
            chunks.push(j);
        }
    } catch(e) {}
});

console.log(`Found ${chunks.length} chunks for Təsviri incəsənət 6.`);
chunks.sort((a,b) => (a.page || 0) - (b.page || 0));

const queue = [];
let topicCounter = 1;

for (let i=0; i<manualTopics.length; i++) {
    const chapter = manualTopics[i];
    for (let j=0; j<chapter.topics.length; j++) {
        const topic = chapter.topics[j];
        const nextTopic = chapter.topics[j+1] || (manualTopics[i+1] ? manualTopics[i+1].topics[0] : null);
        
        const startPage = topic.page;
        const endPage = nextTopic ? nextTopic.page - 1 : startPage + 3; // roughly 3 pages if last
        
        // Find chunks in this range
        const topicChunks = chunks.filter(c => c.page >= startPage && c.page <= endPage);
        const text = topicChunks.map(c => c.text).join('\n\n').trim();
        
        queue.push({
            topic_id: `t6_art_t${topicCounter.toString().padStart(2, '0')}`,
            grade: 6,
            subject: "Təsviri incəsənət",
            topic_title: topic.title,
            book_id: "tesviri-incesenet-6",
            start_page: startPage,
            end_page: endPage,
            passport_prefix: `06-015-0101-B${(i+1).toString().padStart(3, '0')}-${(j+1).toString().padStart(2, '0')}-`,
            text: text,
            status: "queued"
        });
        topicCounter++;
    }
}

fs.writeFileSync('data/queue_tesviri_6.json', JSON.stringify(queue, null, 2));
console.log(`Generated ${queue.length} topics in queue.`);
