import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  dotenv.config({ path: '.env' });
}

const units = [
  "UNIT 1. SCHOOLS AROUND THE WORLD",
  "UNIT 2. A WORLD OF TECHNOLOGY",
  "UNIT 3. WHAT A TALENT!",
  "UNIT 4. TRAVEL",
  "UNIT 5. FRIENDS FOREVER",
  "UNIT 6. LIFE IN THE FUTURE"
];

const grade = "7";
const textbook = "English - 7 (əsas xarici dil)";
const difficulty = "qarışıq";
const questionCount = 15;

const getDifficultyPrompt = (difficulty) => {
  return `
  QARIŞIQ SƏVİYYƏ TƏLƏBLƏRI:
  - Müxtəlif çətinlik səviyyələrindən suallar
  - 30% sadə (5 sual), 50% orta (5 sual), 20% çətin (5 sual) - Toplam 15 sual
  - Bloom taksonomiyasının bütün səviyyələri
  - Tədricən çətinləşən sual ardıcıllığı
  `;
};

async function generateForUnit(unit) {
  const prompt = `Azərbaycan Respublikasının ${grade}-ci sinif təhsil proqramına uyğun olaraq "${textbook}" dərsliyindən "${unit}" mövzusu üzrə ${questionCount} test sualı hazırla.

ƏSAS TƏLƏBLƏR:
1. Sinif səviyyəsi: ${grade}-ci sinif
2. Çətinlik səviyyəsi: ${difficulty}
3. Sual sayı: ${questionCount}
4. Azərbaycan təhsil standartlarına uyğunluq

${getDifficultyPrompt(difficulty)}

SUAL FORMATI:
- Hər sual aydın, anlaşılan və birmənalı olmalıdır
- 4 variant cavab (A, B, C, D) olmalıdır
- Yalnız bir düzgün cavab olmalıdır
- Hər sualın ətraflı izahatı olmalıdır
- Suallar mövzu ilə birbaşa əlaqəli olmalıdır

MÖVZU KONTEKSTI: ${unit}

QARIŞIQ ÇƏTINLIK BÖLGÜSÜ:
- 5 sual sadə səviyyədə
- 5 sual orta səviyyədə  
- 5 sual çətin səviyyədə

Cavabı YALNIZ JSON formatında ver, başqa mətn əlavə etmə:

{
  "questions": [
    {
      "question": "Sual mətni burada (aydın və konkret)",
      "options": [
        "A) Birinci variant",
        "B) İkinci variant", 
        "C) Üçüncü variant",
        "D) Dördüncü variant"
      ],
      "correctAnswer": 0,
      "explanation": "Bu cavabın düzgün olmasının ətraflı izahatı və mövzu ilə əlaqəsi",
      "sourceContext": "Sualın və ya cavabın götürüldüyü orijinal mənbə mətni (dərslikdən tam cümlə və ya bənd)",
      "difficulty": "sadə/orta/çətin",
      "topic": "${unit}",
      "bloomLevel": "bilmə/anlama/tətbiq/təhlil/qiymətləndirmə",
      "timeEstimate": 2
    }
  ]
}

Mövzu: ${unit}`;

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt,
      temperature: 0.8,
    });
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).questions;
    }
  } catch (error) {
    console.error(`Error generating for ${unit}:`, error);
  }
  return [];
}

async function main() {
  console.log("Starting test generation...");
  let allQuestions = [];
  
  for (const unit of units) {
    console.log(`Generating 15 questions for ${unit}...`);
    const questions = await generateForUnit(unit);
    console.log(`Generated ${questions.length} questions for ${unit}`);
    
    // Add unit info to each question for categorization
    questions.forEach(q => {
      q.unit = unit;
      allQuestions.push(q);
    });
  }
  
  // Create markdown artifact format
  let markdown = `# 7-ci Sinif İngilis Dili - Mövzular Üzrə Test Tapşırıqları\n\n`;
  
  // SECTION 1: Questions only
  markdown += `## I Hissə: Test Tapşırıqları\n\n`;
  for (const unit of units) {
    markdown += `### ${unit}\n\n`;
    const unitQs = allQuestions.filter(q => q.unit === unit);
    unitQs.forEach((q, i) => {
      markdown += `**Sual ${i + 1}.** ${q.question} (Çətinlik: *${q.difficulty}*)\n`;
      q.options.forEach(opt => {
        markdown += `- ${opt}\n`;
      });
      markdown += `\n`;
    });
  }
  
  // SECTION 2: Answers and explanations
  markdown += `---\n\n## II Hissə: Cavablar və İzahatlar\n\n`;
  for (const unit of units) {
    markdown += `### ${unit}\n\n`;
    const unitQs = allQuestions.filter(q => q.unit === unit);
    unitQs.forEach((q, i) => {
      const correctOpt = q.options[q.correctAnswer] || q.options[0];
      markdown += `**Sual ${i + 1} Cavabı:** ${correctOpt.substring(0, 2)}\n\n`;
      markdown += `**İzahat:** ${q.explanation}\n\n`;
      markdown += `> **Orijinal Mətn (Dərslikdən Sitat):** "${q.sourceContext || q.sourceText || 'Simulyasiya edilmiş mətn'}"\n\n`;
    });
  }
  
  const outPath = 'C:\\\\Users\\\\User\\\\.gemini\\\\antigravity\\\\brain\\\\31d778bc-7ad4-4a0d-b9f4-d0e41b1455c7\\\\artifacts\\\\english-7-tests.md';
  fs.writeFileSync(outPath, markdown, 'utf-8');
  console.log(`Successfully wrote markdown to ${outPath}`);
}

main();
