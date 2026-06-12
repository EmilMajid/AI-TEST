/**
 * build_tebiet6_topics.js
 * Təbiət 6 dərslikinin (h1 + h2) bütün mövzularını avtomatik çıxarır.
 * Nəticəni data/clean_topics_tebiet_6.json faylına yazır.
 */

const fs = require('fs');
const path = require('path');

const CHUNK_FILE = path.join(__dirname, '../data/textbook-chunks.jsonl');
const OUTPUT_FILE = path.join(__dirname, '../data/clean_topics_tebiet_6.json');

const raw = fs.readFileSync(CHUNK_FILE, 'utf8').trim().split('\n');
const allChunks = raw.filter(Boolean).map(l => JSON.parse(l));

// Yalnız Təbiət 6 chunklarını seç
const tebiet6 = allChunks.filter(c => c.grade === 6 && c.subject === 'Təbiət');

// Mövzu başlığı pattern: '. Böyük hərf ilə başlayan cümlə' (tək nöqtə + boşluq)
// Daha dəqiq: text '. SomeTopic' ilə başlayır - bu əsas mövzu
// '.. SubTopic' - alt mövzu (bunlar da ayrıca test üçün istifadə ediləcək)
// Xülasə, Ümumiləşdirici tapşırıqlar - bölmə sonu
const TOPIC_START_RE = /^\.\s+([A-ZÜÖĞŞÇİƏ][^\n.]{3,80})/;
const SUBTOPIC_START_RE = /^\.\.\s+([A-ZÜÖĞŞÇİƏ][^\n.]{3,80})/;
const SUMMARY_RE = /^(Xülasə|Ümumiləşdirici tapşırıqlar)/;

// Hər bir kitab üçün ayrıca işlə
const books = ['tebiet-6-h1', 'tebiet-6-h2'];
const bookNames = {
  'tebiet-6-h1': 'Hissə 1',
  'tebiet-6-h2': 'Hissə 2'
};

let allTopics = [];

for (const bookId of books) {
  const bookChunks = tebiet6
    .filter(c => c.book_id === bookId)
    .sort((a, b) => a.page - b.page);

  console.log(`\n=== ${bookId}: ${bookChunks.length} chunk ===`);

  let currentTopic = null;
  let topicIndex = 0;

  for (const chunk of bookChunks) {
    const text = chunk.text.trim();
    const firstLine = text.split('\n')[0].trim();

    // Yeni əsas mövzu başlayırmı?
    const mainMatch = text.match(TOPIC_START_RE);
    const subMatch = text.match(SUBTOPIC_START_RE);
    const summaryMatch = SUMMARY_RE.test(text);

    if (mainMatch && !subMatch) {
      // Köhnə mövzunu saxla
      if (currentTopic) allTopics.push(currentTopic);

      topicIndex++;
      currentTopic = {
        id: `tebiet-6-${bookId.replace('tebiet-6-','')}-t${String(topicIndex).padStart(2,'0')}`,
        book_id: bookId,
        book_name: bookNames[bookId],
        topic_title: mainMatch[1].trim(),
        type: 'main',
        start_page: chunk.page,
        end_page: chunk.page,
        text: text,
        chunk_count: 1
      };
    } else if (subMatch) {
      // Alt mövzu - mövcud mövzuya əlavə et, amma ayrıca da qeyd et
      if (currentTopic) {
        currentTopic.text += '\n\n' + text;
        currentTopic.end_page = chunk.page;
        currentTopic.chunk_count++;
        // Alt mövzu adlarını saxla
        if (!currentTopic.subtopics) currentTopic.subtopics = [];
        currentTopic.subtopics.push({
          title: subMatch[1].trim(),
          page: chunk.page
        });
      }
    } else if (summaryMatch) {
      // Xülasə/Ümumiləşdirici - mövcud mövzunu bitir
      if (currentTopic) {
        currentTopic.text += '\n\n' + text;
        currentTopic.end_page = chunk.page;
        currentTopic.chunk_count++;
        allTopics.push(currentTopic);
        currentTopic = null;
      }
    } else {
      // Adi davam mətni
      if (currentTopic) {
        currentTopic.text += '\n\n' + text;
        currentTopic.end_page = chunk.page;
        currentTopic.chunk_count++;
      }
    }
  }

  // Son mövzunu əlavə et
  if (currentTopic) allTopics.push(currentTopic);
}

// Xülasə
console.log(`\nCəmi tapılan mövzu: ${allTopics.length}`);
allTopics.forEach((t, i) => {
  console.log(`${i+1}. [${t.book_id}] ${t.topic_title} (s.${t.start_page}-${t.end_page}, ${t.chunk_count} chunk)`);
});

// Nəticəni saxla
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTopics, null, 2), 'utf8');
console.log(`\n✅ ${OUTPUT_FILE} faylına yazıldı (${allTopics.length} mövzu)`);
