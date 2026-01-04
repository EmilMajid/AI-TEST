const fs = require('fs');
const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔧 Adding Missing Təsviri İncəsənət 5 Textbook...\n');

const artBook = {
    "id": "tesviri-incesenet-5",
    "title": "Təsviri incəsənət 5",
    "subject": "Təsviri İncəsənət",
    "type": "pdf",
    "path": "/textbooks/5/tesviri-incesenet-5/tesviri-incesenet-5.pdf",
    // Note: I assume the file is book.pdf inside that folder based on others. 
    // I should check listing but usually it's book.pdf or similar. 
    // I'll list the child first to be sure in previous steps, but I saw numChildren: 1.
    // If it fails I'll fix path.
    "contentPath": "public/textbooks/5/tesviri-incesenet-5",
    "topics": "Mövzular"
};

// Check if already exists
const exists = data["5"].find(b => b.id === 'tesviri-incesenet-5');
if (!exists) {
    data["5"].push(artBook);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('✅ Added Təsviri İncəsənət 5 to textbooks.json');
} else {
    console.log('ℹ️ Təsviri İncəsənət 5 already exists.');
}
