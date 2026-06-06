const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const pdfPath = path.join(__dirname, 'public/textbooks/5/hayat-bilgisi-5/hayat-bilgisi-5.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    console.log("Number of pages:", data.numpages);
    console.log("Text snippet (first 1000 chars):");
    console.log(data.text.substring(0, 1000));
}).catch(e => {
    console.error("PDF Parsing Error:", e);
});
