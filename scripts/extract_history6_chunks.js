const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const chunksPath = path.join(dataDir, 'textbook-chunks.jsonl');

const azTarixChunks = [];
const umumiTarixChunks = [];

const allChunks = fs.readFileSync(chunksPath, 'utf8').split('\n').filter(l => l.trim());
for(const l of allChunks) {
    try {
        const o = JSON.parse(l);
        if(o.book_id === 'azerbaycan-tarixi-6') azTarixChunks.push(o);
        if(o.book_id === 'umumi-tarix-6') umumiTarixChunks.push(o);
    } catch(e) {}
}

azTarixChunks.sort((a,b) => a.page - b.page);
umumiTarixChunks.sort((a,b) => a.page - b.page);

// Hardcode the topics and pages for Az Tarixi 6 based on typical structure
const azTarixiTopics = [
    { id: 1, title: "Əsas tarixi anlayışlar və zaman ölçü vahidləri", start: 8, end: 12 },
    { id: 2, title: "İbtidai cəmiyyət", start: 13, end: 35 },
    { id: 3, title: "Erkən dövlətlər", start: 36, end: 50 },
    { id: 4, title: "Manna dövləti", start: 51, end: 65 },
    { id: 5, title: "Azərbaycan e.ə. VII-IV yüzilliklərdə", start: 66, end: 80 },
    { id: 6, title: "Atropatena dövləti", start: 81, end: 90 },
    { id: 7, title: "Albaniya dövləti", start: 91, end: 105 },
    { id: 8, title: "Azərbaycanda feodal münasibətlərinin yaranması", start: 106, end: 115 },
    { id: 9, title: "Azərbaycan Sasani imperiyası dövründə", start: 116, end: 135 }
];

const umumiTarixiTopics = [
    { id: 1, title: "Tarixdə il hesabı və İbtidai cəmiyyət", start: 6, end: 20 },
    { id: 2, title: "Qədim Şərq: Ehramlar ölkəsi, Şumer", start: 21, end: 40 },
    { id: 3, title: "Qədim Şərq: İkiçayarasının digər dövlətləri, Parfiya", start: 41, end: 60 },
    { id: 4, title: "Qədim Şərq: Tanrının döyüşçüləri, İpək yolu, Şahmatın vətəni", start: 61, end: 80 },
    { id: 5, title: "Qədim Qərb: Avropa mədəniyyətinin beşiyi", start: 81, end: 100 },
    { id: 6, title: "Qədim Qərb: İlk Respublika yaradanlar", start: 101, end: 130 }
];

function saveChunks(topics, chunks, outDirPrefix) {
    const outDir = path.join(dataDir, outDirPrefix + '_chunks');
    if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
    
    topics.forEach(t => {
        let text = '';
        for(let p = t.start; p <= t.end; p++) {
            const c = chunks.find(x => x.page === p);
            if(c) text += c.text + '\n\n';
        }
        if(text.trim()) {
            fs.writeFileSync(path.join(outDir, `topic_real_${t.id}.txt`), text.trim(), 'utf8');
            console.log(`Saved ${outDirPrefix} topic ${t.id} (${text.length} chars)`);
        }
    });
}

saveChunks(azTarixiTopics, azTarixChunks, 'aztarixi6');
saveChunks(umumiTarixiTopics, umumiTarixChunks, 'umumitarix6');

// Save topics JSON for payload generation
fs.writeFileSync(path.join(dataDir, 'clean_topics_aztarixi_6.json'), JSON.stringify(azTarixiTopics, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'clean_topics_umumi_tarix_6.json'), JSON.stringify(umumiTarixiTopics, null, 2), 'utf8');

console.log('Done mapping and saving chunks!');
