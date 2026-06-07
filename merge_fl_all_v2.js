const fs = require('fs');

const dbPath = './data/offline_tests.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const lazyRegex = /all of the above|none of the above|a and b|b and c|hamısı doğru|heç biri|hər ikisi/i;

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

const map = [
    { name: 'Fransız dili 5 (ikinci xarici dil)', prefix: 'Fransız_', count: 26 },
    { name: 'Fransız dili 5 (əsas xarici dil)', prefix: 'fra_es_', count: 14 },
    { name: 'İngilis dili 5 (ikinci xarici dil)', prefix: 'İngilis_', count: 25 },
    { name: 'Rus dili 5 (ikinci xarici dil)', prefix: 'Rus_', count: 41 },
    { name: 'Alman dili 5 (əsas xarici dil)', prefix: 'Alman_Esas_', count: 38 },
    { name: 'Alman dili 5 (ikinci xarici dil)', prefix: 'Alman_Ikinci_', count: 32 }
];

const outputDir = 'C:/Users/User/OneDrive/Desktop/5-ci sinif testlər/';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

let totalGenerated = 0;

map.forEach(subject => {
    let allNew = [];
    console.log(`Processing: ${subject.name}`);
    for (let i = 1; i <= subject.count; i++) {
        let filePath = `./temp_tests_fl_v2/${subject.prefix}${i}.json`;
        if (fs.existsSync(filePath)) {
            let raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let cleaned = auditTests(raw);
            allNew = allNew.concat(cleaned);
        } else {
            console.log(`MISSING: ${filePath}`);
        }
    }
    
    if (!db[subject.name]) db[subject.name] = [];
    db[subject.name] = allNew; // For Foreign Languages, we are completely replacing since this is our only batch
    
    console.log(`Saved ${allNew.length} tests for ${subject.name}`);
    totalGenerated += allNew.length;
    
    // Export to MD
    let md = `# ${subject.name} - AI Sınaq Testləri (Version 2 - Təmizlənmiş)\n\n`;
    md += `> Bu fayl "Sərt Tənqidi Ekspertiza" qaydaları ilə audit edilmiş V2 sınaq testlərindən ibarətdir.\n`;
    md += `> Ümumi sınaq sayı: ${allNew.length}\n\n`;
    
    let letters = ['A', 'B', 'C', 'D'];
    allNew.forEach((t, index) => {
        md += `## TİK: ${t.passport_id || 'N/A'}\n\n`;
        md += `**Sual ${index + 1}:** ${t.question}\n\n`;
        if (t.options && Array.isArray(t.options)) {
            t.options.forEach((opt, i) => {
                md += `- **${letters[i]})** ${opt}\n`;
            });
        }
        md += `\n**Düzgün cavab:** ${letters[t.correctAnswer] || '?'}\n`;
        md += `**İzahı:** ${t.explanation || 'N/A'}\n`;
        md += `**TİK (Passport):** ${t.passport_id || 'N/A'}\n\n---\n\n`;
    });
    
    let filename = subject.name.replace(/ /g, '_').replace(/[()]/g, '') + '_AI_Testler_V2.md';
    fs.writeFileSync(outputDir + filename, md, 'utf8');
    console.log(`Exported to: ${outputDir}${filename}\n`);
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Grand Total Foreign Language Tests Added: ${totalGenerated}`);
