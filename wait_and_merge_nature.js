const fs = require('fs');
const path = require('path');
const os = require('os');

const tempDir = path.join(__dirname, 'temp_tests_nature');
const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
const desktopPath = path.join(os.homedir(), 'OneDrive', 'Desktop', '5-ci sinif testlər', 'Tebiet_5_AI_Testler.md');

const requiredFiles = [];
for (let i = 1; i <= 40; i++) {
    requiredFiles.push(`nat${String(i).padStart(2, '0')}.json`);
}

function checkFiles() {
    return requiredFiles.every(f => fs.existsSync(path.join(tempDir, f)));
}

function mergeAndExport() {
    console.log('All 40 files found! Merging...');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!db['Təbiət']) db['Təbiət'] = [];

    let count = 0;
    for (const f of requiredFiles) {
        try {
            let data = JSON.parse(fs.readFileSync(path.join(tempDir, f), 'utf8'));
            if (!Array.isArray(data)) data = data.tests || Object.values(data)[0];
            if (Array.isArray(data)) { db['Təbiət'].push(...data); count += data.length; }
        } catch (e) { console.error(`Error in ${f}:`, e.message); }
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Merged ${count} tests into database.`);

    // Build MD
    const topics = [
        "Hüceyrədən orqanizmə", "Biz necə hərəkət edirik?", "Yediyimiz qidalar hansı prosesdən keçir?", "Hava bizə nə üçün lazımdır?",
        "Bədənimizdə maddələr necə daşınır?", "Qan dövranı və tənəffüs sistemləri birlikdə necə işləyir?", "Qan bədənimizdə necə təmizlənir?", "İnsan orqanizmi necə idarə olunur?",
        "Canlıları necə təsnif edirik?", "Heyvanları necə qruplaşdırırıq?", "Bitkiləri necə təsnif edə bilərik?", "Bərk, maye və qazların oxşar xassələri",
        "Bərk, maye və qazların fərqli xassələri", "Maddənin halının dəyişməsi", "Təbiətdə su dövranı", "Fiziki hadisələr",
        "Kimyəvi hadisələr", "Saf maddələr və qarışıqlar nədir?", "Maddələrin suda həll olması", "Qarışıqların ayrılması",
        "Enerji bizə nə üçün lazımdır?", "Enerjinin hansı növləri var?", "Enerjinin bir növü başqa növünə çevrilə bilərmi?", "Bərpa olunmayan və bərpa olunan enerji mənbələri hansılardır?",
        "Enerjiyə necə qənaət edə bilərik?", "Canlılar enerjini haradan əldə edir?", "Canlılar arasında enerjinin ötürülməsi prosesi necə baş verir?", "Qida zəncirinə daxil olan halqalar bir-birindən necə asılıdır?",
        "Biz cisimləri necə görürük?", "İşıq hansı istiqamətdə əks olunur?", "İşıq şüası digər mühitə keçəndə nə baş verir?", "Yerin daxili təbəqələri hansılardır?",
        "Zəlzələlər necə baş verir?", "Vulkanlar necə yaranır?", "Sel və daşqınlar necə baş verir?", "Quraqlıq necə baş verir?",
        "Təbii ehtiyatlar dedikdə nə başa düşürük?", "İnsanlar ətraf mühitə mənfi təsir göstərirmi?", "Ətraf mühit necə çirklənir?", "Biz ətraf mühiti necə qoruya bilərik?"
    ];

    let md = `# Təbiət 5 - AI Sınaq Testləri (Cəmi ${count} Test)\n\n`;
    md += `> Bu fayl AI tərəfindən avtomatik generasiya edilmiş orijinal sınaq testlərindən ibarətdir.\n\n`;

    for (let i = 0; i < requiredFiles.length; i++) {
        try {
            let data = JSON.parse(fs.readFileSync(path.join(tempDir, requiredFiles[i]), 'utf8'));
            if (!Array.isArray(data)) data = data.tests || Object.values(data)[0];
            if (!Array.isArray(data)) continue;

            md += `## ${i + 1}. Mövzu: ${topics[i]}\n\n`;
            data.forEach((t, idx) => {
                md += `**Sual ${idx + 1}:** ${t.question || ''}\n\n`;
                (t.options || []).forEach((opt, oi) => {
                    md += `- ${String.fromCharCode(65 + oi)}) ${opt}\n`;
                });
                md += `\n**Doğru Cavab:** ${String.fromCharCode(65 + (t.correctAnswer || 0))}\n`;
                md += `**İzahat:** ${t.explanation || ''}\n`;
                md += `**TİK:** ${t.passport_id || ''}\n\n---\n\n`;
            });
        } catch (e) {}
    }

    fs.writeFileSync(desktopPath, md, 'utf8');
    console.log(`MD exported to Desktop: ${desktopPath}`);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('NATURE_ALL_DONE_WAKE_UP');
}

const interval = setInterval(() => {
    if (checkFiles()) {
        clearInterval(interval);
        setTimeout(mergeAndExport, 2000);
    } else {
        const done = requiredFiles.filter(f => fs.existsSync(path.join(tempDir, f))).length;
        console.log(`Progress: ${done}/40 files ready...`);
    }
}, 5000);
