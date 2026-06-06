const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Azərbaycan_Dili_5_AI_Testler.md');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const azTests = db['Azərbaycan dili'] || [];

let mdContent = `# Azərbaycan Dili 5 - AI Sınaq Testləri (Cəmi 960 Test Planı üzrə Hazır Olanlar)\n\n`;
mdContent += `> Bu fayl AI tərəfindən avtomatik generasiya edilmiş orijinal sınaq testlərindən ibarətdir.\n\n`;

const grouped = {};
for (const t of azTests) {
    const passport = t.passport_id || "BİLİNMƏYƏN_TİK";
    let prefix = "BİLİNMƏYƏN";
    if (passport !== "BİLİNMƏYƏN_TİK") {
        prefix = passport.split('-').slice(0, 5).join('-');
    }
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(t);
}

for (const prefix in grouped) {
    mdContent += `## Mövzu / TİK Kodu: ${prefix}\n\n`;
    const tests = grouped[prefix];
    for (let i = 0; i < tests.length; i++) {
        const t = tests[i];
        const q = t.question || "Sual mətni yoxdur";
        mdContent += `**Sual ${i+1}:** ${q}\n\n`;
        if (t.options && Array.isArray(t.options)) {
            t.options.forEach((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                mdContent += `- ${letter}) ${opt}\n`;
            });
        }
        const correctLetter = (t.correctAnswer !== undefined && t.correctAnswer !== null) ? String.fromCharCode(65 + t.correctAnswer) : "?";
        mdContent += `\n**Doğru Cavab:** ${correctLetter}\n`;
        const expl = t.explanation || "İzahat yoxdur";
        mdContent += `**İzahat:** ${expl}\n`;
        const pass = t.passport_id || "Yoxdur";
        mdContent += `**Pasport (TİK):** ${pass}\n\n---\n\n`;
    }
}

fs.writeFileSync(desktopPath, mdContent, 'utf8');
console.log(`Successfully exported MD file to Desktop: ${desktopPath}`);
