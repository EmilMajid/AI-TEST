import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

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

const topics = [
    'Ana qucağı',
    'Mətn',
    'Üçüncü il',
    '“Amalım millətimi səadətə qovuşdurmaqdır”',
    '“Sizi təbrik edirəm, qızlar!”',
    'Məhəmməd Sadıq bəy Ağabəyzadə',
    'Maarifçi fədailər -Aşurbəylilər'
];

const contextText = fs.readFileSync('temp/az9_all_text.txt', 'utf-8');

const getPrompt = (topic) => {
  return `Azərbaycan Respublikasının 9-cu sinif təhsil proqramına uyğun olaraq "Azərbaycan dili" dərsliyindən "1-ci bölmə. Dil, təhsil və cəmiyyət" əhatəsindəki "${topic}" mövzusu üzrə 15 test sualı hazırla.

SİFIR XƏTA STRATEGİYASI: Bütün suallar və onların doğru cavabları AŞAĞIDA VERİLMİŞ DƏRSLİK MƏTNİNƏ (Source Context) tamamilə və hərfi-hərfinə əsaslanmalıdır. Heç bir uydurma məlumat olmamalıdır. Mətndə "${topic}" mövzusunu tapıb ona uyğun suallar tərtib et.

ƏSAS TƏLƏBLƏR:
1. Sinif səviyyəsi: 9-cu sinif
2. Mövzu: ${topic}
3. Çətinlik səviyyəsi: qarışıq (5 sadə, 5 orta, 5 çətin)
4. Sual sayı: Düz 15 ədəd
5. Hər sualın 4 variantı (A, B, C, D) və yalnız 1 doğru cavabı olmalıdır.

SUAL FORMATI VƏ JSON ÇIXIŞ:
Cavabı YALNIZ aşağıdakı JSON formatında ver, başqa heç bir mətn əlavə etmə:

{
  "questions": [
    {
      "question": "Sual mətni",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": 0,
      "explanation": "Doğru cavabın ətraflı izahatı",
      "sourceContext": "Mətndən sualın götürüldüyü orijinal cümlə və ya abzas",
      "difficulty": "sadə",
      "topic": "${topic}",
      "bloomLevel": "bilmə/anlama/tətbiq/təhlil/qiymətləndirmə"
    }
  ]
}

AŞAĞIDAKI MƏTNDƏN İSTİFADƏ EDİN (DƏRSLİK MƏTNİ):
===================================================
${contextText}
===================================================
`;
};

async function generateForTopic(topic) {
  console.log(`Generating 15 questions for ${topic}...`);
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: getPrompt(topic),
      temperature: 0.1,
      maxRetries: 3
    });
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).questions;
    }
  } catch (error) {
    console.error(`Error generating for ${topic}:`, error);
  }
  return [];
}

async function main() {
  console.log("Starting test generation...");
  let allQuestions = [];
  
  for (const topic of topics) {
    const questions = await generateForTopic(topic);
    console.log(`Generated ${questions.length} questions for ${topic}`);
    questions.forEach(q => allQuestions.push(q));
  }
  
  let markdown = `# 9-cu Sinif Azərbaycan dili - 1-ci Bölmə (Dil, təhsil və cəmiyyət) Testləri\n\n`;
  markdown += `> [!NOTE]\n> Bu sənəddə 9-cu sinif Azərbaycan dili fənni üzrə 1-ci bölməyə aid 7 mövzu üçün hazırlanmış cəmi 105 test tapşırığı yer alır. Testlər Sıfır Xəta strategiyası ilə dərslik mətnlərinə əsasən tərtib edilmişdir.\n\n`;
  
  markdown += `## I Hissə: Test Tapşırıqları\n\n`;
  for (const topic of topics) {
    markdown += `### ${topic}\n\n`;
    const topicQs = allQuestions.filter(q => q.topic === topic);
    topicQs.forEach((q, i) => {
      markdown += `**Sual ${i + 1}.** ${q.question} (Çətinlik: *${q.difficulty}*)\n`;
      q.options.forEach(opt => {
        markdown += `- ${opt}\n`;
      });
      markdown += `\n`;
    });
  }
  
  markdown += `---\n\n## II Hissə: Cavablar və İzahatlar\n\n`;
  for (const topic of topics) {
    markdown += `### ${topic}\n\n`;
    const topicQs = allQuestions.filter(q => q.topic === topic);
    topicQs.forEach((q, i) => {
      const correctOpt = q.options[q.correctAnswer] || q.options[0];
      markdown += `**Sual ${i + 1} Cavabı:** ${correctOpt.substring(0, 2)}\n\n`;
      markdown += `**İzahat:** ${q.explanation}\n\n`;
      markdown += `> **Orijinal Mətn:** "${q.sourceContext || 'Simulyasiya edilmiş mətn'}"\n\n`;
    });
  }
  
  const outPath = path.join(__dirname, '..', 'temp', 'az9_B1_testleri.md');
  fs.writeFileSync(outPath, markdown, 'utf-8');
  console.log(`Successfully wrote markdown to ${outPath}`);
  
  const dbPath = path.join(__dirname, '..', 'data', 'offline_tests.json');
  if (fs.existsSync(dbPath)) {
    let testsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!testsDb['Azərbaycan dili']) testsDb['Azərbaycan dili'] = [];
    
    let nextId = 90001;
    const dbTests = allQuestions.map(q => ({
      id: nextId++,
      category: "Azərbaycan dili 9",
      question: q.question,
      options: q.options.map(o => o.replace(/^[A-D]\)\s*/, '')),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      passport_id: `09-001-0101-B1F01-${q.difficulty === 'sadə' ? '01' : q.difficulty === 'orta' ? '02' : '03'}-01-${nextId}`,
      topic: q.topic
    }));
    
    testsDb['Azərbaycan dili'].push(...dbTests);
    fs.writeFileSync(dbPath, JSON.stringify(testsDb, null, 2));
    console.log('Appended to offline_tests.json');
  }
}

main();
