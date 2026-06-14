const fs = require('fs');
const path = require('path');
const https = require('https');

const dataDir = path.join(__dirname, '../data');
const azDir = path.join(dataDir, 'aztarixi6_chunks');
const umDir = path.join(dataDir, 'umumitarix6_chunks');
if (!fs.existsSync(azDir)) fs.mkdirSync(azDir, { recursive: true });
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
        }).on('error', reject);
    });
}

function stripHtml(html) {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
}

async function scrapeAzTarixi() {
    console.log('Scraping Azərbaycan tarixi 6 (Manna)...');
    let text = '';
    // Manna is roughly pages 70-85
    for(let p = 70; p <= 85; p++) {
        const html = await fetchXHTML(`https://www.e-derslik.edu.az/books/910/units/unit-1/page${p}.xhtml`);
        if (html) text += stripHtml(html) + '\n\n';
    }
    fs.writeFileSync(path.join(azDir, 'topic_real_4.txt'), text, 'utf8');
    console.log('Manna saved. Length:', text.length);
}

async function scrapeUmumiTarix() {
    console.log('Scraping Ümumi tarix 6 (Full book)...');
    let fullText = '';
    for(let p = 1; p <= 140; p++) {
        const html = await fetchXHTML(`https://www.e-derslik.edu.az/books/920/units/unit-1/page${p}.xhtml`);
        if (html) fullText += stripHtml(html) + '\n\n';
    }
    
    // Split by headings approximately
    const headings = [
        "Tarixdə il hesabı", "İbtidai cəmiyyət", "Ehramlar ölkəsi", "Şumerdən başlanan tarix", 
        "ikiçayarasının digər dövlətləri", "Oda sitayiş edənlər", "Parfiya dövləti", 
        "Tanrının döyüşçüləri", "Böyük ipək yolunun başlandığı ölkə", "Şahmatın vətəni", 
        "Avropa mədəniyyətinin beşiyi", "ilk Respublika yaradanlar", "MƏDƏNİYYƏTİN İNKİŞAFI" // limit
    ];
    
    const chunks = [];
    let lowerText = fullText.toLowerCase();
    let currentIdx = 0;
    
    for(let i = 0; i < headings.length - 1; i++) {
        const startHeading = headings[i].toLowerCase();
        let startIndex = lowerText.indexOf(startHeading, currentIdx);
        if (startIndex === -1) {
            console.log('MISSING START:', headings[i]);
            continue;
        }
        
        let nextIndex = lowerText.length;
        for(let j = i+1; j < headings.length; j++) {
            let nIdx = lowerText.indexOf(headings[j].toLowerCase(), startIndex + 100);
            if(nIdx !== -1) {
                nextIndex = nIdx;
                break;
            }
        }
        
        const chunk = fullText.substring(startIndex, nextIndex);
        fs.writeFileSync(path.join(umDir, `topic_real_${i+1}.txt`), chunk, 'utf8');
        console.log(`Saved Ümumi Tarix topic ${i+1}: ${headings[i]} (Length: ${chunk.length})`);
        currentIdx = nextIndex;
    }
}

async function main() {
    await scrapeAzTarixi();
    await scrapeUmumiTarix();
    console.log('Done!');
}

main();
