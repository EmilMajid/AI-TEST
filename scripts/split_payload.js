const fs = require('fs');
const payload = JSON.parse(fs.readFileSync('data/subagents_payload_tebiet6_real_mini.json', 'utf8')).Subagents;

fs.writeFileSync('data/batch1.json', JSON.stringify(payload.slice(0, 20), null, 2));
fs.writeFileSync('data/batch2.json', JSON.stringify(payload.slice(20, 40), null, 2));
fs.writeFileSync('data/batch3.json', JSON.stringify(payload.slice(40, 60), null, 2));
fs.writeFileSync('data/batch4.json', JSON.stringify(payload.slice(60, 81), null, 2));

console.log('Created 4 batches.');
