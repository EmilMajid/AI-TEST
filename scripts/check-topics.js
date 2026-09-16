const fs = require('fs');
const path = require('path');

console.log("Checking textbooks and topics status...");
const manual = JSON.parse(fs.readFileSync(path.join(__dirname, 'manual-topics.json'), 'utf8'));
console.log("Grade 1 Azerbaijani manual topics count:", (manual['azerbaycan-dili-1-h1'] || []).length);

