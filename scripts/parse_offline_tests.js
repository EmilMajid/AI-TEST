const fs = require('fs');
const path = require('path');

const artifactsDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\31d778bc-7ad4-4a0d-b9f4-d0e41b1455c7\\artifacts';
const outputFilePath = path.join(__dirname, '..', 'data', 'offline_tests.json');

const filesToParse = [
    { file: 'english-7-tests.md', subjectKey: 'İngilis dili' },
    { file: 'azerbaycan-dili-7-tests.md', subjectKey: 'Azərbaycan dili' },
    { file: 'edebiyyat-7-tests.md', subjectKey: 'Ədəbiyyat' },
    { file: 'riyaziyyat-7-tests-hisse1.md', subjectKey: 'Riyaziyyat' },
    { file: 'riyaziyyat-7-tests-hisse2.md', subjectKey: 'Riyaziyyat' }
];

const db = {};

function parseFile(fileName, subjectKey) {
    const filePath = path.join(artifactsDir, fileName);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Split into Part I (Questions) and Part II (Answers)
    const parts = content.split(/## II Hissə: Cavablar və İzahatlar|## II Hissə: Cavablar/);
    if (parts.length < 2) {
        console.warn(`Could not split into questions and answers for ${fileName}`);
        return;
    }

    const qPart = parts[0];
    const aPart = parts[1];

    if (!db[subjectKey]) {
        db[subjectKey] = {};
    }

    // Process questions
    // Split by topics: ### TOPIC NAME
    const topicSections = qPart.split(/###\s+(.+)/).slice(1);
    
    for (let i = 0; i < topicSections.length; i += 2) {
        let topicName = topicSections[i].trim();
        // Remove prefixes like "BÖLMƏ 1. " or "UNIT 1. " if needed, but the user selects from dropdown. 
        // Actually the dropdown might just say the pure topic name or with chapter. Let's keep the full topicName for now.
        // Or wait, `data/textbooks.json` has specific strings. Let's just keep the topic name as it is in MD. 
        // The API can do a fuzzy match.
        const questionsText = topicSections[i+1];
        
        if (!db[subjectKey][topicName]) {
            db[subjectKey][topicName] = [];
        }

        const qBlocks = questionsText.split(/\*\*Sual \d+\.\*\*/).slice(1);
        
        qBlocks.forEach((block, index) => {
            const lines = block.trim().split('\n').filter(l => l.trim() !== '');
            const firstLine = lines[0].trim();
            const qMatch = firstLine.match(/(.*?)\(Çətinlik:\s*\*?([^*)]+)\*?\)/);
            
            let questionText = firstLine;
            let difficulty = "orta";
            if (qMatch) {
                questionText = qMatch[1].trim();
                difficulty = qMatch[2].trim().toLowerCase();
            }

            const options = [];
            lines.forEach(l => {
                if (l.trim().match(/^- [A-D]\)/)) {
                    options.push(l.trim().substring(2).trim());
                }
            });

            db[subjectKey][topicName].push({
                id: index + 1,
                question: questionText,
                options: options,
                difficulty: difficulty,
                topic: topicName,
                bloomLevel: "Anlama", // Default
                correctAnswer: 0,
                explanation: "",
                sourceContext: ""
            });
        });
    }

    // Process answers
    const ansTopicSections = aPart.split(/###\s+(.+)/).slice(1);
    for (let i = 0; i < ansTopicSections.length; i += 2) {
        let topicName = ansTopicSections[i].trim();
        const answersText = ansTopicSections[i+1];
        
        if (!db[subjectKey][topicName]) {
            continue;
        }

        const aBlocks = answersText.split(/\*\*Sual \d+ Cavabı:\*\*/).slice(1);
        
        aBlocks.forEach((block, index) => {
            if (db[subjectKey][topicName][index]) {
                const lines = block.trim().split('\n').filter(l => l.trim() !== '');
                const ansLetter = lines[0].trim().charAt(0); // A, B, C, D
                const correctIndex = ansLetter.charCodeAt(0) - 65;
                
                db[subjectKey][topicName][index].correctAnswer = correctIndex;

                let explanation = "";
                let sourceContext = "";
                lines.forEach(l => {
                    if (l.startsWith('**İzahat:**')) {
                        explanation = l.replace('**İzahat:**', '').trim();
                    } else if (l.startsWith('> **Orijinal Mətn')) {
                        sourceContext = l.replace(/> \*\*Orijinal Mətn.*?\*\*:/, '').trim();
                    } else if (l.startsWith('>')) {
                        sourceContext += ' ' + l.substring(1).trim();
                    }
                });

                db[subjectKey][topicName][index].explanation = explanation;
                db[subjectKey][topicName][index].sourceContext = sourceContext.replace(/^"|"$/g, '').trim();
            }
        });
    }
}

filesToParse.forEach(f => parseFile(f.file, f.subjectKey));

// Normalize topics to make them easier to match
const normalizedDb = {};
for (const subject in db) {
    normalizedDb[subject] = [];
    for (const topic in db[subject]) {
        normalizedDb[subject].push({
            topic_key: topic,
            questions: db[subject][topic]
        });
    }
}

fs.writeFileSync(outputFilePath, JSON.stringify(normalizedDb, null, 2), 'utf-8');
console.log(`Parsed successfully. Output written to ${outputFilePath}`);
