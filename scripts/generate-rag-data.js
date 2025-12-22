const fs = require('fs');
const path = require('path');

const TEXTBOOKS_JSON = path.join(process.cwd(), 'data', 'textbooks.json');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'textbook-chunks.jsonl');

/**
 * Strips HTML tags and cleans up whitespace
 */
function cleanText(html) {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, ' ') // Remove tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}

/**
 * Recursively find all XHTML files in a directory
 */
function findXhtmlFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findXhtmlFiles(file));
        } else if (file.endsWith('.xhtml') || file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

/**
 * Main process
 */
async function main() {
    console.log("🚀 Starting Unified RAG Data Extraction...");

    if (!fs.existsSync(TEXTBOOKS_JSON)) {
        console.error("❌ textbooks.json not found!");
        return;
    }

    const textbooksData = JSON.parse(fs.readFileSync(TEXTBOOKS_JSON, 'utf8'));
    const allChunks = [];

    // Process each grade
    for (const [grade, books] of Object.entries(textbooksData)) {
        console.log(`\n📂 Processing Grade ${grade}...`);

        for (const book of books) {
            if (!book.contentPath) {
                console.log(`  ⚠️  Skipping ${book.title} (no contentPath)`);
                continue;
            }

            console.log(`  - ${book.title} (${book.type})`);

            const contentPath = path.join(process.cwd(), book.contentPath);

            if (book.type === 'html') {
                // For HTML/EPUB, extract from all XHTML files
                const files = findXhtmlFiles(contentPath);
                for (const file of files) {
                    const content = fs.readFileSync(file, 'utf8');
                    const text = cleanText(content);

                    if (text.length > 50) { // Skip empty/trivial files
                        // Extract page number from filename if possible
                        const pageMatch = file.match(/page(\d+)/i);
                        const page = pageMatch ? parseInt(pageMatch[1]) : 0;

                        allChunks.push({
                            grade: parseInt(grade),
                            subject: book.subject,
                            book_id: book.id,
                            source: path.basename(file),
                            text: text,
                            page: page,
                            type: 'epub_page'
                        });
                    }
                }
            } else if (book.type === 'pdf') {
                // For PDF, we'll note its existence. 
                // Actual text extraction might require an external tool or Python script.
                // For now, we add a metadata entry.
                allChunks.push({
                    grade: parseInt(grade),
                    subject: book.subject,
                    book_id: book.id,
                    source: book.path,
                    text: `PDF Content: ${book.title}. Note: Full text extraction for this PDF is pending advanced OCR/Parsing.`,
                    page: 1,
                    type: 'pdf_placeholder'
                });
            }
        }
    }

    // Save to JSONL (one chunk per line for RAG standard)
    console.log(`\n💾 Saving ${allChunks.length} chunks to ${OUTPUT_FILE}...`);
    const stream = fs.createWriteStream(OUTPUT_FILE);
    for (const chunk of allChunks) {
        stream.write(JSON.stringify(chunk) + '\n');
    }
    stream.end();

    console.log("✅ Extraction complete!");
}

main().catch(console.error);
