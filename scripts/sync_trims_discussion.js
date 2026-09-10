/**
 * TRİMS İctimai Müzakirədə Olan Dərsliklərin Avtomatik Sinxronizatoru
 * URL: https://www.trims.edu.az/site/search.php?category_id=f-2&book_type_id=&lang_id=1&grif_no=&grif_date=&search=ok
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DISC_FILE = path.join(process.cwd(), 'data', 'discussion_textbooks.json');
const SEARCH_URL = 'https://www.trims.edu.az/site/search.php?category_id=f-2&book_type_id=&lang_id=1&grif_no=&grif_date=&search=ok';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function sync() {
  console.log('🔍 [TRİMS SYNC] İctimai müzakirədə olan dərsliklər axtarılır...');
  try {
    const html = await fetchUrl(SEARCH_URL);
    const re = /resource\.php\?id=(\d+)/g;
    let match;
    const ids = new Set();
    while ((match = re.exec(html)) !== null) {
      ids.add(match[1]);
    }

    console.log(`📋 TRİMS portalında tapılan resurs sayı: ${ids.size}`);
    console.log('ID-lər:', Array.from(ids));

    let existingBooks = [];
    if (fs.existsSync(DISC_FILE)) {
      try {
        existingBooks = JSON.parse(fs.readFileSync(DISC_FILE, 'utf-8'));
      } catch (e) {}
    }

    console.log(`📁 Platformada mövcud qeydiyyat sayı: ${existingBooks.length}`);
    const registeredIds = new Set(existingBooks.map(b => String(b.trimsId)));

    const newIds = Array.from(ids).filter(id => !registeredIds.has(id));
    if (newIds.length === 0) {
      console.log('✅ Bütün dərsliklər artıq platformada qeydiyyatdan keçib və tam sinxron vəziyyətdədir.');
    } else {
      console.log(`⚠️ Yeni əlavə olunmuş ${newIds.length} resurs tapıldı:`, newIds);
    }
  } catch (err) {
    console.error('❌ Sinxronizasiya xətası:', err.message);
  }
}

if (require.main === module) {
  sync();
}

module.exports = { sync };
