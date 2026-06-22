const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'offline_tests.json');
let testsDb = {};
if (fs.existsSync(dbPath)) {
  testsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
if (!testsDb['Azərbaycan dili 9']) testsDb['Azərbaycan dili 9'] = [];

const batch5 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp', 'az9_batch5_final.json'), 'utf8'));

testsDb['Azərbaycan dili 9'].push(...batch5);

fs.writeFileSync(dbPath, JSON.stringify(testsDb, null, 2));

const total = testsDb['Azərbaycan dili 9'].length;
console.log(`Successfully appended ${batch5.length} final tests.`);
console.log(`Total 'Azərbaycan dili 9' tests in database: ${total}`);
