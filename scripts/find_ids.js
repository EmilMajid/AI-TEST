const fs = require('fs');
const mainLog = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\3c6d91d4-ab06-4ee4-9598-273f712891fb\\.system_generated\\logs\\transcript_full.jsonl';
const content = fs.readFileSync(mainLog, 'utf8');
const ids = [];
const regex = /"conversationId"\s*:\s*"([a-f0-9\-]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
}
fs.writeFileSync('C:\\Users\\User\\Downloads\\azerbaijanaiplatform\\data\\found_ids.txt', ids.join('\n'), 'utf8');
console.log('Found ' + ids.length + ' IDs');
