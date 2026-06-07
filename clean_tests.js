const fs = require('fs');
const dbPath = './data/offline_tests.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let totalDeleted = 0;
let deletedByReason = {
    empty: 0,
    olympiad: 0,
    lazyOptions: 0,
    imbalancedOptions: 0,
    invalidIndex: 0
};

const olympiadTiks = [
    '05-004-0101-B1F01-02-02-012',
    '05-004-0101-B1F01-03-03-021',
    '05-004-0101-B1F01-03-03-022',
    '05-004-0101-B1F01-03-03-025',
    '05-004-0101-B1F01-03-03-029',
    '05-004-0101-B1F02-03-03-026'
];

const lazyRegex = /hamısı doğru|heç biri|a və b|b və c/i;

function cleanSubject(tests, subjectName) {
    if (!tests) return [];
    let initialCount = tests.length;
    let validTests = [];
    
    for (let test of tests) {
        // 1. Empty Object Check
        if (!test.question || !test.options || !Array.isArray(test.options) || test.options.length !== 4 || test.correctAnswer === undefined || !test.passport_id) {
            deletedByReason.empty++;
            continue;
        }

        // 2. Olympiad TIK Check
        if (olympiadTiks.includes(test.passport_id)) {
            deletedByReason.olympiad++;
            continue;
        }

        // 3. Lazy Options Check (Hamisi dogrudur, etc)
        let hasLazyOption = false;
        for (let opt of test.options) {
            if (lazyRegex.test(opt)) {
                hasLazyOption = true;
                break;
            }
        }
        if (hasLazyOption) {
            deletedByReason.lazyOptions++;
            continue;
        }

        // 4. Invalid Index
        if (test.correctAnswer < 0 || test.correctAnswer > 3) {
            deletedByReason.invalidIndex++;
            continue;
        }

        // 5. Length Balance (Visual Clue check)
        // If the correct option is significantly longer than the max of other options (e.g. > 3x)
        let correctLength = test.options[test.correctAnswer].length;
        let otherLengths = test.options.filter((_, idx) => idx !== test.correctAnswer).map(o => o.length);
        let maxOther = Math.max(...otherLengths);
        if (correctLength > 40 && correctLength > maxOther * 3) {
            deletedByReason.imbalancedOptions++;
            continue;
        }

        // Specific Math Fix
        if (test.passport_id === '05-004-0101-B1F01-01-01-010' && test.question.includes('0 natural ədəd deyil')) {
            if (!test.question.includes('kurikulum')) {
                test.question = test.question + ' (Azərbaycan Respublikası kurikulumuna əsasən)';
            }
        }

        validTests.push(test);
    }
    
    console.log(`${subjectName}: Reduced from ${initialCount} to ${validTests.length}`);
    totalDeleted += (initialCount - validTests.length);
    return validTests;
}

for (let subj in db) {
    db[subj] = cleanSubject(db[subj], subj);
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('Total deleted:', totalDeleted);
console.log('Stats:', JSON.stringify(deletedByReason, null, 2));
