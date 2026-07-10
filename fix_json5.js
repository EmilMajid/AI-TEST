const fs = require('fs');

function fixEdebiyyat() {
  let f = 'data/gen_edebiyyat8.json';
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  // the previous fix replaced `"D": "Text"` with `"D) Text"`. But the original was `"D": "Text"},` instead of `"D": "Text"],`.
  // So now it is `"D) Text"},`. Let's fix that.
  c = c.replace(/\"},\s*\"correctAnswer\"/g, '\"],\n    \"correctAnswer\"');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Edebiyyat fixed!'); } catch(e) { console.log('Edebiyyat error: ' + e.message); }
}

function fixRiyaziyyat2() {
  let f = 'data/gen_riyaziyyat8_part2.json';
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\"A\"\)\s+/g, '\"A) ');
  c = c.replace(/\"B\"\)\s+/g, '\"B) ');
  c = c.replace(/\"C\"\)\s+/g, '\"C) ');
  c = c.replace(/\"D\"\)\s+/g, '\"D) ');
  c = c.replace(/\"E\"\)\s+/g, '\"E) ');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Riyaziyyat2 fixed!'); } catch(e) { console.log('Riyaziyyat2 error: ' + e.message); }
}

fixEdebiyyat();
fixRiyaziyyat2();
