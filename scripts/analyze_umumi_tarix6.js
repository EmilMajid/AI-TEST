const fs = require('fs');
const path = require('path');

const umDir = path.join(__dirname, '../data/umumitarix6_chunks');
const fullText = fs.readFileSync(path.join(umDir, 'full_book.txt'), 'utf8');

console.log('Total length:', fullText.length);

// Let's find the actual headings by searching around known positions
// and print context so we can identify all 12 topic headings
const searchTerms = [
    // Topic 1
    'tarixd', 'il hesab', 'ümumi tarix 6', 
    // Topic 2
    'ibtidai', 'btidai',
    // Topic 3
    'ehram', 'piramida', 'misir',
    // Topic 4
    'şumerd', 'şumer',
    // Topic 5
    'ikiçayr', 'babil', 'asur', 'ikinci', 'digər döv',
    // Topic 6
    'oda sitay', 'atəş', 'zərdüşt', 'iran',
    // Topic 7
    'parfiya',
    // Topic 8
    'tanrın', 'hun', 'türk',
    // Topic 9
    'böyük ipək', 'çin', 'ipək yol',
    // Topic 10
    'şahmat', 'hindistan',
    // Topic 11
    'avropa', 'yunan', 'atina', 'ellada',
    // Topic 12
    'respublika', 'roma',
];

// Get unique positions with context
const found = {};
searchTerms.forEach(term => {
    let idx = fullText.toLowerCase().indexOf(term.toLowerCase());
    while (idx !== -1) {
        const key = Math.floor(idx / 5000); // group by 5000-char buckets
        if (!found[key]) {
            found[key] = { pos: idx, text: fullText.substring(Math.max(0, idx-20), idx+150).replace(/\n/g, ' ') };
        }
        idx = fullText.toLowerCase().indexOf(term.toLowerCase(), idx + 1);
    }
});

// Print positions in order
const positions = Object.entries(found).sort((a,b) => a[0] - b[0]);
positions.forEach(([key, val]) => {
    console.log(`\nPOS ~${val.pos}: "${val.text}"`);
});

// Now let's do smart splitting: print first occurrence of each heading-like line
// Looking at text in 10000-char sections
console.log('\n\n=== SECTION BOUNDARIES (every 15000 chars) ===');
for (let i = 0; i < fullText.length; i += 12000) {
    const section = fullText.substring(i, i + 500).replace(/\n/g, ' ');
    console.log(`\n--- Around position ${i}: ---`);
    console.log(section);
}
