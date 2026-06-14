const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/test_generation_queue_6.json', 'utf8'));

let infoTopics = data.filter(t => t.subject === 'İnformatika' && t.grade === '6' || t.category === 'İnformatika 6' || t.title?.includes('İnformatika'));
if (infoTopics.length === 0) {
    infoTopics = data.filter(t => t.book_id === 'informatika-6' || t.book_id === '912');
}

console.log(`Found ${infoTopics.length} topics for Informatika 6`);
if (infoTopics.length > 0) {
    console.log(JSON.stringify(infoTopics.slice(0, 3), null, 2));
} else {
    console.log(Object.keys(data[0] || {}));
    console.log(data.slice(0, 2).map(t => t.subject || t.category));
}
