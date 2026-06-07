const fs = require('fs');

const dbPath = './data/textbooks.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const targetSubjects = [
    'Fransız dili 5 (əsas xarici dil)',
    'İngilis dili 5 (ikinci xarici dil)',
    'Fransız dili 5 (ikinci xarici dil)',
    'Alman dili 5 (ikinci xarici dil)',
    'Alman dili 5 (əsas xarici dil)',
    'Rus dili 5 (ikinci xarici dil)'
];

const ignorePatterns = [
    /cild/i,
    /mündəricat/i,
    /içindəkilər/i,
    /giriş/i,
    /lüğət/i,
    /layihə/i,
    /işarələr/i,
    /ədəbiyyat/i,
    /istifadə edilmiş/i,
    /sözlük/i,
    /proqram/i,
    /vocabulary/i,
    /appendix/i,
    /grammar/i,
    /cədvəl/i,
    /révise/i,
    /lecture/i,
    /actes de parole/i,
    /dico visuel/i,
    /exercices/i,
    /Wiederholung/i,
    /Das kannst du jetzt/i,
    /Projektarbeit/i,
    /Training:/i,
    /Grammatik/i,
    /Lernwortschatz/i,
    /Wortliste/i,
    /Обобщающие задания/i,
    /Обобща́ющие зада́ния/i,
    /Словарь/i,
    /Слова́рь/i,
    /Сказки/i,
    /Ска́зки/i,
    /Übung/i,
    /Test/i
];

let result = {};
let allGood = true;
let consoleOutput = "";

targetSubjects.forEach(target => {
    let subjectObj = db['5'].find(x => x.title === target);
    if (!subjectObj) {
        consoleOutput += `SUBJECT NOT FOUND: ${target}\n`;
        return;
    }

    let allLines = subjectObj.topics.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let filteredLines = [];
    let ignoredLines = [];

    allLines.forEach(line => {
        let isIgnored = ignorePatterns.some(regex => regex.test(line));
        
        if (line.length <= 2 && !/[a-zA-Zа-яА-Я]/.test(line)) {
            isIgnored = true;
        }

        if (isIgnored) {
            ignoredLines.push(line);
        } else {
            filteredLines.push(line);
        }
    });

    let total = allLines.length;
    let ignored = ignoredLines.length;
    let percent = total === 0 ? 0 : (ignored / total) * 100;

    result[target] = {
        total,
        ignoredCount: ignored,
        percent: percent.toFixed(2),
        ignoredLines,
        filteredLines
    };
    
    consoleOutput += `\n[${target}]\nÜmumi mövzu: ${total}, Silinən: ${ignored} (${percent.toFixed(2)}%)\nSilinənlər:\n${ignoredLines.join('\n')}\n`;
    
    if (percent > 10) {
        allGood = false;
    }
});

fs.writeFileSync('fl_analysis_report.md', consoleOutput);
console.log('Report written to fl_analysis_report.md');
