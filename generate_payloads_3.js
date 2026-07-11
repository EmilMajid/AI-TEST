const fs = require('fs');
let missing = JSON.parse(fs.readFileSync('data/missing_3_queue.json', 'utf8'));
let payload = [];
for (let cat in missing) {
  for (let m of missing[cat]) {
    let fname = 'data/gen_req_' + cat.replace(/\s+/g, '') + '_' + m.topic.replace(/[^a-zA-Z0-9_]/g, '') + '.json';
    fs.writeFileSync(fname, JSON.stringify(m, null, 2), 'utf8');
    
    let subagentName = cat + ' - ' + m.topic.substring(0, 15);
    
    let prompt = `Sən SİTG test yaradıcısısan (Gold Standart 2.1). Sənə '${fname}' faylı təqdim edilir. 
Faylda 'text' sahəsində dərslik materialı və 'needed' sahəsində sənə lazım olan test sayı (15) var.
Tapşırıqlar:
1. Mətndəki faktlara əsaslanaraq DƏQİQ ${m.needed} ədəd, bir-birini təkrarlamayan (unique), fərqli qavrayış səviyyələrini (Anlama, Tətbiq, Təhlil) əhatə edən test yaz.
2. Hər testin MÜTLƏQ 4 variantı (A, B, C, D) olmalıdır. E variantı YOXDUR.
3. Hər bir yanlış variant üçün MÜTLƏQ 'distractor_diagnostics' (məs: diqqətsizlik, anlayış səhvi, hesablama) yaz.
4. Testlərə 'passport_id' təyin et.
5. İzahatları (explanation) YALNIZ mətndəki cümlələrdən istifadə edərək yaz.
Nəticəni YALNIZ JSON array formatında '${fname.replace('gen_req_', 'gen_res_')}' faylına yaz.`;

    payload.push({
      Prompt: prompt,
      Role: subagentName + ' Generator',
      TypeName: 'self'
    });
  }
}
fs.writeFileSync('data/subagents_payload_3.json', JSON.stringify(payload, null, 2), 'utf8');
console.log('Created 16 payload files and subagents config.');
