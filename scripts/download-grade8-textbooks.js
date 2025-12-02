/**
 * Automated Grade 8 Textbooks Downloader & Converter
 * Downloads all 23 textbooks from e-derslik.edu.az and converts to PDF
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');

// Configuration
const TEXTBOOKS_DIR = path.join(__dirname, '../public/textbooks');
const TEMP_DIR = path.join(__dirname, '../temp');

// All Grade 8 textbooks with EPUB download URLs
const TEXTBOOKS = [
    { id: 784, title: "Azərbaycan dili 8", subject: "Azərbaycan dili", epub: "https://www.e-derslik.edu.az/books/784/784.epub" },
    { id: 785, title: "Alman dili 8 (əsas xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/785/785.epub" },
    { id: 786, title: "Alman dili 8 (ikinci xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/786/786.epub" },
    { id: 788, title: "İngilis dili 8 (ikinci xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/788/788.epub" },
    { id: 789, title: "Fransız dili 8 (əsas xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/789/789.epub" },
    { id: 790, title: "Fransız dili 8 (ikinci xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/790/790.epub" },
    { id: 791, title: "Ümumi tarix 8", subject: "Ümumi tarix", epub: "https://www.e-derslik.edu.az/books/791/791.epub" },
    { id: 793, title: "Ədəbiyyat 8", subject: "Ədəbiyyat", epub: "https://www.e-derslik.edu.az/books/793/793.epub" },
    { id: 795, title: "Rus dili 8 (əsas xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/795/795.epub" },
    { id: 796, title: "Rus dili 8 (ikinci xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/796/796.epub" },
    { id: 797, title: "İngilis dili 8 (əsas xarici dil)", subject: "Xarici dil", epub: "https://www.e-derslik.edu.az/books/797/797.epub" },
    { id: 799, title: "Azərbaycan tarixi 8", subject: "Azərbaycan tarixi", epub: "https://www.e-derslik.edu.az/books/799/799.epub" },
    { id: 801, title: "Coğrafiya 8", subject: "Coğrafiya", epub: "https://www.e-derslik.edu.az/books/801/801.epub" },
    { id: 803, title: "Kimya 8", subject: "Kimya", epub: "https://www.e-derslik.edu.az/books/803/803.epub" },
    { id: 824, title: "Texnologiya 8", subject: "Texnologiya", epub: "https://www.e-derslik.edu.az/books/824/824.epub" },
    { id: 369, title: "İnformatika 8", subject: "İnformatika", epub: "https://www.e-derslik.edu.az/books/369/369.epub" },
    { id: 371, title: "Fiziki tərbiyə 8", subject: "Fiziki tərbiyə", epub: "https://www.e-derslik.edu.az/books/371/371.epub" },
    { id: 374, title: "Coğrafiya 8 (zəngin dərslik)", subject: "Coğrafiya", epub: "https://www.e-derslik.edu.az/books/374/374.epub" },
    { id: 379, title: "Azərbaycan tarixi 8 (zəngin dərslik)", subject: "Azərbaycan tarixi", epub: "https://www.e-derslik.edu.az/books/379/379.epub" },
    { id: 381, title: "Fizika 8 (zəngin dərslik)", subject: "Fizika", epub: "https://www.e-derslik.edu.az/books/381/381.epub" },
    { id: 383, title: "Biologiya 8 (zəngin dərslik)", subject: "Biologiya", epub: "https://www.e-derslik.edu.az/books/383/383.epub" },
    { id: 393, title: "Riyaziyyat 8 (zəngin dərslik)", subject: "Riyaziyyat", epub: "https://www.e-derslik.edu.az/books/393/393.epub" },
    { id: 395, title: "Kimya 8 (zəngin dərslik)", subject: "Kimya", epub: "https://www.e-derslik.edu.az/books/395/395.epub" },
];

// Ensure directories exist
[TEXTBOOKS_DIR, TEMP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('🚀 Starting Grade 8 textbooks download and conversion...');
console.log(`📁 Output directory: ${TEXTBOOKS_DIR}\n`);

// Helper to download file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirects
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${url}`));
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

// Helper to convert to PDF using Calibre
const convertToPdf = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        const command = `ebook-convert "${inputPath}" "${outputPath}" --paper-size a4 --pdf-page-numbers --margin-left 20 --margin-right 20 --margin-top 20 --margin-bottom 20 --enable-heuristics`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
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

// Process textbooks
async function processTextbooks() {
    const calibreAvailable = await checkCalibre();

    if (!calibreAvailable) {
        console.log('⚠️  Skipping conversion. Please install Calibre first.');
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const book of TEXTBOOKS) {
        console.log(`\n📚 [${TEXTBOOKS.indexOf(book) + 1}/${TEXTBOOKS.length}] ${book.title}...`);

        try {
            // Step 1: Download EPUB
            const epubPath = path.join(TEMP_DIR, `${book.id}.epub`);
            console.log(`📥 Downloading...`);
            await downloadFile(book.epub, epubPath);
            console.log(`✅ Downloaded`);

            // Step 2: Convert to PDF
            const pdfFilename = `${book.id}.pdf`;
            const pdfPath = path.join(TEXTBOOKS_DIR, pdfFilename);
            console.log(`📄 Converting to PDF...`);
            await convertToPdf(epubPath, pdfPath);
            console.log(`✅ Converted: ${pdfFilename}`);

            // Clean up EPUB
            fs.unlinkSync(epubPath);

            successCount++;

        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            failCount++;
        }
    }

    console.log(`\n\n✅ Processing complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total: ${TEXTBOOKS.length} textbooks`);
    console.log(`   - Success: ${successCount}`);
    console.log(`   - Failed: ${failCount}`);
    console.log(`   - Output: ${TEXTBOOKS_DIR}`);
    console.log(`\n📝 Next step: Update lib/education-data.ts with textbook entries`);
}

processTextbooks();
