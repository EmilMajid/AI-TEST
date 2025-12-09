const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const manualPath = path.join(process.cwd(), "scripts", "manual-topics.json");
let manualTopics = {};
if (fs.existsSync(manualPath)) {
    manualTopics = JSON.parse(fs.readFileSync(manualPath, "utf-8"));
}

// 1. Musiqi - Placeholder (Files missing)
// We keep it empty or add a note. If user provided a list earlier, we'd use it, but they didn't.
// Actually, looking at previous conversation, user gave lists for Art, Life Knowledge, Informatics.
// Not Musiqi.
manualTopics["musiqi"] = [
    {
        "chapter": "Mövzular",
        "topics": [
            { "title": "Dərslik faylları yüklənməyib", "page": 1 }
        ]
    }
];

// 2. Texnologiya - CLEANUP
if (manualTopics["texnologiya"]) {
    manualTopics["texnologiya"] = manualTopics["texnologiya"].map(group => ({
        ...group,
        topics: group.topics.filter(t => {
            const title = t.title.toUpperCase();
            if (title.includes("PRAKTİK İŞ")) return false;
            if (title.includes("TAPŞIRIQ")) return false;
            if (title.includes("MÖVZU")) return false;
            if (title.includes("SUAL VƏ")) return false;
            if (title.length < 4) return false;
            return true;
        })
    })).filter(g => g.topics.length > 0);
}

// 3. Foreign Languages Extraction
const languages = [
    { key: "alman-dili-esas", path: "public/textbooks/8/alman-dili-esas/alman-dili-8-esas", keyword: "Lektion" },
    { key: "fransiz-dili-esas", path: "public/textbooks/8/fransiz-dili-esas/fransiz-dili-8-esas", keyword: "Unité" },
    { key: "rus-dili-esas", path: "public/textbooks/8/rus-dili-esas/rus-8-esas", keyword: "Урок" },
    // Also second languages if needed, usually same structure
    { key: "alman-dili-ikinci", path: "public/textbooks/8/alman-dili-ikinci/alman-dili-8-ikinci", keyword: "Lektion" },
    { key: "fransiz-dili-ikinci", path: "public/textbooks/8/fransiz-dili-ikinci/fransiz-dili-8-ikinci", keyword: "Unité" },
    { key: "rus-dili-ikinci", path: "public/textbooks/8/rus-dili-ikinci/rus-8-ikinci", keyword: "Урок" }

];

function extractFromDir(dirPath, keyword) {
    if (!fs.existsSync(dirPath)) return [];

    // Naive crawler: checks first 100 pages inside units/unit-X
    const topics = [];
    const unitsDir = path.join(dirPath, "units");
    if (!fs.existsSync(unitsDir)) return [];

    const units = fs.readdirSync(unitsDir).filter(u => u.startsWith("unit-"));

    for (const unit of units) {
        const uPath = path.join(unitsDir, unit);
        const pages = fs.readdirSync(uPath).filter(p => p.endsWith(".xhtml"));

        for (const p of pages) {
            const content = fs.readFileSync(path.join(uPath, p), "utf-8");
            // regex to find headers. E.g. <div class="...">Lektion 1. Title</div>
            // This is tricky without DOM, but let's try regex.

            // Look for keyword followed by number or text
            const regex = new RegExp(`(${keyword}\\s*\\d*\\.?\\s*[^<]+)`, "i");
            const match = content.match(regex);
            if (match) {
                let text = match[1].replace(/<[^>]*>/g, "").trim();
                if (text.length > 5 && text.length < 100) {
                    // Clean up
                    text = text.replace(/&nbsp;/g, " ");
                    // unique check
                    if (!topics.find(t => t.title === text)) {
                        const pageNumMatch = p.match(/page(\d+)/);
                        const pageNum = pageNumMatch ? parseInt(pageNumMatch[1]) : 1;
                        topics.push({
                            title: text,
                            page: pageNum,
                            path: path.join(uPath, p) // relative path logic needed later?
                        });
                    }
                }
            }
        }
    }

    return [{ chapter: "Mövzular", topics }];
}

for (const lang of languages) {
    const fullPath = path.join(process.cwd(), lang.path);
    const nodes = extractFromDir(fullPath, lang.keyword);
    if (nodes.length > 0 && nodes[0].topics.length > 0) {
        manualTopics[lang.key] = nodes;
        console.log(`Extracted ${nodes[0].topics.length} topics for ${lang.key}`);
    }
}


fs.writeFileSync(manualPath, JSON.stringify(manualTopics, null, 2));
console.log("Updated manual-topics.json with final fixes.");
