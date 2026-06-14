const fs = require('fs');
const path = require('path');

const generatedDir = path.join(__dirname, '../data/tebiet6_generated');
const offlineTestsPath = path.join(__dirname, '../data/offline_tests.json');

if (!fs.existsSync(generatedDir)) {
    console.log('No generated tests found.');
    process.exit(0);
}

let existingTests = {};
if (fs.existsSync(offlineTestsPath)) {
    try {
        const raw = fs.readFileSync(offlineTestsPath, 'utf8');
        existingTests = JSON.parse(raw);
    } catch(e) {}
}

const files = fs.readdirSync(generatedDir).filter(f => f.endsWith('.json'));
let newTestsCount = 0;

if (!existingTests['Təbiət']) {
    existingTests['Təbiət'] = [];
}

// Remove any existing Təbiət 6 tests to avoid duplication when merging
existingTests['Təbiət'] = existingTests['Təbiət'].filter(q => q.category !== 'Təbiət 6');

files.forEach(file => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(generatedDir, file), 'utf8'));
        if (Array.isArray(data) && data.length > 0) {
            // Check if it's not an ERROR_NO_CONTEXT response
            if (!data[0].error) {
                // Flatten and push to existingTests
                data.forEach(q => {
                    // Normalize fields if needed
                    q.id = Math.floor(Math.random() * 100000);
                    q.category = 'Təbiət 6';
                    q.correctAnswer = q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : 3;
                    
                    // Push valid question
                    existingTests['Təbiət'].push(q);
                    newTestsCount++;
                });
            }
        }
    } catch(e) {
        console.error(`Error parsing ${file}: ${e.message}`);
    }
});

fs.writeFileSync(offlineTestsPath, JSON.stringify(existingTests, null, 2), 'utf8');
console.log(`Merged ${files.length} files. Added ${newTestsCount} valid tests to Təbiət.`);
