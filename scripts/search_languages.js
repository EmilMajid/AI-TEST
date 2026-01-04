const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/textbooks.json', 'utf8'));

const keywords = ['Alman', 'Frans', 'Rus', 'Xarici', 'İkinci'];
const results = [];

Object.keys(data).forEach(grade => {
    data[grade].forEach(book => {
        const str = (book.title + " " + book.subject).toLowerCase();
        if (keywords.some(k => str.includes(k.toLowerCase()))) {
            results.push({ grade, id: book.id, title: book.title, subject: book.subject, type: book.type });
        }
    });
});

console.log(JSON.stringify(results, null, 2));
