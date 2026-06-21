const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'offline_tests.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const questions = JSON.parse(fs.readFileSync('scripts/rus_dili8_questions.json', 'utf-8'));

db['Rus dili 8'] = questions;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Rus dili 8:', questions.length, 'questions injected');

const byTopic = {};
questions.forEach(q => {
  byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
});
console.log('\nBy topic:');
Object.entries(byTopic).forEach(([t, c]) => console.log(' ', t, ':', c, 'sual'));
