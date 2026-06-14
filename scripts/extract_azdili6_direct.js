const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = 'C:/Users/User/.gemini/antigravity/brain';
const outputDir = 'data/azdili6_chunks_generated';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractFromLog(logPath) {
    if (!fs.existsSync(logPath)) return null;
    
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });
    
    let latestJson = null;
    
    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const step = JSON.parse(line);
            if (step.type === 'PLANNER_RESPONSE' && step.content) {
                const jsonMatch = step.content.match(/\[\s*\{[\s\S]*\}\s*\]/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
                            latestJson = parsed;
                        }
                    } catch (e) {
                        // ignore invalid json
                    }
                }
            }
        } catch (e) {}
    }
    return latestJson;
}

async function run() {
    const folders = fs.readdirSync(logsDir);
    let extractedCount = 0;
    
    for (const folder of folders) {
        const transcriptPath = path.join(logsDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        const json = await extractFromLog(transcriptPath);
        if (json) {
            // Find which topic it belongs to by looking at passport or topic field
            let topicStr = json[0].topic || '';
            let topicMatch = topicStr.match(/^(\d+)\./);
            let topicId = topicMatch ? topicMatch[1] : null;
            
            if (!topicId && json[0].passport) {
                const parts = json[0].passport.split('-');
                if (parts.length >= 4) {
                    topicId = parts[3];
                }
            }
            
            if (topicId) {
                const outPath = path.join(outputDir, `topic_${topicId}.json`);
                fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
                console.log(`Extracted topic ${topicId} with ${json.length} tests.`);
                extractedCount++;
            }
        }
    }
    console.log(`Extracted ${extractedCount} topics in total.`);
}

run().catch(console.error);
