const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../data');
const genDir = path.join(dataDir, 'tebiet6_generated');

let failedTopics = [];
let allParsed = [];

for(let i=1; i<=4; i++) {
    try {
        const batchFile = path.join(dataDir, 'batch' + i + '.json');
        if (!fs.existsSync(batchFile)) continue;
        const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
        batch.forEach(item => {
            const role = item.Role;
            const id = parseInt(role.replace('Nat6_T', ''), 10);
            const prompt = item.Prompt;
            const topicName = prompt.split('Mətn faylı:')[0].replace('Mövzu:', '').trim();
            
            try {
                const result = JSON.parse(fs.readFileSync(path.join(genDir, 'topic_' + id + '.json'), 'utf8'));
                if (Array.isArray(result) && result.length > 0 && result[0].error === 'ERROR_NO_CONTEXT') {
                    failedTopics.push(`Mövzu ${id}: ${topicName}`);
                }
            } catch(e) {
                // If it doesn't exist, maybe it wasn't generated at all?
                failedTopics.push(`Mövzu ${id}: ${topicName} (Heç yaradılmayıb/Xəta: ${e.message.split(',')[0]})`);
            }
        });
    } catch(e) {
        console.error('Batch error:', e);
    }
}
console.log('--- PROBLEMLİ MÖVZULAR (Məlumatsız / ERROR_NO_CONTEXT) ---');
console.log(failedTopics.join('\n'));
console.log('-----------------------------------------------------------');
console.log('Cəmi:', failedTopics.length);
