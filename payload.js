const fs = require('fs');
let queueFiles = JSON.parse(fs.readFileSync('data/queue_files_89.json', 'utf8'));
let subagents = [];
for (let f of queueFiles) {
  let subName = f.replace('data/q_', '').replace('.json', '');
  let outName = f.replace('data/q_', 'data/gen_');
  let prompt = `Sən SİTG test bərpaçısısan (Gold Standart 2.1). Sənə ${f} faylı (fənn mətnləri və testlər) verilir.
Tapşırıqlar:
1. Hər bir testi 'text' sahəsindəki mətnlə üzləşdir və izahatı (explanation) o mətndəki cümlələrlə yaz. 
2. Testləri mütləq 4 varianta (A,B,C,D) sal, E variantını sil (qaydaya uyğun olaraq ABCD qalmalıdır). Doğru variantları təsadüfi qarışdır (ziq-zaq).
3. 'distractor_diagnostics' və 'passport_id' sahələrini əlavə et. Bloom/difficulty qorusun.
4. Mətndən kənar uydurma mövzuları mətndəki faktlarla yenidən yaz.
Nəticəni yalnız 'tests' massivi şəklində '${outName}' faylına (write_to_file) yaz.`;
  
  subagents.push({
    Prompt: prompt,
    Role: subName + ' Validator',
    TypeName: 'self'
  });
}
fs.writeFileSync('data/subagents_payload.json', JSON.stringify(subagents, null, 2));
console.log('Payload created with ' + subagents.length + ' subagents.');
