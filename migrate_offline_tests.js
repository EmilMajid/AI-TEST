const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'offline_tests.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const db = JSON.parse(rawData);

// Hardcoded constants for the migration
const GRADE = 7;
const EDITION = 1;
const PART = 1;

const TIK_SUBJECT_CODES = {
  "Azərbaycan dili": "001",
  "Ədəbiyyat": "002",
  "Azərbaycan tarixi": "003",
  "Riyaziyyat": "004",
  "İngilis dili (əsas xarici dil)": "005",
  "İngilis dili (ikinci xarici dil)": "006",
  "İngilis dili": "005",
  "Təbiət": "007",
  "İnformatika": "008",
  "Ümumi tarix": "009",
  "Fizika": "010",
  "Kimya": "011",
  "Biologiya": "012",
  "Coğrafiya": "013",
  "Həyat bilgisi": "014",
  "Texnologiya": "015",
  "Təsviri İncəsənət": "016",
  "Təsviri incəsənət": "016",
  "Musiqi": "017",
  "Fiziki tərbiyə": "018",
  "Alman dili (əsas xarici dil)": "019",
  "Alman dili (ikinci xarici dil)": "020",
  "Alman dili": "019",
  "Fransız dili (əsas xarici dil)": "021",
  "Fransız dili (ikinci xarici dil)": "022",
  "Fransız dili": "021",
  "Rus dili (əsas xarici dil)": "023",
  "Rus dili (ikinci xarici dil)": "024",
  "Rus dili": "023",
  "Русский язык": "023",
  "null": "999"
};

const TIK_BLOOM_CODES = {
  "xatırlama": "01",
  "bilmə": "01",
  "anlama": "02",
  "tətbiq": "03",
  "analiz": "04",
  "dəyərləndirmə": "05",
  "yaratma": "06"
};

const TIK_DIFFICULTY_CODES = {
  "sadə": "01",
  "orta": "02",
  "çətin": "03"
};

function generateTopicCode(topicName, topicIndex) {
  // If it's something like "BÖLMƏ 1. STATİSTİKA", we can try to extract the number
  // Or simply generate a sequential code like B01AM01 (Bölmə 01 Alt Mövzu 01)
  // For simplicity and uniqueness, since we don't have exact chapter numbers for everything:
  return `B01AM${(topicIndex + 1).toString().padStart(2, '0')}`;
}

let totalMigrated = 0;

Object.keys(db).forEach(subj => {
  const topics = db[subj];
  const subjCode = TIK_SUBJECT_CODES[subj] || "999";
  
  topics.forEach((t, topicIndex) => {
    if (!t.questions) return;
    
    const topicCode = generateTopicCode(t.topic, topicIndex);
    
    t.questions.forEach((q, qIndex) => {
      const g = GRADE.toString().padStart(2, '0');
      const ep = EDITION.toString().padStart(2, '0') + PART.toString().padStart(2, '0');
      const tc = topicCode.toUpperCase();
      
      const safeBloom = q.bloomLevel ? q.bloomLevel.toLowerCase().trim() : '';
      const bloom = TIK_BLOOM_CODES[safeBloom] || "00";
      
      const safeDiff = q.difficulty ? q.difficulty.toLowerCase().trim() : '';
      const diff = TIK_DIFFICULTY_CODES[safeDiff] || "00";
      
      const idx = (qIndex + 1).toString().padStart(3, '0');
      
      q.passport_id = `${g}-${subjCode}-${ep}-${tc}-${bloom}-${diff}-${idx}`;
      totalMigrated++;
    });
  });
});

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Migration complete. Successfully assigned passport IDs to ${totalMigrated} tests.`);
