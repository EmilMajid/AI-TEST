const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/queue_tebiet_6_real.json', 'utf8'));

if (!fs.existsSync('data/tebiet6_generated')) {
    fs.mkdirSync('data/tebiet6_generated', { recursive: true });
}

const subs = q.map((t, idx) => {
    return {
        TypeName: 'tebiet_generator',
        Role: 'Nat6_T' + String(idx+1).padStart(2, '0'),
        Prompt: `Mövzu: ${t.topic_title}. Mətn faylı: data/tebiet6_chunks/topic_real_${idx+1}.txt. TİK: ${t.passport_prefix}. 15 test (5 sadə, 5 orta, 5 çətin) yarat. Nəticəni \`write_to_file\` aləti ilə tam C:/Users/User/Downloads/azerbaijanaiplatform/data/tebiet6_generated/topic_${idx+1}.json faylına yaz. Mənə heç bir JSON kodu GÖNDƏRMƏ! Yalnız 'Hazırdır' mesajı göndər.`
    };
});

fs.writeFileSync('data/batch1.json', JSON.stringify(subs.slice(0, 20), null, 2));
fs.writeFileSync('data/batch2.json', JSON.stringify(subs.slice(20, 40), null, 2));
fs.writeFileSync('data/batch3.json', JSON.stringify(subs.slice(40, 60), null, 2));
fs.writeFileSync('data/batch4.json', JSON.stringify(subs.slice(60, 81), null, 2));

console.log('Fixed batches created with write_to_file prompt.');
