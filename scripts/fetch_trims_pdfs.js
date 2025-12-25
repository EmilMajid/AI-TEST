const https = require('https');

const bookIds = [
    { id: '1007', name: 'Texnologiya 5' },
    { id: '1147', name: 'Təsviri İncəsənət 5' },
    { id: '1457', name: 'Fiziki Tərbiyə 5' },
    { id: '1880', name: 'Musiqi 5' },
    { id: '1488', name: 'Təbiət 5 H1' },
    { id: '1634', name: 'Təbiət 5 H2' },
    { id: '1638', name: 'Azərbaycan Dili 5 H1' },
    { id: '1704', name: 'Azərbaycan Dili 5 H2' },
    { id: '1703', name: 'Riyaziyyat 5 H1' },
    { id: '1771', name: 'Riyaziyyat 5 H2' },
    // Grade 8
    { id: '1681', name: 'İnformatika 8' },
    { id: '902', name: 'Fiziki Tərbiyə 8' },
    { id: '882', name: 'Həyat Bilgisi 8' },
    { id: '876', name: 'Təsviri İncəsənət 8' },
    { id: '890', name: 'Musiqi 8' },
    { id: '919', name: 'Texnologiya 8' }
];

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    console.log("Fetching PDF URLs...");
    for (const book of bookIds) {
        try {
            const html = await fetchUrl(`https://www.trims.edu.az/site/resource.php?id=${book.id}`);
            // Look for href that ends in .pdf
            const match = html.match(/href="([^"]+\.pdf)"/i);
            if (match) {
                let pdfUrl = match[1];
                if (!pdfUrl.startsWith('http')) {
                    pdfUrl = "https://www.trims.edu.az" + (pdfUrl.startsWith('/') ? '' : '/') + pdfUrl;
                }
                console.log(`FOUND: ${book.name} | ${pdfUrl}`);
            } else {
                console.log(`MISSING PDF: ${book.name} (ID: ${book.id})`);
            }
        } catch (e) {
            console.error(`ERROR ${book.name}: ${e.message}`);
        }
    }
}

run();
