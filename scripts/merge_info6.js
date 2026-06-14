const fs = require('fs');
const path = require('path');
const dataDir = path.join('C:\\\\Users\\\\User\\\\Downloads\\\\azerbaijanaiplatform\\\\data');
const offlinePath = path.join(dataDir, 'offline_tests.json');

const offlineTests = JSON.parse(fs.readFileSync(offlinePath, 'utf8'));

let maxId = 0;
for (const subj of Object.values(offlineTests)) {
    if (Array.isArray(subj)) {
        for (const test of subj) {
            if (test.id > maxId) maxId = test.id;
        }
    }
}

let added = 0;
const dirs = ['info6_chunks_generated', 'info6_generated'];

function getDiff(d) {
    if(d === 'sadə' || d === 'easy') return 'easy';
    if(d === 'orta' || d === 'medium') return 'medium';
    if(d === 'çətin' || d === 'hard') return 'hard';
    return 'medium';
}

function getBloom(b) {
    if(!b) return 'knowledge';
    if(b.includes('bilik')) return 'knowledge';
    if(b.includes('anlama')) return 'comprehension';
    if(b.includes('tətbiq')) return 'application';
    if(b.includes('təhlil')) return 'analysis';
    if(b.includes('sintez')) return 'synthesis';
    if(b.includes('dəyərləndirmə')) return 'evaluation';
    return 'knowledge';
}

for (const d of dirs) {
    const fullDir = path.join(dataDir, d);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir);
    for (const f of files) {
        if (!f.endsWith('.json')) continue;
        const tests = JSON.parse(fs.readFileSync(path.join(fullDir, f), 'utf8'));
        
        for (const test of tests) {
            let subj = test.subject || 'İnformatika';
            if(subj === 'Informatika') subj = 'İnformatika';
            
            if (!offlineTests[subj]) offlineTests[subj] = [];
            
            const existingIndex = offlineTests[subj].findIndex(x => x.passport_id === test.passport);
            
            const optionsArr = [];
            let corrIdx = 0;
            const letters = ['A', 'B', 'C', 'D', 'E'];
            for (let i = 0; i < letters.length; i++) {
                if (test.options && test.options[letters[i]]) {
                    optionsArr.push(test.options[letters[i]]);
                    if (test.answer === letters[i]) {
                        corrIdx = optionsArr.length - 1;
                    }
                }
            }
            if(optionsArr.length === 0) continue;
            
            const mapped = {
                category: subj,
                question: test.question,
                options: optionsArr,
                correctAnswer: corrIdx,
                explanation: test.explanation,
                passport_id: test.passport,
                difficulty: getDiff(test.difficulty),
                topic: test.topic,
                bloomLevel: getBloom(test.bloom)
            };
            
            if (existingIndex !== -1) {
                mapped.id = offlineTests[subj][existingIndex].id;
                offlineTests[subj][existingIndex] = mapped;
            } else {
                maxId++;
                mapped.id = maxId;
                offlineTests[subj].push(mapped);
                added++;
            }
        }
    }
}

fs.writeFileSync(offlinePath, JSON.stringify(offlineTests, null, 2), 'utf8');
console.log('Added ' + added + ' new info 6 tests to offline_tests.json');
