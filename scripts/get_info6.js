const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/textbooks.json', 'utf8'));
const grade6 = data["6"] || [];
const info6 = grade6.find(b => b.title.includes('İnformatika'));
console.log(JSON.stringify(info6, null, 2));
