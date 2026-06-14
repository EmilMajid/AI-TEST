const fs = require('fs');
const lines = fs.readFileSync('data/textbook-chunks.jsonl', 'utf8').split('\n');
for(const l of lines){
  if(l.includes('İnformatika')){
     console.log(l);
     break;
  }
}
