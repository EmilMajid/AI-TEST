export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/scripts/llm-wrapper';
import { validateAndSanitizeQuestion } from '@/scripts/psychometric-validator';
import fs from 'fs';
import path from 'path';
import { atomicWriteJsonSync, offlineTestsMutex } from '@/lib/data-safety';

const offlineTestsPath = path.join(process.cwd(), 'data', 'offline_tests.json');
const textbooksPath = path.join(process.cwd(), 'data', 'textbooks.json');

function loadDb(): Record<string, any> {
    if (!fs.existsSync(offlineTestsPath)) return {};
    try {
        return JSON.parse(fs.readFileSync(offlineTestsPath, 'utf-8'));
    } catch (err) {
        console.error("Critical error reading offline_tests.json in generate route:", err);
        return {};
    }
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
    try {
        const { topicKey, subject, difficulty, bloomLevel, count = 5, autoApprove = false } = await req.json();

        let topicContent = '';
        try {
            const topicsPath = path.join(process.cwd(), 'scripts', 'manual-topics.json');
            if (fs.existsSync(topicsPath)) {
                const topicsData = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
                topicContent = topicsData[topicKey]?.join('\n') ?? '';
            }
        } catch (err) {
            console.warn("Could not read manual-topics.json:", err);
        }

        const result = await generateQuestions({
            topic: topicKey,
            topicContent,
            difficulty: difficulty ?? 'orta',
            bloomLevel: bloomLevel ?? 'anlama',
            count,
        });

        // Save to offline_tests.json safely under mutex lock
        const unlock = await offlineTestsMutex.lock();
        try {
            const db = loadDb();
            const subjectKey = subject || findSubjectKeyForTopic(topicKey) || topicKey;

            if (!db[subjectKey]) {
                // If existing subjects are dicts, initialize as dict
                db[subjectKey] = {};
            }

            const isDictSubject = typeof db[subjectKey] === 'object' && !Array.isArray(db[subjectKey]);
            if (isDictSubject && !db[subjectKey][topicKey]) {
                db[subjectKey][topicKey] = [];
            }

            const validQuestions: any[] = [];
            result.questions.forEach((q: any, idx: number) => {
                const validation = validateAndSanitizeQuestion(q);
                const cleanQ = validation.sanitizedQuestion || q;
                
                const newPassportId = `GEN-${Date.now()}-${idx}`;
                const questionObj = {
                    passport_id: newPassportId,
                    topic: topicKey,
                    question: cleanQ.question,
                    options: cleanQ.options,
                    correctAnswer: cleanQ.correctAnswer,
                    explanation: cleanQ.explanation ?? '',
                    difficulty: difficulty ?? 'orta',
                    bloomLevel: bloomLevel ?? 'anlama',
                    status: autoApprove ? 'active' : 'draft',
                };

                if (isDictSubject) {
                    db[subjectKey][topicKey].push(questionObj);
                } else {
                    db[subjectKey].push(questionObj);
                }
                validQuestions.push(questionObj);
            });

            atomicWriteJsonSync(offlineTestsPath, db, { backup: true });

            return NextResponse.json({
                success: true,
                generated: validQuestions.length,
                savedTo: subjectKey,
            });
        } finally {
            unlock();
        }
    } catch (e: any) {
        console.error('Generation error:', e);
        return NextResponse.json({ success: false, error: e.message }, { status: 503 });
    }
}
