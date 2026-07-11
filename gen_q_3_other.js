const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));

let targetCats = Object.keys(db).filter(cat => 
  (cat.endsWith(' 3') || cat.endsWith('3') || cat.includes(' 3-cü') || cat === 'Ortaq türk tarixi 3' || cat === 'Ümumi tarix 3') &&
  !cat.includes('13') && !cat.includes('23') &&
  !cat.includes('Riyaziyyat') &&
  !cat.includes('İngilis') && !cat.includes('Rus') && !cat.includes('Alman') && !cat.includes('Fransız') && !cat.includes('Русский')
).sort();

let queue = [];

for (let cat of targetCats) {
  let topics = {};
  for (let t of db[cat]) {
    let tp = t.topic ? t.topic.trim() : 'Mövzusuz';
    if (tp !== 'Mövzusuz') {
      topics[tp] = (topics[tp] || 0) + 1;
    }
  }
  
  for (let tp in topics) {
    if (topics[tp] < 15) {
      queue.push({
        cat: cat,
        topic: tp,
        count: 15 - topics[tp]
      });
    }
  }
}

let chunks = [];
if (fs.existsSync('data/textbook-chunks.jsonl')) {
  let lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
  for (let l of lines) {
    if (l.trim()) chunks.push(JSON.parse(l));
  }
}

for (let tgt of queue) {
  let sub = tgt.cat.replace(' 3', '').replace(' 3-cü sinif', '').trim();
  let text = '';
  for (let ch of chunks) {
    if (ch.subject === sub && ch.grade === 3 && ch.topic && (ch.topic.includes(tgt.topic) || tgt.topic.includes(ch.topic))) {
      text += ch.text + '\n';
    }
  }
  tgt.text = text ? text : 'Təəssüf ki, mətni birbaşa dərslik bazasından tapmaq mümkün olmadı. Lakin sən fənnin bu mövzusu barədə biliklərindən istifadə edərək SİTG formatında testlər yaratmalısan.';
}

fs.writeFileSync('data/queue_3_other_subjects.json', JSON.stringify(queue, null, 2), 'utf8');

console.log('Target categories: ' + targetCats.join(', '));
console.log('Total topics needing tests to reach 15: ' + queue.length);
let sum = 0;
for (let t of queue) {
  sum += t.count;
  console.log(t.cat + ' - ' + t.topic + ' -> needs ' + t.count);
}
console.log('Total new tests to generate: ' + sum);
