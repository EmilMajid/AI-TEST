const fs = require('fs');

const dbPath = './data/textbooks.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Subjects and their configs
const configs = {
    'Fransız dili 5 (əsas xarici dil)': { agent: 'fra_test_generator_v2', prefix: '05-015-0101', remove: [] },
    'İngilis dili 5 (ikinci xarici dil)': { agent: 'eng_test_generator_v2', prefix: '05-011-0101', remove: [] },
    'Fransız dili 5 (ikinci xarici dil)': { agent: 'fra_test_generator_v2', prefix: '05-016-0101', remove: ['Mes actes de parole', 'Mon dico visuel'] },
    'Alman dili 5 (ikinci xarici dil)': { agent: 'ger_test_generator_v2', prefix: '05-014-0101', remove: ['Projektarbeit: Was mögen unsere Freunde?', 'Training: Lesen', 'Training: Schreiben', 'Training: Hören', 'Training: Sprechen', 'Grammatik mit Tabellen', 'Lernwortschatz'] },
    'Alman dili 5 (əsas xarici dil)': { agent: 'ger_test_generator_v2', prefix: '05-012-0101', remove: ['Wortliste', 'Projektarbeit: Wir und die Wochentage', 'Projektarbeit: Was wissen wir über unsere Freunde?'] },
    'Rus dili 5 (ikinci xarici dil)': { agent: 'rus_test_generator_v2', prefix: '05-013-0201', remove: ['Слова́рь - Lüğət'] }
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
        
        // Exact match user exclusions
        if (cfg.remove.includes(line)) isIgnored = true;
        
        // Let's also check substring for user exclusions just in case
        cfg.remove.forEach(rm => {
            if (line.toLowerCase().includes(rm.toLowerCase())) isIgnored = true;
        });

        if (!isIgnored) {
            let role = `${sub.split(' ')[0]} T${topicIndex}`;
            let tCode = `B01M${topicIndex.toString().padStart(2, '0')}`;
            let file = `temp_tests_fl_v2/${sub.split(' ')[0]}_${topicIndex}.json`;
            allSubagents.push({
                TypeName: cfg.agent,
                Role: role,
                Prompt: `Mövzu: ${line}. Fayl: C:/Users/User/Downloads/azerbaijanaiplatform/${file}. TİK prefixi: ${cfg.prefix}-${tCode}. 15 test (5 sadə, 5 orta, 5 çətin) yarat. Sonda 'Hazırdır' yaz.`
            });
            topicIndex++;
        }
    });
});

console.log(`Total agents to launch: ${allSubagents.length}`);

// Split into batches of 30
let batches = [];
for (let i = 0; i < allSubagents.length; i += 30) {
    batches.push(allSubagents.slice(i, i + 30));
}

batches.forEach((b, idx) => {
    fs.writeFileSync(`batch_${idx+1}.json`, JSON.stringify(b, null, 2));
    console.log(`Wrote batch_${idx+1}.json with ${b.length} agents`);
});
