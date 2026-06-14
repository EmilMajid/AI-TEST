const fs = require('fs');
const path = require('path');
const https = require('https');

const dataDir = path.join(__dirname, '../data');
const genDir = path.join(dataDir, 'tebiet6_generated');
const chunksDir = path.join(dataDir, 'tebiet6_chunks');

// Ensure chunk directory exists
if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
}

// 1. Read topics structure to map indexes to topics
const topicsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'clean_topics_tebiet_6_final.json'), 'utf8'));
const topicsArray = Array.isArray(topicsData) ? topicsData : Object.values(topicsData);

// 2. Identify failed topics based on generated json errors
let failedTopicsMap = {}; // id -> topicData

for(let i=1; i<=4; i++) {
    const batchFile = path.join(dataDir, 'batch' + i + '.json');
    if (!fs.existsSync(batchFile)) continue;
    const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    
    batch.forEach(item => {
        const id = parseInt(item.Role.replace('Nat6_T', ''), 10);
        const promptTitle = item.Prompt.split('Mətn faylı:')[0].replace('Mövzu:', '').replace(/[0-9]+\.[0-9]+/, '').trim();
        let isFailed = false;
        
        try {
            const result = JSON.parse(fs.readFileSync(path.join(genDir, 'topic_' + id + '.json'), 'utf8'));
            if (Array.isArray(result) && result.length > 0 && result[0].error === 'ERROR_NO_CONTEXT') {
                isFailed = true;
            }
        } catch(e) {
            isFailed = true; // file missing
        }
        
        if(isFailed) {
            // Find topic in topicsArray by matching title
            const matchedTopic = topicsArray.find(t => {
                if(!t.topic_title) return false;
                const cleanT = t.topic_title.replace(/[0-9\.]+/, '').trim().toLowerCase();
                const cleanP = promptTitle.toLowerCase().replace('.', '').trim();
                if(id === 1) {
                   console.log(`Comparing "${cleanP}" with "${cleanT}"`);
                }
                return cleanP.includes(cleanT) || cleanT.includes(cleanP);
            });
            
            if (matchedTopic) {
                failedTopicsMap[id] = matchedTopic;
            } else {
                // If it's a "Xülasə" or "Sözlük", we can just skip it
                console.log(`Could not find mapping for Failed Topic ${id}: ${promptTitle}`);
            }
        }
    });
}


console.log(`Found ${Object.keys(failedTopicsMap).length} failed topics. Starting scraping...`);

// Helper to fetch XHTML
function fetchXHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                resolve(''); // return empty if page doesn't exist
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Clean HTML tags simply
function stripHtml(html) {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
}

async function processTopics() {
    for (const [idStr, topicData] of Object.entries(failedTopicsMap)) {
        if(!topicData) {
            console.log(`No topic data for ID ${idStr}`);
            continue;
        }
        
        const id = parseInt(idStr, 10);
        // Default to Part 1 if ID <= 40, else Part 2 if topicData.id is missing
        const bookId = (topicData.id && topicData.id.includes('-h1-')) ? '780' : 
                       (topicData.id && topicData.id.includes('-h2-')) ? '781' :
                       (id <= 40 ? '780' : '781');
                       
        let combinedText = '';
        
        console.log(`Processing Topic ${id}: ${topicData.topic_title} (Pages ${topicData.start_page}-${topicData.end_page}, Book ${bookId})`);

        
        for(let page = topicData.start_page; page <= topicData.end_page; page++) {
            const url = `https://www.e-derslik.edu.az/books/${bookId}/units/unit-1/page${page}.xhtml`;
            try {
                const html = await fetchXHTML(url);
                if (html) {
                    const cleanText = stripHtml(html);
                    combinedText += cleanText + '\n\n';
                }
            } catch(e) {
                console.error(`Error fetching ${url}: ${e.message}`);
            }
        }
        
        if(combinedText.trim()) {
            const outPath = path.join(chunksDir, `topic_real_${id}.txt`);
            fs.writeFileSync(outPath, combinedText.trim(), 'utf8');
            console.log(`Saved ${outPath} (${combinedText.length} chars)`);
        } else {
            console.log(`WARNING: Extracted empty text for Topic ${id}`);
        }
    }
    console.log('All done!');
}

processTopics();
