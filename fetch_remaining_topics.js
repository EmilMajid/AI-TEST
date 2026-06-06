const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'textbooks.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const fetchTopics = async (id, title) => {
    try {
        const url = `https://e-derslik.edu.az/player/index3.php?book_id=${id}`;
        const res = await fetch(url);
        const html = await res.text();
        
        let topics = [];
        const regex = /<h6>(.*?)<\/h6>[\s\S]*?<ul>([\s\S]*?)<\/ul>/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            topics.push(match[1].trim());
            const liRegex = /<li><a[^>]*>(.*?)<\/a><\/li>/g;
            let liMatch;
            while ((liMatch = liRegex.exec(match[2])) !== null) {
                topics.push(liMatch[1].trim());
            }
        }
        
        if (topics.length > 0) {
            const b = db['5'].find(book => book.e_derslik_id === id.toString() && book.title === title);
            if (b) {
                b.topics = topics.join('\n');
                console.log(`Extracted ${topics.length} topics for ${title}`);
            }
        } else {
            console.log(`No topics found for ${title} (${id})`);
        }
    } catch (e) {
        console.error(`Error fetching ${title}:`, e.message);
    }
};

const run = async () => {
    const targets = [
        { id: '851', title: 'Alman dili 5 (əsas xarici dil)' },
        { id: '852', title: 'Alman dili 5 (ikinci xarici dil)' },
        { id: '854', title: 'Fransız dili 5 (ikinci xarici dil)' },
        { id: '856', title: 'Rus dili 5 (ikinci xarici dil)' }
    ];
    
    for (const target of targets) {
        await fetchTopics(target.id, target.title);
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Database updated successfully.');
};

run();
