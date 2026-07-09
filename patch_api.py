import re

with open('app/api/generate-test/route.ts', 'r', encoding='utf-8') as f:
    code = f.read()

target = """    // 1. Find matching subject keys in offline_tests.json
    const titleLower = textbookTitle.toLowerCase().replace(/iş/g, "i").replace(/ı/g, "i");
    const keys = Object.keys(db);
    let matchedKeys = keys.filter(k => 
      k === textbookTitle || 
      k.toLowerCase().replace(/iş/g, "i").replace(/ı/g, "i") === titleLower || 
      titleLower.includes(k.toLowerCase()) || 
      k.toLowerCase().includes(titleLower)
    );"""

# The file might have corrupted characters due to encoding in the stdout, but in the actual file it's real utf-8.
# I'll use a regex replacement to find the block.

pattern = re.compile(r'// 1\. Find matching subject keys.*?let matchedKeys = [^;]+;', re.DOTALL)

replacement = """// 1. Find matching subject keys in offline_tests.json
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
          const specific = matchedKeys.filter(k => k.match(/\d/));
          if (specific.length > 0) matchedKeys = specific;
      }
    }"""

new_code = pattern.sub(replacement, code)

with open('app/api/generate-test/route.ts', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Patched app/api/generate-test/route.ts successfully!")
