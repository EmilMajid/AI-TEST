const fs = require('fs');
const PdfParse = require('pdf-parse');

const filePath = 'public/textbooks/5/azerbaycan-dili-hisse-1/book.pdf';
const buffer = fs.readFileSync(filePath);

(async () => {
    try {
        console.log('Attempting new PdfParse(buffer)...');
        const instance = new PdfParse(buffer);
        console.log('Instance created:', !!instance);
        console.log('Instance keys:', Object.keys(instance));

        if (instance.text) {
            console.log('Text length:', instance.text.length);
            console.log('First 100 chars:', instance.text.substring(0, 100));
        } else if (instance.then) {
            console.log('Instance is a promise/thenable');
            const result = await instance;
            console.log('Result text length:', result.text?.length);
        } else {
            console.log('No text property. Trying .parse() if exists');
            if (instance.parse) {
                const res = await instance.parse();
                console.log('Parsed text length:', res.text?.length);
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
})();
