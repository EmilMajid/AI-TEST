const fs = require('fs');
const path = require('path');

const textbooksPath = path.join(__dirname, '../data/textbooks.json');
const textbooks = JSON.parse(fs.readFileSync(textbooksPath, 'utf8'));

console.log("Checking textbooks data structure...");

// Check Grade 8 books
const books8 = textbooks['8'];
if (books8) {
    books8.forEach(book => {
        console.log(`\nBook: ${book.title}`);
        console.log(`Topics Type: ${typeof book.topics}`);
        if (Array.isArray(book.topics)) {
            console.log(`Topics Is Array: Yes (Length: ${book.topics.length})`);
        } else {
            console.log(`Topics Is Array: No`);
            if (typeof book.topics === 'string') {
                console.log(`Snippet: ${book.topics.substring(0, 50)}...`);
            } else {
                console.log(`Topics is ${typeof book.topics}`);
            }
        }
    });
} else {
    console.log("No Grade 8 books found.");
}
