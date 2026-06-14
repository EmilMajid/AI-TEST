const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../data');
const chunksDir = path.join(dataDir, 'tebiet6_chunks');

let subagents = [];

for(let i=1; i<=4; i++) {
    const batchFile = path.join(dataDir, 'batch' + i + '.json');
    if (!fs.existsSync(batchFile)) continue;
    const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    
    batch.forEach(item => {
        const id = parseInt(item.Role.replace('Nat6_T', ''), 10);
        const txtPath = path.join(chunksDir, 'topic_real_' + id + '.txt');
        
        if (fs.existsSync(txtPath)) {
            const stats = fs.statSync(txtPath);
            const genPath = path.join(dataDir, 'tebiet6_generated', 'topic_' + id + '.json');
            let isFailed = false;
            try {
                const result = JSON.parse(fs.readFileSync(genPath, 'utf8'));
                if (Array.isArray(result) && result.length > 0 && result[0].error === 'ERROR_NO_CONTEXT') {
                    isFailed = true;
                }
            } catch(e) { 
                isFailed = true; 
            }
            
            if (isFailed && stats.size > 100) {
                subagents.push({
                    TypeName: 'tebiet_generator',
                    Role: 'Nat6_T' + id,
                    Prompt: item.Prompt
                });
            }
        }
    });
}
fs.writeFileSync(path.join(dataDir, 'subagents_payload_filtered.json'), JSON.stringify(subagents, null, 2));
console.log('Filtered agents count:', subagents.length);
