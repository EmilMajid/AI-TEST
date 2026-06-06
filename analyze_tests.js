const db = require('./data/offline_tests.json');
Object.keys(db).forEach(subj => {
  const topics = db[subj];
  let qCount = 0;
  topics.forEach(t => {
    if(t.questions) qCount += t.questions.length;
  });
  console.log(`${subj}: ${topics.length} topics, ${qCount} questions`);
});
