const fs = require('fs');
const path = require('path');

const dataDir = path.join('C:\\\\Users\\\\User\\\\Downloads\\\\azerbaijanaiplatform\\\\data');
const dirs = ['aztarixi6_chunks_generated', 'umumitarix6_chunks_generated'];

let report = [];
let total = 0;

for (const d of dirs) {
    const fullDir = path.join(dataDir, d);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir);
    for (const f of files) {
        if (!f.endsWith('.json')) continue;
        try {
            const tests = JSON.parse(fs.readFileSync(path.join(fullDir, f), 'utf8'));
            if (tests.length > 0) {
                const subj = tests[0].subject || tests[0].category || (d.includes('aztarixi') ? 'Azərbaycan tarixi' : 'Ümumi tarix');
                let topic = tests[0].topic || f.replace('.json', '');
                // Try to clean topic string
                topic = topic.replace(/^\\d+\\.\\s*/, '').trim();
                report.push({ subject: subj, topic: topic, count: tests.length });
                total += tests.length;
            }
        } catch(e) {}
    }
}

// Sort by subject then topic name
report.sort((a, b) => {
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
    return a.topic.localeCompare(b.topic);
});

console.log('Ümumi Test Sayı: ' + total + '\n');
let currentSubj = '';
for (const item of report) {
    if (item.subject !== currentSubj) {
        console.log('\n--- ' + item.subject + ' ---');
        currentSubj = item.subject;
    }
    console.log('- ' + item.topic + ': ' + item.count + ' test');
}
