const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/offline_tests.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db['İnformatika 6'] = db['İnformatika 6'] || [];

const agents = [
  '1d229694-925f-469c-96fd-3f2eb46ade9e',
  'fb04e615-8d96-4e5b-bdcc-f8f975fe54c4',
  '6aaf7579-ef38-4c6b-a3cb-2a1878e7ed5b',
  '69a91519-545d-4c43-833f-469477645b34'
];

let added = 0;

for (let id of agents) {
  try {
    const logPath = `C:/Users/User/.gemini/antigravity/brain/${id}/.system_generated/logs/transcript.jsonl`;
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    let a1 = '';
    for (let line of lines) {
      if (line.includes('PLANNER_RESPONSE')) {
        const obj = JSON.parse(line);
        if (obj.content && obj.content.includes('[')) {
          a1 = obj.content;
          break;
        }
      }
    }
    
    if (a1) {
      const jsonStr = a1.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const t1 = JSON.parse(jsonStr);
      db['İnformatika 6'].push({topic: t1[0].topic, questions: t1});
      added++;
    }
  } catch(e){
    console.error(`Error processing agent ${id}: ${e.message}`);
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully added ${added} topics to İnformatika 6.`);
