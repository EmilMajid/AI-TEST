const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\\\Users\\\\User\\\\.gemini\\\\antigravity\\\\brain';
const dataDir = path.join(__dirname, '../data');

async function processSubagent(logPath) {
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    let jsonContent = null;
    
    for await (const line of rl) {
        if (line.includes('"send_message"') && line.includes('passport')) {
            try {
                const o = JSON.parse(line);
                if (o.tool_calls) {
                    for (const tc of o.tool_calls) {
                        if (tc.name === 'send_message' && tc.args && tc.args.Message) {
                            const msg = tc.args.Message;
                            const start = msg.indexOf('[');
                            const end = msg.lastIndexOf(']') + 1;
                            if (start !== -1 && end !== -1) {
                                jsonContent = msg.substring(start, end);
                            }
                        }
                    }
                }
            } catch(e) {}
        }
    }
    
    if (jsonContent) {
        try {
            // First check if it's info6, aztarixi6, umumitarix6 or tebiet6
            let book = '';
            let topicId = '';
            
            // Just parse it
            let parsed;
            try {
                parsed = JSON.parse(jsonContent);
            } catch (e1) {
                try {
                    parsed = JSON.parse(jsonContent.replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
                } catch (e2) {
                    let fixed = jsonContent.replace(/\n/g, '\\n').replace(/\r/g, '');
                    parsed = JSON.parse(fixed);
                }
            }
            
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].passport) {
                const pp = parsed[0].passport;
                let type = '';
                if (pp.includes('06-AZT-6')) type = 'aztarixi6';
                if (pp.includes('06-ÜMT-6') || pp.includes('06-UMT-6')) type = 'umumitarix6';
                if (pp.includes('06-004-0101-B001')) type = 'info6';
                if (pp.includes('06-003-H1')) type = 'tebiet6';
                
                if (!type) {
                    if(parsed[0].book_id) {
                        if(parsed[0].book_id.includes('AZT')) type = 'aztarixi6';
                        else if(parsed[0].book_id.includes('UMT') || parsed[0].book_id.includes('ÜMT')) type = 'umumitarix6';
                    }
                }
                
                if (type) {
                    // Extract topic from passport
                    const parts = pp.split('-');
                    if(type === 'info6' && parts.length >= 6) {
                         topicId = parseInt(parts[5], 10);
                    } else if (type === 'aztarixi6' || type === 'umumitarix6') {
                         topicId = parseInt(parts[3], 10);
                    } else {
                         topicId = parsed[0].topic ? parsed[0].topic.split('.')[0].trim() : 'unknown';
                    }
                    
                    const outDir = path.join(dataDir, `${type}_chunks_generated`);
                    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
                    const outPath = path.join(outDir, `topic_${topicId}.json`);
                    
                    fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8');
                    console.log(`Saved ${type} topic ${topicId}`);
                }
            }
        } catch(e) {
             // Ignoring errors to continue
        }
    }
}

async function main() {
    const dirs = fs.readdirSync(brainDir);
    for (const d of dirs) {
        if (d.length !== 36) continue;
        const logPathFull = path.join(brainDir, d, '.system_generated', 'logs', 'transcript_full.jsonl');
        const logPathTrunc = path.join(brainDir, d, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(logPathFull)) {
            await processSubagent(logPathFull);
        } else if (fs.existsSync(logPathTrunc)) {
            await processSubagent(logPathTrunc);
        }
    }
    console.log('Finished processing.');
}

main().catch(console.error);
