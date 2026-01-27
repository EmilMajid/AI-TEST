const fs = require('fs');

const path = 'scripts/manual-topics.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

for (const key in data) {
    const bookTopics = data[key];
    if (Array.isArray(bookTopics)) {
        // Iterate over groups
        bookTopics.forEach(group => {
            if (group.topics && Array.isArray(group.topics)) {
                // Check if topics are strings
                if (group.topics.length > 0 && typeof group.topics[0] === 'string') {
                    console.log(`Fixing strings for ${key} - ${group.chapter}`);
                    group.topics = group.topics.map((t, idx) => ({
                        title: t,
                        page: 1, // Default page
                        path: ""
                    }));
                }
            } else if (typeof group === 'string') {
                // Handle case where the book entry itself might be just strings (unlikely for the ones I injected, but possible for others)
                // Actually my injection was [ { chapter, topics: [] } ]
            }
        });
    }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log("Fixed topic structures.");
