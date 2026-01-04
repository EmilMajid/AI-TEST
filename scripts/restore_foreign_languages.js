const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Restoring Foreign Languages for Grade 5...\n');

// 1. Revert English to "Xarici dil"
const englishBook = data["5"].find(b => b.id === 'ingilis-dili-5');
if (englishBook) {
    englishBook.subject = "Xarici dil";
    console.log('✅ Reverted English subject to "Xarici dil"');
}

// 2. Add Missing Languages
const newBooks = [
    {
        id: "alman-dili-5",
        title: "Alman dili 5",
        subject: "Xarici dil",
        type: "pdf",
        path: "/textbooks/5/ingilis-dili-5/english-5.pdf", // Placeholder
        contentPath: "public/textbooks/5/ingilis-dili-5", // Placeholder
        topics: "1. Hallo!\n2. Meine Familie\n3. Meine Schule\n4. Zahlen und Farben\n5. Tiere\n6. Essen und Trinken\n7. Mein Haus\n8. Kleidung\n9. Wetter\n10. Ferien"
    },
    {
        id: "fransiz-dili-5",
        title: "Fransız dili 5",
        subject: "Xarici dil",
        type: "pdf",
        path: "/textbooks/5/ingilis-dili-5/english-5.pdf", // Placeholder
        contentPath: "public/textbooks/5/ingilis-dili-5", // Placeholder
        topics: "1. Bonjour!\n2. Ma famille\n3. Mon école\n4. Les nombres\n5. Les couleurs\n6. Les animaux\n7. La maison\n8. Les vêtements\n9. La nourriture\n10. Les vacances"
    },
    {
        id: "rus-dili-5",
        title: "Rus dili 5",
        subject: "İkinci xarici dil", // As requested "ikinci xarici dil" category
        type: "pdf",
        path: "/textbooks/5/ingilis-dili-5/english-5.pdf", // Placeholder
        contentPath: "public/textbooks/5/ingilis-dili-5", // Placeholder
        topics: "1. Привет!\n2. Моя семья\n3. Школа\n4. Числа и цвета\n5. Животные\n6. Мой дом\n7. Еда\n8. Одежда\n9. Времена года\n10. Каникулы"
    }
];

let addedCount = 0;
newBooks.forEach(newBook => {
    const exists = data["5"].find(b => b.id === newBook.id);
    if (!exists) {
        data["5"].push(newBook);
        console.log(`✅ Added ${newBook.title} (${newBook.subject})`);
        addedCount++;
    } else {
        // Update existing if needed (e.g. to fix subject)
        exists.subject = newBook.subject;
        exists.topics = newBook.topics;
        console.log(`ℹ️ Updated ${newBook.title}`);
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`\n✅ Process Complete. Added ${addedCount} new books.`);
