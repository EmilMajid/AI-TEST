const fs = require('fs');
const path = require('path');
const https = require('https');

const BOOKS = [
    {
        name: 'Texnologiya 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-texnologiya-quot-fanni-uzra-5-ci-sinif-ucun-darslik.pdf',
        dir: 'texnologiya',
        filename: 'texnologiya-5.pdf'
    },
    {
        name: 'Təsviri İncəsənət 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tasviri-incasanat-quot-fanni-uzra-5-ci-sinif-ucun-darslik-1595329086-259.pdf',
        dir: 'tesviri-incesenet',
        filename: 'tesviri-incesenet-5.pdf'
    },
    {
        name: 'Fiziki tərbiyə 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-fiziki-tarbiya-quot-fanni-uzra-5-ci-sinif-ucun-darslik.pdf',
        dir: 'fiziki-terbiye',
        filename: 'fiziki-terbiye-5.pdf'
    },
    {
        name: 'Musiqi 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-musiqi-quot-fanni-uzra-5-ci-sinif-ucun-darslik.pdf',
        dir: 'musiqi',
        filename: 'musiqi-5.pdf'
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
    console.log('Downloading final Grade 5 textbooks from TRIMS...');

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

    console.log('\n✅ All Grade 5 textbooks downloaded!');
}

main();
