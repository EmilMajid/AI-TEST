const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'offline_tests.json');
const testsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const az9 = testsDb['Azərbaycan dili 9'];

const topics = [
  'Mətn',
  'Ana qucağı',
  'Üçüncü il',
  '"Amalım millətimi səadətə qovuşdurmaqdır"',
  '"Sizi təbrik edirəm, qızlar!"',
  'Məhəmməd Sadıq bəy Ağabəyzadə',
  'Maarifçi fədailər -Aşurbəylilər'
];

let md = `# 9-cu sinif Azərbaycan dili — 1-ci Bölmə: Dil, Təhsil və Cəmiyyət\n`;
md += `## 105 Test Tapşırığı ("Sıfır Xəta, Sıfır İsraf" Strategiyası)\n\n`;
md += `> [!NOTE]\n> Bu sənəddə 9-cu sinif Azərbaycan dili fənni, 1-ci bölmə üzrə 7 mövzu (hər mövzudan 15 sual — 5 sadə, 5 orta, 5 çətin) üzrə 105 test tapşırığı yer alır. Testlər yalnız rəsmi dərslik mətnlərinə əsaslanaraq, Bloom taksonomiyasına uyğun, keyfiyyətli distraktorlarla hazırlanmışdır.\n\n`;

md += `| # | Mövzu | Sadə | Orta | Çətin | Cəmi |\n`;
md += `|---|-------|------|------|-------|------|\n`;
topics.forEach((t, i) => {
  const tqs = az9.filter(q => q.topic === t);
  const easy = tqs.filter(q => q.difficulty === 'sadə').length;
  const mid = tqs.filter(q => q.difficulty === 'orta').length;
  const hard = tqs.filter(q => q.difficulty === 'çətin').length;
  md += `| ${i+1} | ${t} | ${easy} | ${mid} | ${hard} | **${tqs.length}** |\n`;
});
md += `| | **CƏMİ** | **35** | **35** | **35** | **105** |\n\n`;
md += `---\n\n`;

md += `## I HİSSƏ: TEST SUALLAR\n\n`;
let globalNum = 1;
topics.forEach(topic => {
  md += `### ${topic}\n\n`;
  const tqs = az9.filter(q => q.topic === topic);
  ['sadə','orta','çətin'].forEach(diff => {
    const dqs = tqs.filter(q => q.difficulty === diff);
    if (dqs.length > 0) {
      md += `#### ${diff.charAt(0).toUpperCase() + diff.slice(1)} Səviyyə\n\n`;
      dqs.forEach(q => {
        md += `**Sual ${globalNum}.** *(${q.passport_id})* ${q.question}\n\n`;
        q.options.forEach((opt, i) => {
          const letter = ['A','B','C','D'][i];
          md += `${letter}) ${opt}\n`;
        });
        md += `\n`;
        globalNum++;
      });
    }
  });
  md += `---\n\n`;
});

md += `## II HİSSƏ: CAVABLAR VƏ İZAHATLAR\n\n`;
let n2 = 1;
topics.forEach(topic => {
  md += `### ${topic}\n\n`;
  const tqs = az9.filter(q => q.topic === topic);
  const allDiff = ['sadə','orta','çətin'].flatMap(d => tqs.filter(q => q.difficulty === d));
  allDiff.forEach(q => {
    const letter = ['A','B','C','D'][q.correctAnswer];
    md += `**Sual ${n2} — Cavab: ${letter})**\n\n`;
    md += `📝 **İzah:** ${q.explanation}\n\n`;
    if (q.sourceContext) {
      md += `📖 **Dərslik mətni:** *"${q.sourceContext}"*\n\n`;
    }
    md += `🔖 Bloom: \`${q.bloomLevel}\` | Çətinlik: \`${q.difficulty}\` | Passport: \`${q.passport_id}\`\n\n`;
    n2++;
  });
  md += `---\n\n`;
});

const outPath = path.join(__dirname, '..', 'temp', 'AZ9_Bolme1_105_Test_FINAL.md');
fs.writeFileSync(outPath, md, 'utf-8');
console.log('✅ Markdown artifact created:', outPath);
console.log('📊 Total questions:', az9.length);
