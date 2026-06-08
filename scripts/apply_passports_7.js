const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/offline_tests.json');
const backupPath = path.join(__dirname, '../data/offline_tests.json.pre_passport.bak');

// 1. Create a backup
if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ Backup created at ${backupPath}`);
} else {
    console.error("❌ offline_tests.json not found!");
    process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let totalChecked = 0;
let totalPassed = 0;
let totalFailed = 0;

// Mapping to generate subject ID prefix
let subjectCounter = 1;
const subjectCodeMap = {};

function getSubjectCode(subjectName) {
    if (!subjectCodeMap[subjectName]) {
        subjectCodeMap[subjectName] = String(subjectCounter).padStart(3, '0');
        subjectCounter++;
    }
    return subjectCodeMap[subjectName];
}

function cleanDifficulty(diff) {
    if (!diff) return 'orta';
    const d = diff.toLowerCase();
    if (d.includes('asan') || d.includes('sadə')) return 'sadə';
    if (d.includes('çətin')) return 'çətin';
    return 'orta';
}

function cleanBloomLevel(bloom) {
    if (!bloom) return 'anlama';
    const b = bloom.toLowerCase();
    if (b.includes('bilm') || b.includes('xatırla') || b.includes('knowledge')) return 'bilik';
    if (b.includes('tətbiq') || b.includes('application')) return 'tətbiq';
    if (b.includes('təhlil') || b.includes('analiz') || b.includes('analysis')) return 'təhlil';
    if (b.includes('dəyər') || b.includes('qiymət') || b.includes('evaluation')) return 'dəyərləndirmə';
    if (b.includes('yarat') || b.includes('sint') || b.includes('creation')) return 'yaratma';
    return 'anlama'; // default
}

const keys = Object.keys(db);
const report = {};

for (const subjectKey of keys) {
    if (subjectKey.includes(' 7') || subjectKey.includes('7-ci')) {
        const subCode = getSubjectCode(subjectKey);
        report[subjectKey] = { checked: 0, passed: 0, failed: 0 };
        
        let topicCounter = 1;

        for (let i = 0; i < db[subjectKey].length; i++) {
            const topicGroup = db[subjectKey][i];
            const topicNumStr = String(topicCounter).padStart(2, '0');
            topicCounter++;
            
            const validQuestions = [];
            let questionCounter = 1;

            for (const q of topicGroup.questions) {
                totalChecked++;
                report[subjectKey].checked++;

                // Keyfiyyət Ekspertizası (Quality Check)
                let isValid = true;
                
                // 1. Minimum 4 variant olmalıdır
                if (!q.options || q.options.length < 4) isValid = false;
                
                // 2. Düzgün cavab variantı limitdən kənara çıxmamalıdır
                if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) isValid = false;
                
                // 3. Sualın mətni boş olmamalıdır
                if (!q.question || q.question.trim().length < 5) isValid = false;

                if (isValid) {
                    // Normalize option counts (cut extra options just in case)
                    if (q.options.length > 4) {
                        q.options = q.options.slice(0, 4);
                    }

                    // TİK Pasportu Yaradılması
                    // Format: 07-[SUB_ID]-0101-B[TOPIC_NUM]-01-[Q_NUM]
                    const qNumStr = String(questionCounter).padStart(3, '0');
                    q.passport_id = `07-${subCode}-0101-B${topicNumStr}-01-${qNumStr}`;
                    
                    // Standartlaşdırma
                    q.difficulty = cleanDifficulty(q.difficulty);
                    q.bloomLevel = cleanBloomLevel(q.bloomLevel);
                    q.id = questionCounter; // normalize ID

                    validQuestions.push(q);
                    questionCounter++;
                    totalPassed++;
                    report[subjectKey].passed++;
                } else {
                    totalFailed++;
                    report[subjectKey].failed++;
                }
            }

            // Mövzu qrupunu yalnız uğurlu testlərlə əvəz et
            topicGroup.questions = validQuestions;
        }
    }
}

// Bazanı Yadda Saxla
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log("\n📊 EKSKPERTİZA VƏ TİK YARADILMASI HESABATI");
console.log("=========================================");
console.log(`Ümumi Yoxlanılan: ${totalChecked}`);
console.log(`Uğurla Pasportlaşdırılan: ${totalPassed}`);
console.log(`Ekspertizadan Kəsilən (Silinən): ${totalFailed}`);
console.log("\nFənlər Üzrə Detallı Hesabat:");
for (const k in report) {
    console.log(`- ${k}: ${report[k].passed} keçdi, ${report[k].failed} kəsildi`);
}
console.log("=========================================\n");
