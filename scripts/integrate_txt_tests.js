const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/User/OneDrive/Desktop/7-cisinif testlər';
const dbPath = 'data/offline_tests.json';

let db = {};
if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt'));
let totalIntegrated = 0;

function parseTxt(content, subjectKey) {
    const questions = [];
    const blocks = content.split(/Sual \d+[:.]/i);
    
    // The first element is the header/topic info
    let currentTopic = 'Ümumi';
    
    for (let i = 1; i < blocks.length; i++) {
        let block = blocks[i];
        
        // Sometimes the topic is mentioned just before "Sual X."
        const prevBlock = blocks[i-1];
        const topicMatch = prevBlock.match(/(?:BÖLMƏ|Bölmə:)[^\n]+/gi);
        if (topicMatch) currentTopic = topicMatch[topicMatch.length - 1].replace(/Bölmə:/i, '').trim();

        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length === 0) continue;

        let questionText = lines[0];
        
        // Extract difficulty if present in the first line
        let difficulty = 'orta';
        const diffMatch = questionText.match(/\(Çətinlik:\s*(.*?)\)/i);
        if (diffMatch) {
            difficulty = diffMatch[1].toLowerCase();
            questionText = questionText.replace(diffMatch[0], '').trim();
        }

        const options = [];
        let correctIdx = 0;
        let explanation = '';

        // Extract options
        for (let j = 1; j < lines.length; j++) {
            const line = lines[j];
            if (line.match(/^[A-D]\)/)) {
                let optText = line.replace(/^[A-D]\)\s*/, '');
                
                // If the option line contains "Düzgün cavab:", we need to split it
                const answerIndex = optText.indexOf('Düzgün cavab:');
                if (answerIndex !== -1) {
                    const extra = optText.substring(answerIndex);
                    optText = optText.substring(0, answerIndex).trim();
                    
                    const correctLetterMatch = extra.match(/Düzgün cavab:\s*([A-D])/i);
                    if (correctLetterMatch) correctIdx = correctLetterMatch[1].toUpperCase().charCodeAt(0) - 65;
                    
                    const explanationMatch = extra.match(/İzahat:\s*(.*)/i);
                    if (explanationMatch) explanation = explanationMatch[1];
                }
                options.push(optText);
            } else if (line.match(/^Düzgün cavab:/i)) {
                const correctLetterMatch = line.match(/Düzgün cavab:\s*([A-D])/i);
                if (correctLetterMatch) correctIdx = correctLetterMatch[1].toUpperCase().charCodeAt(0) - 65;
                
                const explanationMatch = line.match(/İzahat:\s*(.*)/i);
                if (explanationMatch) explanation = explanationMatch[1];
            } else if (line.match(/^İzahat:/i)) {
                 explanation = line.replace(/^İzahat:/i, '').trim();
            }
        }

        if (options.length >= 2) {
            questions.push({
                id: questions.length + 1,
                question: questionText,
                options: options,
                correctAnswer: correctIdx,
                explanation: explanation || 'Doğru cavab',
                difficulty: difficulty,
                topic: currentTopic,
                bloomLevel: 'anlama',
                sourceContext: '> **Mənbə:** ' + subjectKey + ' - ' + currentTopic
            });
        }
    }
    return questions;
}

for (const file of files) {
    let subjectKey = '';
    const lower = file.toLowerCase();
    
    if (lower.includes("ingilis") || lower.includes("ing-7")) subjectKey = "İngilis dili 7";
    else if (lower.includes("azərbaycan dili") || lower.includes("azərbaycan_dili")) subjectKey = "Azərbaycan dili 7";
    else if (lower.includes("ədəbiyyat") || lower.includes("edebiyyat")) subjectKey = "Ədəbiyyat 7";
    else if (lower.includes("riyaziyyat")) subjectKey = "Riyaziyyat 7";
    else if (lower.includes("ümumi tarix") || lower.includes("ümumi_tarix")) subjectKey = "Ümumi tarix 7";
    else if (lower.includes("tarix") && lower.includes("azərbaycan")) subjectKey = "Azərbaycan tarixi 7";
    else if (lower.includes("fizika")) subjectKey = "Fizika 7";
    else if (lower.includes("kimya")) subjectKey = "Kimya 7";
    else if (lower.includes("biologiya")) subjectKey = "Biologiya 7";
    else if (lower.includes("informatika")) subjectKey = "İnformatika 7";
    else continue;

    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const qs = parseTxt(content, subjectKey);
    
    if (qs.length > 0) {
        if (!db[subjectKey]) db[subjectKey] = [];
        
        const topicGroups = {};
        for (const q of qs) {
            if (!topicGroups[q.topic]) topicGroups[q.topic] = [];
            topicGroups[q.topic].push(q);
        }
        
        for (const topic in topicGroups) {
            const existingTopic = db[subjectKey].find(t => t.topic_key === topic);
            if (existingTopic) {
                // Don't duplicate questions if we already added them in the previous buggy run
                const existingQuestionTexts = existingTopic.questions.map(x => x.question);
                for (const newQ of topicGroups[topic]) {
                    if (!existingQuestionTexts.includes(newQ.question)) {
                         existingTopic.questions.push(newQ);
                         totalIntegrated++;
                    }
                }
            } else {
                db[subjectKey].push({
                    topic_key: topic,
                    questions: topicGroups[topic]
                });
                totalIntegrated += topicGroups[topic].length;
            }
        }
        
        console.log(`Parsed ${qs.length} questions from ${file} into ${subjectKey}`);
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully merged ${totalIntegrated} NEW questions into offline_tests.json!`);
