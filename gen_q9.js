const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));

let categories = Object.keys(db).filter(cat => 
  cat.endsWith(' 9') || cat.endsWith('9') || cat === 'Ortaq türk tarixi 9' || cat === 'Ümumi tarix 9' || cat === 'Zəfər tarixi 9' || cat === 'Həyat bilgisi 9'
).sort();

let queue = [];

for (let cat of categories) {
  let topics = {};
  for (let t of db[cat]) {
    let tp = t.topic ? t.topic.trim() : 'Mövzusuz';
    if (tp !== 'Mövzusuz') {
      topics[tp] = (topics[tp] || 0) + 1;
    }
  }
  
  for (let tp in topics) {
    if (topics[tp] < 21) {
      queue.push({
        cat: cat,
        topic: tp,
        count: 21 - topics[tp]
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
  let sub = tgt.cat.replace(' 9', '').trim();
  let text = '';
  for (let ch of chunks) {
    if (ch.subject === sub && ch.grade === 9 && ch.topic && (ch.topic.includes(tgt.topic) || tgt.topic.includes(ch.topic))) {
      text += ch.text + '\n';
    }
  }
  tgt.text = text ? text : 'Təəssüf ki, mətni birbaşa dərslik bazasından tapmaq mümkün olmadı. Lakin sən fənnin bu mövzusu barədə biliklərindən istifadə edərək SİTG formatında testlər yaratmalısan.';
}

let groups = {
  zefer_tarixi: queue.filter(x => x.cat === 'Zəfər tarixi 9'),
  xarici_diller: queue.filter(x => x.cat === 'Rus dili 9' || x.cat === 'Alman dili 9' || x.cat === 'Fransız dili 9'),
  heyat_bilgisi: queue.filter(x => x.cat === 'Həyat bilgisi 9')
};

for (let key in groups) {
  if (groups[key].length > 0) {
    fs.writeFileSync('data/queue_9_' + key + '.json', JSON.stringify(groups[key], null, 2), 'utf8');
  }
}
console.log('Queues generated.');
