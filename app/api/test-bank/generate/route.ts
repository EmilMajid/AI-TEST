import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/scripts/llm-wrapper';
import fs from 'fs';
import path from 'path';

// POST /api/test-bank/generate
export async function POST(req: NextRequest) {
    const { topicKey, difficulty, bloomLevel, count = 5, autoApprove = true } = await req.json();

    // Load simple topic content (manual topics file) – can be replaced with richer content later
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

        // ---- Append to question‑bank.json ----
        const qbPath = path.join(process.cwd(), 'scripts', 'question-bank.json');
        const bank = JSON.parse(fs.readFileSync(qbPath, 'utf-8'));
        result.questions.forEach((q: any) => {
            const id = `${topicKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            bank[id] = {
                id,
                topicKey,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation ?? '',
                difficulty: difficulty ?? 'orta',
                bloomLevel: bloomLevel ?? 'anlama',
                usageCount: 0,
                successRate: 0,
                wrongAnswerStats: { option0: 0, option1: 0, option2: 0, option3: 0 },
                isProblemDetected: false,
                tags: [],
                status: autoApprove ? 'active' : 'pending', // New status field
                isPending: !autoApprove // Helper boolean
            };
        });
        fs.writeFileSync(qbPath, JSON.stringify(bank, null, 2), 'utf-8');

        // ---- Update topic‑coverage.json ----
        const covPath = path.join(process.cwd(), 'scripts', 'topic-coverage.json');
        const coverage = JSON.parse(fs.readFileSync(covPath, 'utf-8'));
        if (coverage[topicKey]) {
            coverage[topicKey].currentCount += result.questions.length;
            coverage[topicKey].completionPercentage = Math.min(
                100,
                (coverage[topicKey].currentCount / coverage[topicKey].targetQuestions) * 100
            );
        }
        fs.writeFileSync(covPath, JSON.stringify(coverage, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            generated: result.questions.length,
            coverage: coverage[topicKey] ?? null,
        });
    } catch (e: any) {
        console.error('Generation error:', e);
        return NextResponse.json({ success: false, error: e.message }, { status: 503 });
    }
}
