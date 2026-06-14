const fs = require('fs');

const manualTopics = JSON.parse(fs.readFileSync('scripts/manual-topics.json', 'utf8'));
const topics1 = manualTopics['tebiet-6-h1'] || [];
const topics2 = manualTopics['tebiet-6-h2'] || [];
const allManualTopics = [...topics1, ...topics2];

const chunksFile = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');

const chunks = [];
chunksFile.forEach(line => {
    if (!line.trim()) return;
    try {
        const j = JSON.parse(line);
        if ((j.grade === 6 || j.grade === "6") && j.subject === "Təbiət") {
            chunks.push(j);
        }
    } catch(e) {}
});

console.log(`Found ${chunks.length} chunks for Təbiət 6.`);
chunks.sort((a,b) => (a.page || 0) - (b.page || 0));

const queue = [];
let topicCounter = 1;

for (let i=0; i<allManualTopics.length; i++) {
    const chapter = allManualTopics[i];
    for (let j=0; j<chapter.topics.length; j++) {
        const topic = chapter.topics[j];
        const nextTopic = chapter.topics[j+1] || (allManualTopics[i+1] ? allManualTopics[i+1].topics[0] : null);
        
        const startPage = topic.page;
        const endPage = nextTopic ? nextTopic.page - 1 : startPage + 5; 
        
        const topicChunks = chunks.filter(c => c.page >= startPage && c.page <= endPage);
        const text = topicChunks.map(c => c.text).join('\n\n').trim();
        
        queue.push({
            topic_id: `t6_nature_t${topicCounter.toString().padStart(2, '0')}`,
            grade: 6,
            subject: "Təbiət",
            topic_title: topic.title,
            book_id: "tebiet-6",
            start_page: startPage,
            end_page: endPage,
            passport_prefix: `06-003-0101-B${(i+1).toString().padStart(3, '0')}-${(j+1).toString().padStart(2, '0')}-`,
            text: text,
            status: "queued"
        });
        topicCounter++;
    }
}

fs.writeFileSync('data/queue_tebiet_6_real.json', JSON.stringify(queue, null, 2));
console.log(`Generated ${queue.length} topics in queue for Təbiət 6.`);
