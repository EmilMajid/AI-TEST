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
for (let i = 1; i <= 27; i++) {
    let filePath = `./temp_tests_lit_v2/lit${i}.json`;
    if (fs.existsSync(filePath)) {
        let raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let cleaned = auditTests(raw);
        console.log(`lit${i}.json: ${raw.length} -> ${cleaned.length} (${raw.length - cleaned.length} rejected)`);
        allNew = allNew.concat(cleaned);
    }
}

if (!db['Ədəbiyyat']) db['Ədəbiyyat'] = [];
db['Ədəbiyyat'] = db['Ədəbiyyat'].concat(allNew);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`\nTotal new Ədəbiyyat tests added: ${allNew.length}`);

// Export to MD
const outputDir = 'C:/Users/User/OneDrive/Desktop/5-ci sinif testlər/';
let md = `# Ədəbiyyat 5 - AI Sınaq Testləri (Version 2 - Təmizlənmiş)\n\n`;
md += `> Bu fayl "Sərt Tənqidi Ekspertiza" qaydaları ilə audit edilmiş V2 sınaq testlərindən ibarətdir.\n`;
md += `> Ümumi sınaq sayı: ${db['Ədəbiyyat'].length}\n\n`;

let letters = ['A', 'B', 'C', 'D'];
db['Ədəbiyyat'].forEach((t, index) => {
    md += `## TİK: ${t.passport_id || 'N/A'}\n`;
    md += `**Mövzu:** ${t.topic || 'N/A'}\n\n`;
    md += `**Sual ${index + 1}:** ${t.question}\n\n`;
    if (t.options && Array.isArray(t.options)) {
        t.options.forEach((opt, i) => {
            md += `- **${letters[i]})** ${opt}\n`;
        });
    }
    md += `\n**Doğru Cavab:** ${letters[t.correctAnswer] || '?'}\n`;
    md += `**İzahat:** ${t.explanation || 'N/A'}\n\n---\n\n`;
});

fs.writeFileSync(outputDir + 'Ədəbiyyat_5_AI_Testler_V2.md', md, 'utf8');
console.log(`\nMD file exported to: ${outputDir}Ədəbiyyat_5_AI_Testler_V2.md`);
