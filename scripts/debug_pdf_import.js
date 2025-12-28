const pdfParse = require('pdf-parse');
console.log('require("pdf-parse") type:', typeof pdfParse);
console.log('require("pdf-parse") keys:', Object.keys(pdfParse));

if (typeof pdfParse === 'function') {
    console.log('It IS a function');
} else {
    console.log('It IS NOT a function');
    if (pdfParse.default) {
        console.log('Has default export:', typeof pdfParse.default);
    }
}
