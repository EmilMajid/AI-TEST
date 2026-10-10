const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, '..', 'lib', 'runtime-kag-guard.ts');
const tsContent = fs.readFileSync(tsFilePath, 'utf8');

const marker = 'CANONICAL_ONTOLOGY_REGISTRY = [';
const startIndex = tsContent.indexOf(marker);
const arrayStart = tsContent.indexOf('[', startIndex);

let depth = 0;
let arrayEnd = -1;
let inString = false;
let escape = false;
let quoteChar = '';

for (let i = arrayStart; i < tsContent.length; i++) {
  const c = tsContent[i];

  if (inString) {
    if (escape) {
      escape = false;
    } else if (c === '\\') {
      escape = true;
    } else if (c === quoteChar) {
      inString = false;
    }
  } else {
    if (c === '"' || c === "'") {
      inString = true;
      quoteChar = c;
    } else if (c === '[') {
      depth++;
    } else if (c === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }
}

console.log('Marker index:', startIndex);
console.log('Array start index:', arrayStart);
console.log('Array end index:', arrayEnd);

if (arrayEnd === -1) {
  console.error('Failed to find array end!');
  process.exit(1);
}

const arrayContent = tsContent.substring(arrayStart, arrayEnd + 1);
console.log('Extracted exact array slice length in bytes:', arrayContent.length);

const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
const registry = vm.runInContext('(' + arrayContent + ')', sandbox);

console.log('Total Exactly Parsed Registry Nodes:', registry.length);

// 1. All Nodes
fs.writeFileSync(
  path.join(__dirname, '..', 'reports', 'runtime_canonical_all_nodes.json'),
  JSON.stringify(registry, null, 2),
  'utf8'
);

// 2. All Directed Prerequisite Edges
const allEdges = registry
  .filter(n => n.prereqId && n.prereqId !== 'null' && String(n.prereqId).trim() !== '')
  .map(n => ({
    target_id: n.id,
    target_label: n.label,
    target_subject: n.subject,
    target_grade: n.firstGradeVerified,
    prereq_id: n.prereqId,
    prereq_label: n.prereqLabel,
    prereq_grade: n.prereqGrade,
    prereq_book: n.prereqBook
  }));

console.log('Total True Directed Prerequisite Edges:', allEdges.length);

fs.writeFileSync(
  path.join(__dirname, '..', 'reports', 'runtime_canonical_all_edges.json'),
  JSON.stringify(allEdges, null, 2),
  'utf8'
);

console.log('Extraction 100% complete and saved.');
