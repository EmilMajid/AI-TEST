const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./data/textbooks.json', 'utf8'));
const ed5 = ['Azərbaycan dili', 'Ədəbiyyat', 'Xarici dil', 'İkinci xarici dil', 'Riyaziyyat', 'İnformatika', 'Azərbaycan tarixi', 'Təbiət', 'Həyat bilgisi', 'Texnologiya', 'Təsviri İncəsənət', 'Musiqi', 'Fiziki tərbiyə'];
const tb5 = db['5'] || [];
const tbSubjects = [...new Set(tb5.map(t => t.subject))];
console.log('ED5:', ed5);
console.log('TB5:', tbSubjects);
ed5.forEach(s => {
  const match = tbSubjects.find(ts => ts === s);
  console.log(s + ': ' + (match ? 'MATCH' : 'NO MATCH'));
});
