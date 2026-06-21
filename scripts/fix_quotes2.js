const fs = require('fs');
let c = fs.readFileSync('scripts/inject_kimya8_tests.js', 'utf-8');

// Find ALL occurrences of "word" patterns inside expl strings and remove inner quotes
// The problem: expl: "...\"word\"..." where "word" is quoted within a double-quoted string
// Strategy: scan line by line and fix any line with unmatched embedded quotes in expl fields

const lines = c.split('\n');
const fixed = lines.map((line, idx) => {
    if (!line.includes('expl:')) return line;
    // Find the expl: "..." part and replace any embedded " that aren't at start/end
    // Replace pattern \" inside the expl value (between outer quotes)
    // Simple approach: find all "WORD" patterns (quoted identifiers) and unquote them
    // Using a regex to remove inner quotes in text-like contexts
    let newLine = line;
    // Replace "Word" patterns that appear inside longer strings (preceded by space or text)
    newLine = newLine.replace(/ "([^"]+)" /g, ' $1 ');
    newLine = newLine.replace(/'([^"]+)"([^"]+)"([^']+)'/g, (m, a, b, c2) => {
        return "'" + a + b + c2 + "'";
    });
    if (newLine !== line) {
        console.log(`Fixed line ${idx + 1}`);
    }
    return newLine;
});

const result = fixed.join('\n');
fs.writeFileSync('scripts/inject_kimya8_tests.js', result, 'utf-8');
console.log('Done.');
