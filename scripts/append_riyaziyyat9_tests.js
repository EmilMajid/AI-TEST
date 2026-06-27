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

if (!db['Riyaziyyat 9']) {
  db['Riyaziyyat 9'] = [];
}

const testFiles = [
  'riyaziyyat9_t1_1.json'
];

let addedCount = 0;

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '../temp', file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content.forEach(test => {
      const exists = db['Riyaziyyat 9'].find(t => t.passport_id === test.passport_id);
      if (!exists) {
        db['Riyaziyyat 9'].push(test);
        addedCount++;
      }
    });
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} tests to offline_tests.json under Riyaziyyat 9`);
console.log(`Total tests in Riyaziyyat 9 DB: ${db['Riyaziyyat 9'].length}`);
