const fs = require('fs');

const lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
const topics = [];
let currentTopic = null;

// The keywords that define the start of a new topic in Chapter 1
const keywords = [
    '. Qüvvənin təsiri',
    '. Ağırlıq qüvvəsi',
    '. Sürtünmə qüvvəsi',
    '. Arximed qüvvəsi',
    '. Tarazlaşan və tarazlaşmayan',
    'Xülasə',
    'Ümumiləşdirici tapşırıqlar'
];

for (let l of lines) {
    if (!l.trim()) continue;
    try {
        const j = JSON.parse(l);
        if (parseInt(j.grade) === 6 && j.subject === 'Təbiət') {
            const text = j.text.trim();
            
            // Check if text starts with any of the keywords
            const isNewTopic = keywords.some(kw => text.startsWith(kw));
            
            if (isNewTopic) {
                if (currentTopic) {
                    topics.push(currentTopic);
                }
                
                let title = text.split('\n')[0].trim();
                currentTopic = {
                    title: title,
                    text: text,
                    chunks: 1
                };
            } else if (currentTopic) {
                currentTopic.text += '\n\n' + text;
                currentTopic.chunks++;
            }
        }
    } catch(e) {}
}

if (currentTopic) topics.push(currentTopic);

console.log(JSON.stringify(topics.map(t => ({
    title: t.title, 
    length: t.text.length, 
    chunks: t.chunks
})), null, 2));
