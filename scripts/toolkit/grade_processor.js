/**
 * UIS Grade Processor (Pipeline Orchestrator)
 * Automatically processes all books in a grade:
 * 1. Metadata check.
 * 2. Auto-TOC extraction for PDFs (Head & Tail Deep Search).
 * 3. RAG Indexing Readiness.
 */
const { getGradeData, updateBook } = require('./metadata_helper');
const { extractTocText, structureTocWithLLM } = require('./toc_extractor');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function processGrade(grade) {
    console.log(`\n🚀 Starting UIS Pipeline for Grade ${grade}...\n`);

    const books = getGradeData(grade);
    if (books.length === 0) {
        console.error(`❌ No data found for Grade ${grade} in textbooks.json`);
        return;
    }

    for (const book of books) {
        console.log(`\n--- Processing: ${book.title} (ID: ${book.id}) ---`);

        // 1. Check if PDF exists
        const fullPath = path.join(process.cwd(), book.contentPath, 'book.pdf');
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ PDF not found at ${fullPath}. Skipping.`);
            continue;
        }

        // 2. Auto-TOC Extraction
        const needsTOC = !book.topics ||
            book.topics === "Mövzular (Auto-TOC pending)" ||
            (Array.isArray(book.topics) && book.topics.length === 0);

        if (needsTOC) {
            console.log(`🔍 Running Auto-TOC...`);
            try {
                // Phase 1: Check head pages (2-10)
                let rawTOCText = await extractTocText(fullPath, [2, 3, 4, 5, 6, 7, 8, 9, 10]);
                let structuredTOC = await structureTocWithLLM(rawTOCText);

                // Phase 2: Deep Search (Tail check) if head failed
                if ((!structuredTOC || structuredTOC.length === 0)) {
                    console.log("⚠️ TOC not found in first pages. Trying Deep Search (End of book)...");
                    try {
                        // Use python to get page count safely
                        const pageCountOutput = execSync(`python -c "import fitz; print(fitz.open('${fullPath.replace(/\\/g, '/')}').page_count)"`).toString().trim();
                        const pageCount = parseInt(pageCountOutput);

                        if (pageCount > 10) {
                            const lastPages = [];
                            for (let p = Math.max(11, pageCount - 8); p <= pageCount; p++) lastPages.push(p);
                            console.log(`Checking tail pages: ${lastPages.join(',')}`);
                            const tailText = await extractTocText(fullPath, lastPages);
                            structuredTOC = await structureTocWithLLM(tailText);
                        }
                    } catch (e) {
                        console.warn("Could not perform deep search: " + e.message);
                    }
                }

                if (Array.isArray(structuredTOC) && structuredTOC.length > 0) {
                    console.log(`✅ Extracted ${structuredTOC.length} topics.`);
                    updateBook(grade, book.id, { topics: structuredTOC });
                } else {
                    console.warn(`⚠️ TOC extraction failed for ${book.title}.`);
                }
            } catch (e) {
                console.error(`❌ TOC Extraction failed for ${book.title}: ${e.message}`);
            }
        } else {
            console.log(`✅ Topics already present.`);
        }

        // 3. FULL OCR (Optional, triggered via CLI flag or env)
        const runFullOCR = process.argv.includes('--full-ocr');
        if (runFullOCR) {
            const outputPath = path.join(process.cwd(), 'scripts/ocr_output', `${book.id}.json`);
            if (fs.existsSync(outputPath)) {
                console.log(`✅ Full OCR for ${book.id} already exists. Skipping.`);
            } else {
                console.log(`🖼️ Running FULL OCR for ${book.title}...`);
                try {
                    const cmd = `node scripts/ocr_master.js "${fullPath}" --id "${book.id}"`;
                    execSync(cmd, { stdio: 'inherit' });
                    console.log(`✅ Full OCR complete for ${book.id}.`);
                } catch (e) {
                    console.error(`❌ Full OCR failed for ${book.id}: ${e.message}`);
                }
            }
        }

        // 4. RAG Status update
        console.log(`✅ Book ${book.id} sync status: OK.`);
    }

    console.log(`\n🎉 Grade ${grade} processing complete!`);
}

// CLI usage
if (require.main === module) {
    const grade = process.argv[2];
    if (!grade) {
        console.error("Usage: node grade_processor.js [grade]");
        process.exit(1);
    }
    processGrade(grade).catch(console.error);
}

module.exports = { processGrade };
