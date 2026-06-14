const fs = require('fs');
const https = require('https');
const umDir = 'C:\\\\Users\\\\User\\\\Downloads\\\\azerbaijanaiplatform\\\\data\\\\umumitarix6_chunks';

function fetchXHTML(url) {
    return new Promise((resolve) => {
        const req = https.get(url, { timeout: 3000 }, (res) => {
            if (res.statusCode !== 200) { resolve(''); return; }
            let data = ''; 
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', () => resolve(''));
        req.on('timeout', () => { req.destroy(); resolve(''); });
    });
}

function stripHtml(html) {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function scrape() {
    let fullText = '';
    const pages = Array.from({length: 140}, (_, i) => i + 1);
    const batchSize = 10;
    
    for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize);
        console.log(`Fetching pages ${batch[0]} to ${batch[batch.length - 1]}...`);
        const results = await Promise.all(batch.map(p => fetchXHTML(`https://www.e-derslik.edu.az/books/920/units/unit-1/page${p}.xhtml`)));
        
        batch.forEach((p, idx) => {
            if (results[idx]) {
                fullText += `\\n\\n[PAGE ${p}]\\n\\n` + stripHtml(results[idx]);
            }
        });
    }
    fs.writeFileSync(umDir + '\\\\full_book.txt', fullText, 'utf8');
    console.log('Saved full book with pages. Length: ' + fullText.length);
}
scrape();
