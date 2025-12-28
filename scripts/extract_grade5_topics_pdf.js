const fs = require('fs');
const path = require('path');

// Robust import strategy for pdf-parse
let pdfParse;
try {
    const lib = require('pdf-parse');
    if (typeof lib === 'function') {
        pdfParse = lib;
    } else if (typeof lib.default === 'function') {
        pdfParse = lib.default;
    } else if (typeof lib.PDFParse === 'function') {
        // Some versions might export a class or function
        pdfParse = lib.PDFParse;
    } else {
        // Last ditch effort: standard library behavior usually returns a promise
        // If the library is completely broken/variant, we might need a different one.
        // But let's try assuming 'lib' itself is the entry point if it has keys like "PDFParse"
        // It might be we need to instantiate it or use a specific method.
        // However, standard use is: let data = await pdf(dataBuffer);
        // If 'lib' is an object, maybe it has a different main method?
        // Let's print what we have to debug if this fails.
        console.log('Warning: pdf-parse structure unknown, using as-is object');
        pdfParse = lib;
    }
} catch (e) {
    console.error('Failed to import pdf-parse:', e);
}

const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔍 Starting Topic Extraction for Grade 5 PDFs...\n');

async function extractTopicsFromPDF(filePath) {
    if (!fs.existsSync(filePath)) return null;

    const dataBuffer = fs.readFileSync(filePath);

    try {
        let pdfData;

        // Try to invoke the parser
        if (typeof pdfParse === 'function') {
            pdfData = await pdfParse(dataBuffer, { max: 15 });
        } else {
            // If it's the object we saw earlier with "PDFParse", "Line", etc.
            // It might be a different library masquerading as pdf-parse or a major version change.
            // But let's try to assume it might be callable or have a 'parse' method?
            // If not, we can't really proceed with THIS library.
            // Let's try one specific thing: if it has "getException", maybe it's "pdfjs-dist"?
            // No, the keys look like "pdf-parse" internals but exposed.

            // FALLBACK: If we can't use the library, return null.
            console.error('❌ PDF library is not a function. Cannot parse.');
            return null;
        }

        const text = pdfData.text;

        // Strategy 1: Look for "Mündəricat" or "Contents"
        let lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
        let startIndex = lines.findIndex(l => /MÜNDƏRİCAT|İÇİNDƏKİLƏR|CONTENTS/i.test(l));

        if (startIndex === -1) {
            startIndex = 0;
        }

        const topics = [];
        const patterns = [
            /^(?:Mövzu|§)?\s*\d+\.\s+(.+?)(?:\.{3,}|\s+\d+$|$)/, // Standard "1. Topic" or "Mövzu 1. Topic"
            /^[IVX]+\.\s+(.+?)(?:\.{3,}|\s+\d+$|$)/, // Roman numerals
        ];

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];

            if (/Buraxılış məlumatı|Ümumtəhsil məktəbləri/i.test(line)) break;

            for (let pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    let topic = match[0].replace(/\.{3,}.*$/, '').replace(/\s+\d+$/, '').trim();
                    if (topic.length > 5 && topic.length < 100) {
                        topics.push(topic);
                        break;
                    }
                }
            }
        }

        return topics.length > 3 ? topics.join('\n') : null;

    } catch (e) {
        console.error(`Error parsing PDF ${filePath}:`, e.message);
        return null;
    }
}

async function run() {
    let updatedCount = 0;

    const grade5 = data["5"];

    // Working: Edebiyyat, Azerbaycan tarixi, Informatika
    const workingIds = ['edebiyyat-5', 'azerbaycan-tarixi-5', 'informatika-5'];

    for (const book of grade5) {
        if (workingIds.includes(book.id)) continue;
        if (book.type !== 'pdf') continue;
        if (book.topics && book.topics.length > 50 && book.topics !== 'Mövzular') continue;

        console.log(`Processing: ${book.title} (${book.id})...`);
        const pdfPath = path.join('public', book.path.replace(/^\//, ''));

        const extractedTopics = await extractTopicsFromPDF(pdfPath);

        if (extractedTopics) {
            book.topics = extractedTopics;
            console.log(`  ✅ Extracted ${extractedTopics.split('\n').length} topics.`);
            updatedCount++;
        } else {
            console.log(`  ⚠️ Could not extract topics. Keeping "Mövzular".`);
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\n✅ Updated ${updatedCount} textbooks with extracted topics.`);
    } else {
        console.log('\nNo changes made.');
    }
}

run();
