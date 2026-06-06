const fs = require('fs');
const path = require('path');

const NUM_LOGS = 5000;
const subjects = ['İngilis dili', 'Azərbaycan dili', 'Riyaziyyat'];
const grades = ['7', '8', '9'];

const generateMockLogs = () => {
  const logs = [];
  const now = new Date();
  
  for (let i = 0; i < NUM_LOGS; i++) {
    // Distribute dates over the last 30 days
    const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const isCorrect = Math.random() > 0.4; // 60% success rate overall
    const timeSpent = Math.floor(Math.random() * 60) + 10; // 10s to 70s
    
    logs.push({
      id: `log_${i}`,
      studentId: `stu_${Math.floor(Math.random() * 500)}`,
      subject,
      grade,
      date: date.toISOString(),
      isCorrect,
      timeSpent,
      difficulty: Math.random() > 0.7 ? 'çətin' : (Math.random() > 0.5 ? 'orta' : 'sadə')
    });
  }
  
  // Sort by date ascending
  logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return logs;
};

const logs = generateMockLogs();
const outPath = path.join(__dirname, '../data/student_logs.json');

fs.writeFileSync(outPath, JSON.stringify(logs, null, 2), 'utf8');
console.log(`Generated ${NUM_LOGS} mock student logs at ${outPath}`);
