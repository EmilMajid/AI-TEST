
const fs = require('fs');

const path = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\manual-topics.json';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const keys = {};

lines.forEach((line, index) => {
    // Look for top level keys: "key": [ or "key": {
    // Indentation should be 2 spaces usually
    const match = line.match(/^\s*"([^"]+)"\s*:\s*[\[\{]/);
    if (match) {
        const key = match[1];
        if (!keys[key]) {
            keys[key] = [];
        }
        keys[key].push(index + 1);
    }
});

console.log("--- Found Keys ---");
for (const [key, lines] of Object.entries(keys)) {
    if (lines.length > 1) {
        console.log(`DUPLICATE: "${key}" at lines ${lines.join(', ')}`);
    } else {
        console.log(`"${key}" at line ${lines[0]}`);
    }
}
