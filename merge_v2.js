const fs = require('fs');
const path = require('path');

const targetFiles = [
    './temp_tests_az_v2/az1.json',
    './temp_tests_az_v2/az2.json',
    './temp_tests_math_v2/math1.json',
    './temp_tests_math_v2/math2.json',
    './temp_tests_math_v2/math3.json'
];
const dbPath = './data/offline_tests.json';

const lazyRegex = /hamısı doğru|heç biri|a və b|b və c/i;

function cleanAgentTests(tests) {
    return tests.filter(test => {
        if (!test.question || !test.options || test.options.length !== 4) return false;
        if (test.correctAnswer < 0 || test.correctAnswer > 3) return false;
        for (let opt of test.options) {
            if (lazyRegex.test(opt)) return false;
        }
        let correctLength = test.options[test.correctAnswer].length;
        let otherLengths = test.options.filter((_, idx) => idx !== test.correctAnswer).map(o => o.length);
        let maxOther = Math.max(...otherLengths);
        if (correctLength > 40 && correctLength > maxOther * 3) return false;
        return true;
    });
}

function mergeAll() {
    let allExist = targetFiles.every(f => fs.existsSync(f));
    if (!allExist) {
        console.log("Not all files exist yet. Waiting...");
        return;
    }
    
    console.log("All V2 temporary files found! Merging...");
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Process AZ
    let azFiles = ['./temp_tests_az_v2/az1.json', './temp_tests_az_v2/az2.json'];
    let newAzTests = [];
    for(let f of azFiles) {
        let raw = JSON.parse(fs.readFileSync(f, 'utf8'));
        newAzTests = newAzTests.concat(cleanAgentTests(raw));
    }
    db['Azərbaycan dili'] = newAzTests.concat(db['Azərbaycan dili']);
    
    // Process Math
    let mathFiles = ['./temp_tests_math_v2/math1.json', './temp_tests_math_v2/math2.json', './temp_tests_math_v2/math3.json'];
    let newMathTests = [];
    for(let f of mathFiles) {
        let raw = JSON.parse(fs.readFileSync(f, 'utf8'));
        newMathTests = newMathTests.concat(cleanAgentTests(raw));
    }
    db['Riyaziyyat'] = newMathTests.concat(db['Riyaziyyat']);
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Successfully merged ${newAzTests.length} Az tests and ${newMathTests.length} Math tests!`);
}

mergeAll();
