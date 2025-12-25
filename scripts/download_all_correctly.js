const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
    // Grade 5 matches
    {
        name: 'Təsviri İncəsənət 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tasviri-incasanat-quot-fanni-uzra-5-ci-sinif-ucun-darslik-1595329086-259.pdf',
        dest: 'public/textbooks/5/tesviri-incesenet-5/tesviri-incesenet-5.pdf'
    },
    {
        name: 'Fiziki Tərbiyə 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-fiziki-tarbiya-quot-fanni-uzra-5-ci-sinif-ucun-darslik.pdf',
        dest: 'public/textbooks/5/fiziki-terbiye-5/fiziki-terbiye-5.pdf'
    },
    {
        name: 'Təbiət 5 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tabiat-quot-fanni-uzra-5-ci-sinif-ucun-darslik-1-ci-hissa-1663259290-413.pdf',
        dest: 'public/textbooks/5/tebiet-hisse-1/tebiet-5-h1.pdf'
    },
    {
        name: 'Təbiət 5 (Hissə 2)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-tabiat-quot-fanni-uzra-5-ci-sinif-ucun-darslik-2-ci-hissa.pdf',
        dest: 'public/textbooks/5/tebiet-hisse-2/tebiet-5-h2.pdf'
    },
    {
        name: 'Azərbaycan Tarixi 5',
        url: 'https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-5-ci-sinif-ucun-darslik-1721649923-178.pdf',
        dest: 'public/textbooks/5/azerbaycan-tarixi/book.pdf'
    },
    {
        name: 'Azərbaycan Dili 5 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-azarbaycan-dili-quot-tadris-dili-fanni-uzra-5-ci-sinif-ucun-1-ci-hissa-darslik.pdf',
        dest: 'public/textbooks/5/azerbaycan-dili-hisse-1/book.pdf'
    },
    {
        name: 'Azərbaycan Dili 5 (Hissə 2)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-azarbaycan-dili-quot-tadris-dili-fanni-uzra-5-ci-sinif-ucun-2-ci-hissa-darslik-1720120967-759.pdf',
        dest: 'public/textbooks/5/azerbaycan-dili-hisse-2/book.pdf'
    },
    {
        name: 'Riyaziyyat 5 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-riyaziyyat-quot-fanni-uzra-5-ci-sinif-ucun-1-ci-hissa-darslik.pdf',
        dest: 'public/textbooks/5/riyaziyyat-hisse-1/book.pdf'
    },
    {
        name: 'Riyaziyyat 5 (Hissə 2)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-riyaziyyat-quot-fanni-uzra-5-ci-sinif-ucun-2-ci-hissa-darslik-1720121878-890.pdf',
        dest: 'public/textbooks/5/riyaziyyat-hisse-2/book.pdf'
    },

    // Grade 8 matches
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
    console.log('Starting downloads...');
    for (const item of downloads) {
        console.log(`Downloading ${item.name}...`);
        try {
            await downloadFile(item.url, item.dest);
            console.log(`✅ Downloaded ${item.name}`);
        } catch (e) {
            console.error(`❌ Error ${item.name}: ${e.message}`);
        }
    }
    console.log('All downloads completed.');
}

run();
