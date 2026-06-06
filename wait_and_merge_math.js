const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, 'temp_tests_math');
const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Riyaziyyat_5_AI_Testler.md');

const requiredFiles = [];
for (let i = 1; i <= 53; i++) {
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
    console.log('All 53 files found! Merging...');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!db['Riyaziyyat']) db['Riyaziyyat'] = [];
    
    let newTestsCount = 0;
    
    for (const f of requiredFiles) {
        try {
            const raw = fs.readFileSync(path.join(tempDir, f), 'utf8');
            let data = JSON.parse(raw);
            if (!Array.isArray(data)) {
                data = data.tests || Object.values(data)[0];
            }
            if (Array.isArray(data)) {
                db['Riyaziyyat'].push(...data);
                newTestsCount += data.length;
            }
        } catch (e) {
            console.error(`Error in ${f}:`, e.message);
        }
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Merged ${newTestsCount} tests into database.`);
    
    // Now create MD file on desktop
    let mdContent = `# Riyaziyyat 5 - AI Sınaq Testləri (Cəmi 1590 Test)\n\n`;
    mdContent += `> Bu fayl AI tərəfindən avtomatik generasiya edilmiş orijinal sınaq testlərindən ibarətdir.\n\n`;
    
    const mathTests = db['Riyaziyyat'];
    
    // Group by TİK prefix (topic)
    const grouped = {};
    for (const t of mathTests) {
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
    console.log('MATH_ALL_DONE_WAKE_UP');
}

const interval = setInterval(() => {
    if (checkFiles()) {
        clearInterval(interval);
        setTimeout(mergeAndExport, 2000); // give 2 seconds for writes to finish
    } else {
        const existCount = requiredFiles.filter(f => fs.existsSync(path.join(tempDir, f))).length;
        if (existCount % 5 === 0 && existCount > 0) {
            console.log(`Progress: ${existCount}/53 files ready...`);
        }
    }
}, 5000);
