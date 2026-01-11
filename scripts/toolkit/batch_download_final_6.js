const { downloadFile } = require('./downloader');
const path = require('path');

const FINAL_BATCH = [
    { name: 'Alman dili 6 (İkinci)', url: 'https://www.trims.edu.az/noduploads/book/quot-deutsch-quot-alman-dili-ikinci-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1757674645-738.pdf', dest: 'public/textbooks/6/alman-dili-2/book.pdf' },
    { name: 'Alman dili 6 (Əsas)', url: 'https://www.trims.edu.az/noduploads/book/quot-alman-dili-quot-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1631279917-903.pdf', dest: 'public/textbooks/6/alman-dili/book.pdf' },
    { name: 'Təbiət 6 (Hissə 2)', url: 'https://www.trims.edu.az/noduploads/book/quot-tabiat-quot-fanni-uzra-6-ci-sinif-ucun-darslik-2-ci-hissa-1689687994-596.pdf', dest: 'public/textbooks/6/tebiet-hisse-2/book.pdf' },
    { name: 'Təbiət 6 (Hissə 1)', url: 'https://www.trims.edu.az/noduploads/book/quot-tabiat-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1-ci-hissa-1689687927-217.pdf', dest: 'public/textbooks/6/tebiet-hisse-1/book.pdf' },
    { name: 'Fiziki tərbiyə 6', url: 'https://www.trims.edu.az/noduploads/book/quot-fiziki-tarbiya-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1633503309-972.pdf', dest: 'public/textbooks/6/fiziki-terbiye/book.pdf' },
    { name: 'Coğrafiya 6 (Hissə 2)', url: 'https://www.trims.edu.az/noduploads/book/quot-cografiya-quot-fanni-uzra-6-ci-sinif-ucun-darslik-2-ci-hissa-1727855998-286.pdf', dest: 'public/textbooks/6/cografiya-hisse-2/book.pdf' },
    { name: 'Riyaziyyat 6 (Hissə 2)', url: 'https://www.trims.edu.az/noduploads/book/quot-riyaziyyat-quot-fanni-uzra-6-ci-sinif-ucun-darslik-2-ci-hissa-1758003258-217.pdf', dest: 'public/textbooks/6/riyaziyyat-hisse-2/book.pdf' },
    { name: 'Rus dili 6 (Əsas)', url: 'https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-quot-rus-dili-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1630840115-811.pdf', dest: 'public/textbooks/6/rus-dili/book.pdf' },
    { name: 'Rus dili 6 (İkinci)', url: 'https://www.trims.edu.az/noduploads/book/quot-russkij-yazyk-quot-rus-dili-ikinci-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1630949803-229.pdf', dest: 'public/textbooks/6/rus-dili-2/book.pdf' },
    { name: 'Fransız dili 6 (Əsas)', url: 'https://www.trims.edu.az/noduploads/book/quot-le-francais-quot-fransiz-dili-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1761549522-432.pdf', dest: 'public/textbooks/6/fransiz-dili/book.pdf' },
    { name: 'İngilis dili 6 (Əsas)', url: 'https://www.trims.edu.az/noduploads/book/quot-english-quot-ingilis-dili-asas-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik-1758090974-778.pdf', dest: 'public/textbooks/6/ingilis-dili/book.pdf' },
    { name: 'Fransız dili 6 (İkinci)', url: 'https://www.trims.edu.az/noduploads/book/quot-le-francais-quot-fransiz-dili-ikinci-xarici-dil-fanni-uzra-6-ci-sinif-ucun-darslik.pdf', dest: 'public/textbooks/6/fransiz-dili-2/book.pdf' }
];

async function main() {
    for (const book of FINAL_BATCH) {
        console.log(`Downloading ${book.name}...`);
        try {
            const destPath = path.join(process.cwd(), book.dest);
            await downloadFile(book.url, destPath);
            console.log(`✅ Success: ${book.name}`);
        } catch (e) {
            console.error(`❌ Failed ${book.name}: ${e.message}`);
        }
    }
}

main();
