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

if (!mainData['Biologiya 9']) {
  mainData['Biologiya 9'] = [];
}

let newTestsAdded = 0;
let duplicatesSkipped = 0;

// Mövzular 1-8 üçün faylları oxu
for (let i = 1; i <= 8; i++) {
  const tempFile = path.join(__dirname, `../temp/biologiya9_t1_${i}.json`);
  if (fs.existsSync(tempFile)) {
    let newTests;
    try {
      const tempContent = fs.readFileSync(tempFile, 'utf8');
      newTests = JSON.parse(tempContent);
    } catch(e) {
      console.log(`XƏTA: biologiya9_t1_${i}.json oxunarkən JSON xətası: ${e.message}`);
      continue;
    }

    newTests.forEach(test => {
      const exists = mainData['Biologiya 9'].some(
        existing => existing.passport_id === test.passport_id
      );
      if (!exists) {
        mainData['Biologiya 9'].push(test);
        newTestsAdded++;
      } else {
        duplicatesSkipped++;
      }
    });
    console.log(`Fayl biologiya9_t1_${i}.json: ${newTests.length} test əlavə edildi.`);
  } else {
    console.log(`XƏBƏRDARLIQ: biologiya9_t1_${i}.json tapılmadı!`);
  }
}

fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2));
console.log(`\nYEKUN: ${newTestsAdded} yeni test əlavə edildi. ${duplicatesSkipped} dublikat keçildi.`);
console.log(`Biologiya 9 üzrə ümumi test sayı: ${mainData['Biologiya 9'].length}`);
