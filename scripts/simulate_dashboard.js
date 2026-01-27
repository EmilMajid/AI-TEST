const fs = require('fs');

const textbooksData = JSON.parse(fs.readFileSync('./data/textbooks.json', 'utf8'));

// Simulating lib/textbook-service.ts
function getTextbooksByClass(grade) {
    const books = textbooksData[grade];
    if (!books) return [];
    return books.map((book) => ({
        id: book.id,
        title: book.title,
        class: grade,
        subject: book.subject,
        type: book.type,
        fileUrl: book.type === 'html' ? book.path : undefined,
        pdfUrl: book.type === 'pdf' ? book.path : undefined
    }));
}

function getTextbooks(grade, subject) {
    return getTextbooksByClass(grade).filter(t => t.subject === subject);
}

const subjectsToTest = [
    "Azərbaycan dili",    // Works (Multi)
    "Riyaziyyat",         // Works (Multi)
    "Ədəbiyyat",          // Reported Missing
    "İnformatika",        // Reported Missing
    "Azərbaycan tarixi",  // Reported Missing
    "Texnologiya",        // Reported Missing
    "Musiqi",            // Reported Missing
    "Fiziki tərbiyə",     // Reported Missing
    "Təsviri İncəsənət"   // Reported Missing
];

console.log("\n=== DASHBOARD UI SIMULATION ===\n");

subjectsToTest.forEach(subject => {
    console.log(`SUBJECT: [${subject}]`);
    
    // Simulate selection logic
    const available = getTextbooks("5", subject);
    const selected = available.length > 0 ? available[0] : null;
    
    console.log(`  Available Books: ${available.length}`);
    if (selected) {
        console.log(`  Selected ID: ${selected.id}`);
        console.log(`  Selected Title: ${selected.title}`);
        
        // UI Condition Check
        const showSelectorRow = available.length >= 1; // My fix
        const hasOpenButton = selected.fileUrl || selected.pdfUrl;
        
        console.log(`  Show Selector Row: ${showSelectorRow ? '✅ YES' : '❌ NO'}`);
        console.log(`  Has Open Button: ${hasOpenButton ? '✅ YES' : '❌ NO'}`);
        if (hasOpenButton) {
            console.log(`    - Button Type: ${selected.fileUrl ? 'HTML' : 'PDF'}`);
            console.log(`    - URL: ${selected.fileUrl || selected.pdfUrl}`);
        }
    } else {
        console.log(`  ❌ NO TEXTBOOKS FOUND`);
    }
    console.log("");
});
