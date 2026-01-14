
const fs = require('fs');
const path = require('path');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-dili-6-h1.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const keywords = ["bölmə", "fəsil", "dil qaydaları", "mövzu"];

data.forEach(item => {
    const text = item.text.toLowerCase();
    const matches = keywords.filter(k => text.includes(k));
    if (matches.length > 0) {
        // Try to capture the specific line
        const lines = item.text.split('\n');
        lines.forEach(line => {
             const lowerLine = line.toLowerCase();
             if (keywords.some(k => lowerLine.includes(k)) || line.trim().length < 50) { // Also print short lines that might be titles
                 // Filter out noise? Just print lines with keywords for now
                 if (keywords.some(k => lowerLine.includes(k))) {
                     console.log(`Page ${item.page}: ${line.trim()}`);
                 }
             }
        });
    }
});
