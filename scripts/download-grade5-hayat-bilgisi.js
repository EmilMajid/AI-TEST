const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

const BOOK_ID = 451;
const BOOK_TITLE = "Həyat bilgisi 5";
const SUBJECT_SLUG = "hayat-bilgisi";

const GRADE = '5';
const BASE_DIR = path.join(process.cwd(), 'public', 'textbooks', GRADE);
const TEMP_DIR = path.join(process.cwd(), 'temp');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Status code: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve());
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => { });
            reject(err);
        });
    });
}

function unzipFile(zipPath, destDir) {
    return new Promise((resolve, reject) => {
        // Using PowerShell for cross-platform zip capability on Windows without extra deps
        const command = `powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.warn(`PowerShell unzip failed, trying generic unzip...`);
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function main() {
    console.log(`Starting download for ${BOOK_TITLE} (ID: ${BOOK_ID})...`);

    const targetDir = path.join(BASE_DIR, SUBJECT_SLUG);
    const tempZip = path.join(TEMP_DIR, `${SUBJECT_SLUG}.zip`);
    const downloadUrl = `https://www.e-derslik.edu.az/player/books/${BOOK_ID}/darslik.zip`; // Standard format

    try {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        console.log(`Downloading URL: ${downloadUrl}`);
        await downloadFile(downloadUrl, tempZip);
        console.log('Download complete. Extracting...');

        await unzipFile(tempZip, targetDir);
        console.log(`✅ Extracted to ${targetDir}`);

        // Initial check for toc.xhtml
        const tocPath = path.join(targetDir, 'OEBPS', 'toc.xhtml');
        const altTocPath = path.join(targetDir, 'toc.xhtml');
        if (fs.existsSync(tocPath) || fs.existsSync(altTocPath)) {
            console.log('✅ TOC file found.');
        } else {
            console.warn('⚠️ TOC file NOT found. This might be a PDF-only zip or non-standard structure.');
        }

        // Cleanup
        // fs.unlinkSync(tempZip); 

    } catch (error) {
        console.error(`❌ Error downloading ${BOOK_TITLE}:`, error.message);
    }
}

main();
