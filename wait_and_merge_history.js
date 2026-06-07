const fs = require('fs');
const path = require('path');
const os = require('os');

const tempDir = path.join(__dirname, 'temp_tests_history');
const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
const desktopPath = path.join(os.homedir(), 'Desktop', 'Tarix_5_AI_Testler.md');

const requiredFiles = [];
for (let i = 1; i <= 39; i++) {
    requiredFiles.push(`his${String(i).padStart(2, '0')}.json`);
}

function checkFiles() {
    return requiredFiles.every(f => fs.existsSync(path.join(tempDir, f)));
}

function mergeAndExport() {
    console.log('All 39 files found! Merging...');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!db['Azərbaycan tarixi']) db['Azərbaycan tarixi'] = [];

    let count = 0;
    for (const f of requiredFiles) {
        try {
            let data = JSON.parse(fs.readFileSync(path.join(tempDir, f), 'utf8'));
            if (!Array.isArray(data)) data = data.tests || Object.values(data)[0];
            if (Array.isArray(data)) { db['Azərbaycan tarixi'].push(...data); count += data.length; }
        } catch (e) { console.error(`Error in ${f}:`, e.message); }
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log(`Merged ${count} tests into database.`);

    // Build MD
    const topics = [
        "Tarix necə öyrənilir?", "Vətənim Azərbaycan", "Azərbaycanda ilk insan məskənləri", "Əmək alətləri necə yarandı?",
        "Dövlətlər nə üçün lazımdır?", "Azərbaycanın qədim dövlətləri", "Əsarətlə barışmayan qəhrəman", "Azərbaycanı birləşdirən ilk hökmdar",
        "Səlcuqlar və Azərbaycan", "Atabəy Şəmsəddin Eldəniz", "Qara Yusif kim idi?", "Həsən padşah Bayandur",
        "Şeyx necə şah oldu?", "Tariximizdə qadınlar", "Şərqin son fatehi", "Birlik yoxdursa, dirilik də yoxdur",
        "Azərbaycan necə parçalandı?", "Daş keşikçilər", "Şəhərlər necə yarandı?", "Qədim Azərbaycan şəhərləri",
        "Azərbaycanın taxtı - Təbriz", "Müsəlman Şərqinin ilk Cümhuriyyəti", "Sovet işğalı", "Azərbaycan xalqı faşizmə karşı",
        "Dövlət müstəqilliyinin bərpası", "Birinci Qarabağ müharibəsi", "Dövlətin xilaskarı", "Müzəffər Ali Baş Komandan",
        "Böyük Zəfərin ilk qaranquşu - Aprel döyüşləri", "Qanı ilə tarix yazan qəhrəmanlar", "Vətən müharibəsi", "Qarabağda quruculuq",
        "“Kitabi-Dədə Qorqud”", "Nizami Gəncəvi", "Elmlə siyasət yürüdən alimlər", "Azərbaycan tarixinin atası",
        "“Əkinçi”dən başlanan yol", "Milli operanın banisi", "Lütfi Zadə"
    ];

    let md = `# Azərbaycan tarixi 5 - AI Sınaq Testləri (Cəmi ${count} Test)\n\n`;
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
    console.log('HISTORY_ALL_DONE_WAKE_UP');
}

const interval = setInterval(() => {
    if (checkFiles()) {
        clearInterval(interval);
        setTimeout(mergeAndExport, 2000);
    } else {
        const done = requiredFiles.filter(f => fs.existsSync(path.join(tempDir, f))).length;
        console.log(`Progress: ${done}/39 files ready...`);
    }
}, 5000);
