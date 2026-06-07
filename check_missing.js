const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./data/offline_tests.json', 'utf8'));

function checkMissing(subjectName, expectedCountPerTopic = 30) {
    if (!db[subjectName]) return;
    let counts = {};
    let topics = {};
    db[subjectName].forEach(t => {
        let prefix = t.passport_id ? t.passport_id.split('-').slice(0,5).join('-') : 'UNKNOWN';
        counts[prefix] = (counts[prefix] || 0) + 1;
        topics[prefix] = t.topic;
    });
    console.log(`--- ${subjectName} ---`);
    for (let p in counts) {
        if (counts[p] < expectedCountPerTopic) {
            console.log(`Prefix: ${p} | Topic: ${topics[p]} | Count: ${counts[p]}`);
        }
    }
}

checkMissing('Azərbaycan dili');
checkMissing('Riyaziyyat');
