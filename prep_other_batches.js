const fs = require('fs');

const dbPath = './data/textbooks.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Subjects and their configs
const configs = {
    'Musiqi 5': { agent: 'music_test_generator_v2', prefix: '05-007-0101' },
    'Fiziki Tərbiyə 5': { agent: 'pe_test_generator_v2', prefix: '05-010-0101' },
    'Həyat Bilgisi 5': { agent: 'life_test_generator_v2', prefix: '05-008-0101' }
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
    let filePrefix = '';
    if (sub === 'Musiqi 5') filePrefix = 'Mus';
    else if (sub === 'Fiziki Tərbiyə 5') filePrefix = 'Pe';
    else if (sub === 'Həyat Bilgisi 5') filePrefix = 'Life';
    
    lines.forEach(line => {
        let isIgnored = ignorePatterns.some(regex => regex.test(line));
        if (line.length <= 2 && !/[a-zA-Zа-яА-Я]/.test(line)) isIgnored = true;
        
        if (!isIgnored) {
            let role = `${filePrefix} T${topicIndex}`;
            let tCode = `B01M${topicIndex.toString().padStart(2, '0')}`;
            let file = `temp_tests_other_v2/${filePrefix}_${topicIndex}.json`;
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

if (!fs.existsSync('temp_tests_other_v2')) {
    fs.mkdirSync('temp_tests_other_v2');
}

fs.writeFileSync('other_batches.json', JSON.stringify(allSubagents, null, 2));
