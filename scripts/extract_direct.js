const fs = require('fs');
const path = require('path');

const ids = [
    { id: '06865bd4-3c5b-44b1-a243-d3d52ca8d23b', type: 'info6', topic: '21' },
    { id: '2d6b5ba6-82d0-4d6c-bcf9-58c5b7841c8a', type: 'info6', topic: '26' },
    { id: 'a69a00f6-033f-4022-acdc-88045740da70', type: 'info6', topic: '4' },
    { id: '93d29dee-e9dc-4822-b864-248dfd278cae', type: 'info6', topic: '12' },
    { id: '6d62580c-fc5a-4bb9-a0f1-2012c4bb261c', type: 'info6', topic: '15' },
    { id: '21ab805d-f1eb-4db9-9d95-abca31299cca', type: 'aztarixi6', topic: '1' },
    { id: '315cf6b7-075b-4ccf-bbd0-7a5aa854c3b8', type: 'aztarixi6', topic: '2' },
    { id: 'ea8c7002-08e1-4c36-a232-e6aa20c57378', type: 'aztarixi6', topic: '3' },
    { id: '8ee28f0a-d799-47d5-af21-db7c44af19f1', type: 'aztarixi6', topic: '4' },
    { id: '0e822aef-36b1-4c20-86c9-eb56ccaa5e91', type: 'aztarixi6', topic: '5' },
    { id: '99b8b3c7-2dfd-41e0-83b8-917b5022bdbf', type: 'aztarixi6', topic: '6' },
    { id: 'ff77292a-8287-4886-bb32-3342962f93db', type: 'aztarixi6', topic: '7' },
    { id: '48c957f0-ebe2-4091-b202-48915f2e0a15', type: 'aztarixi6', topic: '8' },
    { id: 'f568a98b-7009-408a-b85d-8db421523a9b', type: 'aztarixi6', topic: '9' }
];

const dataDir = path.join(__dirname, '../data');

for (const sub of ids) {
    const logPath = `C:\\Users\\User\\.gemini\\antigravity\\brain\\${sub.id}\\.system_generated\\logs\\transcript_full.jsonl`;
    if (!fs.existsSync(logPath)) continue;
    
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    let jsonContent = null;
    
    for (const line of lines) {
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
        const outDir = path.join(dataDir, `${sub.type}_chunks_generated`);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
        const outPath = path.join(outDir, `topic_${sub.topic}.json`);
        
        try {
            // Check if string needs unescaping or is valid as is
            let parsed;
            try {
                parsed = JSON.parse(jsonContent);
            } catch (e1) {
                // if it fails, maybe it has some escaped quotes?
                try {
                    parsed = JSON.parse(jsonContent.replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
                } catch (e2) {
                    // Try to fix common issues
                    let fixed = jsonContent.replace(/\n/g, '\\n').replace(/\r/g, '');
                    parsed = JSON.parse(fixed);
                }
            }
            
            fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8');
            console.log(`Saved ${sub.type} topic ${sub.topic}`);
        } catch(e) {
            console.log(`Error on ${sub.type} topic ${sub.topic}: ` + e.message);
            fs.writeFileSync(outPath + '.raw', jsonContent, 'utf8');
        }
    } else {
        console.log(`No json found for ${sub.type} topic ${sub.topic}`);
    }
}
