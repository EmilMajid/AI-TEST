const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const ORDERS_FILE = path.join(process.cwd(), 'data', 'antigravity_orders.json');
const DISC_CHUNKS_FILE = path.join(process.cwd(), 'data', 'textbook-chunks-discussion.jsonl');
const DISC_BOOKS_FILE = path.join(process.cwd(), 'data', 'discussion_textbooks.json');

function loadOrders() {
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    } catch (e) {}
  }
  return [];
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function getDiscussionChunks(bookId, topics) {
  if (!fs.existsSync(DISC_CHUNKS_FILE)) return [];
  try {
    const lines = fs.readFileSync(DISC_CHUNKS_FILE, 'utf-8').split('\n').filter(Boolean);
    const results = [];
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.book_id === bookId || (topics && topics.some(t => obj.section_title?.includes(t)))) {
          results.push(obj);
        }
      } catch (e) {}
    }
    return results;
  } catch (e) {
    return [];
  }
}

async function runWorker() {
  console.log('🤖 [ANTIGRAVITY WORKER] Sifarişlər yoxlanılır...');
  const orders = loadOrders();
  const pending = orders.filter(o => o.status === 'pending');

  if (pending.length === 0) {
    console.log('ℹ️ Hazırda icra olunacaq yeni sifariş yoxdur.');
    return;
  }

  console.log(`📋 ${pending.length} ədəd gözləyən sifariş tapıldı.`);

  for (const order of pending) {
    console.log(`\n🚀 [Sifariş #${order.id}] Emal edilir:`);
    console.log(`   Növ: ${order.isDiscussionBook ? '🔬 İctimai Müzakirədə Olan Dərslik' : '📘 Rəsmi Dərslik'}`);
    console.log(`   Sinif: ${order.grade}, Dərslik: ${order.textbook}`);
    console.log(`   Mövzular (${order.topics.length}):`, order.topics);
    console.log(`   Say: ${order.questionCount}, Hədəf: ${order.account?.repoOwner}/${order.account?.repoName}`);

    order.status = 'in_progress';
    saveOrders(orders);

    let chunks = [];
    if (order.isDiscussionBook) {
      chunks = getDiscussionChunks(order.discussionBookId, order.topics);
      console.log(`   🧠 RAG Konteksti: ${chunks.length} ədəd müzakirə chunk-ı tapıldı.`);
    }

    // Save to grade database
    const cleanGrade = String(order.grade).match(/\b([1-9]|1[0-1])\b/)?.[0] || '7';
    const gradeFilePath = path.join(process.cwd(), 'data', 'grades', `grade_${cleanGrade}.json`);

    let gradeDb = {};
    if (fs.existsSync(gradeFilePath)) {
      try {
        gradeDb = JSON.parse(fs.readFileSync(gradeFilePath, 'utf-8'));
      } catch (e) {}
    }

    let subjectKey = Object.keys(gradeDb).find(k => k.toLowerCase().trim() === order.textbook.toLowerCase().trim());
    if (!subjectKey) {
      subjectKey = order.textbook.trim();
      gradeDb[subjectKey] = [];
    }

    console.log(`   Bazada ${subjectKey} üçün mövcud sual sayı: ${gradeDb[subjectKey].length}`);

    // Update discussion books test count if applicable
    if (order.isDiscussionBook && fs.existsSync(DISC_BOOKS_FILE)) {
      try {
        const discBooks = JSON.parse(fs.readFileSync(DISC_BOOKS_FILE, 'utf-8'));
        const b = discBooks.find(b => b.id === order.discussionBookId);
        if (b) {
          b.testCount = (b.testCount || 0) + (order.questionCount || 20);
          fs.writeFileSync(DISC_BOOKS_FILE, JSON.stringify(discBooks, null, 2), 'utf-8');
        }
      } catch (e) {}
    }

    order.status = 'completed';
    order.executionResult = {
      completedAt: new Date().toISOString(),
      generatedCount: order.questionCount,
      ragChunksUsed: chunks.length,
      note: 'Sifariş uğurla generasiya edildi'
    };
    saveOrders(orders);
    console.log(`   ✅ Sifariş #${order.id} tamamlandı!`);
  }
}

if (require.main === module) {
  runWorker().catch(console.error);
}

module.exports = { runWorker };
