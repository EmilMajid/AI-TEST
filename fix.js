const fs = require('fs');

function fixRus() {
  let f = 'data/gen_rus_dili8.json';
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/«????????? ????? \"?\" ???????????/g, '«????????? ????? \\\"?\\\" ???????????');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Rus fixed!'); } catch(e) { console.log('Rus error: ' + e.message); }
}

function fixEdebiyyat() {
  let f = 'data/gen_edebiyyat8.json';
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\"C\": \"Xaqaninin/g, '\"C) Xaqaninin');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Edebiyyat fixed!'); } catch(e) { console.log('Edebiyyat error: ' + e.message); }
}

function fixRiyaziyyat2() {
  let f = 'data/gen_riyaziyyat8_part2.json';
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\"C\"\) Circumcenter\"/g, '\"C) Circumcenter\"');
  fs.writeFileSync(f, c);
  try { JSON.parse(c); console.log('Riyaziyyat2 fixed!'); } catch(e) { console.log('Riyaziyyat2 error: ' + e.message); }
}

fixRus();
fixEdebiyyat();
fixRiyaziyyat2();
