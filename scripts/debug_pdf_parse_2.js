const pdfLib = require('pdf-parse');
console.log('typeof pdfLib.PDFParse:', typeof pdfLib.PDFParse);
try {
    const instance = new pdfLib.PDFParse();
    console.log('Instantiated PDFParse');
} catch (e) {
    console.log('Could not instantiate PDFParse:', e.message);
}
