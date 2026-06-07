const fs = require('fs');

const dbPath = './data/offline_tests.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const outputDir = 'C:/Users/User/OneDrive/Desktop/5-ci sinif testlər/';

function generateMD(subjectName, tests, filename) {
    let md = `# ${subjectName} 5 - AI Sınaq Testləri (Version 2 - Təmizlənmiş)\n\n`;
    md += `> Bu fayl "Sərt Tənqidi Ekspertiza" qaydaları ilə audit edilmiş və yenidən bərpa olunmuş (V2) sınaq testlərindən ibarətdir.\n`;
    md += `> Ümumi sınaq sayı: ${tests.length}\n\n`;

    tests.forEach((t, index) => {
        md += `## Mövzu / TİK Kodu: ${t.passport_id || 'BİLİNMƏYƏN'}\n\n`;
        md += `**Sual ${index + 1}:** ${t.question || 'Sual mətni yoxdur'}\n\n`;
        
        let letters = ['A', 'B', 'C', 'D'];
        if (t.options && Array.isArray(t.options)) {
            t.options.forEach((opt, i) => {
                md += `- **${letters[i]})** ${opt}\n`;
            });
        }
        
        md += `\n**Doğru Cavab:** ${t.correctAnswer !== undefined && letters[t.correctAnswer] ? letters[t.correctAnswer] : '?'}\n`;
        md += `**İzahat:** ${t.explanation || 'İzahat yoxdur'}\n`;
        md += `**Pasport (TİK):** ${t.passport_id || 'Yoxdur'}\n\n---\n\n`;
    });

    fs.writeFileSync(outputDir + filename, md, 'utf8');
    console.log(`${filename} yaradıldı! Cəmi: ${tests.length} test.`);
}

if (db['Azərbaycan dili']) generateMD('Azərbaycan Dili', db['Azərbaycan dili'], 'Azərbaycan_Dili_5_AI_Testler_V2.md');
if (db['Riyaziyyat']) generateMD('Riyaziyyat', db['Riyaziyyat'], 'Riyaziyyat_5_AI_Testler_V2.md');
if (db['Təbiət']) generateMD('Təbiət', db['Təbiət'], 'Təbiət_5_AI_Testler_V2.md');
if (db['Azərbaycan tarixi']) generateMD('Azərbaycan Tarixi', db['Azərbaycan tarixi'], 'Azərbaycan_Tarixi_5_AI_Testler_V2.md');
if (db['İnformatika']) generateMD('İnformatika', db['İnformatika'], 'İnformatika_5_AI_Testler_V2.md');
