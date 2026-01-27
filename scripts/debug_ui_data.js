const fs = require('fs');

// We'll simulate what lib/textbook-service.ts does
const textbooksData = JSON.parse(fs.readFileSync('./data/textbooks.json', 'utf8'));

function getTextbooksByClass(grade) {
    const books = textbooksData[grade];
    if (!books) return [];

    return books.map((book) => {
        let topics = [];
        if (Array.isArray(book.topics)) {
            topics = book.topics;
        } else if (typeof book.topics === 'string') {
            topics = book.topics.split('\n').filter(t => t.trim().length > 0);
        }

        const result = {
            id: book.id,
            title: book.title,
            class: grade,
            subject: book.subject,
            topics: topics,
            type: book.type,
            fileUrl: book.type === 'html' ? book.path : undefined,
            pdfUrl: book.type === 'pdf' ? book.path : undefined,
            contentPath: book.contentPath
        };
        return result;
    });
}

const subjectsToTest = [
    "Ədəbiyyat",
    "İnformatika",
    "Azərbaycan tarixi",
    "Texnologiya",
    "Musiqi",
    "Fiziki tərbiyə",
    "Təsviri İncəsənət"
];

console.log("\n=== UI DATA DEBUG (GRADE 5) ===\n");

const grade5Books = getTextbooksByClass("5");

subjectsToTest.forEach(subject => {
    const matching = grade5Books.filter(b => b.subject === subject);
    console.log(`Subject: [${subject}] -> Found ${matching.length} books.`);
    matching.forEach(b => {
        console.log(`  - ID: ${b.id}`);
        console.log(`    Title: ${b.title}`);
        console.log(`    Type: ${b.type}`);
        console.log(`    fileUrl: ${b.fileUrl}`);
        console.log(`    pdfUrl: ${b.pdfUrl}`);
        console.log(`    Topic Count: ${b.topics.length}`);

        // Critical UI Check
        const canOpen = b.fileUrl || b.pdfUrl;
        console.log(`    UI Status: ${canOpen ? '✅ CAN OPEN' : '❌ CANNOT OPEN'}`);
    });
    console.log("");
});
