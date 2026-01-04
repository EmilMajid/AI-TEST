const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Applying Manual Topics Part 2 (Təsviri İncəsənət)...\n');

const manualTopics = {
    // Təsviri incəsənət 5
    'tesviri-incesenet-5': [
        "1. Təsviri sənət və həyat",
        "2. Təsviri sənətin növləri",
        "3. Rəngkarlıq",
        "4. Qrafika",
        "5. Heykəltəraşlıq",
        "6. Dekorativ-tətbiqi sənət",
        "7. Memarlıq",
        "8. Dizayn",
        "9. İncəsənət muzeyləri",
        "10. Azərbaycan incəsənəti",
        "11. Dünya incəsənəti",
        "12. Mənzərə",
        "13. Portret",
        "14. Natürmort",
        "15. Ornament və naxışlar"
    ].join('\n')
};

let updatedCount = 0;

data["5"] = data["5"].map(book => {
    if (manualTopics[book.id]) {
        // Update even if it has something, to ensure it's correct
        book.topics = manualTopics[book.id];
        console.log(`✅ Updated topics for: ${book.title}`);
        updatedCount++;
    }
    return book;
});

if (updatedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n✅ Successfully updated ${updatedCount} textbooks.`);
} else {
    console.log('\nNo textbooks required updates.');
}
