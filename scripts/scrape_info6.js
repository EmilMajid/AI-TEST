const fs = require('fs');
const path = require('path');
const https = require('https');

const dataDir = path.join(__dirname, '../data');
const chunksDir = path.join(dataDir, 'info6_chunks');

// Ensure chunk directory exists
if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
}

const topicsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'clean_topics_informatika_6_final.json'), 'utf8'));

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
    for (const topicData of topicsData) {
        let combinedText = '';
        
        console.log(`Processing Topic ${topicData.topic_id}: ${topicData.topic_title} (Pages ${topicData.start_page}-${topicData.end_page})`);
        
        for(let page = topicData.start_page; page <= topicData.end_page; page++) {
            const url = `https://www.e-derslik.edu.az/books/912/units/unit-1/page${page}.xhtml`;
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
            const outPath = path.join(chunksDir, `topic_real_${topicData.topic_id}.txt`);
            fs.writeFileSync(outPath, combinedText.trim(), 'utf8');
            console.log(`Saved ${outPath} (${combinedText.length} chars)`);
        } else {
            console.log(`WARNING: Extracted empty text for Topic ${topicData.topic_id}`);
        }
    }
    console.log('All done!');
}

processTopics();
