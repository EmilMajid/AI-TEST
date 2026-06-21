const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'offline_tests.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Load from JSON data files
const riyaziyyat8 = JSON.parse(fs.readFileSync('scripts/riyaziyyat8_questions.json','utf-8'));
const kimya8 = JSON.parse(fs.readFileSync('scripts/kimya8_questions.json','utf-8'));

db['Riyaziyyat 8'] = riyaziyyat8;
db['Kimya 8'] = kimya8;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Riyaziyyat 8:', riyaziyyat8.length, 'questions injected');
console.log('Kimya 8:', kimya8.length, 'questions injected');
