const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/queue_tebiet_6_real.json', 'utf8'));

const subs = q.map((t, idx) => {
    return {
        TypeName: 'sop_v3_test_generator',
        Role: 'Nat6_T' + String(idx+1).padStart(2, '0'),
        Prompt: `Mövzu: ${t.topic_title}\nFayl: data/tebiet6_chunks/topic_real_${idx+1}.txt\nTİK: ${t.passport_prefix}\n15 test (5 sadə, 5 orta, 5 çətin) yarat. Sonda 'Hazırdır' yaz.`
    };
});

fs.writeFileSync('data/subagents_payload_tebiet6_real_mini.json', JSON.stringify({Subagents: subs}, null, 2));
console.log('Mini payload generated with ' + subs.length + ' agents. Size: ' + fs.statSync('data/subagents_payload_tebiet6_real_mini.json').size + ' bytes');
