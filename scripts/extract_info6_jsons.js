const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:/Users/User/.gemini/antigravity/brain/3c6d91d4-ab06-4ee4-9598-273f712891fb/.system_generated/logs/transcript.jsonl';
const outDir = 'C:/Users/User/Downloads/azerbaijanaiplatform/data/info6_generated';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let count = 0;

lines.forEach(line => {
    if (!line.trim()) return;
    try {
        const step = JSON.parse(line);
        if (step.type === 'USER_INPUT' || step.type === 'SYSTEM_MESSAGE' || step.source === 'SYSTEM') {
            const content = step.content || (step.message && step.message.content) || '';
            
            // look for passport fields: "passport": "06-004-0101-B001-
            // find all JSON arrays
            
            // Lets just extract all text between [ and ] and try parsing it
            let currentIndex = 0;
            while (currentIndex < content.length) {
                const startIndex = content.indexOf('[', currentIndex);
                if (startIndex === -1) break;
                
                // Find matching bracket
                let brackets = 1;
                let endIndex = startIndex + 1;
                let foundEnd = false;
                while (endIndex < content.length) {
                    if (content[endIndex] === '[') brackets++;
                    if (content[endIndex] === ']') brackets--;
                    if (brackets === 0) {
                        foundEnd = true;
                        break;
                    }
                    endIndex++;
                }
                
                if (foundEnd) {
                    const possibleJson = content.substring(startIndex, endIndex + 1);
                    try {
                        const parsed = JSON.parse(possibleJson);
                        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].passport) {
                            const passportParts = parsed[0].passport.split('-');
                            if (passportParts.length >= 6) {
                                const topicId = parseInt(passportParts[5], 10);
                                if (topicId && !isNaN(topicId)) {
                                    const outFile = path.join(outDir, `topic_${topicId}.json`);
                                    fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2), 'utf8');
                                    console.log(`Saved topic ${topicId}`);
                                    count++;
                                }
                            }
                        }
                    } catch(e) {}
                }
                currentIndex = startIndex + 1;
            }
        }
    } catch(e) {}
});

console.log(`Total saved: ${count}`);
