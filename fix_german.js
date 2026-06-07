const fs = require('fs');

const dbPath = './data/textbooks.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Subjects and their configs
const configs = {
    'Alman dili 5 (əsas xarici dil)': { agent: 'ger_test_generator_v2', prefix: '05-012-0101', remove: ['Wortliste', 'Projektarbeit: Wir und die Wochentage', 'Projektarbeit: Was wissen wir über unsere Freunde?'], filePrefix: 'Alman_Esas_' },
    'Alman dili 5 (ikinci xarici dil)': { agent: 'ger_test_generator_v2', prefix: '05-014-0101', remove: ['Projektarbeit: Was mögen unsere Freunde?', 'Training: Lesen', 'Training: Schreiben', 'Training: Hören', 'Training: Sprechen', 'Grammatik mit Tabellen', 'Lernwortschatz'], filePrefix: 'Alman_Ikinci_' }
};

const ignorePatterns = [
    /^cild$/i,
    /^mündəricat$/i,
    /^içindəkilər$/i,
    /^giriş$/i,
    /^lüğət$/i,
    /^layihə/i,
    /işarələr/i,
    /^ədəbiyyat$/i,
    /^istifadə edilmiş/i,
    /^sözlük$/i,
    /^proqram$/i,
    /vocabulary/i,
    /appendix/i,
    /grammar/i,
    /cədvəl/i
];

let allSubagents = [];

Object.keys(configs).forEach(sub => {
    let cfg = configs[sub];
    let subjectObj = db['5'].find(x => x.title === sub);
    if(!subjectObj) return;
    
    let lines = subjectObj.topics.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let topicIndex = 1;
    lines.forEach(line => {
        let isIgnored = ignorePatterns.some(regex => regex.test(line));
        if (line.length <= 2 && !/[a-zA-Zа-яА-Я]/.test(line)) isIgnored = true;
        
        if (cfg.remove.includes(line)) isIgnored = true;
        cfg.remove.forEach(rm => {
            if (line.toLowerCase().includes(rm.toLowerCase())) isIgnored = true;
        });

        if (!isIgnored) {
            let role = `${cfg.filePrefix} T${topicIndex}`;
            let tCode = `B01M${topicIndex.toString().padStart(2, '0')}`;
            let file = `temp_tests_fl_v2/${cfg.filePrefix}${topicIndex}.json`;
            allSubagents.push({
                TypeName: cfg.agent,
                Role: role,
                Prompt: `Mövzu: ${line}. Fayl: C:/Users/User/Downloads/azerbaijanaiplatform/${file}. TİK prefixi: ${cfg.prefix}-${tCode}. 15 test (5 sadə, 5 orta, 5 çətin) yarat. Sonda 'Hazırdır' yaz.`
            });
            topicIndex++;
        }
    });
});

fs.writeFileSync('german_batches.json', JSON.stringify(allSubagents, null, 2));
console.log(`Generated ${allSubagents.length} german agents.`);
