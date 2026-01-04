const https = require('https');

// Known ID from user URL is 852, but let's check a range or specific ID if known for PDF.
// Trims usually mirrors e-derslik IDs or has its own.
// Let's search the resource page for standard IDs around Grade 5 foreign languages.

// Based on previous scripts, we can try to fetch the page for "Alman dili 5"
// The user link contains book_id=852. Let's try to see if TRIMS has a resource with this ID or similar.

const bookName = "Alman dili 5";
const potentialIds = [852, 1636, 1637, 1000, 1001, 1002]; // Guessing/using known ranges

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function searchForPdf() {
    console.log(`Searching PDF for ${bookName} in range 1400-1800...`);

    // Scan range where other Grade 5 books were found (e.g. 1634, 1704)
    const startId = 1400;
    const endId = 1800;
    const concurrency = 20; // Parallel requests

    let found = false;

    for (let i = startId; i <= endId; i += concurrency) {
        if (found) break;

        const batch = [];
        for (let j = 0; j < concurrency && i + j <= endId; j++) {
            batch.push(i + j);
        }

        await Promise.all(batch.map(async (id) => {
            if (found) return;
            try {
                const html = await fetchUrl(`https://www.trims.edu.az/site/resource.php?id=${id}`);
                // Check strictly for "Alman" and "5" in title
                if (/Alman\s+dili\s+5/i.test(html) || /Alman\s+dili.*5/i.test(html)) {
                    console.log(`\n!!! FOUND POTENTIAL MATCH: ID ${id}`);
                    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                    console.log(`Title: ${titleMatch ? titleMatch[1] : 'Unknown'}`);

                    const pdfMatch = html.match(/href="([^"]+\.pdf)"/i);
                    if (pdfMatch) {
                        let pdfUrl = pdfMatch[1];
                        if (!pdfUrl.startsWith('http')) {
                            pdfUrl = "https://www.trims.edu.az" + (pdfUrl.startsWith('/') ? '' : '/') + pdfUrl;
                        }
                        console.log(`PDF URL FOUND: ${pdfUrl}`);
                        found = true;
                    } else {
                        console.log('No PDF link found on page.');
                    }
                }
            } catch (e) {
                // ignore errors
            }
        }));

        if (i % 100 === 0) process.stdout.write('.');
    }

    if (!found) console.log('\nSearch complete. No PDF found.');
}

searchForPdf();
