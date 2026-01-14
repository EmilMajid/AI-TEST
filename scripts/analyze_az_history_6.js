
const fs = require('fs');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\ocr_output\\azerbaycan-tarixi-6.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// detailed analysis of pages 4, 5, 6, 7 where TOC usually resides
const tocPages = data.filter(p => p.page >= 3 && p.page <= 8);

console.log("--- TOC Page Content Analysis ---");
tocPages.forEach(p => {
    console.log(`\n=== PAGE ${p.page} ===`);
    console.log(p.text);
});

// Heuristic extraction
console.log("\n--- Potential Structure Extraction ---");
let currentSection = "Introduction"; // Default
const sections = [];
let currentTopics = [];

// Regex to find "1. Topic Name .... 8"
const topicRegex = /^(\d+)\.\s+(.+?)\.+(\d+)$/;
// Regex for broad sections might be harder, looking for lines without numbers but distinct?
// Or we just print lines to decide manually.

tocPages.forEach(p => {
    const lines = p.text.split('\n');
    lines.forEach(line => {
        const trLine = line.trim();
        // Check for numbered topic
        // OCR might malform dots: "1. Topic ............. 8" or "1. Topic 8"
        // Let's look for starting digit + dot
        if (trLine.match(/^\d+\./)) {
            console.log(`[TOPIC CANDIDATE] Page ${p.page}: ${trLine}`);
        } else if (trLine.length > 5 && !trLine.match(/^\d/)) {
            // Potential section header?
            console.log(`[TEXT LINE] Page ${p.page}: ${trLine}`);
        }
    });
});
