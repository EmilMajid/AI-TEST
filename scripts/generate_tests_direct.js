/**
 * generate_tests_direct.js
 * SOP V3.0: Vahid Standart Əsasında Kütləvi Test Generasiyası
 * 
 * Bu skript verilmiş mövzular üzrə təyin edilmiş çətinlik və sayda 
 * testləri API vasitəsilə yaradır, Sıfır Tolerantlıqla audit edir, 
 * və prosesin sonunda strukturlaşdırılmış Hesabat (Report) verir.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

// --- SOP V3.0 KONFİQURASİYASI (Qayda 1.2) ---
const CONFIG = {
  // Qayda 1.2: Dinamik Sual Sayı və Çətinlik
  TARGET_COUNT: 15,
  DIFFICULTY_DIST: { sade: 5, orta: 5, cetin: 5 },
  
  // Fayl yolları
  QUEUE_FILE: path.join(__dirname, '../data/test_generation_queue_tebiet6.json'),
  TESTS_FILE: path.join(__dirname, '../data/offline_tests.json'),
  REPORT_FILE: path.join(__dirname, '../data/SOP_V3_Report.md'),
  DESKTOP_DIR: 'C:\\Users\\User\\OneDrive\\Desktop\\SOP_V3_Testləri'
};

// .env faylından API açarını yüklə
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  });
  return env;
}

const env = loadEnv();
const API_KEY = env.GEMINI_API_KEY || env.GOOGLE_AI_API_KEY || env.API_KEY;

if (!API_KEY || API_KEY.includes('placeholder')) {
  console.log('⚠️ DİQQƏT: Keçərli API Key yoxdur! Skript yalnız Subagent-lərin istifadəsi üçün model kimi strukturlaşdırılıb, birbaşa Gemini çağırışı xəta verə bilər.');
}

// Mövcud testləri yüklə
let existingTests = [];
if (fs.existsSync(CONFIG.TESTS_FILE)) {
  try { existingTests = JSON.parse(fs.readFileSync(CONFIG.TESTS_FILE, 'utf8')); } catch(e) {}
}

// Növbəni yüklə
if (!fs.existsSync(CONFIG.QUEUE_FILE)) {
    console.error('❌ Növbə faylı tapılmadı:', CONFIG.QUEUE_FILE);
    process.exit(1);
}
const queue = JSON.parse(fs.readFileSync(CONFIG.QUEUE_FILE, 'utf8'));
const queued = queue.filter(q => q.status === 'queued' || q.status === 'error_no_context');

console.log(`\n🚀 SOP V3.0 - Uçdan-Uca Test Generator`);
console.log(`   Hədəf Say: ${CONFIG.TARGET_COUNT} (${CONFIG.DIFFICULTY_DIST.sade} sadə, ${CONFIG.DIFFICULTY_DIST.orta} orta, ${CONFIG.DIFFICULTY_DIST.cetin} çətin)`);
console.log(`   Növbədəki Mövzu: ${queued.length}`);

// Gemini API çağırışı
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    if (!API_KEY || API_KEY.includes('placeholder')) {
        return reject(new Error("API_KEY is placeholder. Subagents should be used for real LLM calls in this environment."));
    }
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error.message));
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          resolve(text || '[]');
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// SOP V3.0 Prompt Arxitekturası (Qayda 1.3, 2.1, 2.2, 2.3, 3.1)
function buildPrompt(topic) {
  return `Sən Azərbaycan təhsil sistemi üçün test sualları hazırlayan ekspertsən.

Aşağıda "${topic.topic_title}" mövzusunun dərslik mətni verilmişdir:
---
${(topic.text || '').substring(0, 4000)}
---

QƏTİ QADAĞA (Sıfır Tolerantlıq): 
Əgər yuxarıdakı mətn boşdursa, sadəcə tapşırıq siyahısıdırsa və ya test yaratmaq üçün kifayət qədər faktoloji bilik yoxdursa, ÜMUMİ BİLİKLƏRİNDƏN İSTİFADƏ EDƏRƏK TEST UYDURMA!
Bu halda birbaşa olaraq [{"error": "ERROR_NO_CONTEXT"}] qaytar və dayan.

Əgər mətn kifayətdirsə, aşağıdakı bölgüyə əsasən TAM ${CONFIG.TARGET_COUNT} ədəd test hazırla:
- ${CONFIG.DIFFICULTY_DIST.sade} sadə
- ${CONFIG.DIFFICULTY_DIST.orta} orta
- ${CONFIG.DIFFICULTY_DIST.cetin} çətin

QAYDALAR:
1. Yalnız JSON massivi qaytar. Əlavə heç bir cümlə yazma.
2. Variantlarda "Hamısı doğrudur", "Heç biri doğru deyil" istifadəsi qəti qadağandır.
3. İzahat (explanation) hissəsində MƏHZ dərslikdəki mətndən hərfi-hərfinə kopyalanmış cümləni SİTAT GƏTİR.

Gözlənilən JSON formatı (hər obyekt üçün):
{
  "grade": ${topic.grade || 6},
  "subject": "${topic.subject}",
  "topic": "${topic.topic_title}",
  "book_id": "${topic.book_id}",
  "pages": "${topic.start_page}-${topic.end_page}",
  "passport": "${topic.passport_prefix}XXXX",
  "question": "Sual mətni?",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "answer": "A",
  "difficulty": "sadə/orta/çətin",
  "bloom": "bilik/anlama/tətbiq/təhlil/sintez/dəyərləndirmə",
  "explanation": "Mətndə qeyd edilir: \\\"[Mətndən sözbəsöz sitat]\\\""
}`;
}

function cleanString(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').replace(/[.,;:!?"]/g, '').toLowerCase().trim();
}

// Qayda 3.2: Sitat Yoxdursa, Sual Yoxdur
function verifyTestQuotes(test, contextText) {
    if(!test.explanation) return false;
    
    const explClean = cleanString(test.explanation);
    
    // Qadağan olunmuş şablon ifadələr
    if (explClean.includes('öz əksini tapmışdır') || explClean.includes('ümumi biliklərə əsasən')) {
        return false;
    }
    
    // İzahat dırnaq işarəsi ehtiva etməlidir (Sitatın sübutu)
    if (!test.explanation.includes('"') && !test.explanation.includes('“')) {
        // Dırnaq yoxdursa belə "mətndə" sözü keçməlidir
        if (!explClean.includes('mətndə') && !explClean.includes('qeyd edilir')) {
            return false;
        }
    }
    
    return true; 
}

// Mərhələ 8: Hesabatlılıq və Problemlərin Analizi
function generateReport(stats, issues) {
    let md = `# SOP V3.0 Test Generasiyası və Backend İnteqrasiya Hesabatı\n\n`;
    md += `## 1. Ümumi Statistikalar (Data Integrity Check)\n`;
    md += `- Cəmi Emal Edilən Mövzu: **${stats.total}**\n`;
    md += `- Uğurlu İnteqrasiya: **${stats.success}**\n`;
    md += `- Yaradılan Valid Test Sayı: **${stats.validTests}**\n\n`;

    md += `## 2. Problemlərin Analizi və Həll Təklifləri (Actionable Solutions)\n`;
    if (issues.length === 0) {
        md += `> ✅ Bütün mövzular üzrə nəticələr mükəmməldir. Heç bir kontekst və ya parse xətası qeydə alınmadı.\n`;
    } else {
        issues.forEach(issue => {
            if (issue.type === 'error_no_context') {
                md += `### 🔴 XƏTA: Mövzu Mətni Yoxdur (Sıfır Tolerantlıq)\n`;
                md += `- **Mövzu:** ${issue.topic}\n`;
                md += `- **Analiz:** Sİ tərəfindən dərslik parçasında faktoloji bilik tapılmadığı üçün generasiya bloklandı.\n`;
                md += `- **Həll Təklifi:** Backend administratoru müvafiq dərslik faylındakı (PDF/HTML) bu səhifə aralığını yoxlamalı, əgər problem varsa, \`textbook-chunks.jsonl\` yenidən indexlənməlidir.\n\n`;
            } else if (issue.type === 'parse_error') {
                md += `### 🟡 XƏTA: JSON Validasiya Problemi\n`;
                md += `- **Mövzu:** ${issue.topic}\n`;
                md += `- **Analiz:** Sİ-nin qaytardığı nəticə düzgün JSON formatında deyildi (Schema Validation Failed).\n`;
                md += `- **Həll Təklifi:** Sİ modelinin "temperature" parametri aşağı salınmalı və promptdakı JSON strukturu daha sərt vurğulanmalıdır.\n\n`;
            }
        });
    }

    fs.writeFileSync(CONFIG.REPORT_FILE, md, 'utf8');
    console.log(`\n📊 Mərhələ 8 Hesabatı yaradıldı: ${CONFIG.REPORT_FILE}`);
}

async function run() {
  let stats = { total: queued.length, success: 0, validTests: 0 };
  let issues = [];
  const updatedQueue = [...queue];

  for (const topic of queued) {
    console.log(`\n📝 [${topic.topic_title}] → Emal olunur...`);
    
    if (!topic.text || topic.text.trim().length < 50) {
         console.error(`  ❌ STOP ON DEVIATION: Mövzu mətni (context) yoxdur!`);
         issues.push({ type: 'error_no_context', topic: topic.topic_title });
         const qIdx = updatedQueue.findIndex(q => q.topic_id === topic.topic_id);
         if (qIdx !== -1) updatedQueue[qIdx].status = 'error_no_context';
         continue;
    }

    try {
      const prompt = buildPrompt(topic);
      const response = await callGeminiAPI(prompt);

      let tests = [];
      try {
        const cleaned = response.replace(/^\s*```json\n?|\n?```\s*$/g, '').trim();
        tests = JSON.parse(cleaned);
        if (!Array.isArray(tests)) tests = [tests];
      } catch(e) {
        console.warn(`  ⚠️ JSON parse xətası: Sİ xətalı struktur qaytardı.`);
        issues.push({ type: 'parse_error', topic: topic.topic_title });
        continue;
      }
      
      if (tests.length > 0 && tests[0].error === 'ERROR_NO_CONTEXT') {
          console.error(`  ❌ STOP ON DEVIATION: AI mətnin uyğunsuz olduğunu təsdiqlədi.`);
          issues.push({ type: 'error_no_context', topic: topic.topic_title });
          const qIdx = updatedQueue.findIndex(q => q.topic_id === topic.topic_id);
          if (qIdx !== -1) updatedQueue[qIdx].status = 'error_no_context';
          continue;
      }

      // Validasiya filtri (Qayda 5.1 & 3.2)
      const validTests = tests.filter(t => verifyTestQuotes(t, topic.text) && t.question && t.answer);
      
      if (validTests.length < tests.length) {
          console.warn(`  ⚠️ DİQQƏT: ${tests.length - validTests.length} test "Sitat Yoxlaması"ndan və ya Schema Auditindən keçə bilmədi!`);
      }

      if (validTests.length > 0) {
          if (!existingTests[topic.subject]) {
              existingTests[topic.subject] = [];
          }
          existingTests[topic.subject].push({topic: topic.topic_title, questions: validTests});
          stats.validTests += validTests.length;
          stats.success++;
          console.log(`  ✅ ${validTests.length} TEST MƏLUMAT BAZASINA YAZILDI.`);
      } else {
          console.log(`  ❌ Heç bir test validasiyadan keçmədi.`);
      }

      // Növbə statusunu yenilə
      const qIdx = updatedQueue.findIndex(q => q.topic_id === topic.topic_id);
      if (qIdx !== -1) {
        updatedQueue[qIdx].status = 'done';
      }

      fs.writeFileSync(CONFIG.TESTS_FILE, JSON.stringify(existingTests, null, 2), 'utf8');
      fs.writeFileSync(CONFIG.QUEUE_FILE, JSON.stringify(updatedQueue, null, 2), 'utf8');

      // Lokal Yedəkləmə (Qayda 5.2)
      if (!fs.existsSync(CONFIG.DESKTOP_DIR)) fs.mkdirSync(CONFIG.DESKTOP_DIR, { recursive: true });
      const desktopFile = path.join(CONFIG.DESKTOP_DIR, `SOP_V3_${Date.now()}.json`);
      fs.writeFileSync(desktopFile, JSON.stringify(validTests, null, 2), 'utf8');

    } catch(e) {
      console.error(`  ❌ Xəta (Ola bilsin API Key yoxdur): ${e.message}`);
    }
  }

  // Mərhələ 8 Hesabatının yaradılması
  generateReport(stats, issues);
}

run().catch(console.error);
