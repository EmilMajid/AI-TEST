const https = require('https');

const ids = ['1007', '1681']; // Texnologiya 5, İnformatika 8

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
    for (const id of ids) {
        console.log(`--- DEBUGGING ID ${id} ---`);
        try {
            const html = await fetchUrl(`https://www.trims.edu.az/site/resource.php?id=${id}`);
            console.log(html.substring(0, 2000)); // Print first 2000 chars
            // Check for specific PDF strings
            const matches = html.match(/href="[^"]+\.pdf"/g);
            if (matches) {
                console.log("PDF Links found:", matches);
            } else {
                console.log("No PDF links found.");
            }
        } catch (e) {
            console.error(e);
        }
    }
}

run();
