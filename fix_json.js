const fs = require('fs');
let c1 = fs.readFileSync('data/gen_rus_dili8.json', 'utf8');
c1 = c1.replace(/"Ф"/g, '\\"Ф\\"');
fs.writeFileSync('data/gen_rus_dili8.json', c1);

let c2 = fs.readFileSync('data/gen_edebiyyat8.json', 'utf8');
c2 = c2.replace(/"C": "Xaqaninin/g, '"C) Xaqaninin');
fs.writeFileSync('data/gen_edebiyyat8.json', c2);

let c3 = fs.readFileSync('data/gen_riyaziyyat8_part2.json', 'utf8');
c3 = c3.replace(/"C"\) Circumcenter"/g, '"C) Circumcenter"');
fs.writeFileSync('data/gen_riyaziyyat8_part2.json', c3);
