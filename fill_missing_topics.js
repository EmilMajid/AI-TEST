const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'textbooks.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const extractTopicsFromTOC = (tocPath) => {
    try {
        let text = fs.readFileSync(tocPath, 'utf8');
        // Simple extraction: look for all text inside <a> tags
        const aRegex = /<a[^>]*>(.*?)<\/a>/gi;
        let match;
        const topics = [];
        while ((match = aRegex.exec(text)) !== null) {
            let innerText = match[1].replace(/<[^>]+>/g, '').trim();
            innerText = innerText
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, " ");
            
            if (innerText.length > 3 && !/^\d+$/.test(innerText) && !/^\d+\.\s*$/.test(innerText)) {
                topics.push(innerText);
            }
        }
        return topics;
    } catch (e) {
        return [];
    }
};

let updated = 0;

Object.keys(db).forEach(grade => {
    const books = db[grade];
    books.forEach(b => {
        if (!b.topics && b.contentPath) {
            const subjectPath = path.join(__dirname, b.contentPath);
            let tPath = path.join(subjectPath, "OEBPS", "toc.xhtml");
            if (!fs.existsSync(tPath)) tPath = path.join(subjectPath, "toc.xhtml");
            
            if (fs.existsSync(tPath)) {
                const extracted = extractTopicsFromTOC(tPath);
                if (extracted.length > 0) {
                    // Filter out meaningless ones
                    const cleanTopics = extracted.filter(t => !/^(Mvzular|page \d+)$/i.test(t));
                    b.topics = cleanTopics.join('\n');
                    console.log(`Extracted ${cleanTopics.length} topics for ${b.title}`);
                    updated++;
                }
            }
        }
    });
});

if (updated > 0) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${updated} books with extracted topics.`);
} else {
    console.log("No books could be automatically filled from toc.xhtml.");
}
