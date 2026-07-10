const fs = require('fs');
const dbPath = 'data/offline_tests.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const topicMap = {
  'Ədəbiyyat 8': {
    'Nizami Gəncəvi. Sultan Səncər və qarı': 'Nizami Gəncəvi. Sultan Səncər və qarı ("Sirlər xəzinəsi"poemasından)',
    'Qazan bəyin oğlu Uruz bəyin dustaq olduğu boy': 'Qazan bəyin oğlu Uruz bəyin dustaq olduğu boy ("Kitabi-Dədə Qorqud"dastanında)',
    'Qazılıq Qoca oğlu Yeynək boyu': 'Qazılıq Qoca oğlu Yeynək boyu (qiymətləndirmə materialı)'
  }
};

let modifiedCount = 0;

for (let cat in db) {
  if (topicMap[cat]) {
    for (let t of db[cat]) {
      let currentTopic = t.topic ? t.topic.trim() : '';
      if (topicMap[cat][currentTopic]) {
        t.topic = topicMap[cat][currentTopic];
        modifiedCount++;
      }
    }
  }
}

if (modifiedCount > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}
console.log('Modified topics for ' + modifiedCount + ' tests.');
