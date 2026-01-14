
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-dili-6-h1.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const topics = [
    "Söz vermişəm",
    "Sənin kimi olacağam",
    "Buqələmun",
    "Sadiq dost",
    "Piktoqramdan hərflərə",
    "Rozetta daşının sirri",
    "Qədim türk əlifbası",
    "Qədimdə yazı materialları",
    "Vətən sağ olsun!",
    "Sonuncu dərs",
    "Cənub xatirələri",
    "Fironlar və ehramlar",
    "Troya müharibəsi",
    "Barbarlar və vandallar",
    "Şeyx Səfi məqbərəsi",
    "Ağdam Çörək Muzeyi"
];

// Map sections
const sections = {}; // page -> section name

// Normalize text for easier matching
function normalize(str) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

console.log("Searching for topics...");

topics.forEach(topic => {
    const tNorm = normalize(topic);
    // Find the first occurrence of the topic title on a page where it likely is a header
    // We expect headers to be short lines or distinct
    for (const item of data) {
        const text = item.text;
        if (normalize(text).includes(tNorm)) {
            // Check if it's a likely header (e.g. at the start of page or isolated)
            // For now, just print the first page found
            console.log(`Topic: "${topic}" found on Page ${item.page}`);
            break;
        }
    }
});

console.log("\nSearching for Sections (Bölmə)...");
for (const item of data) {
    const lines = item.text.split('\n');
    for (const line of lines) {
        if (line.includes('bölmə') && line.length < 50) {
            console.log(`Section found on Page ${item.page}: ${line.trim()}`);
        }
    }
}

console.log("\nSearching for Dil qaydaları...");
for (const item of data) {
    if (item.text.includes('Dil qaydaları')) {
        console.log(`Dil qaydaları found on Page ${item.page}`);
    }
}
