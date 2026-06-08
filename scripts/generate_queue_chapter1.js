const fs = require('fs');
const path = require('path');

const CHUNKS_FILE = path.join(__dirname, '../data/textbook-chunks.jsonl');
const QUEUE_FILE = path.join(__dirname, '../data/test_generation_queue_6_chap1.json');

const keywords = [
    { title: '1.1 Qüvvənin təsiri nədən asılıdır', key: '. Qüvvənin təsiri' },
    { title: '1.2 Ağırlıq qüvvəsi', key: '. Ağırlıq qüvvəsi' },
    { title: '1.3 Sürtünmə qüvvəsi', key: '. Sürtünmə qüvvəsi' },
    { title: '1.4 Arximed qüvvəsi', key: '. Arximed qüvvəsi' },
    { title: '1.5 Tarazlaşan və tarazlaşmayan qüvvələr', key: '. Tarazlaşan və tarazlaşmayan' }
];

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
    const topics = [];
    let currentTopic = null;
    let topicIndex = 0;

    for (let l of lines) {
        if (!l.trim()) continue;
        try {
            const j = JSON.parse(l);
            if (parseInt(j.grade) === 6 && j.subject === 'Təbiət') {
                const text = j.text.trim();
                
                const matchedKeyword = keywords.find(k => text.startsWith(k.key));
                
                if (matchedKeyword) {
                    if (currentTopic) {
                        topics.push(currentTopic);
                    }
                    currentTopic = {
                        title: matchedKeyword.title,
                        text: text,
                        topicId: ++topicIndex
                    };
                } else if (currentTopic) {
                    // Only break if we are ALREADY collecting topics and we hit the end markers
                    if (text.startsWith('Xülasə') || text.includes('Ümumiləşdirici tapşırıqlar')) {
                        break;
                    }
                    currentTopic.text += '\n\n' + text;
                }
            }
        } catch(e) {}
    }

    if (currentTopic) topics.push(currentTopic);

    const queue = topics.map(t => {
        const logic = getLevelLogic(t.text.length);
        const topicNum = String(t.topicId).padStart(3, '0');
        return {
            title: t.title,
            text: t.text,
            length: t.text.length,
            level: logic.level,
            count: logic.count,
            breakdown: logic.breakdown,
            passportPrefix: `06-003-0101-B${topicNum}-01-`
        };
    });

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    console.log(`✅ Fəsil 1 Növbəsi yaradıldı! Cəmi ${queue.length} mövzu 'test_generation_queue_6_chap1.json' faylına yazıldı.`);
    queue.forEach(q => console.log(`- ${q.title}: ${q.length} simvol -> Səviyyə ${q.level} (${q.count} test)`));
}

main();
