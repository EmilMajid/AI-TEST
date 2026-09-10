const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const ORDERS_FILE = path.join(process.cwd(), 'data', 'antigravity_orders.json');

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
    console.log(`   Sinif: ${order.grade}, Dərslik: ${order.textbook}`);
    console.log(`   Mövzular (${order.topics.length}):`, order.topics);
    console.log(`   Say: ${order.questionCount}, Hədəf: ${order.account?.repoOwner}/${order.account?.repo}`);

    order.status = 'in_progress';
    saveOrders(orders);

    // Save to grade database
    const cleanGrade = String(order.grade).match(/\b([1-9]|1[0-1])\b/)?.[0] || '2';
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
  }
}

if (require.main === module) {
  runWorker().catch(console.error);
}

module.exports = { runWorker };
