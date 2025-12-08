const service = require('./lib/textbook-service');
const textbooks = require('./data/textbooks.json');

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
            console.log(`Snippet: ${book.topics ? book.topics.substring(0, 50) : 'undefined'}...`);
        }
    });
} else {
    console.log("No Grade 8 books found.");
}
