const fs = require('fs');
let db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));
let chunks = [];
if (fs.existsSync('data/textbook-chunks.jsonl')) {
  let lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
  for (let l of lines) {
    if (l.trim()) chunks.push(JSON.parse(l));
  }
}

let subjects = ['Həyat bilgisi 3', 'Texnologiya 3', 'İnformatika 3'];
let output = {};

for (let subCat of subjects) {
  let subName = subCat.slice(0, -2).trim();
  let tests = db[subCat] || [];
  
  let topicCounts = {};
  for (let t of tests) {
    let tp = t.topic ? t.topic.trim() : 'Mövzusuz';
    if (!topicCounts[tp]) topicCounts[tp] = 0;
    topicCounts[tp]++;
  }
  
  let subChunks = chunks.filter(c => c.subject === subName && parseInt(c.grade) === 3);
  let availableTopics = [];
  for (let c of subChunks) {
    if (c.topic && c.topic.trim()) availableTopics.push(c.topic.trim());
    else if (c.section && c.section.trim()) availableTopics.push(c.section.trim());
  }
  availableTopics = [...new Set(availableTopics)];
  
  let missing = [];
  for (let tp of availableTopics) {
    let count = topicCounts[tp] || 0;
    if (count < 15) {
      let topicText = subChunks.filter(c => c.topic === tp || c.section === tp).map(c => c.text).join('\n\n');
      missing.push({
        topic: tp,
        current_count: count,
        needed: 15 - count,
        text: topicText
      });
    }
  }
  output[subCat] = missing;
}
fs.writeFileSync('data/missing_3_queue.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Successfully generated queue for 3rd grade missing subjects.');
