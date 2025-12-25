const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
    {
        name: 'Fiziki Tərbiyə 8',
        url: 'https://www.trims.edu.az/noduploads/book/quot-fiziki-tarbiya-quot-fanni-uzra-8-ci-sinif-ucun-darslik.pdf',
        dest: 'public/textbooks/8/fiziki-terbiye/book.pdf'
    },
    {
        name: 'Həyat Bilgisi 8',
        url: 'https://www.trims.edu.az/noduploads/book/quot-hayat-bilgisi-quot-fanni-uzra-8-ci-sinif-ucun-darslik.pdf',
        dest: 'public/textbooks/8/hayat-bilgisi/book.pdf'
    },
    {
        name: 'Təsviri İncəsənət 8',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tasviri-incasanat-quot-fanni-uzra-8-ci-sinif-ucun-darslik-1564551241-868.pdf',
        dest: 'public/textbooks/8/tesviri-incesenet/book.pdf'
    },
    {
        name: 'Musiqi 8',
        url: 'https://www.trims.edu.az/noduploads/book/quot-musiqi-quot-fanni-uzra-8-ci-sinif-ucun-darslik.pdf',
        dest: 'public/textbooks/8/musiqi/book.pdf'
    },
    {
        name: 'Texnologiya 8',
        url: 'https://www.trims.edu.az/noduploads/book/quot-texnologiya-quot-fanni-uzra-8-ci-sinif-ucun-darslik.pdf',
        dest: 'public/textbooks/8/texnologiya/book.pdf'
    }
];

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

async function downloadFile(url, dest) {
    ensureDirectoryExistence(dest);
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    for (const item of downloads) {
        console.log(`Downloading ${item.name}...`);
        try {
            await downloadFile(item.url, item.dest);
            console.log(`✅ Downloaded ${item.name}`);
        } catch (e) {
            console.error(`❌ Error ${item.name}: ${e.message}`);
        }
    }
}

run();
