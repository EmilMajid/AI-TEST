const https = require('https');

// URL based on user's link but filtered for Grade 5 (id=5) and Foreign Languages
// User link had many classes. Let's simplify to Grade 5 to see what we find.
// The search page uses query params.
const searchUrl = "https://www.trims.edu.az/site/search.php?category_id=c-1&classes_id%5B%5D=5&search=ok";

async function fetchUrl(url) {
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    };
    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function findBooks() {
    console.log(`Fetching TRIMS Search Results for Grade 5...`);
    try {
        const html = await fetchUrl(searchUrl);

        // Log all resource links to debug
        const allLinksRegex = /href="resource\.php\?id=(\d+)"/g;
        let match;
        const allIds = new Set();

        while ((match = allLinksRegex.exec(html)) !== null) {
            allIds.add(match[1]);
        }

        console.log(`Total Resource IDs found: ${allIds.size}`);

        // Setup simple lookup map if possible, or just print snippets around IDs
        console.log(`Deep scanning specific IDs...`);

        const targetIds = [1868, 1893, 1871, 1860, 1890, 1862];

        await Promise.all(targetIds.map(async (id) => {
            try {
                const detailHtml = await fetchUrl(`https://www.trims.edu.az/site/resource.php?id=${id}`);
                const titleMatch = detailHtml.match(/<title>(.*?)<\/title>/i);
                const title = titleMatch ? titleMatch[1].trim() : "Unknown";

                console.log(`\nID ${id} | Title: ${title}`);
                const pdfMatch = detailHtml.match(/href="([^"]+\.pdf)"/i);
                if (pdfMatch) {
                    let pdfUrl = pdfMatch[1];
                    if (!pdfUrl.startsWith('http')) {
                        pdfUrl = "https://www.trims.edu.az" + (pdfUrl.startsWith('/') ? '' : '/') + pdfUrl;
                    }
                    console.log(`   📄 PDF FOUND: ${pdfUrl}`);
                } else {
                    console.log(`   ❌ No PDF found`);
                    // Check for E-Derslik link
                    const ederslikMatch = detailHtml.match(/href="(https:\/\/www\.e-derslik\.edu\.az[^"]+)"/i);
                    if (ederslikMatch) {
                        console.log(`   🌐 E-Derslik: ${ederslikMatch[1]}`);
                    }
                }
            } catch (e) {
                console.error(`Error scanning ID ${id}: ${e.message}`);
            }
        }));
    } catch (e) {
        console.error("Error fetching TRIMS:", e.message);
    }
}

findBooks();
