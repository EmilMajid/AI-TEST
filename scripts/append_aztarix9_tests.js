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

const CATEGORY = 'Azərbaycan tarixi 9';

if (!mainData[CATEGORY]) {
  mainData[CATEGORY] = [];
}

let newTestsAdded = 0;
let duplicatesSkipped = 0;
let filesFound = 0;
let filesMissing = 0;

// Mövzular 1-8 üçün faylları oxu
for (let i = 1; i <= 8; i++) {
  const tempFile = path.join(__dirname, `../temp/aztarix9_t1_${i}.json`);
  if (fs.existsSync(tempFile)) {
    filesFound++;
    let newTests;
    try {
      const tempContent = fs.readFileSync(tempFile, 'utf8');
      newTests = JSON.parse(tempContent);
    } catch(e) {
      console.log(`XƏTA: aztarix9_t1_${i}.json oxunarkən JSON xətası: ${e.message}`);
      continue;
    }

    let batchAdded = 0;
    newTests.forEach(test => {
      const exists = mainData[CATEGORY].some(
        existing => existing.passport_id === test.passport_id
      );
      if (!exists) {
        mainData[CATEGORY].push(test);
        newTestsAdded++;
        batchAdded++;
      } else {
        duplicatesSkipped++;
      }
    });
    console.log(`✓ aztarix9_t1_${i}.json: ${batchAdded}/${newTests.length} test əlavə edildi.`);
  } else {
    filesMissing++;
    console.log(`⚠ aztarix9_t1_${i}.json tapılmadı!`);
  }
}

fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2));

console.log(`\n═══════════════════════════════════════`);
console.log(`YEKUN NƏTİCƏ:`);
console.log(`  Tapılan fayl sayı  : ${filesFound}`);
console.log(`  Tapılmayan fayl    : ${filesMissing}`);
console.log(`  Əlavə edilən test  : ${newTestsAdded}`);
console.log(`  Dublikat keçilən   : ${duplicatesSkipped}`);
console.log(`  DB-də ümumi say    : ${mainData[CATEGORY].length}`);
console.log(`═══════════════════════════════════════`);
