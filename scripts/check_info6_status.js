const fs = require('fs');
const path = require('path');

const genDir = path.join(__dirname, '../data/info6_generated');

if (!fs.existsSync(genDir)) {
    console.log("Directory doesn't exist yet.");
    process.exit(0);
}

const files = fs.readdirSync(genDir).filter(f => f.endsWith('.json'));

let successCount = 0;
let errorCount = 0;

files.forEach(file => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(genDir, file), 'utf8'));
        if (data.length > 0 && data[0].error === 'ERROR_NO_CONTEXT') {
            errorCount++;
        } else if (data.length > 0) {
            successCount++;
        }
    } catch(e) {}
});

console.log(`Total agents launched: 27`);
console.log(`Files generated: ${files.length}`);
console.log(`Successful generations: ${successCount}`);
console.log(`ERROR_NO_CONTEXT: ${errorCount}`);
console.log(`Remaining: ${27 - files.length}`);
