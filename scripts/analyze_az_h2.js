
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-dili-6-h2.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log("--- Searching for Bölmə (Sections) ---");
data.forEach(item => {
    const lines = item.text.split('\n');
    lines.forEach(line => {
        if (line.toLowerCase().includes('bölmə')) {
            console.log(`Page ${item.page}: ${line.trim()}`);
        }
    });
});

console.log("\n--- Searching for Fəsil (Chapters/Topics) ---");
data.forEach(item => {
    const lines = item.text.split('\n');
    lines.forEach(line => {
        if (line.toLowerCase().includes('fəsil') && line.length < 50) {
            console.log(`Page ${item.page}: ${line.trim()}`);
        }
    });
});

console.log("\n--- Searching for Dil qaydaları ---");
data.forEach(item => {
    if (item.text.includes('Dil qaydaları')) {
        const lines = item.text.split('\n');
        // Print the line with Dil qaydaları and maybe the next few lines
        const idx = lines.findIndex(l => l.includes('Dil qaydaları'));
        if (idx !== -1) {
            console.log(`Page ${item.page}: ${lines[idx].trim()}`);
            // Sometimes the topic title is right after
            if (lines[idx + 1]) console.log(`   + ${lines[idx + 1].trim()}`);
        }
    }
});
