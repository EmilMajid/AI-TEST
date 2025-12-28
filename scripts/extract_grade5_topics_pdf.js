const fs = require('fs');
const path = require('path');

// Robust import strategy for pdf-parse
let pdfMethod;

try {
    const lib = require('pdf-parse');
    // Debug what we got
    console.log('Library type:', typeof lib);
    if (lib.default) console.log('Has default export');

    // It seems to be a class that requires 'new', or an async function
    // But 'pdf-parse' standard usage is just specific_function(buffer)
    // If it throws "Class constructor...", then it IS a class.

    // We will define a wrapper function that tries multiple ways
    pdfMethod = async (buffer, options) => {
        try {
            // Try standard way first - if it's a function
            if (typeof lib === 'function') {
                try {
                    return await lib(buffer, options);
                } catch (e) {
                    if (e.message.includes("Class constructor")) {
                        // It's a class!
                        // Maybe it has a .parse method or we instantiate it?
                        // Let's assume there's a static parse method or similar if it's a class
                        // Or maybe we make an instance? 
                        // Actually, looking at common pdf-parse forks, if it's a class it probably has methods.
                        // But let's try assuming standard 'pdf-parse' behavior where module.exports is the function.
                        // If that fails with class error, maybe we are getting a different package.

                        // Let's try instantiating it if it allows, but usually we need to call a method on instance?
                        // const instance = new lib(buffer);
                        // return instance.text ? instance : await instance.parse();

                        // BUT, looking at the previous error: "Error parsing... pdfParse is not a function"
                        // Then we fixed it to be an object.
                        // Then we tried to call the object and got "not a function".
                        // Then we tried to find a function and found one, but got "Class constructor".

                        // This implies 'lib' (or whatever we chose) IS a class.
                        // So: const instance = new lib(buffer);
                        // Does it return the data directly? Or do we need to call .text?
                        return new Promise((resolve, reject) => {
                            // If it's a class, maybe it doesn't return a promise directly in constructor?
                            // Let's look for a static 'parse'
                            if (lib.parse) {
                                resolve(lib.parse(buffer, options));
                            } else {
                                // Try instantiation
                                try {
                                    const instance = new lib(buffer);
                                    resolve(instance);
                                } catch (err) { reject(err); }
                            }
                        });
                    }
                    throw e;
                }
            }

            // If it's an object with PDFParse
            if (lib.PDFParse) {
                // If PDFParse is the class
                try {
                    return await lib.PDFParse(buffer, options);
                } catch (e) {
                    if (e.message.includes("Class constructor")) {
                        const instance = new lib.PDFParse(buffer);
                        return instance;
                    }
                    throw e;
                }
            }

            // Fallback for object: manual Promise if it's really weird
            throw new Error("Could not find suitable parse method");

        } catch (err) {
            throw err;
        }
    };

} catch (e) {
    console.error('Failed to prepare pdf-parse:', e);
}

const dataPath = 'data/textbooks.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🔍 Starting Topic Extraction for Grade 5 PDFs...\n');

async function extractTopicsFromPDF(filePath) {
    if (!fs.existsSync(filePath)) return null;

    const dataBuffer = fs.readFileSync(filePath);

    try {
        let pdfData = await pdfMethod(dataBuffer, { max: 15 });

        // Ensure we got text
        // If pdfData is a promise (rare but possible), wait for it
        if (pdfData && typeof pdfData.then === 'function') {
            pdfData = await pdfData;
        }

        let text = pdfData.text;

        if (typeof text !== 'string') {
            // Debug the 'doc' property we saw earlier
            if (pdfData.doc) {
                console.log(`    ⚠️  Debug: pdfData.doc keys: ${Object.keys(pdfData.doc || {})}`);
                // Sometimes it's pdfData.doc.text or similar
            }
            console.log(`    ⚠️  No text property found. pdfData keys: ${Object.keys(pdfData || {})}`);
            return null;
        }

        if (!text) {
            console.log(`    ⚠️  Text is empty or null.`);
            // Maybe it provides page stats?
            if (pdfData.numpages && pdfData.numpages > 0) {
                console.log(`    ⚠️  PDF has ${pdfData.numpages} pages but no text extracted. Likely scanned.`);
            }
            return null;
        }

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
