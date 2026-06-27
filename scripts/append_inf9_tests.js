const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'offline_tests.json');
let testsDb = {};

if (fs.existsSync(dbPath)) {
    testsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

if (!testsDb['İnformatika 9']) {
    testsDb['İnformatika 9'] = [];
}

const t1_1 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'inf9_t1_1.json'), 'utf8'));
const t1_2 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'inf9_t1_2.json'), 'utf8'));
const t1_3 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'inf9_t1_3.json'), 'utf8'));
const t1_4 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'inf9_t1_4.json'), 'utf8'));
const t1_5 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'inf9_t1_5.json'), 'utf8'));

testsDb['İnformatika 9'].push(...t1_1, ...t1_2, ...t1_3, ...t1_4, ...t1_5);

fs.writeFileSync(dbPath, JSON.stringify(testsDb, null, 2));
console.log(`✅ Appended ${t1_1.length + t1_2.length + t1_3.length + t1_4.length + t1_5.length} Informatics 9 tests.`);
console.log(`📊 Total 'İnformatika 9' tests: ${testsDb['İnformatika 9'].length}`);
