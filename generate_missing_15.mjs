import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const missingDataPath = path.join(process.cwd(), 'missing_15.json');
const dbPath = path.join(process.cwd(), 'data', 'offline_tests.json');

const missingData = JSON.parse(fs.readFileSync(missingDataPath, 'utf8'));
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function generateId() {
  return Math.floor(Math.random() * 1000000000) + 1000000000;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function generateMissingForTopic(item) {
  const { subject, topic, needed } = item;
  
  const prompt = `Azərbaycan Respublikasının 5-ci sinif təhsil proqramına uyğun olaraq "${subject}" fənnindən "${topic}" mövzusu üzrə tam ${needed} ədəd test sualı hazırla.

ƏSAS TƏLƏBLƏR:
1. Pedaqoji "Gold Standart 2.1" tələbləri: Sualların birmənalı, aydın və qrammatik olaraq qüsursuz olması. Yalnız 1 düzgün cavab variantı olmalıdır.
2. Çətinlik səviyyəsi: BƏRABƏR PAYLANMALIDIR (asan, orta və çətin suallar balanslı şəkildə qarışdırılsın).
3. Hər sual 4 variantlıdır (A, B, C, D).
4. Suallar mövzu ilə birbaşa əlaqəli olmalıdır.

Cavabı YALNIZ JSON formatında ver, başqa heç bir mətn və ya markdown izahatı əlavə etmə:

{
  "questions": [
    {
      "question": "Sual mətni",
      "options": [
        "A variantı mətni",
        "B variantı mətni",
        "C variantı mətni",
        "D variantı mətni"
      ],
      "correctAnswer": 0,
      "explanation": "Düzgün cavabın izahı",
      "difficulty": "asan / orta / çətin"
    }
  ]
}`;

  console.log(`Generating ${needed} tests for ${subject} -> ${topic}...`);
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });
    
    if (!res.ok) {
       console.log("Response not OK:", await res.text());
       return [];
    }
    
    const data = await res.json();
    let text = data.choices[0].message.content;
    
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    
    const parsed = JSON.parse(cleaned);
    if (parsed && parsed.questions) {
      return parsed.questions;
    }
  } catch (error) {
    console.error(`Error generating for ${topic}:`, error.message);
  }
  return [];
}

async function main() {
  for (let i = 0; i < missingData.length; i++) {
    const item = missingData[i];
    const generated = await generateMissingForTopic(item);
    
    if (generated && generated.length > 0) {
      if (!db[item.subject]) db[item.subject] = [];
      
      generated.forEach(q => {
        let corrIndex = q.correctAnswer;
        if (typeof corrIndex === 'string') {
          corrIndex = q.options.findIndex(o => o.startsWith(q.correctAnswer));
          if (corrIndex === -1) corrIndex = 0;
        }
        
        db[item.subject].push({
          id: generateId(),
          category: item.subject,
          topic: item.topic,
          question: q.question,
          options: q.options,
          correctAnswer: corrIndex,
          explanation: q.explanation,
          difficulty: q.difficulty || "orta",
          passport_id: "05-" + Math.floor(Math.random() * 900000 + 100000) + "-GEN"
        });
      });
      console.log(`+ Added ${generated.length} tests. Target reached for this topic.`);
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    } else {
        console.log(`- Failed to generate or parse tests for ${item.topic}`);
    }
    await delay(2000);
  }
  console.log("ALL DONE!");
}

main();
