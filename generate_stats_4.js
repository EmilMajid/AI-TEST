const fs = require('fs');

let db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));
let chunks = [];
if (fs.existsSync('data/textbook-chunks.jsonl')) {
  let lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
  for (let l of lines) {
    if (l.trim()) chunks.push(JSON.parse(l));
  }
}

let grade4Subjects = Object.keys(db).filter(cat => cat.match(/4(-\S+)?(\s+sinif)?$/) || cat.endsWith(' 4'));

let md = '# 4-cü Sinif Detallı Statistika (Mövzu Üzrə)\n\n';
md += '| Fənn | Mövzu | Test Sayı | Əlavə Edilməli Test Sayı |\n';
md += '|---|---|---|---|\n';

for (let cat of grade4Subjects) {
  let subName = cat.slice(0, -2).trim();
  let tests = db[cat] || [];
  
  let topicCounts = {};
  for (let t of tests) {
    let tp = t.topic ? t.topic.trim() : 'Mövzusuz';
    if (!topicCounts[tp]) topicCounts[tp] = 0;
    topicCounts[tp]++;
  }
  
  // also get topics from textbook-chunks
  let subChunks = chunks.filter(c => c.subject === subName && parseInt(c.grade) === 4);
  let availableTopics = [];
  for (let c of subChunks) {
    if (c.topic && c.topic.trim()) availableTopics.push(c.topic.trim());
    else if (c.section && c.section.trim()) availableTopics.push(c.section.trim());
  }
  availableTopics = [...new Set(availableTopics)];
  
  // merge topics from tests and from textbook
  let allTopics = new Set([...Object.keys(topicCounts), ...availableTopics]);
  // Sort them so they look neat
  let sortedTopics = Array.from(allTopics).sort();
  
  for (let tp of sortedTopics) {
    if (tp === 'Mövzusuz' && !topicCounts[tp]) continue; // Skip if no unassigned tests
    let count = topicCounts[tp] || 0;
    let needed = count >= 15 ? 0 : (15 - count);
    
    // escape markdown table pipes if any
    let safeTopic = tp.replace(/\|/g, '-');
    md += `| ${cat} | ${safeTopic} | ${count} | ${needed} |\n`;
  }
}

fs.writeFileSync('C:/Users/User/.gemini/antigravity/brain/3c6d91d4-ab06-4ee4-9598-273f712891fb/stats_4th_grade_detailed.md', md, 'utf8');
console.log('Detailed stats generated.');
