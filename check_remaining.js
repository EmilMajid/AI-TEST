const fs = require('fs');
const books = JSON.parse(fs.readFileSync('./data/textbooks.json', 'utf8'));
const tests = JSON.parse(fs.readFileSync('./data/offline_tests.json', 'utf8'));

let doneSubjects = Object.keys(tests).filter(k => tests[k].length > 0);
let allBooks = books['5'].map(b => b.title);

let remaining = allBooks.filter(b => {
    // Check if the book title is closely related to a done subject
    if (b.includes('Azərbaycan dili') && doneSubjects.includes('Azərbaycan dili')) return false;
    if (b.includes('Riyaziyyat') && doneSubjects.includes('Riyaziyyat')) return false;
    if (b.includes('Təbiət') && doneSubjects.includes('Təbiət')) return false;
    if (b.includes('Tarix') && doneSubjects.includes('Azərbaycan tarixi')) return false;
    if (b.includes('İnformatika') && doneSubjects.includes('İnformatika')) return false;
    if (b.includes('Texnologiya') && doneSubjects.includes('Texnologiya')) return false;
    if (b === 'İngilis dili 5 (əsas xarici dil)' && doneSubjects.includes('İngilis dili')) return false;
    return true;
});

console.log('--- HAZIR OLAN FƏNLƏR (Baza) ---');
console.log(doneSubjects.join(', '));
console.log('\n--- QALAN FƏNLƏR (Dərslik) ---');
let sortedRemaining = remaining.map(b => {
    let lines = books['5'].find(x => x.title === b).topics.split('\n').filter(l => l.trim().length > 0).length;
    return { name: b, count: lines };
}).sort((a,b) => a.count - b.count);

sortedRemaining.forEach(r => {
    console.log(`${r.name} - ${r.count} mövzu (${r.count * 30} test edəcək)`);
});
