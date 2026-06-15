import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/scripts/llm-wrapper';
import fs from 'fs';
import path from 'path';

const offlineTestsPath = path.join(process.cwd(), 'data', 'offline_tests.json');
const textbooksPath = path.join(process.cwd(), 'data', 'textbooks.json');

function loadDb(): Record<string, any[]> {
    if (!fs.existsSync(offlineTestsPath)) return {};
    return JSON.parse(fs.readFileSync(offlineTestsPath, 'utf-8'));
}

function findSubjectKeyForTopic(topicKey: string): string | null {
    if (!fs.existsSync(textbooksPath)) return null;
    const textbooks = JSON.parse(fs.readFileSync(textbooksPath, 'utf-8'));
    for (const grade of Object.keys(textbooks)) {
        for (const book of textbooks[grade]) {
            const topics = typeof book.topics === 'string'
                ? book.topics.split('\n').map((t: string) => t.trim()).filter(Boolean)
                : Array.isArray(book.topics) ? book.topics : [];
            if (topics.includes(topicKey)) {
                return book.title;
            }
        }
    }
    return null;
}

// POST /api/test-bank/generate
export async function POST(req: NextRequest) {
    const { topicKey, subject, difficulty, bloomLevel, count = 5, autoApprove = false } = await req.json();

    const topicsPath = path.join(process.cwd(), 'scripts', 'manual-topics.json');
    const topicsData = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
    const topicContent = topicsData[topicKey]?.join('\n') ?? '';

    try {
        const result = await generateQuestions({
            topic: topicKey,
            topicContent,
            difficulty: difficulty ?? 'orta',
            bloomLevel: bloomLevel ?? 'anlama',
            count,
        });

        // Save to offline_tests.json under the correct subject key
        const db = loadDb();
        const subjectKey = subject || findSubjectKeyForTopic(topicKey) || topicKey;

        if (!db[subjectKey]) {
            db[subjectKey] = [];
        }

        result.questions.forEach((q: any, idx: number) => {
            const newPassportId = `GEN-${Date.now()}-${idx}`;
            db[subjectKey].push({
                passport_id: newPassportId,
                topic: topicKey,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation ?? '',
                difficulty: difficulty ?? 'orta',
                bloomLevel: bloomLevel ?? 'anlama',
                status: autoApprove ? 'active' : 'draft',
            });
        });

        fs.writeFileSync(offlineTestsPath, JSON.stringify(db, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            generated: result.questions.length,
            savedTo: subjectKey,
        });
    } catch (e: any) {
        console.error('Generation error:', e);
        return NextResponse.json({ success: false, error: e.message }, { status: 503 });
    }
}
