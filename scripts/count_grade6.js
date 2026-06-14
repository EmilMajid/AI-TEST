const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/textbooks.json', 'utf8'));

let grade6Books = data["6"] || [];
let pdfCount = 0;
let xhtmlCount = 0;

grade6Books.forEach(b => {
    let type = 'Unknown';
    if (b.type === 'ederslik_html') {
        xhtmlCount++;
        type = 'xhtml (e-derslik)';
    } else if (b.type === 'pdf') {
        pdfCount++;
        type = 'pdf';
    }
    console.log(`- ${b.title} [${type}]`);
});

console.log(`\nTotal 6th grade textbooks: ${grade6Books.length}`);
console.log(`XHTML (e-derslik) format: ${xhtmlCount}`);
console.log(`PDF format: ${pdfCount}`);

console.log(JSON.stringify(grade6Books.slice(0, 2), null, 2));
grade6Books.forEach(b => {
    let type = 'Unknown';
    if (b.url && b.url.includes('player/index3.php')) type = 'xhtml';
    else if (b.url && (b.url.includes('pdf') || b.url.endsWith('.pdf'))) type = 'pdf';
    console.log(`- ${b.title} [${type}]`);
});
