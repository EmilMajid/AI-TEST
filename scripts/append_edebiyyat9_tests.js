const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/offline_tests.json');
let db = {};
try {
  if (fs.existsSync(dbPath)) {
    const raw = fs.readFileSync(dbPath, 'utf8');
    db = JSON.parse(raw);
  }
} catch (e) {
  console.error('Error reading db:', e);
}

if (!db['Ədəbiyyat 9']) {
  db['Ədəbiyyat 9'] = [];
}

const testFiles = [
  'edeb9_t1_1.json',
  'edeb9_t1_2.json',
  'edeb9_t1_3.json',
  'edeb9_t1_4.json',
  'edeb9_t1_5.json'
];

let addedCount = 0;

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '../temp', file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content.forEach(test => {
      const exists = db['Ədəbiyyat 9'].find(t => t.passport_id === test.passport_id);
      if (!exists) {
        db['Ədəbiyyat 9'].push(test);
        addedCount++;
      }
    });
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} tests to offline_tests.json under Ədəbiyyat 9`);
console.log(`Total tests in Ədəbiyyat 9 DB: ${db['Ədəbiyyat 9'].length}`);
