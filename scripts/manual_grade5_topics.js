const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Applying Manual Topics to Grade 5 Textbooks...\n');

const manualTopics = {
    // Azərbaycan dili 5 - Hissə 1
    'azerbaycan-dili-5-h1': [
        "1. Dilimiz - varlığımız",
        "2. Vətən sevgisi",
        "3. Ana dili",
        "4. Mətn və onun hissələri",
        "5. Lüğətlərdən istifadə qaydaları",
        "6. Sözün səs tərkibi",
        "7. Ahəng qanunu",
        "8. Heca və vurğu",
        "9. Sözün leksik və qrammatik mənası",
        "10. Həqiqi və məcazi mənalı sözlər",
        "11. Omonimlər, Sinonimlər, Antonimlər",
        "12. Sözün tərkibi: kök və şəkilçi",
        "13. Söz yaradıcılığı",
        "14. İsim. İsmin halları",
        "15. İsmin mənsubiyyətə görə dəyişməsi"
    ].join('\n'),

    // Azərbaycan dili 5 - Hissə 2
    'azerbaycan-dili-5-h2': [
        "1. Sifət. Sifətin dərəcələri",
        "2. Say. Sayın mənaca növləri",
        "3. Əvəzlik. Şəxs və işarə əvəzlikləri",
        "4. Feil. Feilin zamanları",
        "5. Feilin şəkilləri",
        "6. Zərf. Zərfin mənaca növləri",
        "7. Köməkçi nitq hissələri",
        "8. Cümlə və onun növləri",
        "9. Cümlənin baş üzvləri",
        "10. Cümlənin ikinci dərəcəli üzvləri",
        "11. Həmcins üzvlər",
        "12. Mürəkkəb cümlə",
        "13. Vasitəsiz nitq",
        "14. Durğu işarələri",
        "15. Ümumiləşdirici təkrar"
    ].join('\n'),

    // Riyaziyyat 5 - Hissə 1
    'riyaziyyat-5-h1': [
        "1. Natural ədədlər və onlar üzərində əməllər",
        "2. Çoxrəqəmli ədədlərin oxunması və yazılması",
        "3. Toplama və çıxma əməlləri",
        "4. Vurma və bölmə əməlləri",
        "5. Əməllər ardıcıllığı",
        "6. Məsələ həlli yolları",
        "7. Adi kəsrlər",
        "8. Düzgün və düzgün olmayan kəsrlər",
        "9. Qarışıq ədədlər",
        "10. Kəsrlərin toplanması və çıxılması",
        "11. Kəsrlərin müqayisəsi",
        "12. Hissəyə görə ədədin tapılması"
    ].join('\n'),

    // Riyaziyyat 5 - Hissə 2
    'riyaziyyat-5-h2': [
        "1. Onluq kəsrlər",
        "2. Onluq kəsrlərin toplanması və çıxılması",
        "3. Onluq kəsrlərin vurulması və bölünməsi",
        "4. Faiz",
        "5. Ədədin faizinin tapılması",
        "6. Həndəsi fiqurlar",
        "7. Üçbucaqlar və dördbucaqlılar",
        "8. Çevrə və dairə",
        "9. Sahə və perimetr",
        "10. Həcm",
        "11. Koordinat şəbəkəsi",
        "12. Məlumatların toplanması və təqdim edilməsi"
    ].join('\n'),

    // Təbiət 5 - Hissə 1
    'tebiet-5-h1': [
        "1. Təbiəti öyrənirik",
        "2. Canlılar və onların müxtəlifliyi",
        "3. Bitkilər aləmi",
        "4. Heyvanlar aləmi",
        "5. Göbələklər və bakteriyalar",
        "6. Canlıların qidalanması",
        "7. Canlıların tənəffüsü",
        "8. Canlıların çoxalması",
        "9. Təbiətdə maddələr",
        "10. Maddənin halları",
        "11. Suyun təbiətdə dövranı"
    ].join('\n'),

    // Təbiət 5 - Hissə 2
    'tebiet-5-h2': [
        "1. Hərəkət və qüvvə",
        "2. Sürət",
        "3. Sürtünmə qüvvəsi",
        "4. İstilik hadisələri",
        "5. İşıq hadisələri",
        "6. Səs hadisələri",
        "7. Elektrik hadisələri",
        "8. Maqnit hadisələri",
        "9. Yer və Kainat",
        "10. Günəş sistemi",
        "11. Ay və onun fazaları",
        "12. Ekoloji tarazlıq"
    ].join('\n'),

    // İngilis dili 5
    'ingilis-dili-5': [
        "Unit 1. Hello!",
        "Unit 2. My School",
        "Unit 3. My Family",
        "Unit 4. My Home",
        "Unit 5. My Friends",
        "Unit 6. Food and Drink",
        "Unit 7. Animals",
        "Unit 8. My Hobbies",
        "Unit 9. Clothes",
        "Unit 10. Holidays",
        "Unit 11. Weather/Seasons",
        "Unit 12. My Country"
    ].join('\n'),

    // Texnologiya 5
    'texnologiya-5': [
        "1. Texnologiya və insan həyatı",
        "2. Məmulatların hazırlanma mərhələləri",
        "3. Oduncağın emalı texnologiyası",
        "4. Metalın emalı texnologiyası",
        "5. Parçanın emalı texnologiyası",
        "6. Qida məhsullarının emalı",
        "7. Məişət mədəniyyəti",
        "8. Texniki qrafika",
        "9. Elektrotexnika işləri",
        "10. Elektronika elementləri"
    ].join('\n'),

    // Fiziki tərbiyə 5
    'fiziki-terbiye-5': [
        "1. Sağlamlıq və fiziki inkişaf",
        "2. Gimnastika hərəkətləri",
        "3. Yüngül atletika",
        "4. Qaçış məsafələri",
        "5. Tullanma növləri",
        "6. Atma növləri",
        "7. Hərəki oyunlar",
        "8. Basketbol",
        "9. Voleybol",
        "10. Futbol",
        "11. Milli idman növləri"
    ].join('\n'),

    // Musiqi 5
    'musiqi-5': [
        "1. Musiqi və biz",
        "2. Xalq mahnıları",
        "3. Muğam sənəti",
        "4. Aşıq sənəti",
        "5. Bəstəkar mahnıları",
        "6. Opera və balet",
        "7. Simfonik musiqi",
        "8. Musiqi alətləri",
        "9. Azərbaycan bəstəkarları",
        "10. Dünya musiqisi"
    ].join('\n')
};

let updatedCount = 0;

data["5"] = data["5"].map(book => {
    // Only update if current topics are generic "Mövzular" or missing/empty
    if ((!book.topics || book.topics === 'Mövzular') && manualTopics[book.id]) {
        book.topics = manualTopics[book.id];
        console.log(`✅ Updated topics for: ${book.title}`);
        updatedCount++;
    }
    return book;
});

if (updatedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n✅ Successfully updated ${updatedCount} textbooks with manual topic lists.`);
} else {
    console.log('\nNo textbooks required updates.');
}
