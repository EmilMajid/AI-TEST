const fs = require('fs');
const content = fs.readFileSync('temp_topics_math.txt', 'utf8');

console.log("Original Content Length:", content.length);
console.log("Preview:", content.substring(0, 200));

// Strategy 1: Split by number followed by dot (e.g. "1. ", "32. ")
// This might split too much if there are numbers in the text, so we need to be careful.
// Looking at previous output, it seems to be like "1. Title1.1. Subtitle"
// So maybe match `(?<=\w)(\d+\.\s)` ? No, because it might not be preceded by word char.

// Adjusted regex to match ranges like "8-9." and ensure we capture the title text until the next number
// Pattern: Number(s) + Dot + Space + (Text that doesn't start with a number pattern)
// We use a lookahead or just standard matching.
const regex = /(\d+(?:[-.]\d+)*\.\s+.*?(?=\d+(?:[-.]\d+)*\.\s|$))/g;

const matches = content.match(regex);

if (matches) {
    console.log(`Found ${matches.length} matches.`);
    matches.slice(0, 10).forEach(m => console.log(` - ${m.substring(0, 50)}...`));
} else {
    console.log("No matches found with regex 1.");
}

// Strategy 2: Split by regex and keep delimiters
const parts = content.split(/(\d+(?:\.\d+)*\.\s)/).filter(p => p.trim().length > 0);
console.log(`Strategy 2 parts: ${parts.length}`);
// Reconstruct
let topics = [];
for (let i = 0; i < parts.length; i += 2) {
    if (parts[i + 1]) {
        topics.push(parts[i] + parts[i + 1]);
    }
}
topics.slice(0, 10).forEach(t => console.log(` * ${t.substring(0, 50)}...`));
