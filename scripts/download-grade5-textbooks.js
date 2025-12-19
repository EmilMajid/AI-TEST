
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');

const TEXTBOOKS_DIR = path.join(__dirname, '../public/textbooks/5');
const TEMP_DIR = path.join(__dirname, '../temp');

// Selected high-priority Grade 5 textbooks (Azerbaijani Sector)
// Based on latest IDs (higher IDs usually mean newer editions)
const TEXTBOOKS = [
    { id: 837, title: "Azərbaycan dili 5 (hissə 1)", subject: "azerbaycan-dili" },
    { id: 838, title: "Azərbaycan dili 5 (hissə 2)", subject: "azerbaycan-dili" },
    { id: 840, title: "Riyaziyyat 5 (hissə 1)", subject: "riyaziyyat" },
    { id: 841, title: "Riyaziyyat 5 (hissə 2)", subject: "riyaziyyat" },
    { id: 844, title: "Azərbaycan tarixi 5", subject: "azerbaycan-tarixi" },
    { id: 845, title: "Ədəbiyyat 5", subject: "edebiyyat" },
    { id: 690, title: "Təbiət 5 (hissə 1)", subject: "tebiet" },
    { id: 691, title: "Təbiət 5 (hissə 2)", subject: "tebiet" },
    { id: 450, title: "English 5", subject: "ingilis-dili" } // Using older ID if newer not found, 850 is "Foreign Language" variant maybe? Let's try 450 first as standard.
];

// Ensure directories
[TEXTBOOKS_DIR, TEMP_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function downloadAndUnzip(book) {
    const epubUrl = `https://www.e-derslik.edu.az/books/${book.id}/${book.id}.epub`;
    const tempFile = path.join(TEMP_DIR, `${book.id}.zip`); // Download directly as .zip for PS
    const targetDir = path.join(TEXTBOOKS_DIR, book.subject);

    console.log(`Processing: ${book.title} (ID: ${book.id})...`);

    // 1. Download
    await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(tempFile);
        https.get(epubUrl, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(tempFile, () => reject(err));
        });
    });

    // 2. Unzip (Merge into subject folder - handling multi-part books)
    // For multi-part books (Part 1/2), we need to be careful not to overwrite if they use same file names
    // But typically they have unique internal structures or we merge them.
    // However, for the System, it's better to keep them separate IF they have unique TOCs.
    // BUT, our system maps Subject -> List of Topics.
    // If we have Part 1 and Part 2, we should probably unzip them into the SAME subject folder?
    // OR separate subfolders? 
    // The current `route.ts` reads ONE `toc.xhtml` per subject directory. 
    // IF we merge them, we might overwrite `toc.xhtml`.
    // STRATEGY: Unzip into `subject/part1` and `subject/part2`? 
    // No, `route.ts` expects `public/textbooks/5/subject/OEBPS/toc.xhtml`.
    // It doesn't support sub-sub folders well without modification.

    // DECISION: For now, I will unzip them into `subject-part-X` directories to handle them safely.
    // I will rename the subject slug in the config above.

    let specialTarget = targetDir;
    if (book.title.includes("hissə 1") || book.title.includes("I hissə")) specialTarget += "-hisse-1";
    if (book.title.includes("hissə 2") || book.title.includes("II hissə")) specialTarget += "-hisse-2";

    if (!fs.existsSync(specialTarget)) fs.mkdirSync(specialTarget, { recursive: true });

    await new Promise((resolve, reject) => {
        exec(`powershell -command "Expand-Archive -Path '${tempFile}' -DestinationPath '${specialTarget}' -Force"`, (err, stdout, stderr) => {
            if (err) reject(err);
            else resolve();
        });
    });

    console.log(`✅ Installed to ${path.relative(process.cwd(), specialTarget)}`);

    // Cleanup
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
}

async function main() {
    for (const book of TEXTBOOKS) {
        try {
            await downloadAndUnzip(book);
            // Rate limit
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`❌ Failed ${book.title}: ${e.message}`);
        }
    }
}

main();
