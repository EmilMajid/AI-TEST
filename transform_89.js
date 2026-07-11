const fs = require('fs');

console.log('Starting heuristic transformation for 8-9 grades...');
let queueFiles = JSON.parse(fs.readFileSync('data/queue_files_89.json', 'utf8'));
let totalProcessed = 0;

for (let file of queueFiles) {
  try {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let tests = data.tests;
    let sectionText = data.text || '';
    let sentences = sectionText.split(/(?<=[.?!])\s+/);
    
    let processedTests = [];
    
    for (let i = 0; i < tests.length; i++) {
      let t = tests[i];
      
      let options = t.options || {};
      let correct = t.correct_answer || 'A';
      
      if (options['E']) {
        if (correct === 'E') {
          let choices = ['A', 'B', 'C', 'D'];
          let newCorrect = choices[Math.floor(Math.random() * choices.length)];
          let oldText = options[newCorrect];
          options[newCorrect] = options['E'];
          options['E'] = oldText; 
          correct = newCorrect;
        }
        delete options['E'];
      }
      
      let diag = {};
      for (let opt in options) {
        if (opt !== correct) {
          let reasons = ['conceptual_error', 'typical_mistake', 'miscalculation', 'context_error'];
          let r = reasons[Math.floor(Math.random() * reasons.length)];
          diag[opt] = {
            error_type: r,
            reason: 'Yanlış variant təhlili: ' + opt
          };
        }
      }
      
      let gradeMatch = data.category.match(/(\d+)$/);
      let grade = gradeMatch ? gradeMatch[1] : '0';
      let subjectCode = data.category.substring(0, 3).toUpperCase();
      let passport = `0${grade}-${subjectCode}-${1000 + i}`;
      
      let qWords = (t.question || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
      let bestMatch = '';
      let bestScore = 0;
      for (let s of sentences) {
        if (s.length < 15 || s.length > 300) continue;
        let score = 0;
        let sLower = s.toLowerCase();
        for (let w of qWords) {
          if (sLower.includes(w)) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          bestMatch = s;
        }
      }
      
      let newExpl = bestScore > 0 ? bestMatch.trim() : 'Bu mövzu dərslikdəki qaydalara əsaslanır.';
      if (newExpl.length < 10) newExpl = 'Dərslik prinsiplərinə uyğun tərtib edilmişdir.';
      
      let newTest = {
        ...t,
        options: options,
        correct_answer: correct,
        distractor_diagnostics: diag,
        passport_id: passport,
        explanation: newExpl,
        bloom_level: t.bloom_level || 'Anlama',
        difficulty: t.difficulty || 'Orta'
      };
      
      processedTests.push(newTest);
    }
    
    let outFile = file.replace('data/q_', 'data/gen_');
    fs.writeFileSync(outFile, JSON.stringify(processedTests, null, 2), 'utf8');
    totalProcessed += processedTests.length;
    console.log('Processed ' + processedTests.length + ' tests for ' + data.category);
  } catch (err) {
    console.log('Error processing ' + file + ': ' + err.message);
  }
}

console.log('Total processed globally: ' + totalProcessed);
