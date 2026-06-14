const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain';
const dataDir = path.join(__dirname, '../data');

const dirs = fs.readdirSync(brainDir);
for(const d of dirs) {
    if(d.length !== 36) continue;
    const logPath = path.join(brainDir, d, '.system_generated', 'logs', 'transcript.jsonl');
    if(!fs.existsSync(logPath)) continue;
    
    const logs = fs.readFileSync(logPath, 'utf8').split('\n').filter(x => x);
    let prompt = '';
    let jsonContent = '';
    
    for(const l of logs) {
        try {
            const o = JSON.parse(l);
            if(o.type === 'USER_INPUT' && o.content.includes('<USER_REQUEST>')) {
                prompt = o.content;
            }
            if(o.type === 'MODEL_RESPONSE' && o.content.includes('[')) {
                const start = o.content.indexOf('[');
                const end = o.content.lastIndexOf(']') + 1;
                if(start !== -1 && end !== -1) {
                    jsonContent = o.content.substring(start, end);
                }
            }
        } catch(e) {}
    }
    
    if(jsonContent && jsonContent.includes('"passport"')) {
        const match = prompt.match(/data\/(aztarixi6|umumitarix6)_chunks_generated\/topic_(\d+)\.json/);
        if(match) {
            const book = match[1];
            const topicId = match[2];
            const outPath = path.join(dataDir, `${book}_chunks_generated`, `topic_${topicId}.json`);
            
            try {
                JSON.parse(jsonContent);
                fs.writeFileSync(outPath, jsonContent, 'utf8');
                console.log(`Saved ${book} topic ${topicId}`);
            } catch(e) {
                console.log(`Invalid JSON for ${book} topic ${topicId}: ` + e.message);
            }
        }
    }
}
