const fs = require('fs');
const dir = './temp_tests_lit_v2/';
let files = Array.from({length: 27}, (_, i) => 'lit' + (i + 1) + '.json');
let count = 0;
files.forEach(f => {
    let path = dir + f;
    if (fs.existsSync(path)) {
        try {
            let data = JSON.parse(fs.readFileSync(path, 'utf8'));
            count++;
        } catch(e) {
        }
    }
});
console.log('Valid JSON files count: ' + count + '/27');
