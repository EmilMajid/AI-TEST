const fs = require('fs');
const path = require('path');

// Fix encoding function
function fixEncoding(text) {
    if (!text) return "";
    return text
        .replace(/Ã¼/g, 'ü').replace(/Ãœ/g, 'Ü')
        .replace(/É™/g, 'ə').replace(/Æ/g, 'Ə')
        .replace(/Ã¶/g, 'ö').replace(/Ã–/g, 'Ö')
        .replace(/Ä±/g, 'ı').replace(/Ä°/g, 'İ')
        .replace(/ÄŸ/g, 'ğ').replace(/Ä/g, 'Ğ')
        .replace(/ÅŸ/g, 'ş').replace(/Å/g, 'Ş')
        .replace(/Ã§/g, 'ç').replace(/Ã‡/g, 'Ç')
        // Variations
        .replace(/Ã\x83Â¼/g, 'ü')
        .replace(/Ã\x83â€“/g, 'Ö')
        .replace(/Ã\x83Â¶/g, 'ö')
        .replace(/Ã\x89â„¢/g, 'ə')
        .replace(/Ã\x84Â±/g, 'ı')
        .replace(/Ã\x84Â°/g, 'İ')
        .replace(/Ã\x85Å¸/g, 'ş')
        .replace(/Ã\x83â€¡/g, 'Ç')
        .replace(/Ã\x83Â§/g, 'ç')
        // Punctuation
        .replace(/â€“/g, '–').replace(/â€”/g, '—')
        .replace(/â€œ/g, '"').replace(/â€/g, '"')
        .replace(/â€™/g, "'");
}

function cleanTopics() {
    console.log("Reading extraction results...");
    const extractedPath = path.join(process.cwd(), "scripts", "extracted-topics.json");
    const manualPath = path.join(process.cwd(), "scripts", "manual-topics.json");

    let extracted = {};
    let manual = {};

    if (fs.existsSync(extractedPath)) {
        extracted = JSON.parse(fs.readFileSync(extractedPath, "utf-8"));
    }

    if (fs.existsSync(manualPath)) {
        manual = JSON.parse(fs.readFileSync(manualPath, "utf-8"));
    }

    const merged = {};

    // Process extracted: clean encoding
    for (const subject in extracted) {
        merged[subject] = extracted[subject].map(group => ({
            chapter: fixEncoding(group.chapter),
            topics: group.topics.map(t => ({
                ...t,
                title: fixEncoding(t.title)
            }))
        }));
    }

    // Override with manual (already clean)
    for (const subject in manual) {
        merged[subject] = manual[subject];
    }

    // Save back to manual-topics.json (which is now the master source)
    fs.writeFileSync(manualPath, JSON.stringify(merged, null, 2));
    console.log(`✅ Merged and cleaned topics saved to manual-topics.json`);
    console.log(`Total subjects: ${Object.keys(merged).length}`);

    Object.keys(merged).forEach(s => {
        const count = merged[s].reduce((acc, g) => acc + g.topics.length, 0);
        console.log(`- ${s}: ${count} topics`);
    });
}

cleanTopics();
