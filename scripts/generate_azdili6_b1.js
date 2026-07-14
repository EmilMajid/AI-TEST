import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Load API key
const envContent = fs.readFileSync('.env.local', 'utf-8') + '\n' + fs.readFileSync('.env', 'utf-8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.includes('GOOGLE_GENERATIVE_AI_API_KEY')) {
    apiKey = line.split('=')[1].trim().replace(/^"|"$/g, '');
  }
}

const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

const b1_topics = [
  "Fəsil 1. Söz vermişəm",
  "Sözlərdə saitlərin deyilişi və yazılışı: səsdüşümü və səsartımı",
  "Fəsil 2. Sənin kimi olacağam",
  "Saitlərin uzun tələffüzü",
  "Fəsil 3. Buqələmun",
  "Samitlərin tələffüzü",
  "Fəsil 4. Sadiq dost",
  "Söz ortasında yanaşı gələn samitlərin deyilişi və yazılışı",
  "Ümumiləşdirici təkrar"
];

const getPrompt = (topic, missingCount) => {
  return `Azərbaycan Respublikasının 6-cı sinif təhsil proqramına uyğun olaraq "Azərbaycan dili" dərsliyindən "${topic}" mövzusu üzrə ${missingCount} ədəd test sualı hazırla.

QƏTİ QAYDALAR VƏ GOLD STANDART 2.1:
1. Sinif səviyyəsi: 6-cı sinif. 
2. Mövzu: ${topic}
3. Çətinlik səviyyəsi: Qarışıq (Asan, Orta, Çətin).
4. Sual sayı: Düz ${missingCount} ədəd.
5. Hər sualın 4 variantı (A, B, C, D) və yalnız 1 doğru cavabı olmalıdır.
6. 'Hamısı doğrudur', 'Heç biri doğru deyil', 'A və B' kimi tənbəl variantlardan istifadə etmək QƏTİ QADAĞANDIR.
7. Doğru cavabın mətni digər variantlardan vizual olaraq kəskin uzun olmamalıdır.
8. Distraktorlar (yanlış cavablar) real qrammatik/leksik məlumatlara əsaslanmalı, məntiqi cəhətdən çaşdırıcı olmalıdır. Açıq-aydın səhv olan gülünc variantlar YAZILMAMALIDIR.
9. Mövzu həm qrammatika, həm də mətni anlamağa aid ola bilər. Mövzuya uyğun mətn parçası qura və ya mövcud 6-cı sinif biliyinə uyğun qaydaları (sait, samit, orfoqrafiya və s.) yoxlaya bilərsən.

SUAL FORMATI VƏ JSON ÇIXIŞI:
Cavabı YALNIZ aşağıdakı JSON formatında ver, başqa heç bir mətn, "budur JSON" kimi sözlər əlavə etmə:

{
  "questions": [
    {
      "question": "Sual mətni (əgər mətn tipli sualdırsa, kiçik abzas və sual birlikdə)",
      "options": ["A variantı mətni", "B variantı mətni", "C variantı mətni", "D variantı mətni"],
      "correctAnswer": 0,
      "difficulty": "sadə",
      "bloom_level": "bilmə",
      "topic": "${topic}",
      "pedagogical_explanation": "Pedaqoji izah: Şagird bu tapşırıqda [Bloom] səviyyəsini nümayiş etdirir. İzah: [Düzgün cavabın niyə düz olması, səhvlərin niyə səhv olması barədə ətraflı izah]"
    }
  ]
}

BLOOM SƏVİYYƏLƏRİ: bilmə, anlama, tətbiq, təhlil, qiymətləndirmə, yaratmaq
ÇƏTİNLİK DƏRƏCƏLƏRİ: sadə, orta, çətin
`;
};

async function generateForTopic(topic, missingCount) {
  console.log(`Generating ${missingCount} questions for ${topic}...`);
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: getPrompt(topic, missingCount),
      temperature: 0.3,
      maxRetries: 3
    });
    
    // Find json block even if wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      let data = JSON.parse(jsonMatch[0]);
      return data.questions || [];
    }
  } catch (error) {
    console.error(`Error generating for ${topic}:`, error);
  }
  return [];
}

async function main() {
  const dbPath = path.resolve('data/offline_tests.json');
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  if (!db['Azərbaycan dili 6']) db['Azərbaycan dili 6'] = [];
  let existingTests = db['Azərbaycan dili 6'];
  
  console.log("Starting test generation for Bölmə 1...");
  let newTests = [];
  
  for (const topic of b1_topics) {
    // count current
    const count = existingTests.filter(t => t.topic === topic).length;
    let missing = 15 - count;
    if (missing <= 0) {
      console.log(`${topic} already has ${count} tests. Skipping.`);
      continue;
    }
    
    // If missing > 10, doing it in batches to avoid LLM context issues
    while (missing > 0) {
      let batchSize = missing > 10 ? 10 : missing;
      const questions = await generateForTopic(topic, batchSize);
      if (questions && questions.length > 0) {
        console.log(`Generated ${questions.length} questions for ${topic} in this batch`);
        newTests.push(...questions);
        missing -= questions.length;
      } else {
        console.log(`Failed to generate questions for ${topic}, breaking batch loop.`);
        break; // break to avoid infinite loop on fail
      }
    }
  }
  
  // Format and append
  let maxId = 0;
  for (const s of Object.keys(db)) {
    for (const t of db[s]) {
      if (t.id && String(t.id).startsWith('gen-')) continue;
      if (typeof t.id === 'number' && t.id > maxId) maxId = t.id;
      if (typeof t.id === 'string' && !isNaN(parseInt(t.id)) && parseInt(t.id) > maxId) maxId = parseInt(t.id);
    }
  }
  
  let nextId = maxId > 100000 ? maxId + 1 : 100001;
  
  const formattedTests = newTests.map(q => {
    // Generate a temporary passport ID - the final pass will run `apply_passport_id.py` to fix all of them sequentially
    return {
      id: `gen-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`,
      passport_id: "TBD", 
      question: q.question,
      options: q.options.map(o => o.replace(/^[A-D]\)\s*/, '')),
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty || "orta",
      bloom_level: q.bloom_level || "bilmə",
      topic: q.topic,
      cat: "Azərbaycan dili 6",
      pedagogical_explanation: q.pedagogical_explanation || "Pedaqoji izah: Əlavə edilməyib."
    };
  });
  
  existingTests.push(...formattedTests);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Successfully generated and appended ${formattedTests.length} tests to DB.`);
}

main();
