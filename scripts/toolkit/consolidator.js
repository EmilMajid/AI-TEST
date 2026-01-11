/**
 * UIS RAG Consolidator
 * Merges OCR output files into the unified textbook-chunks.jsonl for the RAG engine.
 */
const fs = require('fs');
const path = require('path');
const { getGradeData } = require('./metadata_helper');

async function consolidateGrade(grade) {
    console.log(`\n📦 Consolidating Grade ${grade} for RAG...\n`);

    const chunksPath = path.join(__dirname, '../../data/textbook-chunks.jsonl');
    const ocrDir = path.join(__dirname, '../../scripts/ocr_output');

    const books = getGradeData(grade);
    let totalAdded = 0;

    for (const book of books) {
        const ocrFile = path.join(ocrDir, `${book.id}.json`);

        // Handle cases where ID in metadata might be different from OCR filename (if needed)
        // Usually we keep them synced: book.id or path.basename(book.contentPath)
        let finalOcrFile = ocrFile;
        if (!fs.existsSync(finalOcrFile)) {
            const altId = path.basename(book.contentPath);
            finalOcrFile = path.join(ocrDir, `${altId}.json`);
        }

        if (fs.existsSync(finalOcrFile)) {
            console.log(`Processing ${book.title} (${finalOcrFile})...`);
            const pages = JSON.parse(fs.readFileSync(finalOcrFile, 'utf8'));

            const chunks = [];
            for (const page of pages) {
                // Skip very short or empty pages
                if (!page.text || page.text.trim().length < 20) continue;

                // Simple chunking: Per page for now (matches existing pipeline)
                chunks.push({
                    grade: parseInt(grade),
                    subject: book.subject,
                    book_id: book.id,
                    source: path.basename(finalOcrFile),
                    text: page.text.replace(/\r?\n|\r/g, " ").trim(),
                    page: page.page || 0,
                    type: "pdf_page_ocr"
                });
            }

            if (chunks.length > 0) {
                const jsonl = chunks.map(c => JSON.stringify(c)).join('\n') + '\n';
                fs.appendFileSync(chunksPath, jsonl, 'utf8');
                totalAdded += chunks.length;
                console.log(`  -> Added ${chunks.length} pages to RAG pool.`);
            }
        } else {
            console.warn(`⚠️ No OCR data found for ${book.title}. (Checked ${finalOcrFile})`);
        }
    }

    console.log(`\n✅ Grade ${grade} consolidation complete. Total chunks added: ${totalAdded}`);
}

if (require.main === module) {
    const grade = process.argv[2];
    if (!grade) {
        console.error("Usage: node consolidator.js [grade]");
        process.exit(1);
    }
    consolidateGrade(grade);
}

module.exports = { consolidateGrade };
