const Tesseract = require('tesseract.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEXTBOOKS_FILE = path.join(__dirname, '../data/textbooks.json');
const OUTPUT_DIR = path.join(__dirname, 'ocr_output');
const TEMP_IMG_DIR = path.join(__dirname, 'ocr_temp');

// Create directories
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
if (!fs.existsSync(TEMP_IMG_DIR)) fs.mkdirSync(TEMP_IMG_DIR);

async function processBook(book) {
    console.log(`\n>>> Processing Book: ${book.title} (ID: ${book.id})`);

    // Resolve PDF path
    let pdfPath = path.join(__dirname, '../public', book.path);
    if (!fs.existsSync(pdfPath)) {
        // Try contentPath
        if (book.contentPath) {
            const files = fs.readdirSync(path.join(__dirname, '..', book.contentPath)).filter(f => f.endsWith('.pdf'));
            if (files.length > 0) pdfPath = path.join(__dirname, '..', book.contentPath, files[0]);
        }
    }

    if (!fs.existsSync(pdfPath)) {
        console.warn(`[SKIP] PDF not found: ${pdfPath}`);
        return;
    }

    // Step 1: Convert non-searchable pages to images
    console.log(`[1/3] Converting PDF to images: ${pdfPath}`);
    try {
        execSync(`python scripts/convert_to_images.py "${pdfPath}" "${TEMP_IMG_DIR}"`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`[ERROR] Image conversion failed for ${book.id}: ${e.message}`);
        return;
    }

    // Step 2: OCR images
    const bookImgDir = path.join(TEMP_IMG_DIR, book.id);
    if (!fs.existsSync(bookImgDir)) {
        console.log(`[SKIP] No images generated (already searchable?).`);
        return;
    }

    const images = fs.readdirSync(bookImgDir).filter(f => f.endsWith('.png')).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

    console.log(`[2/3] Running OCR on ${images.length} pages...`);

    const bookResults = [];
    const scheduler = Tesseract.createScheduler();

    // Support multiple languages
    const lang = book.subject.toLowerCase().includes('rus') ? 'aze+rus+eng' : 'aze+eng';

    // Create 4 workers for parallel processing
    for (let i = 0; i < 4; i++) {
        const worker = await Tesseract.createWorker(lang);
        scheduler.addWorker(worker);
    }

    for (const img of images) {
        const imgPath = path.join(bookImgDir, img);
        const pageNum = img.match(/\d+/)[0];

        console.log(`  - OCRing Page ${pageNum}...`);
        const { data: { text } } = await scheduler.addJob('recognize', imgPath);

        bookResults.push({
            page: parseInt(pageNum),
            text: text
        });
    }

    await scheduler.terminate();

    // Step 3: Save results
    console.log(`[3/3] Saving OCR results for ${book.id}`);
    const outputPath = path.join(OUTPUT_DIR, `${book.id}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(bookResults, null, 2));

    // Optional: Cleanup images
    // fs.rmSync(bookImgDir, { recursive: true, force: true });
}

async function runMaster() {
    const data = JSON.parse(fs.readFileSync(TEXTBOOKS_FILE, 'utf8'));
    const grade5 = data["5"];

    for (const book of grade5) {
        if (book.type === 'pdf') {
            await processBook(book);
        }
    }

    console.log("\n✅ ALL PDF TEXTBOOKS PROCESSED!");
}

runMaster().catch(console.error);
