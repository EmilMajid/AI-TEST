const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
    {
        name: 'Alman dili 5 (2nd)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-deutsch-quot-alman-dili-ikinci-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik.pdf',
        dir: 'public/textbooks/5/alman-dili-5',
        file: 'alman-5.pdf'
    },
    {
        name: 'Fransız dili 5 (Main)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-le-francais-quot-fransiz-dili-asas-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik-1723808781-147.pdf',
        dir: 'public/textbooks/5/fransiz-dili-5',
        file: 'fransiz-5.pdf'
    },
    {
        name: 'Rus dili 5 (Main)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-quot-rus-dili-asas-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik-1724913033-941.pdf',
        dir: 'public/textbooks/5/rus-dili-5',
        file: 'rus-5.pdf'
    },
    {
        name: 'Rus dili 5 (2nd)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-quot-rus-dili-ikinci-xarici-dil-fanni-uzra-5-ci-sinif-ucun-darslik-1724910660-335.pdf',
        dir: 'public/textbooks/5/rus-dili-2-5',
        file: 'rus-2-5.pdf'
    }
];

async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);

        // Remove '..' from URL if present (TRIMS output had it)
        const cleanUrl = url.replace('/\.\.', '');

        https.get(cleanUrl, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(destPath));
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => { });
            reject(err);
        });
    });
}

async function run() {
    console.log('🚀 Starting Foreign Language PDF Downloads...\n');

    for (const item of downloads) {
        if (!fs.existsSync(item.dir)) {
            fs.mkdirSync(item.dir, { recursive: true });
        }

        const dest = path.join(item.dir, item.file);
        console.log(`Downloading ${item.name}...`);
        try {
            await downloadFile(item.url, dest);
            console.log(`✅ Downloaded to ${dest}`);
        } catch (e) {
            console.error(`❌ Error downloading ${item.name}: ${e.message}`);
        }
    }
    console.log('\nAll downloads processed.');
}

run();
