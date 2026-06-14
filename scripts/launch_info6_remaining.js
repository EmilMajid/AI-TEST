const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '../data/clean_topics_informatika_6_final.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

const outDir = path.join(__dirname, '../data/info6_generated');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let remainingTopics = [];

topics.forEach((topic, i) => {
    const topicId = i + 1;
    const jsonPath = path.join(outDir, `topic_${topicId}.json`);
    if (!fs.existsSync(jsonPath)) {
        remainingTopics.push({ topicId, topic });
    }
});

console.log(`Remaining topics: ${remainingTopics.length}`);
console.log(remainingTopics.map(t => t.topicId).join(', '));

const payload = {
    "Subagents": remainingTopics.map(t => {
        const topicId = t.topicId;
        const topic = t.topic;
        const passport = `06-004-0101-B001-${topicId.toString().padStart(2, '0')}-`;
        const prompt = `Mövzu: ${topic.topic_title}. Mətn faylı: data/info6_chunks/topic_real_${topicId}.txt. TİK: ${passport}. 15 test (5 sadə, 5 orta, 5 çətin) yarat. Nəticəni \`write_to_file\` aləti ilə tam C:/Users/User/Downloads/azerbaijanaiplatform/data/info6_generated/topic_${topicId}.json faylına yaz. Mənə heç bir JSON kodu GÖNDƏRMƏ! Yalnız 'Hazırdır' mesajı göndər.`;
        return {
            "TypeName": "informatika_test_generator_6",
            "Role": `Info6_T${topicId}`,
            "Prompt": prompt
        };
    })
};

fs.writeFileSync(path.join(__dirname, 'payload_remaining.json'), JSON.stringify(payload, null, 2));
console.log('Wrote payload to scripts/payload_remaining.json');
