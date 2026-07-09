const fs = require('fs');

let code = fs.readFileSync('app/api/generate-test/route.ts', 'utf8');

const regex = /\/\/ 1\. Find matching subject keys.*?let matchedKeys = [^;]+;/s;

const replacement = `// 1. Find matching subject keys in offline_tests.json
    const titleLower = textbookTitle.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i");
    const keys = Object.keys(db);
    
    // First try EXACT matches
    let matchedKeys = keys.filter(k => k === textbookTitle || k.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i") === titleLower);
    
    // If no exact match, try safe substring matching but avoid pulling generic buckets (like "Riyaziyyat" for "Riyaziyyat 3")
    if (matchedKeys.length === 0) {
      matchedKeys = keys.filter(k => 
        titleLower.includes(k.toLowerCase()) || 
        k.toLowerCase().includes(titleLower)
      );
      
      // If we matched multiple, try to filter out generic ones if a more specific one exists
      if (matchedKeys.length > 1) {
          const specific = matchedKeys.filter(k => k.match(/\\d/));
          if (specific.length > 0) matchedKeys = specific;
      }
    }`;

code = code.replace(regex, replacement);

fs.writeFileSync('app/api/generate-test/route.ts', code, 'utf8');
console.log("Patched route.ts successfully using node!");
