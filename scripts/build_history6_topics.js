const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const textbooksPath = path.join(dataDir, 'textbooks.json');
const chunksPath = path.join(dataDir, 'textbook-chunks.jsonl');

const textbooks = JSON.parse(fs.readFileSync(textbooksPath, 'utf8'));
const grade6Books = textbooks['6'] || [];

const azTarix = grade6Books.find(b => b.id === 'azerbaycan-tarixi-6');
const umumiTarix = grade6Books.find(b => b.id === 'umumi-tarix-6');

function parseTopics(bookStr) {
    if(!bookStr) return [];
    const lines = bookStr.split('\n').map(l => l.trim()).filter(l => l);
    const topics = [];
    let topicId = 1;
    for(const l of lines) {
        // e.g. "1. Əsas tarixi anlayışlar və zaman ölçü vahidləri"
        // Ignore "I Bölmə...", "Tarix", etc if they don't start with a number
        const match = l.match(/^(\d+)\.\s+(.*)/);
        if(match) {
            topics.push({
                id: topicId++,
                original_number: parseInt(match[1]),
                topic_title: match[2].trim()
            });
        }
    }
    return topics;
}

const azTarixTopics = parseTopics(azTarix.topics);
const umumiTarixTopics = parseTopics(umumiTarix.topics);

// Read chunks to map pages
console.log('Loading chunks...');
const allChunks = fs.readFileSync(chunksPath, 'utf8').split('\n').filter(l => l.trim());
const azTarixChunks = [];
const umumiTarixChunks = [];

for(const l of allChunks) {
    try {
        const o = JSON.parse(l);
        if(o.book_id === 'azerbaycan-tarixi-6') azTarixChunks.push(o);
        if(o.book_id === 'umumi-tarix-6') umumiTarixChunks.push(o);
    } catch(e) {}
}

azTarixChunks.sort((a,b) => a.page - b.page);
umumiTarixChunks.sort((a,b) => a.page - b.page);

function mapPagesToTopics(topics, chunks) {
    // Basic heuristic: search for topic string in pages
    // Fallback: If not found exactly, just distribute them or search loosely
    for (let i = 0; i < topics.length; i++) {
        const t = topics[i];
        let foundPage = -1;
        const searchStr = t.topic_title.toLowerCase().replace(/[^a-z0-9əöğıüçş]/g, '');
        
        // Search forwards from previous topic's page (or 1)
        const startSearch = i > 0 && topics[i-1].start_page ? topics[i-1].start_page : 1;
        
        for (const c of chunks) {
            if (c.page < startSearch) continue;
            const cStr = c.text.toLowerCase().replace(/[^a-z0-9əöğıüçş]/g, '');
            if (cStr.includes(searchStr)) {
                foundPage = c.page;
                break;
            }
        }
        
        if (foundPage !== -1) {
            t.start_page = foundPage;
        } else {
            console.log('Could not find start page for: ' + t.topic_title);
            t.start_page = startSearch; // fallback
        }
    }
    
    // Fill end_page
    for (let i = 0; i < topics.length; i++) {
        if (i < topics.length - 1) {
            topics[i].end_page = Math.max(topics[i].start_page, topics[i+1].start_page - 1);
        } else {
            topics[i].end_page = chunks.length > 0 ? chunks[chunks.length - 1].page : topics[i].start_page + 5;
        }
    }
}

console.log('Mapping Azərbaycan tarixi 6...');
mapPagesToTopics(azTarixTopics, azTarixChunks);
fs.writeFileSync(path.join(dataDir, 'clean_topics_aztarixi_6.json'), JSON.stringify(azTarixTopics, null, 2), 'utf8');

console.log('Mapping Ümumi tarix 6...');
mapPagesToTopics(umumiTarixTopics, umumiTarixChunks);
fs.writeFileSync(path.join(dataDir, 'clean_topics_umumi_tarix_6.json'), JSON.stringify(umumiTarixTopics, null, 2), 'utf8');

console.log('Done!');
