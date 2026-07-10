const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// 1. Fix all known JSON errors in the recovered files
function fixAll() {
  // Rus
  let fRus = 'data/gen_rus_dili8.json';
  if (fs.existsSync(fRus)) {
    let c = fs.readFileSync(fRus, 'utf8');
    c = c.replace(/\"Ф\"/g, '\\\"Ф\\\"');
    c = c.replace(/"лишней"/g, '\\"лишней\\"');
    fs.writeFileSync(fRus, c);
  }

  // Edebiyyat
  let fEdeb = 'data/gen_edebiyyat8.json';
  if (fs.existsSync(fEdeb)) {
    let c = fs.readFileSync(fEdeb, 'utf8');
    c = c.replace(/\"C\": \"Xaqaninin/g, '\"C) Xaqaninin');
    c = c.replace(/"D": "Həyat/g, '"D) Həyat');
    c = c.replace(/"D": "Bu arxetipin/g, '"D) Bu arxetipin');
    c = c.replace(/\"},\s*\"correctAnswer\"/g, '\"],\n    \"correctAnswer\"');
    fs.writeFileSync(fEdeb, c);
  }

  // Riyaziyyat2
  let fRiyaz = 'data/gen_riyaziyyat8_part2.json';
  if (fs.existsSync(fRiyaz)) {
    let c = fs.readFileSync(fRiyaz, 'utf8');
    c = c.replace(/\"A\"\)\s+/g, '\"A) ');
    c = c.replace(/\"B\"\)\s+/g, '\"B) ');
    c = c.replace(/\"C\"\)\s+/g, '\"C) ');
    c = c.replace(/\"D\"\)\s+/g, '\"D) ');
    c = c.replace(/\"E\"\)\s+/g, '\"E) ');
    fs.writeFileSync(fRiyaz, c);
  }
}

fixAll();

// 2. Merge into database
const dbPath = 'data/offline_tests.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const files = [
  'gen_informatika8.json',
  'gen_texnologiya8.json',
  'gen_ingilis8.json',
  'gen_umumi_tarix8.json',
  'gen_rus_dili8.json',
  'gen_kimya8.json',
  'gen_ortaq_turk8.json',
  'gen_edebiyyat8.json',
  'gen_alman8.json',
  'gen_fransiz8.json',
  'gen_az_tarixi8.json',
  'gen_fizika8.json',
  'gen_riyaziyyat8_part1.json',
  'gen_riyaziyyat8_part2.json',
  'gen_azdili8_part1.json',
  'gen_azdili8_part2.json',
  'gen_azdili8_part3.json'
];

let totalMerged = 0;

for (let f of files) {
  let p = path.join('data', f);
  if (!fs.existsSync(p)) continue;
  try {
    let data = JSON.parse(fs.readFileSync(p, 'utf8'));
    for (let t of data) {
      if (!t.id) t.id = crypto.randomUUID();
      let cat = t.cat || 'Mövzusuz';
      if (!db[cat]) db[cat] = [];
      db[cat].push(t);
      totalMerged++;
    }
    console.log('Merged ' + data.length + ' from ' + f);
  } catch(e) {
    console.log('Skipping ' + f + ' due to parse error: ' + e.message);
  }
}

// Write the database file synchronously
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Total new tests merged: ' + totalMerged);

