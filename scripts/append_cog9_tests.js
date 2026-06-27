const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'offline_tests.json');
let testsDb = {};
if (fs.existsSync(dbPath)) {
  testsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
if (!testsDb['Coğrafiya 9']) testsDb['Coğrafiya 9'] = [];

const t1_3 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_3.json'), 'utf8'));
const t1_4 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_4.json'), 'utf8'));
const t1_5 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_5.json'), 'utf8'));
const t1_6 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_6.json'), 'utf8'));
const t1_7 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_7.json'), 'utf8'));
const t1_8 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_8.json'), 'utf8'));
const t1_9 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'cog9_t1_9.json'), 'utf8'));

testsDb['Coğrafiya 9'].push(...t1_5, ...t1_6, ...t1_7, ...t1_8, ...t1_9);

fs.writeFileSync(dbPath, JSON.stringify(testsDb, null, 2));
console.log(`✅ Appended ${t1_5.length + t1_6.length + t1_7.length + t1_8.length + t1_9.length} Geography 9 tests.`);
console.log(`📊 Total 'Coğrafiya 9' tests: ${testsDb['Coğrafiya 9'].length}`);
