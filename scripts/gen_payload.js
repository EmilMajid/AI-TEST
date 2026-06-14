const fs = require('fs');
const q = require('../data/test_generation_queue_tebiet6.json');
const subset = q.slice(0, 5);
const subagents = subset.map(t => ({
  TypeName: 'informatika_test_generator_6',
  Role: 'Info 6 ' + t.topic_id,
  Prompt: `Mövzu: ${t.topic_title}\nSəhifələr: ${t.start_page}-${t.end_page}\nTİK Prefix: ${t.passport_prefix}\nSay: 5 test\n\n[MƏTN BAŞLADI]\n${t.text.substring(0, 3000)}\n[MƏTN BİTDİ]`
}));
fs.writeFileSync('../scripts/subagents_payload.json', JSON.stringify({Subagents: subagents}, null, 2));
console.log("Written");
