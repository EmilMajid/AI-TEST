/**
 * e-derslik Textbook Downloader & Converter
 * 
 * This script downloads textbooks from e-derslik.edu.az and converts them to PDF
 * for use in the Azerbaijan AI Platform.
 * 
 * PREREQUISITES:
 * 1. Node.js installed
 * 2. Calibre installed (for ebook-convert tool) - https://calibre-ebook.com/download
 *    Ensure 'ebook-convert' is in your system PATH.
 * 
 * USAGE:
 * node scripts/download-textbooks.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');
const http = require('http');

// Configuration
const TEXTBOOKS_DIR = path.join(__dirname, '../public/textbooks');
const TEMP_DIR = path.join(__dirname, '../temp');

// Real textbooks from e-derslik.edu.az
// Note: These URLs are examples. You need to find the actual download links from e-derslik.edu.az
// by inspecting the network tab when downloading textbooks from the website.
const TEXTBOOKS_TO_PROCESS = [
    {
        id: 'geo-8',
        title: 'Coğrafiya 8',
        class: '8',
        subject: 'Coğrafiya',
        // You need to replace this with the actual download URL from e-derslik.edu.az
        // Example: https://www.e-derslik.edu.az/books/geo-8.epub
        downloadUrl: null, // Set to null if you want to manually download
        manualPath: null, // If you manually download, put the file path here
        outputFilename: 'geo-8.pdf',
        topics: [
            'Azərbaycanın coğrafi mövqeyi',
            'Azərbaycanın təbii şəraiti',
            'Azərbaycanın iqlimi',
            'Azərbaycanın daxili suları',
            'Azərbaycanın torpaqları və bitki örtüyü'
        ]
    },
    {
        id: 'tarix-8',
        title: 'Azərbaycan tarixi 8',
        class: '8',
        subject: 'Tarix',
        downloadUrl: null,
        manualPath: null,
        outputFilename: 'tarix-8.pdf',
        topics: [
            'Azərbaycan XIX əsrin əvvəllərində',
            'Rusiya-İran müharibələri',
            'Gülüstan və Türkmənçay müqavilələri',
            'XIX əsrdə Azərbaycanda mədəniyyət'
        ]
    },
    {
        id: 'riyaziyyat-8',
        title: 'Riyaziyyat 8',
        class: '8',
        subject: 'Riyaziyyat',
        downloadUrl: null,
        manualPath: null,
        outputFilename: 'riyaziyyat-8.pdf',
        topics: [
            'Rasional ədədlər',
            'Tənliklər və bərabərsizliklər',
            'Funksiyalar',
            'Həndəsə: Çevrə və dairə'
        ]
    }
];

// Ensure directories exist
[TEXTBOOKS_DIR, TEMP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('🚀 Starting textbook processing...');
console.log(`📁 Output directory: ${TEXTBOOKS_DIR}\n`);

// Helper to download file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirects
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlinkSync(dest);
            reject(err);
        });
    });
};

// Helper to convert to PDF using Calibre's ebook-convert
const convertToPdf = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`📄 Converting ${path.basename(inputPath)} to PDF...`);

        // ebook-convert supports: EPUB, MOBI, AZW, HTML, etc.
        const command = `ebook-convert "${inputPath}" "${outputPath}" --paper-size a4 --pdf-page-numbers --margin-left 20 --margin-right 20 --margin-top 20 --margin-bottom 20`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error converting file: ${error.message}`);
                reject(error);
                return;
            }
            console.log(`✅ Converted successfully: ${path.basename(outputPath)}`);
            resolve();
        });
    });
};

// Check if Calibre is installed
const checkCalibre = () => {
    return new Promise((resolve) => {
        exec('ebook-convert --version', (error) => {
            if (error) {
                console.error('❌ ebook-convert (Calibre) not found!');
                console.error('   Please install Calibre and add it to your PATH.');
                console.error('   Download: https://calibre-ebook.com/download\n');
                resolve(false);
            } else {
                console.log('✅ Calibre found!\n');
                resolve(true);
            }
        });
    });
};

async function processTextbooks() {
    const calibreAvailable = await checkCalibre();

    if (!calibreAvailable) {
        console.log('⚠️  Skipping conversion. Please install Calibre first.');
        return;
    }

    for (const book of TEXTBOOKS_TO_PROCESS) {
        console.log(`\n📚 Processing: ${book.title}...`);

        try {
            let inputPath;

            // Step 1: Download or use manual path
            if (book.manualPath && fs.existsSync(book.manualPath)) {
                console.log(`📥 Using manually downloaded file: ${book.manualPath}`);
                inputPath = book.manualPath;
            } else if (book.downloadUrl) {
                const ext = path.extname(book.downloadUrl) || '.epub';
                const downloadPath = path.join(TEMP_DIR, `${book.id}${ext}`);

                console.log(`📥 Downloading from: ${book.downloadUrl}`);
                await downloadFile(book.downloadUrl, downloadPath);
                console.log(`✅ Downloaded to: ${downloadPath}`);
                inputPath = downloadPath;
            } else {
                console.log(`⚠️  No download URL or manual path provided for ${book.title}`);
                console.log(`   Please download the textbook manually from e-derslik.edu.az`);
                console.log(`   and set the 'manualPath' in the script.\n`);
                continue;
            }

            // Step 2: Convert to PDF
            const outputPath = path.join(TEXTBOOKS_DIR, book.outputFilename);
            await convertToPdf(inputPath, outputPath);

            // Step 3: Update education-data.ts (manual step - show instructions)
            console.log(`\n📝 Next steps for ${book.title}:`);
            console.log(`   1. PDF created at: ${outputPath}`);
            console.log(`   2. Add this entry to lib/education-data.ts:`);
            console.log(`      {`);
            console.log(`        id: '${book.id}',`);
            console.log(`        title: '${book.title}',`);
            console.log(`        class: '${book.class}',`);
            console.log(`        subject: '${book.subject}',`);
            console.log(`        pdfUrl: '/textbooks/${book.outputFilename}',`);
            console.log(`        topics: ${JSON.stringify(book.topics, null, 10)}`);
            console.log(`      }`);

        } catch (error) {
            console.error(`❌ Error processing ${book.title}:`, error.message);
        }
    }

    console.log('\n✅ Processing complete!');
    console.log('\n📋 Summary:');
    console.log(`   - Processed ${TEXTBOOKS_TO_PROCESS.length} textbooks`);
    console.log(`   - Output directory: ${TEXTBOOKS_DIR}`);
    console.log(`   - Remember to update lib/education-data.ts with the textbook entries shown above`);
}

processTextbooks();
