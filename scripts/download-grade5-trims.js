const fs = require('fs');
const path = require('path');
const https = require('https');

const BOOKS = [
    {
        name: 'English 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-english-quot-ingilis-dili-asas-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik-1727852668-855.pdf',
        dir: 'ingilis-dili',
        filename: 'english-5.pdf'
    },
    {
        name: 'Təbiət 5 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tabiat-quot-fanni-uzra-5-ci-sinif-ucun-darslik-1-ci-hissa-1663259290-413.pdf',
        dir: 'tebiet-hisse-1',
        filename: 'tebiet-5-h1.pdf'
    },
    {
        name: 'Təbiət 5 (Hissə 2)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tabiat-quot-fanni-uzra-5-ci-sinif-ucun-darslik-2-ci-hissa.pdf',
        dir: 'tebiet-hisse-2',
        filename: 'tebiet-5-h2.pdf'
    }
];

const BASE_DIR = path.join(process.cwd(), 'public', 'textbooks', '5');

async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
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

async function main() {
    console.log('Downloading missing Grade 5 textbooks from TRIMS...');

    for (const book of BOOKS) {
        const targetDir = path.join(BASE_DIR, book.dir);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const destPath = path.join(targetDir, book.filename);
        console.log(`Downloading ${book.name} -> ${book.dir}/${book.filename}...`);

        try {
            await downloadFile(book.url, destPath);
            console.log(`✅ ${book.name} downloaded successfully.`);
        } catch (error) {
            console.error(`❌ Failed to download ${book.name}:`, error.message);
        }
    }
}

main();
