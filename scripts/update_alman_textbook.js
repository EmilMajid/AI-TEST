const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Updating Alman dili 5 to HTML format with Manual Topics...\n');

const almanBook = data["5"].find(b => b.id === 'alman-dili-5');
if (almanBook) {
    // 1. Set to HTML type with official E-Derslik link
    almanBook.type = "html";
    almanBook.path = "https://www.e-derslik.edu.az/player/index3.php?book_id=852";
    // We can keep contentPath as placeholder or remove it, keeping it safe.

    // 2. Set Topics strictly as requested
    almanBook.topics = `Lektion 1. Wie bitte?
- Stunde 1. Wie schreibt man das?
- Stunde 2. Hallo, ich bin Hesen.
- Stunde 3. Das ist ein Buch.
- Stunde 4. Wiederholung
Lektion 2. Meine Familie
- Stunde 1. Wer sind die Personen?
- Stunde 2. Was macht sie gern?
- Stunde 3. Ist er im Park?
- Stunde 4. Wiederholung`;

    console.log('✅ Updated Alman dili 5:');
    console.log(`   Type: ${almanBook.type}`);
    console.log(`   Path: ${almanBook.path}`);
    console.log(`   Topics Length: ${almanBook.topics.length} characters`);
} else {
    console.error('❌ Alman dili 5 entry not found!');
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ JSON update complete.');
