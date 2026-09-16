const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function cleanText(rawText) {
  return (rawText || '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getAudioPath(text, voice = 'az-AZ-BanuNeural') {
  const truncated = cleanText(text).slice(0, 500);
  const hash = crypto.createHash('md5').update(`${voice}__${truncated}`).digest('hex');
  const filePath = path.join('public', 'audio', 'cache', `${hash}.mp3`);
  if (fs.existsSync(filePath)) {
    return `/audio/cache/${hash}.mp3`;
  }
  return `/api/tts?text=${encodeURIComponent(truncated)}`;
}

// 1. Update grade_1.json
const g1Path = path.join('data', 'grades', 'grade_1.json');
if (fs.existsSync(g1Path)) {
  const data = JSON.parse(fs.readFileSync(g1Path, 'utf8'));
  for (const [subj, topics] of Object.entries(data)) {
    if (typeof topics === 'object' && topics !== null) {
      for (const [topName, qList] of Object.entries(topics)) {
        if (Array.isArray(qList)) {
          qList.forEach(q => {
            q.audio = getAudioPath(q.question);
            if (Array.isArray(q.options)) {
              q.optionAudios = q.options.map(opt => getAudioPath(opt));
            }
          });
        }
      }
    }
  }
  fs.writeFileSync(g1Path, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated data/grades/grade_1.json with audio links!');
}

// 2. Update offline_tests.json
const offPath = path.join('data', 'offline_tests.json');
if (fs.existsSync(offPath)) {
  const offData = JSON.parse(fs.readFileSync(offPath, 'utf8'));
  ['Azərbaycan dili 1', 'Azərbaycan dili 1 (hissə 1)'].forEach(subj => {
    if (offData[subj] && typeof offData[subj] === 'object') {
      for (const [topName, qList] of Object.entries(offData[subj])) {
        if (Array.isArray(qList)) {
          qList.forEach(q => {
            q.audio = getAudioPath(q.question);
            if (Array.isArray(q.options)) {
              q.optionAudios = q.options.map(opt => getAudioPath(opt));
            }
          });
        }
      }
    }
  });
  fs.writeFileSync(offPath, JSON.stringify(offData, null, 2), 'utf8');
  console.log('Updated data/offline_tests.json with audio links!');
}

// 3. Update Desktop test bank files
const deskJson = path.join('C:', 'Users', 'User', 'Desktop', '1-ci_Sinif_Test_Banki', 'Azerbaycan_dili_1_Ilk_3_Movzu_TEST_BANKI.json');
if (fs.existsSync(deskJson)) {
  const dData = JSON.parse(fs.readFileSync(deskJson, 'utf8'));
  for (const [topName, qList] of Object.entries(dData)) {
    if (Array.isArray(qList)) {
      qList.forEach(q => {
        q.audio = getAudioPath(q.question);
        if (Array.isArray(q.options)) {
          q.optionAudios = q.options.map(opt => getAudioPath(opt));
        }
      });
    }
  }
  fs.writeFileSync(deskJson, JSON.stringify(dData, null, 2), 'utf8');
  console.log('Updated Desktop JSON test bank with audio links!');
}
