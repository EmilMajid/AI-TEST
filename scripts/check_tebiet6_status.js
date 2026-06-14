const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/User/Downloads/azerbaijanaiplatform/data/tebiet6_generated';
const files = fs.readdirSync(dir).filter(f => f.startsWith('topic_') && f.endsWith('.json'));

let success = 0;
let noContext = 0;
let errors = 0;
let active = 0;

// The payload had exactly 36 agents.
const targetTopics = [
    39, 40, 42, 43, 44, 49, 53, 54, 57, 59, 
    62, 63, 66, 67, 70, 72, 76, 77, 78, 80,
    // plus the others that returned earlier...
];
// Actually let's just check the ones that were modified in the last 10 minutes.
const now = Date.now();

let recentFiles = [];

files.forEach(f => {
    const filePath = path.join(dir, f);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs < 15 * 60 * 1000) { // last 15 minutes
        recentFiles.push(f);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(data) && data.length > 0 && data[0].error === "ERROR_NO_CONTEXT") {
                noContext++;
            } else if (Array.isArray(data) && data.length >= 10) {
                success++;
            } else {
                errors++;
            }
        } catch (e) {
            errors++;
        }
    }
});

console.log(`Total agents launched: 36`);
console.log(`Responses in last 15 mins: ${recentFiles.length}`);
console.log(`Successful generations: ${success}`);
console.log(`ERROR_NO_CONTEXT (No theory in text): ${noContext}`);
console.log(`Errors/Empty: ${errors}`);
console.log(`Remaining agents: ${36 - recentFiles.length}`);
