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

    // Step 2: Read searchable text metadata
    const bookImgDir = path.join(TEMP_IMG_DIR, book.id);
    const metaPath = path.join(bookImgDir, "searchable_text.json");
    if (!fs.existsSync(metaPath)) {
        console.warn(`[SKIP] No metadata generated for ${book.id}`);
        return;
    }

    const pagesData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const imagesToOCR = pagesData.filter(p => p.image_path && !p.text);

    console.log(`[2/3] Processing ${pagesData.length} pages (${imagesToOCR.length} need OCR)...`);

    const bookResults = [];
    const scheduler = Tesseract.createScheduler();

    // Support multiple languages based on subject
    let lang = 'aze+eng'; // Default
    const sub = book.subject.toLowerCase();
    const title = book.title.toLowerCase();

    if (sub.includes('rus') || title.includes('rus')) lang = 'aze+rus+eng';
    else if (sub.includes('alman') || title.includes('alman')) lang = 'aze+deu+eng';
    else if (sub.includes('fransız') || title.includes('fransız')) lang = 'aze+fra+eng';
    else if (sub.includes('ingilis')) lang = 'aze+eng';

    console.log(`  - Language configuration: ${lang}`);

    // Create workers with specific language support
    const workers = [];
    if (imagesToOCR.length > 0) {
        for (let i = 0; i < 2; i++) {
            const worker = await Tesseract.createWorker(lang);
            scheduler.addWorker(worker);
            workers.push(worker);
        }
    }

    const NOISE_KEYWORDS = [
        'Dövlət Himni', 'Dövlət Bayrağı', 'Dövlət Gerbi',
        'nəşr ili', 'tiraj', 'çapa imzalanıb', 'İpək yolu',
        'Azərbaycan Respublikasının Təhsil Nazirliyi'
    ];

    for (const page of pagesData) {
        let text = page.text;
        const pageNum = page.page;

        if (!text && page.image_path) {
            const imgPath = path.join(bookImgDir, page.image_path);
            if (pageNum < 5) console.log(`  - OCRing Page ${pageNum}...`);

            const { data: { text: ocrText } } = await scheduler.addJob('recognize', imgPath);
            text = ocrText;
        }

        if (!text) continue;

        // Basic noise filter
        const lowerText = text.toLowerCase();
        const isNoise = NOISE_KEYWORDS.some(k => lowerText.includes(k.toLowerCase()));

        if (isNoise && pageNum < 10) {
            console.log(`    [FILTER] Skipped metadata/noise on page ${pageNum}`);
            continue;
        }

        bookResults.push({
            page: pageNum,
            text: text.trim()
        });
    }

    if (imagesToOCR.length > 0) await scheduler.terminate();

    // Step 3: Save results
    console.log(`[3/3] Saving final results for ${book.id} (${bookResults.length} pages captured)`);
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
