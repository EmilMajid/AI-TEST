const fs = require('fs');
const path = require('path');

const mainFile = path.join(__dirname, '../data/offline_tests.json');
let mainData = {};

if (fs.existsSync(mainFile)) {
  const content = fs.readFileSync(mainFile, 'utf8');
  if (content.trim()) {
    mainData = JSON.parse(content);
  }
}

if (!mainData['Texnologiya 9']) {
  mainData['Texnologiya 9'] = [];
}

let newTestsAdded = 0;
let duplicatesSkipped = 0;

for (let i = 1; i <= 3; i++) {
  const tempFile = path.join(__dirname, `../temp/texnologiya9_t1_${i}.json`);
  if (fs.existsSync(tempFile)) {
    const tempContent = fs.readFileSync(tempFile, 'utf8');
    const newTests = JSON.parse(tempContent);

    newTests.forEach(test => {
      const exists = mainData['Texnologiya 9'].some(existing => existing.passport_id === test.passport_id);
      if (!exists) {
        mainData['Texnologiya 9'].push(test);
        newTestsAdded++;
      } else {
        duplicatesSkipped++;
      }
    });
  }
}

fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2));
console.log(`Added ${newTestsAdded} new tests. Skipped ${duplicatesSkipped} duplicates.`);
