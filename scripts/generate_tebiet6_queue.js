/**
 * generate_tebiet6_queue.js
 * Təbiət 6 dərsliyinin 67 mövzusu üzrə test generasiya növbəsi yaradır.
 * data/clean_topics_tebiet_6_final.json mövzu faylından oxuyur.
 * Nəticəni data/test_generation_queue_tebiet6.json faylına yazır.
 */

const fs = require('fs');
const path = require('path');

const TOPICS_FILE = path.join(__dirname, '../data/clean_topics_tebiet_6_final.json');
const QUEUE_FILE  = path.join(__dirname, '../data/test_generation_queue_tebiet6.json');
const DESKTOP_DIR = 'C:\\Users\\User\\OneDrive\\Desktop\\6-cı sinif testləri';

if (!fs.existsSync(DESKTOP_DIR)) {
  fs.mkdirSync(DESKTOP_DIR, { recursive: true });
}

const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));

// Mövzu mətninin həcminə görə test sayını müəyyən et
function getLevelLogic(textLength) {
  if (textLength <  1500) return { level: 1, count: 15, breakdown: '5 sadə, 5 orta, 5 çətin' };
  if (textLength <  3000) return { level: 2, count: 18, breakdown: '6 sadə, 6 orta, 6 çətin' };
  if (textLength <  5000) return { level: 3, count: 21, breakdown: '7 sadə, 7 orta, 7 çətin' };
  if (textLength <  7000) return { level: 4, count: 24, breakdown: '8 sadə, 8 orta, 8 çətin' };
  if (textLength < 10000) return { level: 5, count: 27, breakdown: '9 sadə, 9 orta, 9 çətin' };
  return                         { level: 6, count: 30, breakdown: '10 sadə, 10 orta, 10 çətin' };
}

// Fənn kodu: Təbiət = 003
const SUBJECT_CODE = '003';
const GRADE_CODE   = '06';

const queue = [];

for (const topic of topics) {
  const logic = getLevelLogic(topic.text_length || (topic.text ? topic.text.length : 0));

  // Topic ID nümunəsi: tebiet-6-h1-t01 → 01 götürürük
  const topicNum = topic.id.split('-t')[1] || '00';
  // Kitab hissəsi kodu: h1 → 1, h2 → 2
  const bookPart = topic.book_id.includes('h1') ? '1' : '2';

  // Pasport prefiksi: 06-003-H{part}-T{num}
  const passportPrefix = `${GRADE_CODE}-${SUBJECT_CODE}-H${bookPart}-T${topicNum}-`;

  queue.push({
    topic_id:        topic.id,
    topic_title:     topic.topic_title,
    book_id:         topic.book_id,
    book_name:       topic.book_name,
    start_page:      topic.start_page,
    end_page:        topic.end_page,
    chunk_count:     topic.chunk_count,
    text_length:     topic.text_length || (topic.text ? topic.text.length : 0),
    text:            topic.text,
    level:           logic.level,
    count:           logic.count,
    breakdown:       logic.breakdown,
    passport_prefix: passportPrefix,
    status:          'pending',
    created_at:      new Date().toISOString()
  });
}

fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');

// Xülasə
const totalTests = queue.reduce((s, q) => s + q.count, 0);
console.log(`✅ Test generasiya növbəsi yaradıldı!`);
console.log(`   📚 Mövzu sayı: ${queue.length}`);
console.log(`   📝 Ümumi test sayı (planlaşdırılan): ${totalTests}`);
console.log(`   📄 Fayl: ${QUEUE_FILE}\n`);

// Bölmələr üzrə xülasə
const h1 = queue.filter(q => q.book_id === 'tebiet-6-h1');
const h2 = queue.filter(q => q.book_id === 'tebiet-6-h2');
console.log(`   Hissə 1: ${h1.length} mövzu, ${h1.reduce((s,q)=>s+q.count,0)} test`);
console.log(`   Hissə 2: ${h2.length} mövzu, ${h2.reduce((s,q)=>s+q.count,0)} test`);

console.log('\n--- İlk 5 mövzu ---');
queue.slice(0, 5).forEach(q => {
  console.log(`  [${q.topic_id}] "${q.topic_title}"`);
  console.log(`    s.${q.start_page}-${q.end_page} | ${q.text_length} kar | Səv.${q.level} | ${q.count} test | ${q.breakdown}`);
});
