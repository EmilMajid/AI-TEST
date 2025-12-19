
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

const BOOK_ID = '846';
const EPUB_URL = `https://www.e-derslik.edu.az/books/${BOOK_ID}/${BOOK_ID}.epub`;
const TARGET_DIR = path.join(process.cwd(), 'public', 'textbooks', '5', 'informatika');
const ZIP_FILE = path.join(process.cwd(), 'temp', `${BOOK_ID}.epub`);

// Ensure temp dir exists
if (!fs.existsSync(path.dirname(ZIP_FILE))) {
    fs.mkdirSync(path.dirname(ZIP_FILE), { recursive: true });
}

// Ensure target dir exists
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

console.log(`Downloading ${EPUB_URL}...`);

const file = fs.createWriteStream(ZIP_FILE);

https.get(EPUB_URL, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed to download: HTTP ${response.statusCode}`);
        if (response.statusCode === 404) {
            console.log("It seems the direct EPUB link pattern does not work for this book.");
        }
        return;
    }

    response.pipe(file);

    file.on('finish', () => {
        file.close(() => {
            console.log(`Download complete.`);

            // Rename to .zip for PowerShell
            const zipPath = ZIP_FILE.replace('.epub', '.zip');
            fs.renameSync(ZIP_FILE, zipPath);

            console.log(`Renamed to .zip. Unzipping to ${TARGET_DIR}...`);

            // Use PowerShell to unzip
            exec(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${TARGET_DIR}' -Force"`, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error unzipping:', err);
                    console.error(stderr);
                    return;
                }
                console.log('Unzip successful.');
                console.log('Checking for OEBPS folder...');

                if (fs.existsSync(path.join(TARGET_DIR, 'OEBPS'))) {
                    console.log('✅ OEBPS folder found.');
                    if (fs.existsSync(path.join(TARGET_DIR, 'OEBPS', 'toc.xhtml'))) {
                        console.log('✅ toc.xhtml found.');
                    } else {
                        console.log('⚠️ toc.xhtml NOT found.');
                    }
                } else {
                    console.log('❌ OEBPS folder NOT found. Structure might be different.');
                    const files = fs.readdirSync(TARGET_DIR);
                    console.log('Root files:', files);
                }
            });
        });
    });
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
});
