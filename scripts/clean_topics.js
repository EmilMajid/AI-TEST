/**
 * clean_topics.js
 * Mövzu başlıqlarını düzəldib tam, dərslik əsaslı
 * clean_topics_tebiet_6_final.json faylı yaradır.
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '../data/clean_topics_tebiet_6.json');
const OUTPUT = path.join(__dirname, '../data/clean_topics_tebiet_6_final.json');

const topics = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Manually correct or clean up topic titles
// The raw titles sometimes include the first sentence of the text.
// We extract the short title part before punctuation.
function cleanTitle(raw) {
  if (!raw) return raw;
  // Remove leading '. ' or '.. '
  let t = raw.replace(/^\.+\s*/, '').trim();
  // Take only up to the first full sentence separator that appears after at least 5 chars
  // Stop at • (bullet), multiple spaces (artifact of PDF), or sentence end
  t = t.split(/\s{3,}|\s*•\s*/)[0].trim();
  // Capitalize first letter
  t = t.charAt(0).toUpperCase() + t.slice(1);
  // Trim to max 80 chars
  if (t.length > 80) t = t.substring(0, 77) + '...';
  return t;
}

// Known correct topic names (manual mapping from curriculum knowledge)
const KNOWN_TITLES = {
  'tebiet-6-h1-t01': 'Qüvvənin təsiri nədən asılıdır',
  'tebiet-6-h1-t02': 'Ağırlıq qüvvəsi',
  'tebiet-6-h1-t03': 'Sürtünmə qüvvəsi',
  'tebiet-6-h1-t04': 'Arximed qüvvəsi',
  'tebiet-6-h1-t05': 'Tarazlaşan və tarazlaşmayan qüvvələr',
  'tebiet-6-h1-t06': 'Ümumiləşdirici tapşırıqlar (Qüvvələr)',
  'tebiet-6-h1-t07': 'Ürək necə işləyir',
  'tebiet-6-h1-t08': 'Bədəndə qan necə hərəkət edir',
  'tebiet-6-h1-t09': 'Qanın damarlarda hərəkəti',
  'tebiet-6-h1-t10': 'Ağciyərlərdə qazlar mübadiləsi',
  'tebiet-6-h1-t11': 'Ümumiləşdirici tapşırıqlar (Orqanlar)',
  'tebiet-6-h1-t12': 'Göbələk nədir',
  'tebiet-6-h1-t13': 'Bakteriya nədir',
  'tebiet-6-h1-t14': 'Göbələklər (Ümumiləşdirici)',
  'tebiet-6-h1-t15': 'Xəstəlik nədir',
  'tebiet-6-h1-t16': 'Yoluxucu xəstəliklərin qarşısını necə almaq olar',
  'tebiet-6-h1-t17': 'Bitki və heyvanların yoluxucu xəstəlikləri',
  'tebiet-6-h1-t18': 'Maddənin fiziki xassələri',
  'tebiet-6-h1-t19': 'Maddənin sıxlığı',
  'tebiet-6-h1-t20': 'Maddəni təşkil edən zərrəciklər',
  'tebiet-6-h1-t21': 'Su molekulu',
  'tebiet-6-h1-t22': 'Diffuziya',
  'tebiet-6-h1-t23': 'Maddənin sıxlığı (Tətbiq)',
  'tebiet-6-h1-t24': 'Qarışıqlar',
  'tebiet-6-h1-t25': 'Maddələrin həllolması',
  'tebiet-6-h1-t26': 'Eynicinsli və müxtəlifcinsli qarışıqlar',
  'tebiet-6-h1-t27': 'Saf maddələr',
  'tebiet-6-h1-t28': 'Suyun əhəmiyyəti',
  'tebiet-6-h1-t29': 'Su (Ümumiləşdirici)',
  'tebiet-6-h1-t30': 'Yer qabığındakı süxurlar',
  'tebiet-6-h1-t31': 'Hava şəraiti və süxurların aşınması',
  'tebiet-6-h1-t32': 'Torpaq necə yaranır',
  'tebiet-6-h1-t33': 'Süxurların dövranı (Ümumiləşdirici)',
  'tebiet-6-h2-t01': 'Elektrik cərəyanı',
  'tebiet-6-h2-t02': 'Ardıcıl və paralel birləşmələr',
  'tebiet-6-h2-t03': 'Keçiricilər və dielektriklər',
  'tebiet-6-h2-t04': 'Elektrik (Fəaliyyət)',
  'tebiet-6-h2-t05': 'Elektrik dövrəsi (Ümumiləşdirici)',
  'tebiet-6-h2-t06': 'Səs necə yaranır',
  'tebiet-6-h2-t07': 'Səslər bir-birindən necə fərqlənir',
  'tebiet-6-h2-t08': 'Səs başqa mühitlərdə yayılırmı',
  'tebiet-6-h2-t09': 'Səs (Ümumiləşdirici)',
  'tebiet-6-h2-t10': 'Cisimlərin istidən genişlənməsi',
  'tebiet-6-h2-t11': 'İstilik tarazlığı və istilikkeçirmə',
  'tebiet-6-h2-t12': 'İstilik enerjisinin konveksiya ilə ötürülməsi',
  'tebiet-6-h2-t13': 'İstilik enerjisinin şüalanma ilə ötürülməsi',
  'tebiet-6-h2-t14': 'İstilik (Ümumiləşdirici)',
  'tebiet-6-h2-t15': 'Uyğunlaşma nədir',
  'tebiet-6-h2-t16': 'Heyvanlar mühitə necə uyğunlaşır',
  'tebiet-6-h2-t17': 'Heyvanlar sağ qalmaq üçün necə uyğunlaşır',
  'tebiet-6-h2-t18': 'Bitkilər ətraf mühitə necə uyğunlaşır',
  'tebiet-6-h2-t19': 'Canlılar ekstremal temperaturlarda necə yaşayır',
  'tebiet-6-h2-t20': 'Canlılar mühitə uyğunlaşa bilmədikdə nə baş verir',
  'tebiet-6-h2-t21': 'Uyğunlaşma (Ümumiləşdirici)',
  'tebiet-6-h2-t22': 'Canlılar bir-birindən necə asılıdır',
  'tebiet-6-h2-t23': 'Qida zənciri',
  'tebiet-6-h2-t24': 'Ekoloji piramidalar nədir',
  'tebiet-6-h2-t25': 'Ekosistem (Ümumiləşdirici)',
  'tebiet-6-h2-t26': 'Fosillər və fosil yanacaqlar',
  'tebiet-6-h2-t27': 'Yanma prosesi',
  'tebiet-6-h2-t28': 'Təbiətdə karbon dövranı',
  'tebiet-6-h2-t29': 'İstixana effekti və qlobal istiləşmə',
  'tebiet-6-h2-t30': 'Enerji (Ümumiləşdirici)',
  'tebiet-6-h2-t31': 'Günəş sisteminin quruluşu',
  'tebiet-6-h2-t32': 'Ay və Yerin hərəkəti',
  'tebiet-6-h2-t33': 'Yer kürəsi və fəsillər',
  'tebiet-6-h2-t34': 'Astronomiya (Ümumiləşdirici)',
};

// Remap topics renumbered after cleaning
let h1idx = 0, h2idx = 0;
const cleaned = topics.map(t => {
  let bookPart = t.book_id.includes('h1') ? 'h1' : 'h2';
  if (bookPart === 'h1') h1idx++;
  else h2idx++;
  const idx = bookPart === 'h1' ? h1idx : h2idx;
  const newId = `tebiet-6-${bookPart}-t${String(idx).padStart(2,'0')}`;

  const knownTitle = KNOWN_TITLES[newId];
  const autoTitle = cleanTitle(t.topic_title);

  return {
    ...t,
    id: newId,
    topic_title: knownTitle || autoTitle,
    raw_title: t.topic_title,
    text_length: t.text.length,
    // Keep text for later use
  };
});

// Print summary
console.log(`Cəmi: ${cleaned.length} mövzu`);
cleaned.forEach(t => {
  console.log(`  ${t.id}: "${t.topic_title}" (s.${t.start_page}-${t.end_page}, ${t.chunk_count} chunk, ${t.text_length} karakter)`);
});

fs.writeFileSync(OUTPUT, JSON.stringify(cleaned, null, 2), 'utf8');
console.log(`\n✅ ${OUTPUT} yazıldı`);
