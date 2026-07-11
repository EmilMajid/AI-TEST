const fs = require('fs');

console.log('Starting extraction of 8-9 grade suspicious tests...');

let db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));

let chunks = [];
if (fs.existsSync('data/textbook-chunks.jsonl')) {
  let lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
  for (let l of lines) {
    if (l.trim()) chunks.push(JSON.parse(l));
  }
}

let extractCount = 0;
let queueFilesCreated = [];

for (let cat in db) {
  let gradeMatch = cat.match(/(\d+)$/);
  if (!gradeMatch) continue;
  let grade = parseInt(gradeMatch[1]);
  if (grade !== 8 && grade !== 9) continue;
  
  let tests = db[cat] || [];
  if (tests.length === 0) continue;
  
  let sub = cat.replace(gradeMatch[1], '').replace('-cü sinif', '').replace('-cu sinif', '').trim();
  let subChunks = chunks.filter(c => c.subject === sub && parseInt(c.grade) === grade);
  
  let textBySection = {};
  for (let c of subChunks) {
    if (c.section) {
      if (!textBySection[c.section]) textBySection[c.section] = '';
      textBySection[c.section] += (c.text || '') + '\n\n';
    }
  }
  
  let suspiciousTests = [];
  let keptTests = [];
  
  for (let t of tests) {
    let tp = t.topic ? t.topic.trim() : 'Mövzusuz';
    if (tp === 'Mövzusuz') {
      keptTests.push(t);
      continue;
    }
    
    let foundTopicChunk = false;
    for (let c of subChunks) {
      let ct = c.topic || '';
      let cs = c.section || '';
      if ((ct.includes(tp) || tp.includes(ct)) && ct.length > 3) foundTopicChunk = true;
      if ((cs.includes(tp) || tp.includes(cs)) && cs.length > 3) foundTopicChunk = true;
      if (foundTopicChunk) break;
    }
    
    if (!foundTopicChunk) {
      suspiciousTests.push(t);
    } else {
      keptTests.push(t);
    }
  }
  
  if (suspiciousTests.length > 0) {
    let combinedText = '';
    for (let s in textBySection) combinedText += '=== Bölmə: ' + s + ' ===\n' + textBySection[s] + '\n';
    
    let queueData = {
      category: cat,
      text: combinedText,
      tests: suspiciousTests
    };
    
    let fname = 'data/q_' + cat.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') + '.json';
    fs.writeFileSync(fname, JSON.stringify(queueData, null, 2), 'utf8');
    queueFilesCreated.push(fname);
    extractCount += suspiciousTests.length;
    db[cat] = keptTests; 
    console.log('Created ' + fname + ' with ' + suspiciousTests.length + ' tests.');
  }
}

fs.writeFileSync('data/offline_tests.json', JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync('data/queue_files_89.json', JSON.stringify(queueFilesCreated), 'utf8');

console.log('Successfully extracted ' + extractCount + ' tests into ' + queueFilesCreated.length + ' queue files.');
