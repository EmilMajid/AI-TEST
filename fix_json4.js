const fs = require('fs');

function fixEdebiyyat() {
  let f = 'data/gen_edebiyyat8.json';
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/"D": "Bu arxetipin/g, '"D) Bu arxetipin');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Edebiyyat fixed!'); } catch(e) { console.log('Edebiyyat error: ' + e.message); }
}

function fixRiyaziyyat2() {
  let f = 'data/gen_riyaziyyat8_part2.json';
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/"C"\) 0,2"/g, '"C) 0,2"');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Riyaziyyat2 fixed!'); } catch(e) { console.log('Riyaziyyat2 error: ' + e.message); }
}

fixEdebiyyat();
fixRiyaziyyat2();
