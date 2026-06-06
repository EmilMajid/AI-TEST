const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, 'temp_tests_az');
const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Azərbaycan_Dili_5_AI_Testler.md');

const requiredFiles = [];
for (let i = 13; i <= 32; i++) {
    requiredFiles.push(`topic${i}.json`);
}

function checkFiles() {
    let allExist = true;
    for (const f of requiredFiles) {
        if (!fs.existsSync(path.join(tempDir, f))) {
            allExist = false;
            break;
        }
    }
    return allExist;
}

function mergeAndExport() {
    console.log('All files found! Merging...');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!db['Azərbaycan dili']) db['Azərbaycan dili'] = [];
    
    let newTestsCount = 0;
    
    for (const f of requiredFiles) {
        try {
            const raw = fs.readFileSync(path.join(tempDir, f), 'utf8');
            let data = JSON.parse(raw);
            if (!Array.isArray(data)) {
                data = data.tests || Object.values(data)[0];
            }
            if (Array.isArray(data)) {
                db['Azərbaycan dili'].push(...data);
                newTestsCount += data.length;
            }
        } catch (e) {
            console.error(`Error in ${f}:`, e.message);
        }
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Merged ${newTestsCount} tests into database.`);
    
    // Now create MD file on desktop
    let mdContent = `# Azərbaycan Dili 5 - AI Sınaq Testləri (Cəmi 960 Test)\n\n`;
    mdContent += `> Bu fayl AI tərəfindən avtomatik generasiya edilmiş orijinal sınaq testlərindən ibarətdir.\n\n`;
    
    const azTests = db['Azərbaycan dili'];
    
    // Group by TİK prefix (topic)
    const grouped = {};
    for (const t of azTests) {
        const prefix = t.passport_id.split('-').slice(0, 5).join('-');
        if (!grouped[prefix]) grouped[prefix] = [];
        grouped[prefix].push(t);
    }
    
    for (const prefix in grouped) {
        mdContent += `## Mövzu / TİK Kodu: ${prefix}\n\n`;
        const tests = grouped[prefix];
        for (let i = 0; i < tests.length; i++) {
            const t = tests[i];
            mdContent += `**Sual ${i+1}:** ${t.question}\n\n`;
            t.options.forEach((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                mdContent += `- ${letter}) ${opt}\n`;
            });
            const correctLetter = String.fromCharCode(65 + t.correctAnswer);
            mdContent += `\n**Doğru Cavab:** ${correctLetter}\n`;
            mdContent += `**İzahat:** ${t.explanation}\n`;
            mdContent += `**Pasport (TİK):** ${t.passport_id}\n\n---\n\n`;
        }
    }
    
    fs.writeFileSync(desktopPath, mdContent, 'utf8');
    console.log(`Successfully exported MD file to Desktop: ${desktopPath}`);
    console.log('ALL_DONE_WAKE_UP');
}

const interval = setInterval(() => {
    if (checkFiles()) {
        clearInterval(interval);
        setTimeout(mergeAndExport, 2000); // give 2 seconds for writes to finish
    }
}, 5000);
