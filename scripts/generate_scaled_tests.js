const fs = require('fs');
const path = require('path');

const CHUNKS_FILE = path.join(__dirname, '../data/textbook-chunks.jsonl');
const QUEUE_FILE = path.join(__dirname, '../data/test_generation_queue_6.json');
const DESKTOP_DIR = 'C:\\Users\\User\\OneDrive\\Desktop\\6-cı sinif testləri';

if (!fs.existsSync(DESKTOP_DIR)) {
    fs.mkdirSync(DESKTOP_DIR, { recursive: true });
}

const bannedSubjects = ['Musiqi', 'Təsviri incəsənət', 'Fiziki tərbiyə'];

function getLevelLogic(textLength) {
    if (textLength < 500) return { level: 1, count: 15, breakdown: '5 sadə, 5 orta, 5 çətin' };
    if (textLength < 1000) return { level: 2, count: 18, breakdown: '6 sadə, 6 orta, 6 çətin' };
    if (textLength < 1500) return { level: 3, count: 21, breakdown: '7 sadə, 7 orta, 7 çətin' };
    if (textLength < 2000) return { level: 4, count: 24, breakdown: '8 sadə, 8 orta, 8 çətin' };
    if (textLength < 2500) return { level: 5, count: 27, breakdown: '9 sadə, 9 orta, 9 çətin' };
    return { level: 6, count: 30, breakdown: '10 sadə, 10 orta, 10 çətin' };
}

function main() {
    const lines = fs.readFileSync(CHUNKS_FILE, 'utf8').split('\n');
    const queue = [];
    let topicCounter = 1;

    for (let l of lines) {
        if (!l.trim()) continue;
        try {
            const j = JSON.parse(l);
            // Filtrləmə: Yalnız Təbiət 6 üçün qurun (Sınaq üçün)
            if (parseInt(j.grade) === 6 && !bannedSubjects.includes(j.subject) && j.subject === 'Təbiət') {
                const logic = getLevelLogic(j.text.length);
                const topicNum = String(topicCounter).padStart(3, '0');
                
                queue.push({
                    chunkIndex: topicCounter,
                    subject: j.subject,
                    text: j.text,
                    length: j.text.length,
                    level: logic.level,
                    count: logic.count,
                    breakdown: logic.breakdown,
                    passportPrefix: `06-003-0101-B${topicNum}-01-` // 003 = Təbiət
                });
                
                topicCounter++;
            }
        } catch(e) {}
    }

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    console.log(`✅ Növbə uğurla yaradıldı! Cəmi ${queue.length} tapşırıq '${QUEUE_FILE}' faylına yazıldı.`);
    
    // Növbədəki ilk 3 elementin xülasəsi
    console.log("\nİlk 3 tapşırıq:");
    for (let i = 0; i < Math.min(3, queue.length); i++) {
        console.log(`- Abzas ${queue[i].chunkIndex}: ${queue[i].length} simvol -> Səviyyə ${queue[i].level} (${queue[i].count} test)`);
    }
}

main();
