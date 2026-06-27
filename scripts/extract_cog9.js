const fs = require('fs');
const lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n').filter(Boolean);
const chunks = lines.map(line => JSON.parse(line)).filter(chunk => chunk.book_id === 'cografiya-9' || (chunk.subject && chunk.subject.toLowerCase().includes('coğrafiya') && chunk.grade === 9));
const outPath = 'temp/cografiya9_text.txt';
let outText = '';
chunks.forEach((chunk, index) => {
  outText += `--- CHUNK ${index} (Section: ${chunk.section_title || chunk.section}) ---\n`;
  outText += chunk.text + '\n\n';
});
fs.writeFileSync(outPath, outText);
console.log('Extracted ' + chunks.length + ' Geography 9 chunks to ' + outPath);
