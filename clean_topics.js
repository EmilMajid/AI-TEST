const fs = require('fs');

const dbPath = 'data/offline_tests.json';
console.log('Loading database...');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const topicMap = {
  'Alman dili 8': {
    'Stunde 4. Was sind sie von Beruf ?': 'Stunde 4. Was sind sie von Beruf?'
  },
  'Azərbaycan dili 8': {
    'III BÖLMƏ: 10. Hekayt': 'III BÖLMƏ: 10. Hekayət',
    'III BÖLMƏ: 13. Qədim türkälərdə tərbiyə': 'III BÖLMƏ: 13. Qədim türklərdə tərbiyə',
    'III BÖLMƏ: 3. Səhəng içində nə varsa, onu sızdrar': 'III BÖLMƏ: 3. Səhəng içində nə varsa, onu sızdırar...',
    'III BÖLMƏ: 6. Qaranquşların ömrü 6 aydır': 'III BÖLMƏ: 6. Qaranquşların ömrü 6 aydır...',
    'III BÖLMƏ: 9. Sədaqat': 'III BÖLMƏ: 9. Sədaqət',
    'IV BÖLMƏ: 10. \"O, Qəbələni necə xilas etdi?\"': 'IV BÖLMƏ: 10. “O, Qəbələni necə xilas etdi?”',
    'IV BÖLMƏ: 12. Əlimardan bəy Topçubaşov': 'IV BÖLMƏ: 12. Əlimərdan bəy Topçubaşov',
    'IV BÖLMƏ: 2. Kərpickəsən qocanın hekayt': 'IV BÖLMƏ: 2. Kərpickəsən qocanın hekayəti',
    'IV BÖLMƏ: 3. Şuşa dağlarını duman bürüyüb': 'IV BÖLMƏ: 3. Şuşa dağlarını duman bürüyüb...'
  },
  'Azərbaycan tarixi 8': {
    'Rusiyanın Xəzər dənizi hövzəsinə yürüşə hazırlanması': 'Rusiyanın Xəzər dənizi hövzəsinə yürüşə hazırlaşması'
  },
  'Kimya 8': {
    'Elementlərin xässələrinin dövriləyi': 'Elementlərin xassələrinin dövriliyi',
    'Ümuliləşdirici tapşırıqlar': 'Ümumiləşdirici tapşırıqlar'
  },
  'Ortaq türk tarixi 8': {
    'Protötürklər': 'Prototürklər'
  },
  'Riyaziyyat 8': {
    'Oxşar dördbucaqlılar, oxşar üçbucaqlar': 'Oxşar dördbucaqlılar,oxşar üçbucaqlar',
    'Triqonometrik nisbatlərin tətbiqi ilə məsələ həlli': 'Triqonometrik nisbətlərin tətbiqi ilə məsələ həlli',
    'Asılı hadisələr': 'Asılı olmayan və asılı hadisələr',
    'Fiqurların çevrilməsi.Dönmə': 'Fiqurların çevrilməsi. Dönmə',
    'Kvadrat tənliklərin həlli. Kvadrat tənliyin kökləri düsturi': 'Kvadrat tənliklərin həlli. Kvadrat tənliyin kökləri düsturu',
    'Kvadrat tənliklərin həlli.Kvadrat tənliyin kökləri düsturu': 'Kvadrat tənliklərin həlli. Kvadrat tənliyin kökləri düsturu',
    'Kvadrat tənliklərin tətbiqi': 'Kvadrat tənliklərin tətbiqi ilə məsələ həlli',
    'y = x və y = √x funksiyaları': 'y = x² və y = √x funksiyaları',
    'Məlumatın toplanması və təqdim edilməsi': 'Məlumatın toplanması və təqdim',
    'Məlumatın toplanması və təqdimi': 'Məlumatın toplanması və təqdim'
  },
  'Ümumi tarix 8': {
    'İngiltərə (XVI-XVII əsrlər)': 'İngiltərə'
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

// Additional rule for Riyaziyyat 8 section prefixes
for (let t of db['Riyaziyyat 8'] || []) {
  if (t.topic) {
    if (t.topic.startsWith('8 Fiqurların oxşarlığı') && t.topic === '8 Fiqurların oxşarlığı') {
      t.topic = 'Fiqurların oxşarlığı';
      modifiedCount++;
    }
  }
}

console.log('Modified topics for ' + modifiedCount + ' tests. Saving...');
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Done.');
