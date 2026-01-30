const fs = require('fs');
const path = require('path');

const manualTopicsPath = path.join(__dirname, 'manual-topics.json');
const extractedPath = path.join(__dirname, 'extracted-topics-8-html.json');

const manualTopics = JSON.parse(fs.readFileSync(manualTopicsPath, 'utf8'));
const extracted = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

// Map extracted to manual topics format
// Note: Grade 8 subjects in extracted are using folder names like 'azerbaycan-dili'
// but in textbooks.json they use 'azerbaycan-dili-8', etc.
const mapping = {
    "azerbaycan-dili": "azerbaycan-dili-8",
    "edebiyyat": "edebiyyat-8",
    "riyaziyyat": "riyaziyyat-8",
    "fizika": "fizika-8",
    "kimya": "kimya-8",
    "biologiya": "biologiya-8",
    "cografiya": "cografiya-8",
    "umumi-tarix": "umumi-tarix-8",
    "ingilis-dili": "ingilis-dili-8"
};

for (const [key, bookId] of Object.entries(mapping)) {
    if (extracted[key]) {
        console.log(`Injecting ${extracted[key].length} topics for ${bookId}...`);
        manualTopics[bookId] = [
            {
                "chapter": "Bütün bölmələr",
                "topics": extracted[key].map(t => ({ title: t }))
            }
        ];
    }
}

fs.writeFileSync(manualTopicsPath, JSON.stringify(manualTopics, null, 2));
console.log("✅ Injection complete.");
