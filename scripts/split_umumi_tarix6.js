const fs = require('fs');
const path = require('path');

const umDir = path.join(__dirname, '../data/umumitarix6_chunks');
const outDir = path.join(__dirname, '../data/umumitarix6_chunks_generated');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const fullText = fs.readFileSync(path.join(umDir, 'full_book.txt'), 'utf8');
const lower = fullText.toLowerCase();

function findFirst(markers, minPos = 0) {
    for (const m of markers) {
        const idx = lower.indexOf(m.toLowerCase(), minPos);
        if (idx !== -1) return { idx, marker: m };
    }
    return null;
}

// Each topic: { num, name, markers, minPos (optional) }
const TOPICS = [
    {
        num: 1, name: 'Tarixdə il hesabı',
        markers: ['əziz məktəblilər', 'tarix insanların keçmişdə'],
        minPos: 0
    },
    {
        num: 2, name: 'İbtidai cəmiyyət',
        markers: ['ibtidai cəmiyyət', 'paleolit', 'qədim daş dövrü', 'daş dövründə insanların'],
        minPos: 8000
    },
    {
        num: 3, name: 'Ehramlar ölkəsi',
        markers: ['nil çayının ətrafında məskunlaş', 'nil çayının ətrafında', 'nil çayı', 'qədim misir'],
        minPos: 16000
    },
    {
        num: 4, name: 'Şumerdən başlanan tarix',
        markers: ['şumer ölkəsi məhz', 'şumerlər ikiqayarasının', 'şumerlər tikintidə'],
        minPos: 28000
    },
    {
        num: 5, name: 'İkiçayarasının digər dövlətləri',
        markers: ['babil dövlətinin əsası', 'aşşur hökmdarları', 'nineva şəhərini'],
        minPos: 40000
    },
    {
        num: 6, name: 'Oda sitayiş edənlər',
        markers: ['midiya dövlətinin', 'midiyada', 'kiaksar midiyada', 'midiyanı müstəqil'],
        minPos: 50000
    },
    {
        num: 7, name: 'Parfiya dövləti',
        markers: ['parfiya dövlətinin', 'parn tayfaları'],
        minPos: 60000
    },
    {
        num: 8, name: 'Tanrının döyüşçüləri',
        markers: ['hunlar', 'hun imperiyası', 'mete tanhunun'],
        minPos: 65000
    },
    {
        num: 9, name: 'Böyük ipək yolunun başlandığı ölkə',
        markers: ['xuanxe', 'çinin bəlası', 'çin əhalisi üçün müdafiə'],
        minPos: 84000
    },
    {
        num: 10, name: 'Şahmatın vətəni',
        markers: ['şahmatın vətəni', 'hindistan şahmat'],
        minPos: 96000
    },
    {
        num: 11, name: 'Avropa mədəniyyətinin beşiyi',
        markers: ['attikanın qalan azad', 'afina polisi', 'yunanıstanda quldar dövlət', 'ellada'],
        minPos: 102000
    },
    {
        num: 12, name: 'İlk Respublika yaradanlar',
        markers: ['romalılar padşah hakimiyyətini', 'e.ə. 509-cu ildə romalılar'],
        minPos: 120000
    }
];

// Find boundaries
const boundaries = TOPICS.map(t => {
    const result = findFirst(t.markers, t.minPos || 0);
    if (result) {
        console.log(`Topic ${t.num} (${t.name}): pos=${result.idx} via "${result.marker}"`);
        return { ...t, pos: result.idx };
    } else {
        console.log(`Topic ${t.num} (${t.name}): NOT FOUND (minPos=${t.minPos})`);
        return { ...t, pos: -1 };
    }
}).filter(t => t.pos !== -1).sort((a, b) => a.pos - b.pos);

// Extract and save
let saved = 0;
for (let i = 0; i < boundaries.length; i++) {
    const curr = boundaries[i];
    const next = boundaries[i + 1];
    const endPos = next ? next.pos : fullText.length;
    const text = fullText.substring(curr.pos, endPos);
    
    const filename = `topic_${String(curr.num).padStart(2,'0')}.txt`;
    fs.writeFileSync(path.join(outDir, filename), text, 'utf8');
    console.log(`✓ Saved topic ${curr.num}: ${curr.name} (${text.length} chars) → ${filename}`);
    saved++;
}

console.log(`\nDone! Saved ${saved} topic files.`);
