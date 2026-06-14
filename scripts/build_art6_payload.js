const fs = require('fs');

const q = JSON.parse(fs.readFileSync('data/queue_tesviri_6.json', 'utf8'));
const subs = q.map((t, idx) => ({
    TypeName: 'sop_v3_test_generator',
    Role: 'Art6_T' + String(idx+1).padStart(2, '0'),
    Prompt: `Sinif: 6\nFənn: Təsviri incəsənət\nMövzu: ${t.topic_title}\nSəhifələr: ${t.start_page}-${t.end_page}\nBook ID: tesviri-incesenet-6\nTİK Prefix: ${t.passport_prefix}\nTələb: 15 test (5 sadə, 5 orta, 5 çətin).\n\n[DƏRSLİK MƏTNİ BAŞLADI]\n${t.text.substring(0, 4000)}\n[DƏRSLİK MƏTNİ BİTDİ]`
}));

fs.writeFileSync('data/subagents_payload.json', JSON.stringify({Subagents: subs}, null, 2));
console.log('Payload generated with ' + subs.length + ' agents.');
