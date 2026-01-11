/**
 * UIS Downloader Utility
 * Standalone script to download files with progress logging.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: Status ${response.statusCode}`));
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

// If run directly: node downloader.js [url] [destPath]
if (require.main === module) {
    const [, , url, destPath] = process.argv;
    if (!url || !destPath) {
        console.error("Usage: node downloader.js [url] [destPath]");
        process.exit(1);
    }

    downloadFile(url, destPath)
        .then(() => console.log(`✅ Downloaded: ${destPath}`))
        .catch(err => {
            console.error(`❌ Error: ${err.message}`);
            process.exit(1);
        });
}

module.exports = { downloadFile };
