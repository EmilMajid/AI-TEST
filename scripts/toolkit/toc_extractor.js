/**
 * UIS Auto-TOC Extractor
 * Uses OCR to read TOC pages and LLM to structure them.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ported logic from ocr_master.js to extract specific pages
async function extractTocText(pdfPath, pages = [1, 2, 3]) {
    console.log(`Extracting TOC text from ${pdfPath}, pages: ${pages.join(',')}`);
    const tempDir = path.join(__dirname, '../../data/ocr_cache/toc_temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // Use ocr_master logic or direct tesseract calls
    // For UIS, we want a clean standalone command
    const cmd = `node scripts/ocr_master.js "${pdfPath}" --pages ${pages.join(',')} --output "${tempDir}/toc.json"`;
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(`${tempDir}/toc.json`)) {
        const data = JSON.parse(fs.readFileSync(`${tempDir}/toc.json`, 'utf8'));
        return data.full_text;
    }
    return "";
}

// TODO: Integrate LLM call to structure the raw text
async function structureTocWithLLM(rawText) {
    console.log("Structuring TOC with LLM...");
    // This will call our API or llm-wrapper
    return rawText; // Placeholder
}

module.exports = { extractTocText, structureTocWithLLM };
