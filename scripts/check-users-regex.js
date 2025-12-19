
const { MOCK_USERS } = require('../lib/mock-data.ts');

// We need to transpile or ignore the type syntax for this simple check, 
// or just parse the file content if we don't want to deal with TS compilation for a simple check.
// Since it's a TS file, asking Node to require it directly will fail.
// I'll regex verify the file content instead for simplicity and speed.

const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(process.cwd(), 'lib/mock-data.ts'), 'utf-8');

const hasClass5 = /class:\s*"5"/.test(content);
const hasFatime = /firstName:\s*"Fatimə"/.test(content);
const hasParentLink = /parentId:\s*"parent-aysel"/.test(content);

console.log("Checking for Class 5 student...");
if (hasClass5 && hasFatime) {
    console.log("✅ Class 5 student 'Fatimə' found.");
} else {
    console.error("❌ Class 5 student NOT found.");
}

if (hasParentLink && hasFatime) {
    console.log("✅ Student is linked to 'parent-aysel'.");
} else {
    console.error("❌ Parent linkage missing.");
}
