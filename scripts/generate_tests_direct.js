/**
 * generate_tests_direct.js
 * Test generasiyasını birbaşa Node.js içindən edir.
 * Hər mövzu üçün prompt faylını oxuyur, "testlər" yaradır
 * və offline_tests.json-a əlavə edir.
 * 
 * Bu skript - testləri özü AI ilə generasiya edir, 
 * bunun üçün Antigravity-nin daxili API-sini istifadə edir.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const QUEUE_FILE  = path.join(__dirname, '../data/test_generation_queue_tebiet6.json');
const TESTS_FILE  = path.join(__dirname, '../data/offline_tests.json');
const DESKTOP_DIR = 'C:\\Users\\User\\OneDrive\\Desktop\\6-cı sinif testləri';
const LOG_FILE    = path.join(__dirname, '../data/tebiet6_generation_log.json');

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

if (!API_KEY) {
  console.error('❌ API açarı tapılmadı! .env faylında GEMINI_API_KEY olmalıdır.');
  process.exit(1);
}

// Mövcud testləri yüklə
let existingTests = [];
if (fs.existsSync(TESTS_FILE)) {
  try { existingTests = JSON.parse(fs.readFileSync(TESTS_FILE, 'utf8')); } catch(e) {}
}

// Növbəni yüklə
const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
const queued = queue.filter(q => q.status === 'queued');

console.log(`\n🚀 Birbaşa Test Generator`);
console.log(`   API Key: ${API_KEY.substring(0,8)}...`);
console.log(`   Növbədə: ${queued.length} mövzu`);

if (queued.length === 0) {
  console.log('Heç bir mövzu "queued" statusunda deyil. Əvvəlcə run_tebiet6_generator.js işlət.');
  process.exit(0);
}

// Gemini API çağırışı
function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
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

// Mövzu üçün prompt yarat
function buildPrompt(topic) {
  return `Sən Azərbaycan təhsil sistemi üçün test sualları hazırlayan ekspertsən.

Aşağıda 6-cı sinif Təbiət dərsliyinin "${topic.topic_title}" mövzusunun mətninin bir hissəsi verilmişdir:

---
${(topic.text || '').substring(0, 3500)}
---

Bu mövzu üçün ${topic.count} test tapşırığı hazırla (${topic.breakdown}).

Hər test üçün bu JSON strukturu:
{
  "grade": 6,
  "subject": "Təbiət",
  "topic": "${topic.topic_title}",
  "book_id": "${topic.book_id}",
  "pages": "${topic.start_page}-${topic.end_page}",
  "passport": "${topic.passport_prefix}XX",
  "question": "Sual?",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
  "answer": "A",
  "difficulty": "sadə",
  "bloom": "bilik",
  "explanation": "İzahat. Bax: s.${topic.start_page}"
}

Qaydalar:
- XX yerinə 01-dən başlayan ardıcıl nömrə yaz
- difficulty: sadə / orta / çətin
- bloom: bilik / anlama / tətbiq / təhlil
- Hər sualın yalnız bir düzgün cavabı olsun
- Azərbaycan dilində yaz
- Yalnız JSON massiv formatında cavab ver: [{...}, {...}]`;
}

// Log
let log = [];
if (fs.existsSync(LOG_FILE)) {
  try { log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch(e) {}
}

// Əsas generasiya prosesi
async function generate() {
  let totalGenerated = 0;
  const updatedQueue = [...queue];

  for (const topic of queued) {
    console.log(`\n📝 [${topic.topic_id}] "${topic.topic_title}" → ${topic.count} test...`);

    try {
      const prompt = buildPrompt(topic);
      const response = await callGeminiAPI(prompt);

      let tests = [];
      try {
        // JSON parse
        const cleaned = response.replace(/^```json\n?|\n?```$/g, '').trim();
        tests = JSON.parse(cleaned);
        if (!Array.isArray(tests)) tests = [tests];
      } catch(e) {
        console.warn(`  ⚠️ JSON parse xətası: ${e.message}`);
        console.warn(`  Response başlanğıcı: ${response.substring(0, 200)}`);
        log.push({ topic_id: topic.topic_id, status: 'error', error: e.message, at: new Date().toISOString() });
        continue;
      }

      // Testləri mövcud test bazasına əlavə et
      existingTests.push(...tests);
      totalGenerated += tests.length;

      // Növbə statusunu yenilə
      const qIdx = updatedQueue.findIndex(q => q.topic_id === topic.topic_id);
      if (qIdx !== -1) {
        updatedQueue[qIdx].status = 'done';
        updatedQueue[qIdx].generated_count = tests.length;
        updatedQueue[qIdx].done_at = new Date().toISOString();
      }

      log.push({ topic_id: topic.topic_id, status: 'done', count: tests.length, at: new Date().toISOString() });
      console.log(`  ✅ ${tests.length} test generasiya edildi`);

      // Hər mövzudan sonra saxla
      fs.writeFileSync(TESTS_FILE, JSON.stringify(existingTests, null, 2), 'utf8');
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2), 'utf8');
      fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');

      // Desktop-a da yaz
      const desktopFile = path.join(DESKTOP_DIR, `tebiet6_${topic.topic_id}.json`);
      if (!fs.existsSync(DESKTOP_DIR)) fs.mkdirSync(DESKTOP_DIR, { recursive: true });
      fs.writeFileSync(desktopFile, JSON.stringify(tests, null, 2), 'utf8');

      // Rate limit üçün 2 saniyə gözlə
      await new Promise(r => setTimeout(r, 2000));

    } catch(e) {
      console.error(`  ❌ Xəta: ${e.message}`);
      log.push({ topic_id: topic.topic_id, status: 'error', error: e.message, at: new Date().toISOString() });
      fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
    }
  }

  console.log(`\n🎉 Bitdi! Cəmi ${totalGenerated} test generasiya edildi`);
  console.log(`   Mövcud testlər (cəmi): ${existingTests.length}`);
}

generate().catch(console.error);
