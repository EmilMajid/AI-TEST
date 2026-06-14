const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const topicsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'clean_topics_informatika_6_final.json'), 'utf8'));

const payload = [];

topicsData.forEach(t => {
    // Generate Prompt
    const prompt = `Mövzu: ${t.topic_title}. Mətn faylı: data/info6_chunks/topic_real_${t.topic_id}.txt. TİK: 06-004-0101-B001-${t.topic_id.toString().padStart(2, '0')}-. 15 test (5 sadə, 5 orta, 5 çətin) yarat. Nəticəni \`write_to_file\` aləti ilə tam C:/Users/User/Downloads/azerbaijanaiplatform/data/info6_generated/topic_${t.topic_id}.json faylına yaz. Mənə heç bir JSON kodu GÖNDƏRMƏ! Yalnız 'Hazırdır' mesajı göndər.`;
    
    payload.push({
        TypeName: "informatika_test_generator_6",
        Role: `Info6_T${t.topic_id}`,
        Prompt: prompt
    });
});

fs.writeFileSync(path.join(dataDir, 'subagents_payload_info6.json'), JSON.stringify(payload, null, 2), 'utf8');
console.log(`Payload created with ${payload.length} subagents.`);
