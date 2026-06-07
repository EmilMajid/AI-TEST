const fs = require('fs');
const path = require('path');

const tempDir = 'C:/Users/User/Downloads/azerbaijanaiplatform/temp_tests_fl_v2';
const existingFiles = new Set(fs.readdirSync(tempDir));

const missing = [];
let total = 0;

for (let i = 1; i <= 6; i++) {
  const batchFile = `C:/Users/User/Downloads/azerbaijanaiplatform/batch_${i}.json`;
  if (fs.existsSync(batchFile)) {
    const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    batch.forEach(item => {
      total++;
      // Extract filename from Prompt: "Fayl: C:/.../temp_tests_fl_v2/Alman_1.json."
      const match = item.Prompt.match(/Fayl: .*?\/([^\/]+\.json)\./);
      if (match) {
        const filename = match[1];
        if (!existingFiles.has(filename)) {
          missing.push(item);
        }
      }
    });
  }
}

console.log(`Total items in batches: ${total}`);
console.log(`Missing items: ${missing.length}`);
fs.writeFileSync('C:/Users/User/Downloads/azerbaijanaiplatform/missing_items.json', JSON.stringify(missing, null, 2));
