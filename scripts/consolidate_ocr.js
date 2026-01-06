const fs = require('fs');
const path = require('path');

const OCR_OUTPUT_DIR = path.join(__dirname, 'ocr_output');
const TEXTBOOKS_FILE = path.join(__dirname, '../data/textbooks.json');
const CHUNKS_FILE = path.join(__dirname, '../data/textbook-chunks.jsonl');

function chunkText(text, size = 1000) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += size) {
        chunks.push(words.slice(i, i + size).join(' '));
    }
    return chunks;
}

function runConsolidation() {
    const textbooks = JSON.parse(fs.readFileSync(TEXTBOOKS_FILE, 'utf8'));
    const bookMap = {};
    Object.entries(textbooks).forEach(([grade, gradeBooks]) => {
        gradeBooks.forEach(b => {
            bookMap[b.id] = { ...b, grade: grade };
        });
    });

    const ocrFiles = fs.readdirSync(OCR_OUTPUT_DIR).filter(f => f.endsWith('.json'));

    // Load existing EPUB chunks to avoid duplicates if possible, 
    // but here we are basically rebuilding or appending.
    // Let's read existing and filter out any old PDF chunks to replace with new clean OCR data.
    let existingLines = [];
    if (fs.existsSync(CHUNKS_FILE)) {
        existingLines = fs.readFileSync(CHUNKS_FILE, 'utf8').split('\n').filter(l => l.trim());
    }

    const epubChunks = existingLines.map(l => JSON.parse(l)).filter(c => c.type !== 'pdf_page' && c.type !== 'pdf_placeholder');

    console.log(`Consolidating ${ocrFiles.length} OCR files...`);
    const newPdfChunks = [];

    ocrFiles.forEach(file => {
        const bookId = file.replace('.json', '');
        const book = bookMap[bookId];
        if (!book) {
            console.warn(`[SKIP] Book metadata not found for ${bookId}`);
            return;
        }

        const pages = JSON.parse(fs.readFileSync(path.join(OCR_OUTPUT_DIR, file), 'utf8'));
        console.log(`  - Processing ${book.title} (${pages.length} pages)`);

        pages.forEach(p => {
            const chunks = chunkText(p.text);
            chunks.forEach((chunk, i) => {
                newPdfChunks.push({
                    grade: parseInt(book.grade || "5"), // Fallback if grade not in book object
                    subject: book.subject,
                    book_id: book.id,
                    source: path.basename(book.path),
                    text: chunk,
                    page: p.page,
                    type: "pdf_page"
                });
            });
        });
    });

    const allChunks = [...epubChunks, ...newPdfChunks];
    console.log(`Total chunks: ${allChunks.length} (EPUB: ${epubChunks.length}, New PDF: ${newPdfChunks.length})`);

    const stream = fs.createWriteStream(CHUNKS_FILE);
    allChunks.forEach(chunk => {
        stream.write(JSON.stringify(chunk, (key, value) =>
            typeof value === 'string' ? value.replace(/\n/g, ' ') : value
        ) + '\n');
    });
    stream.end();

    console.log(`\n✅ Consolidation complete: ${CHUNKS_FILE}`);
}

runConsolidation();
