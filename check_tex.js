const fs = require('fs');
const dir = './temp_tests_tex_v2/';
let files = [1,2,3,4,5,6,7,8,9,10].map(i => 'tex' + i + '.json');
files.forEach(f => {
    let path = dir + f;
    if (fs.existsSync(path)) {
        try {
            let data = JSON.parse(fs.readFileSync(path, 'utf8'));
            console.log(f, 'EXISTS and is VALID JSON. Count:', data.length);
        } catch(e) {
            console.log(f, 'EXISTS but INVALID JSON!');
        }
    } else {
         console.log(f, 'MISSING!');
    }
});
