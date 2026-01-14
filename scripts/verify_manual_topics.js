
const fs = require('fs');
const path = require('path');

const jsonPath = 'c:\\Users\\User\\Downloads\\azerbaijanaiplatform\\scripts\\manual-topics.json';

try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log("JSON is valid.");

    const requiredKeys = [
        "riyaziyyat-6-h1",
        "azerbaycan-dili-6-h1",
        "azerbaycan-dili-6-h2"
    ];

    let allFound = true;
    requiredKeys.forEach(key => {
        if (data[key]) {
            console.log(`Key '${key}' found.`);
            // Basic structure check
            if (Array.isArray(data[key])) {
                console.log(`  - '${key}' is an array with ${data[key].length} chapters.`);
                data[key].forEach((chapter, idx) => {
                    if (!chapter.chapter || !chapter.topics) {
                        console.error(`  - Error: Chapter ${idx} is missing 'chapter' or 'topics' field.`);
                        allFound = false;
                    }
                });
            } else {
                console.error(`  - Error: '${key}' is not an array.`);
                allFound = false;
            }
        } else {
            console.error(`Error: Key '${key}' NOT found.`);
            allFound = false;
        }
    });

    if (allFound) {
        console.log("Verification SUCCESS: All required keys and structures are present.");
    } else {
        console.log("Verification FAILED: Missing keys or invalid structure.");
        process.exit(1);
    }

} catch (e) {
    console.error("JSON Parse Error:", e);
    process.exit(1);
}
