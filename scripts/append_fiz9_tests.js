const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'offline_tests.json');
let testsDb = {};
if (fs.existsSync(dbPath)) {
  testsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
if (!testsDb['Fizika 9']) testsDb['Fizika 9'] = [];

const t1_7 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'fiz9_t1_7.json'), 'utf8'));
const t1_8 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'fiz9_t1_8.json'), 'utf8'));
const t1_9 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'fiz9_t1_9.json'), 'utf8'));
const t1_10 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'fiz9_t1_10.json'), 'utf8'));

testsDb['Fizika 9'].push(...t1_7, ...t1_8, ...t1_9, ...t1_10);

fs.writeFileSync(dbPath, JSON.stringify(testsDb, null, 2));
const total = testsDb['Fizika 9'].length;
console.log(`✅ Appended ${t1_7.length + t1_8.length + t1_9.length + t1_10.length} tests (topics 1.7-1.10).`);
console.log(`📊 Total 'Fizika 9' tests in database: ${total}`);
