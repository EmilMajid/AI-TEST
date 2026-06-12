/**
 * run_tebiet6_generator.js
 * Təbiət 6 test generasiya agentini işə salır.
 * Növbədən pending mövzuları götürür, hər birini ayrıca subagent vasitəsilə emal edir.
 * 
 * İstifadə: node scripts/run_tebiet6_generator.js [--from <topic_id>] [--limit <n>]
 */

const fs = require('fs');
const path = require('path');

const QUEUE_FILE   = path.join(__dirname, '../data/test_generation_queue_tebiet6.json');
const TESTS_FILE   = path.join(__dirname, '../data/offline_tests.json');
const DESKTOP_DIR  = 'C:\\Users\\User\\OneDrive\\Desktop\\6-cı sinif testləri';
const LOG_FILE     = path.join(__dirname, '../data/tebiet6_generation_log.json');

// CLI args
const args = process.argv.slice(2);
const fromIdx  = args.indexOf('--from');
const limitIdx = args.indexOf('--limit');
const fromId   = fromIdx  !== -1 ? args[fromIdx  + 1] : null;
const limit    = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 5;

// Mövcud testləri yüklə
let existingTests = [];
if (fs.existsSync(TESTS_FILE)) {
  existingTests = JSON.parse(fs.readFileSync(TESTS_FILE, 'utf8'));
}

// Növbəni yüklə
const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
let pending = queue.filter(q => q.status === 'pending');

// --from ilə başlama nöqtəsi
if (fromId) {
  const startIdx = pending.findIndex(q => q.topic_id === fromId);
  if (startIdx !== -1) pending = pending.slice(startIdx);
}

// Limit tətbiq et
const batch = pending.slice(0, limit);

console.log(`\n🚀 Təbiət 6 Test Generator`);
console.log(`   Növbədə: ${pending.length} mövzu`);
console.log(`   Bu turda: ${batch.length} mövzu işlənəcək`);
console.log(`   Hazırda mövcud testlər: ${existingTests.length}\n`);

if (batch.length === 0) {
  console.log('✅ Bütün mövzular artıq emal edilib!');
  process.exit(0);
}

// Log faylı
let log = [];
if (fs.existsSync(LOG_FILE)) {
  log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
}

// Hər mövzu üçün prompt yarat
function buildPrompt(topic) {
  return `Sən Azərbaycan təhsil sistemi üçün test sualları hazırlayan mütəxəssissan.

Aşağıda Azərbaycan 6-cı sinif Təbiət dərsliyinin "${topic.topic_title}" mövzusunun məzmunu verilmişdir (${topic.book_name}, s.${topic.start_page}-${topic.end_page}):

---DƏRSLIK MƏTNİ---
${topic.text.substring(0, 4000)}
---MƏTNİN SONU---

Bu mövzu üçün ${topic.count} test tapşırığı hazırla (${topic.breakdown}).

HƏR TEST TAPŞIRIĞI üçün aşağıdakı JSON formatını istifadə et:
{
  "grade": 6,
  "subject": "Təbiət",
  "topic": "${topic.topic_title}",
  "book_id": "${topic.book_id}",
  "pages": "${topic.start_page}-${topic.end_page}",
  "passport": "${topic.passport_prefix}{N}",
  "question": "Sual mətni?",
  "options": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "answer": "A",
  "difficulty": "sadə|orta|çətin",
  "bloom": "bilik|anlama|tətbiq|təhlil|qiymətləndirmə|yaradıcılıq",
  "explanation": "Düzgün cavabın izahı. Dərslikdə oxumaq üçün: s.${topic.start_page}-${topic.end_page}"
}

QAYDALAR:
1. Suallar mövzunun məzmununa əsaslanmalıdır
2. Hər sualın yalnız bir düzgün cavabı olmalıdır
3. Yanlış cavablar (distraktorlar) inandırıcı olmalıdır
4. Çətinlik: sadə=faktual bilgi, orta=anlama/izah, çətin=tətbiq/analiz
5. İzahat bölümündə şagirdə hansı səhifəni oxumalı olduğunu da qeyd et
6. Pasportda {N} yerinə 01-dən başlayan ardıcıl rəqəm yaz
7. JSON massiv formatında çıxar: [test1, test2, ...]

Yalnız JSON formatında cavab ver, heç bir əlavə izahat yazma.`;
}

// Batch üzərindən keç
console.log('--- Mövzular ---');
batch.forEach((topic, i) => {
  console.log(`${i+1}. [${topic.topic_id}] ${topic.topic_title} → ${topic.count} test`);
});

console.log('\n📋 Prompt faylları yaradılır...');

// Hər mövzu üçün ayrıca prompt fayl yarat
const PROMPTS_DIR = path.join(__dirname, '../data/tebiet6_prompts');
if (!fs.existsSync(PROMPTS_DIR)) fs.mkdirSync(PROMPTS_DIR, { recursive: true });

batch.forEach(topic => {
  const prompt = buildPrompt(topic);
  const promptFile = path.join(PROMPTS_DIR, `${topic.topic_id}.txt`);
  fs.writeFileSync(promptFile, prompt, 'utf8');
  console.log(`  ✓ ${topic.topic_id}.txt (${prompt.length} karakter)`);
});

console.log(`\n✅ ${batch.length} prompt faylı hazır: ${PROMPTS_DIR}`);
console.log('\nSonrakı addım: Bu mövzular üçün subagentlər vasitəsilə testlər generasiya ediləcək.');
console.log('Hər mövzu üçün prompt faylı hazırdır. Növbəti addımda agent işə salınacaq.\n');

// Növbənin status-unu "queued" etmək üçün
const updatedQueue = queue.map(q => {
  const found = batch.find(b => b.topic_id === q.topic_id);
  if (found) return { ...q, status: 'queued', queued_at: new Date().toISOString() };
  return q;
});
fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2), 'utf8');
console.log(`📝 Növbə faylı yeniləndi: ${batch.length} mövzu "queued" statusuna keçirildi`);
