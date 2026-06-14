const fs = require('fs');
const path = require('path');

const contentPath = 'C:/Users/User/.gemini/antigravity/brain/3c6d91d4-ab06-4ee4-9598-273f712891fb/.system_generated/steps/5151/content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const regex = /<li><a href="#books\/912\/units\/unit-1\/page(\d+)\.xhtml">([^<]+)<\/a><\/li>/g;
let match;
const topics = [];
let idCounter = 1;

while ((match = regex.exec(content)) !== null) {
    const startPage = parseInt(match[1], 10);
    const title = match[2].trim();
    
    // Skip general index pages or non-topic links if any
    if (title.toLowerCase().includes('ədəbiyyat') || title.toLowerCase().includes('qısaltmalar') || title.toLowerCase().includes('lüğət')) {
        continue;
    }
    
    topics.push({
        id: `info6-topic-${idCounter}`,
        topic_id: idCounter,
        topic_title: title,
        start_page: startPage,
        end_page: startPage // Will update this
    });
    idCounter++;
}

// Calculate end_page for each topic
for (let i = 0; i < topics.length; i++) {
    if (i < topics.length - 1) {
        topics[i].end_page = topics[i + 1].start_page - 1;
    } else {
        // Last topic ends somewhere, let's say start_page + 3
        topics[i].end_page = topics[i].start_page + 3;
    }
}

// In case the next chapter starts on the same page, ensure start_page <= end_page
topics.forEach(t => {
    if (t.end_page < t.start_page) {
        t.end_page = t.start_page;
    }
});

const outPath = path.join(__dirname, '../data/clean_topics_informatika_6_final.json');
fs.writeFileSync(outPath, JSON.stringify(topics, null, 2), 'utf8');
console.log(`Extracted ${topics.length} topics and saved to ${outPath}`);
console.log(JSON.stringify(topics.slice(0, 3), null, 2));
