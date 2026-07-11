const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));

let targetTopics = [
  'Üçrəqəmli ədədlər',
  'Ədədin yazılış formaları',
  'Ədədlərin müqayisəsi və sıralama',
  'Yuvarlaqlaşdırma',
  'Ümumiləşdirici tapşırıqlar',
  'Üçrəqəmli ədədlərin toplanması',
  'Üçrəqəmli ədədlərin toplanması (yeni onluğun yaranması)',
  'Üçrəqəmli ədədlərin toplanması (yeni yüzlüyün yaranması)',
  'Üçrəqəmli ədədlərin toplanması (yeni onluq və yüzlüyün yaranması)',
  'Üç və daha çox ədədin toplanması',
  'Toplamanın digər üsulları',
  'Üçrəqəmli ədədlərin çıxılması',
  'Üçrəqəmli ədədlərin çıxılması (onluğun ayrılması)',
  'Üçrəqəmli ədədlərin çıxılması (yüzlüyün ayrılması)',
  'Üçrəqəmli ədədlərin çıxılması (onluq və yüzlüyün ayrılması)',
  'Çıxmanın digər üsulları',
  'Təqribi toplama və çıxma'
];

let riyaz3 = db['Riyaziyyat 3'] || [];
let counts = {};
for (let t of riyaz3) {
  let tp = t.topic ? t.topic.trim() : '';
  counts[tp] = (counts[tp] || 0) + 1;
}

let queue = [];
for (let tp of targetTopics) {
  let c = counts[tp] || 0;
  if (c < 21) {
    queue.push({ cat: 'Riyaziyyat 3', topic: tp, count: 21 - c });
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
  let text = '';
  for (let ch of chunks) {
    if (ch.subject === 'Riyaziyyat' && ch.grade === 3 && ch.topic && (ch.topic.includes(tgt.topic) || tgt.topic.includes(ch.topic))) {
      text += ch.text + '\n';
    }
  }
  tgt.text = text ? text : 'Təəssüf ki, mətni birbaşa dərslik bazasından tapmaq mümkün olmadı. Lakin sən fənnin bu mövzusu barədə biliklərindən istifadə edərək SİTG formatında testlər yaratmalısan.';
}

fs.writeFileSync('data/queue_riyaz3_selected.json', JSON.stringify(queue, null, 2), 'utf8');
console.log('Total topics needing tests: ' + queue.length);
for (let t of queue) {
  console.log(t.topic + ' -> needs ' + t.count + ' tests');
}
