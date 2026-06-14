const fs = require('fs');
const path = require('path');
const https = require('https');

const dataDir = path.join(__dirname, '../data');
const umDir = path.join(dataDir, 'umumitarix6_chunks');
if (!fs.existsSync(umDir)) fs.mkdirSync(umDir, { recursive: true });

function fetchXHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                resolve('');
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

function stripHtml(html) {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
}

async function scrapeUmumiTarix() {
    console.log('Scraping Umumi tarix 6 (Full book)...');
    let fullText = '';
    for (let p = 1; p <= 200; p++) {
        const html = await fetchXHTML(`https://www.e-derslik.edu.az/books/920/units/unit-1/page${p}.xhtml`);
        if (html) {
            fullText += stripHtml(html) + '\n\n';
            if (p % 10 === 0) console.log(`Fetched page ${p}`);
        }
    }
    
    fs.writeFileSync(path.join(umDir, 'full_book.txt'), fullText, 'utf8');
    console.log('Full book saved. Length:', fullText.length);
    
    // Print first 2000 chars so we can see what headings exist
    console.log('\n--- FIRST 3000 CHARS ---');
    console.log(fullText.substring(0, 3000));
    console.log('\n--- SEARCHING FOR TOPIC KEYWORDS ---');
    
    const keywords = [
        'Tarixd', 'il hesab', 'ibtidai', 'cəmiyy', 'cəmiyy',
        'Ehram', 'Şumer', 'Sumer', 'Dvurechye', 'ikiçayaras',
        'Oda sitay', 'Parfiya', 'Tanr', 'Böyük ipək', 'ipək yol',
        'Şahmat', 'Avropa mədən', 'Respublika'
    ];
    
    keywords.forEach(kw => {
        const idx = fullText.indexOf(kw);
        if (idx !== -1) {
            console.log(`FOUND "${kw}" at position ${idx}: "${fullText.substring(idx, idx+100)}"`);
        } else {
            console.log(`NOT FOUND: "${kw}"`);
        }
    });
}

scrapeUmumiTarix().then(() => console.log('Done!'));
