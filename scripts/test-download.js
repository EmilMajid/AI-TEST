/**
 * Test script - Download single textbook
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');

const TEXTBOOKS_DIR = path.join(__dirname, '../public/textbooks');
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure directories exist
[TEXTBOOKS_DIR, TEMP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('🚀 Testing textbook download...\n');

// Test with Azərbaycan dili
const testBook = {
    id: 784,
    title: "Azərbaycan dili 8",
    subject: "Azərbaycan dili",
    epub: "https://www.e-derslik.edu.az/books/784/784.epub"
};

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        console.log(`📥 Downloading from: ${url}`);
        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            console.log(`   Status: ${response.statusCode}`);

            if (response.statusCode === 302 || response.statusCode === 301) {
                console.log(`   Redirect to: ${response.headers.location}`);
                file.close();
                fs.unlinkSync(dest);
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return reject(new Error(`HTTP ${response.statusCode}`));
            }

            let downloaded = 0;
            response.on('data', (chunk) => {
                downloaded += chunk.length;
                process.stdout.write(`\r   Downloaded: ${(downloaded / 1024).toFixed(0)} KB`);
            });

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`\n✅ Download complete`);
                resolve();
            });
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            reject(err);
        });
    });
};

const convertToPdf = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`\n📄 Converting to PDF...`);
        const command = `ebook-convert "${inputPath}" "${outputPath}" --paper-size a4 --pdf-page-numbers`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Conversion error: ${error.message}`);
                return reject(error);
            }
            if (stderr) console.log(`   ${stderr}`);
            console.log(`✅ Conversion complete`);
            resolve();
        });
    });
};

async function test() {
    try {
        const epubPath = path.join(TEMP_DIR, `${testBook.id}.epub`);
        const pdfPath = path.join(TEXTBOOKS_DIR, `${testBook.id}.pdf`);

        console.log(`📚 Testing: ${testBook.title}\n`);

        await downloadFile(testBook.epub, epubPath);
        await convertToPdf(epubPath, pdfPath);

        // Clean up
        fs.unlinkSync(epubPath);

        console.log(`\n✅ Test successful!`);
        console.log(`📁 PDF saved to: ${pdfPath}`);

    } catch (error) {
        console.error(`\n❌ Test failed: ${error.message}`);
        process.exit(1);
    }
}

test();
