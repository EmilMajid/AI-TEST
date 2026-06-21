const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'offline_tests.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const informatika8 = JSON.parse(fs.readFileSync('scripts/informatika8_questions.json', 'utf-8'));

db['Informatika 8'] = informatika8;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Informatika 8:', informatika8.length, 'questions injected');

// Count by topic
const byTopic = {};
informatika8.forEach(q => {
  byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
});
console.log('\nBy topic:');
Object.entries(byTopic).forEach(([t, c]) => console.log(' ', t, ':', c, 'sual'));
