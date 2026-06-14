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
const dirs = ['aztarixi6_chunks_generated', 'umumitarix6_chunks_generated'];

function getDiff(d) {
    if(d === 'sadə') return 'easy';
    if(d === 'orta') return 'medium';
    if(d === 'çətin') return 'hard';
    return 'medium';
}

function getBloom(b) {
    if(b === 'bilik') return 'knowledge';
    if(b === 'anlama') return 'comprehension';
    if(b === 'tətbiq') return 'application';
    if(b === 'təhlil') return 'analysis';
    if(b === 'sintez') return 'synthesis';
    if(b === 'dəyərləndirmə') return 'evaluation';
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
            let subj = test.subject;
            if (!offlineTests[subj]) offlineTests[subj] = [];
            
            const existingIndex = offlineTests[subj].findIndex(x => x.passport_id === test.passport);
            
            const optionsArr = [];
            let corrIdx = 0;
            const letters = ['A', 'B', 'C', 'D', 'E'];
            for (let i = 0; i < letters.length; i++) {
                if (test.options[letters[i]]) {
                    optionsArr.push(test.options[letters[i]]);
                    if (test.answer === letters[i]) {
                        corrIdx = optionsArr.length - 1;
                    }
                }
            }
            
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
console.log('Added ' + added + ' new history 6 tests to offline_tests.json');
