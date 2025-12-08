const fs = require('fs');
const path = require('path');

const manualPath = path.join(process.cwd(), "scripts", "manual-topics.json");

const BLACKLIST = [
    "Tanış olun",
    "Sərbəst iş",
    "Özünüzü yoxlayın",
    "Bu maraqlıdır",
    "Yaradıcı fəaliyyət",
    "Müəyyən edin",
    "Düşünün və izah edin",
    "İncəsənətə dair dialoq",
    "Sual və tapşırıqlar",
    "Ümumiləşdirici",
    "Layihə",
    "Yadda saxlayın",
    "Diqqət",
    "Bilirsinizmi",
    "Müzakirə üçün suallar",
    "Təsviri sənət qalereyası",
    "Sənətkar məsləhəti",
    "Yaşadığı illər",
    "Doğulduğu yer",
    "Ad və mükafatları",
    "Üslub və texnika",
    "Əsərlərin mövzusu",
    "Məşhur əsərləri",
    "GÖRKƏMLİ RƏSSAMLAR",
    "Musiqi dinləyək",
    "Notla oxuyaq",
    "Oxuyaq",
    "Yada salın",
    "Araşdırma",
    "Mənbə",
    "Lüğət"
];

function clean() {
    if (!fs.existsSync(manualPath)) {
        console.error("manual-topics.json not found!");
        return;
    }

    const data = JSON.parse(fs.readFileSync(manualPath, "utf-8"));
    const newData = {};

    // Subjects to SKIP (already manually fixed)
    const SKIP = ["azerbaycan-tarixi", "informatika"];

    for (const subject in data) {
        if (SKIP.includes(subject)) {
            newData[subject] = data[subject];
            continue;
        }

        const filteredGroups = data[subject].map(group => {
            const filteredTopics = group.topics.filter(t => {
                // Check blacklist
                if (BLACKLIST.some(term => t.title.includes(term))) return false;
                // Check length
                if (t.title.length < 4) return false;
                // Check if just numbers
                if (/^[\d.]+$/.test(t.title)) return false;

                return true;
            });

            return {
                ...group,
                topics: filteredTopics
            };
        }).filter(g => g.topics.length > 0); // Remove empty groups

        newData[subject] = filteredGroups;
    }

    fs.writeFileSync(manualPath, JSON.stringify(newData, null, 2));

    // Stats
    console.log("Cleanup complete.");
    for (const s in newData) {
        const count = newData[s].reduce((acc, g) => acc + g.topics.length, 0);
        console.log(`${s}: ${count} topics`);
    }
}

clean();
