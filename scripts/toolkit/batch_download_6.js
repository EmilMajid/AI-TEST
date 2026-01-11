const { downloadFile } = require('./downloader');
const path = require('path');

const NEW_BATCH = [
    {
        name: 'Coğrafiya 6 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-cografiya-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1-ci-hissa.pdf',
        dest: 'public/textbooks/6/cografiya-hisse-1/book.pdf'
    },
    {
        name: 'İnformatika 6',
        url: 'https://www.trims.edu.az/noduploads/book/quot-informatika-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1758016863-737.pdf',
        dest: 'public/textbooks/6/informatika/book.pdf'
    },
    {
        name: 'Ədəbiyyat 6',
        url: 'https://www.trims.edu.az/noduploads/book/quot-adabiyyat-quot-fanni-uzra-6-ci-sinif-ucun-darslik.pdf',
        dest: 'public/textbooks/6/edebiyyat/book.pdf'
    },
    {
        name: 'Azərbaycan tarixi 6',
        url: 'https://www.trims.edu.az/noduploads/book/quot-azarbaycan-tarixi-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1758009130-577.pdf',
        dest: 'public/textbooks/6/azerbaycan-tarixi/book.pdf'
    },
    {
        name: 'Ümumi tarix 6',
        url: 'https://www.trims.edu.az/noduploads/book/quot-umumi-tarix-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1757944868-559.pdf',
        dest: 'public/textbooks/6/umumi-tarix/book.pdf'
    },
    {
        name: 'Riyaziyyat 6 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-riyaziyyat-quot-fanni-uzra-6-ci-sinif-ucun-darslik-1-ci-hissa-1758003051-837.pdf',
        dest: 'public/textbooks/6/riyaziyyat-hisse-1/book.pdf'
    },
    {
        name: 'Azərbaycan dili 6 (Hissə 1)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-azarbaycan-dili-quot-tadris-dili-fanni-uzra-6-ci-sinif-ucun-darslik-1-ci-hissa.pdf',
        dest: 'public/textbooks/6/azerbaycan-dili-hisse-1/book.pdf'
    },
    {
        name: 'Azərbaycan dili 6 (Hissə 2)',
        url: 'https://www.trims.edu.az/noduploads/book/quot-azarbaycan-dili-quot-tadris-dili-fanni-uzra-6-ci-sinif-ucun-darslik-2-ci-hissa-1757975213-163.pdf',
        dest: 'public/textbooks/6/azerbaycan-dili-hisse-2/book.pdf'
    }
];

async function main() {
    for (const book of NEW_BATCH) {
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
