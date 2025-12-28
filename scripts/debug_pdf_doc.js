const fs = require('fs');
const path = require('path');

let pdfMethod;
try {
    const lib = require('pdf-parse');
    pdfMethod = async (buffer) => {
        // Wrapper as defined before
        if (typeof lib === 'function') return await lib(buffer);
        if (lib.PDFParse) return await lib.PDFParse(buffer);
        if (typeof lib === 'object') {
            // Try to find a method?
            // Or maybe it's the result of a require that needs 'default'?
            // Let's just try calling it if we can't find anything better
            // But we saw it's an object.
        }
        // If we are here, we are relying on our robust script logic from before.
        // For this debug script, let's just Require strictly what we found worked to get the Object outcome
        // which was: require('pdf-parse') returning an object.
        // Wait, the previous script DID return an object `pdfData` with `doc`.
        // So `pdfMethod` must have successfully called SOMETHING.
        // In the previous script we did:
        /*
            if (typeof lib === 'function') ... return await lib(...)
        */
        // And it returned an object with keys: options, doc, progress.
        // So 'lib' IS a function.
        return await lib(buffer);
    };
} catch (e) { console.error(e); }

const filePath = 'public/textbooks/5/azerbaycan-dili-hisse-1/book.pdf';

(async () => {
    try {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfMethod(buffer);
        console.log('Keys on data:', Object.keys(data));

        if (data.doc) {
            console.log('Keys on data.doc:', Object.keys(data.doc));
            const doc = data.doc;
            // Common PDFJS-dist properties
            if (doc.numPages) console.log('Num pages:', doc.numPages);
            if (doc.info) console.log('Info:', doc.info);
            // Try to get page 1 if possible
            if (doc.getPage) {
                console.log('Has getPage method');
                try {
                    const page = await doc.getPage(1);
                    console.log('Page 1 keys:', Object.keys(page));
                    const content = await page.getTextContent();
                    console.log('Page 1 text content items:', content.items.length);
                    console.log('First item:', content.items[0]);
                } catch (e) {
                    console.error('Error getting page:', e.message);
                }
            } else {
                console.log('No getPage method on doc');
                // Maybe it's exposed differently?
                if (doc._pdfInfo) console.log('_pdfInfo found');
            }
        }

    } catch (e) {
        console.error(e);
    }
})();
