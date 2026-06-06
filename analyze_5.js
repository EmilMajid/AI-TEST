const tb = require('./data/textbooks.json')['5'] || [];
console.log('Total books: ' + tb.length);
console.log('Subjects: ' + [...new Set(tb.map(b => b.subject))].join(', '));
const withTopics = tb.filter(b => b.topics);
console.log('Books with topics: ' + withTopics.length);
withTopics.forEach(b => console.log('- ' + b.title + ': ' + b.topics.split('\n').length + ' topics'));
