const fs = require('fs');

try {
  let kimya = JSON.parse(fs.readFileSync('scripts/kimya8_questions.json', 'utf8'));
  
  if(kimya.length === 135) {
    console.log('Already 135');
    process.exit(0);
  }

  const missingQuestion = {
    id: 0,
    category: 'Kimya 8',
    question: 'Nyulandın Oktavalar qanunu öz dövrünün alimləri tərəfindən ciddi qəbul edilmədi. Bunun ehtimal olunan əsas səbəbi nə idi?',
    options: ['Nyuland elementləri yanlış sıralamışdı', 'Dövrün alimlərinin çoxu elementlər haqqında yetərli biliyə sahib deyildi', 'Cədvəldə yalnız musiqi terminlərindən istifadə edilmişdi', 'Nyulandın fizik olması, kimyaçı olmaması'],
    correctAnswer: 1,
    explanation: 'Mətnə görə alimlər bu cədvəli ciddi qəbul etmədi, lakin illər sonra onun fikirlərinin bir çoxunun həqiqəti əks etdirdiyi məlum oldu. Alimlər o dövrdə elementlərin xassələri haqqında tam məlumata malik deyildilər.',
    difficulty: 'çətin',
    topic: 'Dövri cədvəlin tarixi',
    bloomLevel: 'təhlil',
    passport_id: ''
  };

  // Find where to insert it. ID 100555 is the last 'orta' question for this topic.
  const insertIndex = kimya.findIndex(q => q.id === 100555) + 1;
  
  if (insertIndex === 0) {
    console.log('Could not find id 100555');
  } else {
    kimya.splice(insertIndex, 0, missingQuestion);
    
    // Reassign everything
    let nextId = 100516;
    let currentTopic = '';
    let topicIndex = 0;
    let questionInTopic = 0;

    for (const q of kimya) {
      q.id = nextId++;
      if (q.topic !== currentTopic) {
        currentTopic = q.topic;
        topicIndex++;
        questionInTopic = 1;
      } else {
        questionInTopic++;
      }
      
      const bloomKey = q.bloomLevel === 'bilmə' ? 'B1' : q.bloomLevel === 'anlama' ? 'B2' : q.bloomLevel === 'tətbiq' ? 'B3' : 'B4';
      const diffKey = q.difficulty === 'sadə' ? 'S' : q.difficulty === 'orta' ? 'O' : 'C';
      
      q.passport_id = `08-KIM-T${String(topicIndex).padStart(2, '0')}-${bloomKey}-${diffKey}-${String(questionInTopic).padStart(3, '0')}`;
    }

    fs.writeFileSync('scripts/kimya8_questions.json', JSON.stringify(kimya, null, 2), 'utf8');
    console.log('Fixed Kimya 8 json, new length:', kimya.length);
  }
} catch (e) {
  console.error(e);
}
