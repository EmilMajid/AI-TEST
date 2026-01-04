const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

async function runOCR() {
    const imageDir = path.join(__dirname, 'ocr_temp');
    const images = fs.readdirSync(imageDir).filter(f => f.endsWith('.png'));

    console.log(`Starting OCR on ${images.length} images...`);

    for (const image of images) {
        const imagePath = path.join(imageDir, image);
        console.log(`Processing ${image}...`);

        try {
            const { data: { text } } = await Tesseract.recognize(
                imagePath,
                'aze+rus+eng', // Azerbaijani, Russian, English
                { logger: m => console.log(m.status, Math.round(m.progress * 100) + '%') }
            );

            console.log(`\n--- OCR Result for ${image} ---`);
            console.log(text.substring(0, 500) + "...");

            // Save result
            const txtPath = imagePath.replace('.png', '.txt');
            fs.writeFileSync(txtPath, text);
            console.log(`Saved to ${txtPath}\n`);
        } catch (err) {
            console.error(`Error processing ${image}:`, err);
        }
    }
}

runOCR().catch(console.error);
