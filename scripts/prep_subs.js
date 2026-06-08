const fs = require('fs');

const q = JSON.parse(fs.readFileSync('data/test_generation_queue_6_chap1.json', 'utf8'));

const subs = q.map(t => ({
    TypeName: 'nature_test_generator_6_v2',
    Role: 'Təbiət6 ' + t.title.substring(0, 3),
    Prompt: `Mövzu: ${t.title}\nMətn: ${t.text}\nSəviyyə: ${t.level}\nTələb: ${t.count} test (${t.breakdown}).\npassportPrefix: ${t.passportPrefix}`,
    Workspace: 'inherit'
}));

fs.writeFileSync('temp_subs.json', JSON.stringify(subs, null, 2));
console.log("temp_subs.json created.");
