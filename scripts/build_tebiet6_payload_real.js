const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/queue_tebiet_6_real.json', 'utf8'));

if (!fs.existsSync('data/tebiet6_chunks')) {
    fs.mkdirSync('data/tebiet6_chunks', { recursive: true });
}

const subs = q.map((t, idx) => {
    const textPath = `data/tebiet6_chunks/topic_real_${idx+1}.txt`;
    fs.writeFileSync(textPath, t.text.substring(0, 4000), 'utf8');
    
    return {
        TypeName: 'sop_v3_test_generator',
        Role: 'Nat6_T' + String(idx+1).padStart(2, '0'),
        Prompt: `Sinif: 6\nFənn: Təbiət\nMövzu: ${t.topic_title}\nSəhifələr: ${t.start_page}-${t.end_page}\nBook ID: tebiet-6\nTİK Prefix: ${t.passport_prefix}\nTələb: 15 test (5 sadə, 5 orta, 5 çətin).\n\nKitab mətni tam olaraq C:/Users/User/Downloads/azerbaijanaiplatform/${textPath} faylındadır. Əvvəlcə view_file alətindən istifadə edərək bu faylı oxu, sonra yoxlanılmış "Sıfır Tolerantlıq" JSON nəticəsini geri qaytar.`
    };
});

fs.writeFileSync('data/subagents_payload_tebiet6_real.json', JSON.stringify({Subagents: subs}, null, 2));
console.log('Payload generated with ' + subs.length + ' agents. Size: ' + fs.statSync('data/subagents_payload_tebiet6_real.json').size + ' bytes');
