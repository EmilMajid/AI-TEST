const fs = require('fs');

const dbPath = './data/offline_tests.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const lazyRegex = /all of the above|none of the above|a and b|b and c|hamısı doğru|heç biri/i;

function auditTests(tests) {
    return tests.filter(test => {
        if (!test.question || !test.options || test.options.length !== 4 || test.correctAnswer === undefined || !test.passport_id) return false;
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

let allNew = [];
for (let i = 1; i <= 8; i++) {
    let filePath = `./temp_tests_eng_v2/eng${i}.json`;
    if (fs.existsSync(filePath)) {
        let raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let cleaned = auditTests(raw);
        console.log(`eng${i}.json: ${raw.length} -> ${cleaned.length} (${raw.length - cleaned.length} rejected)`);
        allNew = allNew.concat(cleaned);
    } else {
        console.log(`eng${i}.json NOT FOUND!`);
    }
}

if (!db['İngilis dili']) db['İngilis dili'] = [];
db['İngilis dili'] = db['İngilis dili'].concat(allNew);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`\nTotal new English tests added: ${allNew.length}`);
console.log(`Total English tests in DB: ${db['İngilis dili'].length}`);

// Export to MD
const outputDir = 'C:/Users/User/OneDrive/Desktop/5-ci sinif testlər/';
let md = `# İngilis Dili 5 - AI Sınaq Testləri (Version 2 - Təmizlənmiş)\n\n`;
md += `> Bu fayl "Sərt Tənqidi Ekspertiza" qaydaları ilə audit edilmiş V2 sınaq testlərindən ibarətdir.\n`;
md += `> Ümumi sınaq sayı: ${db['İngilis dili'].length}\n\n`;

let letters = ['A', 'B', 'C', 'D'];
db['İngilis dili'].forEach((t, index) => {
    md += `## TİK: ${t.passport_id || 'N/A'}\n\n`;
    md += `**Question ${index + 1}:** ${t.question}\n\n`;
    if (t.options && Array.isArray(t.options)) {
        t.options.forEach((opt, i) => {
            md += `- **${letters[i]})** ${opt}\n`;
        });
    }
    md += `\n**Correct Answer:** ${letters[t.correctAnswer] || '?'}\n`;
    md += `**Explanation:** ${t.explanation || 'N/A'}\n`;
    md += `**Passport (TİK):** ${t.passport_id || 'N/A'}\n\n---\n\n`;
});

fs.writeFileSync(outputDir + 'İngilis_Dili_5_AI_Testler_V2.md', md, 'utf8');
console.log(`\nMD file exported to: ${outputDir}İngilis_Dili_5_AI_Testler_V2.md`);
