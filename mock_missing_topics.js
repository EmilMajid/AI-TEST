const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'textbooks.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const HB_TOPICS = `FƏSİL 1. Şəxsiyyət və cəmiyyət
1.1. Mən və cəmiyyət
1.2. Ünsiyyət mədəniyyəti
FƏSİL 2. Mənəviyyat və sağlamlıq
2.1. Sağlam həyat tərzi
2.2. Zərərli vərdişlər
FƏSİL 3. Təbiət və biz
3.1. Ekoloji tarazlıq
3.2. Təbiətin qorunması
FƏSİL 4. Hüquq və vəzifələrimiz
4.1. Uşaq hüquqları
4.2. Vətəndaşlıq borcu`;

const FOREIGN_TOPICS = `Unit 1. Salamlaşma və tanışlıq
1.1. Mən və mənim dostlarım
1.2. Məktəb ləvazimatları
Unit 2. Mənim ailəm
2.1. Ailə üzvləri
2.2. Peşələr
Unit 3. Gündəlik rejim
3.1. Saat və vaxt
3.2. Günün hissələri
Unit 4. Məktəb həyatı
4.1. Dərs cədvəli
4.2. Sevdiyim fənlər
Unit 5. Hobbilər və asudə vaxt
5.1. İdman və oyunlar
5.2. İstirahət
Unit 6. Fəsillər və təbiət
6.1. İlin fəsilləri
6.2. Hava haqqında
Unit 7. Nəqliyyat və səyahət
7.1. Nəqliyyat vasitələri
7.2. Təhlükəsizlik qaydaları
Unit 8. Mənim ölkəm
8.1. Vətənim Azərbaycan
8.2. Milli bayramlar`;

let updated = 0;

db['5'].forEach(b => {
    if (!b.topics) {
        if (b.subject === 'Həyat bilgisi') {
            b.topics = HB_TOPICS;
            updated++;
        } else if (b.subject.includes('xarici dil')) {
            b.topics = FOREIGN_TOPICS;
            updated++;
        }
    }
});

if (updated > 0) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Successfully hardcoded topics for ${updated} books.`);
}
