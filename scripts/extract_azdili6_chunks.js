const fs = require('fs');
const readline = require('readline');
const path = require('path');

const topicsData = JSON.parse(fs.readFileSync('data/clean_topics_az_dili_6.json', 'utf8'));
const outputDir = 'data/azdili6_chunks';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processBooks() {
    const rl = readline.createInterface({
        input: fs.createReadStream('data/textbook-chunks.jsonl'),
        crlfDelay: Infinity
    });

    let currentTopicIndex = 0;
    let currentBookId = 'azerbaycan-dili-6-h1';
    
    // Sort topics by id
    topicsData.sort((a, b) => a.id - b.id);
    
    let currentTopicChunks = [];
    
    for await (const line of rl) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line);
        if (!chunk.book_id.includes('azerbaycan-dili-6')) continue;

        // If book changed, jump to the first topic of the new book
        if (chunk.book_id !== currentBookId) {
            // Save last topic of previous book
            if (currentTopicChunks.length > 0 && currentTopicIndex < topicsData.length) {
                const topic = topicsData[currentTopicIndex];
                if (topic.book_id === currentBookId) {
                    fs.writeFileSync(path.join(outputDir, `topic_real_${topic.id}.txt`), currentTopicChunks.join('\n\n'));
                    currentTopicChunks = [];
                }
            }
            currentBookId = chunk.book_id;
            // Find first topic of new book
            currentTopicIndex = topicsData.findIndex(t => t.book_id === currentBookId);
        }

        if (currentTopicIndex >= topicsData.length || topicsData[currentTopicIndex].book_id !== currentBookId) {
            // No more topics for this book, just accumulate in the last topic?
            if (currentTopicIndex > 0 && topicsData[currentTopicIndex-1].book_id === currentBookId) {
                currentTopicChunks.push(`Səhifə: ${chunk.page}\n${chunk.text}`);
            }
            continue;
        }

        let topic = topicsData[currentTopicIndex];
        
        // We need to decide if we move to the next topic.
        // We look for "Fəsil X" or the topic title.
        // Because "Fəsil" might be capitalized or missing dots, we use regex.
        let nextTopicIndex = currentTopicIndex + 1;
        let moved = false;
        
        if (nextTopicIndex < topicsData.length && topicsData[nextTopicIndex].book_id === currentBookId) {
            const nextTopic = topicsData[nextTopicIndex];
            const fesilMatch = nextTopic.topic_title.match(/Fəsil\s*\d+/i);
            
            if (fesilMatch && chunk.text.includes(fesilMatch[0])) {
                // We found the start of the NEXT topic!
                // Save current topic
                fs.writeFileSync(path.join(outputDir, `topic_real_${topic.id}.txt`), currentTopicChunks.join('\n\n'));
                currentTopicChunks = [];
                currentTopicIndex = nextTopicIndex;
                moved = true;
            }
        }
        
        currentTopicChunks.push(`Səhifə: ${chunk.page}\n${chunk.text}`);
    }
    
    // Save the last topic
    if (currentTopicChunks.length > 0 && currentTopicIndex < topicsData.length) {
        const topic = topicsData[currentTopicIndex];
        fs.writeFileSync(path.join(outputDir, `topic_real_${topic.id}.txt`), currentTopicChunks.join('\n\n'));
    }

    console.log('Finished extracting Az Dili 6 chunks.');
}

processBooks().catch(console.error);
