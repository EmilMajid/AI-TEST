const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/User/OneDrive/Desktop/7-cisinif testlər';
const dbPath = 'data/offline_tests.json';

let db = {};
if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

const files = fs.readdirSync(dir);
let totalParsed = 0;

function parseMarkdown(content, subjectName) {
    const questions = [];
    const blocks = content.split('**Sual').slice(1);
    
    for (const block of blocks) {
        try {
            const lines = block.split('\n').map(l => l.trim()).filter(l => l);
            const header = lines[0]; // e.g. "1:** (Səviyyə: Asan) Mövzu: "ENGLISH". English qaydalarına əsasən..."
            
            const levelMatch = header.match(/Səviyyə:\s*([^)]+)/);
            const diffRaw = levelMatch ? levelMatch[1].toLowerCase() : 'orta';
            let difficulty = diffRaw;
            if (difficulty.includes('asan') || difficulty.includes('sadə')) difficulty = 'sadə';
            else if (difficulty.includes('çətin')) difficulty = 'çətin';
            else difficulty = 'orta';

            const topicMatch = header.match(/Mövzu:\s*"([^"]+)"/);
            const topic = topicMatch ? topicMatch[1] : 'Ümumi';

            let questionText = header.replace(/^[^:]+:\*\*\s*(?:\([^)]+\))?\s*(?:Mövzu:\s*"[^"]+"\.)?/, '').trim();
            if (questionText.startsWith('Mövzu:')) {
                 questionText = questionText.replace(/Mövzu:\s*"[^"]+"\./, '').trim();
            }

            const options = [];
            let correctAnswerIdx = 0;
            let explanation = '';
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (line.match(/^-?\s*[A-D]\)/)) {
                    options.push(line.replace(/^-?\s*[A-D]\)\s*/, '').trim());
                } else if (line.startsWith('**Düzgün cavab:**')) {
                    const ansLetterMatch = line.match(/\*\*\s*([A-D])\)/);
                    if (ansLetterMatch) {
                        const letter = ansLetterMatch[1];
                        correctAnswerIdx = letter.charCodeAt(0) - 65;
                    }
                } else if (line.startsWith('**İzahat:**')) {
                    explanation = line.replace('**İzahat:**', '').trim();
                }
            }

            if (options.length >= 2) {
                questions.push({
                    id: questions.length + 1,
                    question: questionText,
                    options: options,
                    correctAnswer: correctAnswerIdx,
                    explanation: explanation,
                    difficulty: difficulty,
                    topic: topic,
                    bloomLevel: 'anlama'
                });
            }
        } catch (e) {
            console.error("Error parsing block", e);
        }
    }
    return questions;
}

for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    let subjectKey = '';
    const lower = file.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i");
    
    if (lower.includes("ingilis") || lower.includes("english")) subjectKey = "İngilis dili 7";
    else if (lower.includes("fransız") || lower.includes("fransiz")) subjectKey = "Fransız dili 7";
    else if (lower.includes("alman")) subjectKey = "Alman dili 7";
    else if (lower.includes("rus") || lower.includes("русский")) subjectKey = "Русский язык 7";
    else if (lower.includes("azərbaycan_dili") || lower.includes("azərbaycan dili")) subjectKey = "Azərbaycan dili 7";
    else if (lower.includes("_dəbiyyat") || lower.includes("ədəbiyyat") || lower.includes("edebiyyat")) subjectKey = "Ədəbiyyat 7";
    else if (lower.includes("riyaziyyat")) subjectKey = "Riyaziyyat 7";
    else if (lower.includes("ümumi_tarix") || lower.includes("ümumi tarix")) subjectKey = "Ümumi tarix 7";
    else if (lower.includes("zəfər")) subjectKey = "Zəfər tarixi 7";
    else if (lower.includes("tarix")) subjectKey = "Azərbaycan tarixi 7";
    else if (lower.includes("fizika")) subjectKey = "Fizika 7";
    else if (lower.includes("kimya")) subjectKey = "Kimya 7";
    else if (lower.includes("biologiya")) subjectKey = "Biologiya 7";
    else if (lower.includes("coğrafiya")) subjectKey = "Coğrafiya 7";
    else if (lower.includes("_nformatika") || lower.includes("informatika")) subjectKey = "İnformatika 7";
    else if (lower.includes("texnologiya")) subjectKey = "Texnologiya 7";
    else if (lower.includes("təsviri")) subjectKey = "Təsviri incəsənət 7";
    else if (lower.includes("musiqi")) subjectKey = "Musiqi 7";
    else continue;

    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const qs = parseMarkdown(content, subjectKey);
    
    if (qs.length > 0) {
        if (!db[subjectKey]) db[subjectKey] = [];
        
        // Group by topic
        const topicGroups = {};
        for (const q of qs) {
            if (!topicGroups[q.topic]) topicGroups[q.topic] = [];
            topicGroups[q.topic].push(q);
        }
        
        for (const topic in topicGroups) {
            db[subjectKey].push({
                topic_key: topic,
                questions: topicGroups[topic]
            });
        }
        
        console.log(`Parsed ${qs.length} questions from ${file} into ${subjectKey}`);
        totalParsed += qs.length;
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully merged ${totalParsed} questions into offline_tests.json!`);
