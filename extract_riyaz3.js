const fs = require('fs');

console.log('Starting extraction script...');
let db = JSON.parse(fs.readFileSync('data/offline_tests.json', 'utf8'));
let chunks = [];
if (fs.existsSync('data/textbook-chunks.jsonl')) {
  let lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
  for (let l of lines) {
    if (l.trim()) chunks.push(JSON.parse(l));
  }
}

let r3Chunks = chunks.filter(c => c.subject === 'Riyaziyyat' && c.grade == '3');
let sectionText = {
  '1 Ədədlər (1000-ə qədər)': '',
  '2 Toplama (1000-ə qədər)': '',
  '3 Çıxma (1000-ə qədər)': ''
};

for (let c of r3Chunks) {
  if (sectionText[c.section] !== undefined) {
    sectionText[c.section] += c.text + '\n\n';
  }
}

const topicMap = {
  '1': ['Üçrəqəmli ədədlər', 'Ədədin yazılış formaları', 'Ədədlərin müqayisəsi və sıralama', 'Yuvarlaqlaşdırma', 'Ümumiləşdirici tapşırıqlar'],
  '2': ['Üçrəqəmli ədədlərin toplanması', 'Üçrəqəmli ədədlərin toplanması (yeni onluğun yaranması)', 'Üçrəqəmli ədədlərin toplanması (yeni yüzlüyün yaranması)', 'Üçrəqəmli ədədlərin toplanması (yeni onluq və yüzlüyün yaranması)', 'Üç və daha çox ədədin toplanması', 'Toplamanın digər üsulları'],
  '3': ['Üçrəqəmli ədədlərin çıxılması', 'Üçrəqəmli ədədlərin çıxılması (onluğun ayrılması)', 'Üçrəqəmli ədədlərin çıxılması (yüzlüyün ayrılması)', 'Üçrəqəmli ədədlərin çıxılması (onluq və yüzlüyün ayrılması)', 'Çıxmanın digər üsulları', 'Təqribi toplama və çıxma']
};

function getSectionForTopic(topic) {
  for (let s in topicMap) {
    if (topicMap[s].includes(topic)) {
      if (s === '1') return '1 Ədədlər (1000-ə qədər)';
      if (s === '2') return '2 Toplama (1000-ə qədər)';
      if (s === '3') return '3 Çıxma (1000-ə qədər)';
    }
  }
  return null;
}

let riyazTests = db['Riyaziyyat 3'] || [];
let keptTests = [];
let targetTopics = [];
for (let s in topicMap) targetTopics = targetTopics.concat(topicMap[s]);

let verifyQueue = {
  'sec1': { section: '1 Ədədlər (1000-ə qədər)', text: sectionText['1 Ədədlər (1000-ə qədər)'], tests: [] },
  'sec2': { section: '2 Toplama (1000-ə qədər)', text: sectionText['2 Toplama (1000-ə qədər)'], tests: [] },
  'sec3': { section: '3 Çıxma (1000-ə qədər)', text: sectionText['3 Çıxma (1000-ə qədər)'], tests: [] },
};

let countExtracted = 0;

for (let t of riyazTests) {
  let tp = t.topic ? t.topic.trim() : '';
  if (targetTopics.includes(tp)) {
    let sec = getSectionForTopic(tp);
    if (sec === '1 Ədədlər (1000-ə qədər)') verifyQueue['sec1'].tests.push(t);
    else if (sec === '2 Toplama (1000-ə qədər)') verifyQueue['sec2'].tests.push(t);
    else if (sec === '3 Çıxma (1000-ə qədər)') verifyQueue['sec3'].tests.push(t);
    else verifyQueue['sec1'].tests.push(t);
    countExtracted++;
  } else {
    keptTests.push(t);
  }
}

db['Riyaziyyat 3'] = keptTests;

fs.writeFileSync('data/queue_riyaz3_verify_1.json', JSON.stringify(verifyQueue['sec1'], null, 2), 'utf8');
fs.writeFileSync('data/queue_riyaz3_verify_2.json', JSON.stringify(verifyQueue['sec2'], null, 2), 'utf8');
fs.writeFileSync('data/queue_riyaz3_verify_3.json', JSON.stringify(verifyQueue['sec3'], null, 2), 'utf8');

fs.writeFileSync('data/offline_tests.json', JSON.stringify(db, null, 2), 'utf8');

console.log('Extracted ' + countExtracted + ' tests for verification.');
console.log('Sec 1 tests: ' + verifyQueue['sec1'].tests.length);
console.log('Sec 2 tests: ' + verifyQueue['sec2'].tests.length);
console.log('Sec 3 tests: ' + verifyQueue['sec3'].tests.length);
