const fs = require('fs');
const path = require('path');

const TEXTBOOKS_JSON = path.join(process.cwd(), 'data', 'textbooks.json');

async function verifyIntegrity() {
    console.log("🔍 Starting Textbook Integrity Check...");
    let errors = [];
    let warnings = [];

    if (!fs.existsSync(TEXTBOOKS_JSON)) {
        console.error("❌ Critical: textbooks.json not found!");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(TEXTBOOKS_JSON, 'utf8'));

    for (const [grade, books] of Object.entries(data)) {
        for (const book of books) {
            const prefix = `[Grade ${grade} - ${book.title}]`;

            // Check content path
            if (!book.contentPath && book.type !== 'external') {
                // External books like Hayat Bilgisi might only have a URL 'path' but maybe no local folder?
                // But in our system we usually give them a dummy folder.
                errors.push(`${prefix} Missing 'contentPath' property`);
                continue;
            }

            if (book.contentPath) {
                const absPath = path.join(process.cwd(), book.contentPath);
                if (!fs.existsSync(absPath)) {
                    errors.push(`${prefix} Content directory not found: ${book.contentPath}`);
                } else {
                    // Check for content based on type
                    if (book.type === 'pdf') {
                        const pdfPath = book.path ? path.join(process.cwd(), book.path) : null;
                        const localPdf = pdfPath && fs.existsSync(pdfPath);

                        // Also check content dir for any PDF
                        const dirFiles = fs.readdirSync(absPath);
                        const hasPdfInDir = dirFiles.some(f => f.toLowerCase().endsWith('.pdf'));

                        if (!localPdf && !hasPdfInDir) {
                            errors.push(`${prefix} PDF file missing in ${book.contentPath} or invalid 'path'`);
                        }
                    } else if (book.type === 'html') {
                        if (book.path && book.path.startsWith('http')) {
                            // External link
                            warnings.push(`${prefix} External HTML resource. Ensure manual topics exist.`);
                        } else {
                            const dirFiles = fs.readdirSync(absPath);
                            const hasToc = dirFiles.includes('toc.xhtml') || fs.existsSync(path.join(absPath, 'OEBPS', 'toc.xhtml'));
                            if (!hasToc) {
                                warnings.push(`${prefix} No 'toc.xhtml' found. Ensure manual topics are provided.`);
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("\n📊 Integrity Report:");
    if (errors.length === 0 && warnings.length === 0) {
        console.log("✅ All systems go! No issues found.");
    } else {
        if (errors.length > 0) {
            console.log("\n❌ Errors (Action Required):");
            errors.forEach(e => console.log(`  - ${e}`));
        }
        if (warnings.length > 0) {
            console.log("\n⚠️ Warnings (Check Configuration):");
            warnings.forEach(w => console.log(`  - ${w}`));
        }
    }
}

verifyIntegrity();
