const fs = require('fs');
const path = require('path');

const chunksPath = path.join(__dirname, '../data/textbook-chunks.jsonl');
const azDir = path.join(__dirname, '../data/aztarixi6_chunks');
const umDir = path.join(__dirname, '../data/umumitarix6_chunks_generated');

// Check what already exists in chunks for these books
const existing = fs.readFileSync(chunksPath, 'utf8').split('\n').filter(Boolean);
const existingIds = new Set();
existing.forEach(line => {
    try {
        const obj = JSON.parse(line);
        if (obj.book_id === 'azerbaycan-tarixi-6' || obj.book_id === 'umumi-tarix-6') {
            existingIds.add(obj.book_id + '::' + (obj.section_title || ''));
        }
    } catch(e) {}
});
console.log(`Found ${existingIds.size} existing chunks for these books`);

const newChunks = [];

// 1. Azərbaycan tarixi 6 - Manna dövləti (Topic 4)
const mannaFile = path.join(azDir, 'topic_real_4.txt');
if (fs.existsSync(mannaFile)) {
    const text = fs.readFileSync(mannaFile, 'utf8');
    newChunks.push({
        book_id: 'azerbaycan-tarixi-6',
        grade: 6,
        subject: 'Azərbaycan tarixi',
        section_title: 'Manna dövləti',
        section_level: 2,
        type: 'ederslik_html',
        bypass_dedup: true,
        text: text.substring(0, 8000), // chunk 1
        quality: 0.9,
        language: 'az',
        corruption_ratio: 0.05,
        section: 'II Bölmə. Azərbaycanda qədim dövlətlər',
        topic_num: 4
    });
    if (text.length > 8000) {
        newChunks.push({
            book_id: 'azerbaycan-tarixi-6',
            grade: 6,
            subject: 'Azərbaycan tarixi',
            section_title: 'Manna dövləti (davam)',
            section_level: 2,
            type: 'ederslik_html',
            bypass_dedup: true,
            text: text.substring(8000),
            quality: 0.9,
            language: 'az',
            corruption_ratio: 0.05,
            section: 'II Bölmə. Azərbaycanda qədim dövlətlər',
            topic_num: 4
        });
    }
    console.log('Added Manna dövləti chunks');
}

// 2. Ümumi tarix 6 - All 12 topics
const umTopics = [
    { num: 1, name: 'Tarixdə il hesabı' },
    { num: 2, name: 'İbtidai cəmiyyət' },
    { num: 3, name: 'Ehramlar ölkəsi' },
    { num: 4, name: 'Şumerdən başlanan tarix' },
    { num: 5, name: 'İkiçayarasının digər dövlətləri' },
    { num: 6, name: 'Oda sitayiş edənlər' },
    { num: 7, name: 'Parfiya dövləti' },
    { num: 8, name: 'Tanrının döyüşçüləri' },
    { num: 9, name: 'Böyük ipək yolunun başlandığı ölkə' },
    { num: 10, name: 'Şahmatın vətəni' },
    { num: 11, name: 'Avropa mədəniyyətinin beşiyi' },
    { num: 12, name: 'İlk Respublika yaradanlar' }
];

for (const topic of umTopics) {
    const filename = `topic_${String(topic.num).padStart(2,'0')}.txt`;
    const filepath = path.join(umDir, filename);
    if (!fs.existsSync(filepath)) {
        console.log(`Missing: ${filename}`);
        continue;
    }
    
    const text = fs.readFileSync(filepath, 'utf8');
    // Split into max 8000 char chunks
    let offset = 0;
    let chunkIdx = 0;
    while (offset < text.length) {
        const chunk = text.substring(offset, offset + 8000);
        newChunks.push({
            book_id: 'umumi-tarix-6',
            grade: 6,
            subject: 'Ümumi tarix',
            section_title: chunkIdx === 0 ? topic.name : `${topic.name} (davam)`,
            section_level: 2,
            type: 'ederslik_html',
            bypass_dedup: true,
            text: chunk,
            quality: 0.9,
            language: 'az',
            corruption_ratio: 0.05,
            section: topic.name,
            topic_num: topic.num
        });
        offset += 8000;
        chunkIdx++;
    }
    console.log(`Added topic ${topic.num}: ${topic.name} (${text.length} chars, ${chunkIdx} chunks)`);
}

// Append to chunks file
const newLines = newChunks.map(c => JSON.stringify(c)).join('\n');
fs.appendFileSync(chunksPath, '\n' + newLines, 'utf8');

console.log(`\n✓ Added ${newChunks.length} new chunks to textbook-chunks.jsonl`);
