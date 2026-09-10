
const fs = require('fs');
const path = require('path');
const offlinePath = path.join(process.cwd(), "data", "offline_tests.json");
const db = JSON.parse(fs.readFileSync(offlinePath, "utf-8"));
const norm = (s) => s.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").replace(/[\s\-_]+/g, " ").trim();

function getTopicsFromOfflineTests(bookId, bookSubject, classLevel) {
    const targetNorm = norm(bookSubject) + " " + classLevel;
    const bookIdNorm = norm(bookId);

    const matchedKey = Object.keys(db).find(k => {
        const kNorm = norm(k);
        return kNorm === targetNorm || 
               kNorm === bookIdNorm || 
               (kNorm.includes(norm(bookSubject)) && k.includes(classLevel)) ||
               (kNorm.includes(bookIdNorm.replace(/\-\d+$/, "")));
    });

    if (!matchedKey) return [];

    const topicsSet = new Set();
    const val = db[matchedKey];
    if (Array.isArray(val)) {
        val.forEach(item => {
            const t = item.topic || item.topic_key;
            if (t && typeof t === "string") topicsSet.add(t.trim());
        });
    } else if (typeof val === "object" && val !== null) {
        Object.keys(val).forEach(t => {
            if (t && typeof t === "string") topicsSet.add(t.trim());
        });
    }

    return [{
        chapter: "Mövzular",
        topics: Array.from(topicsSet).map((t, idx) => ({ title: t, page: idx + 1, path: "" }))
    }];
}

const textbooks = JSON.parse(fs.readFileSync('data/textbooks.json', 'utf8'))['2'] || [];
for (const b of textbooks) {
    const res = getTopicsFromOfflineTests(b.id, b.subject || b.title, '2');
    console.log(`Book: ${b.id} -> matched topics: ${res[0] ? res[0].topics.length : 0}`);
    if (res[0] && res[0].topics.length > 0) {
        console.log(`   Sample: '${res[0].topics[0].title}', '${res[0].topics[1] ? res[0].topics[1].title : ""}'`);
    }
}
