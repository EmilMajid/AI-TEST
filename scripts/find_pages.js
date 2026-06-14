const fs = require('fs');
const text = fs.readFileSync('data\\\\umumitarix6_chunks\\\\full_book.txt', 'utf8');
const topics = [
'il hesabı', 'İbtidai cəmiyyət', 'Ehramlar ölkəsi', 'başlanan tarix', 'digər dövlətləri', 'Oda sitayiş edənlər', 
'Parfiya', 'Tanrının döyüşçüləri', 'ipək yolunun', 'Şahmatın vətəni', 'mədəniyyətinin beşiyi', 'Respublika yaradanlar'
];
let result = '';
topics.forEach(t => {
    let idx = text.toLowerCase().indexOf(t.toLowerCase());
    if (idx !== -1) {
        let pageStr = text.substring(Math.max(0, idx - 1000), idx);
        let matches = pageStr.match(/\[PAGE (\d+)\]/g);
        let page = matches ? matches[matches.length - 1] : 'unknown';
        result += t + ' -> ' + page + '\n';
    } else {
        result += t + ' -> NOT FOUND\n';
    }
});
fs.writeFileSync('temp_out.txt', result);
