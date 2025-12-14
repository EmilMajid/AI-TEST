import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

type Provider = {
    name: string;
    type: string;
    endpoint?: string;
    modelId?: string;
    apiKeyEnv: string;
    quota: { dailyTokens?: number | null; dailyRequests?: number | null };
};

type Config = {
    providers: Provider[];
    fallbackOrder: string[];
    batchSize: number;
    promptTemplate: string;
};

const CONFIG_PATH = path.join(process.cwd(), 'scripts', 'llm-config.json');
const USAGE_PATH = path.join(process.cwd(), 'scripts', 'llm-usage.json');

function loadConfig(): Config {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}
function loadUsage(): any {
    return JSON.parse(fs.readFileSync(USAGE_PATH, 'utf-8'));
}
function saveUsage(usage: any) {
    fs.writeFileSync(USAGE_PATH, JSON.stringify(usage, null, 2), 'utf-8');
}

function hasQuota(provider: Provider, usage: any): boolean {
    const u = usage[provider.name];
    if (!u) return true;
    const { dailyTokens, dailyRequests } = provider.quota;
    if (dailyTokens && u.tokensUsed >= dailyTokens) return false;
    if (dailyRequests && u.requestsMade >= dailyRequests) return false;
    return true;
}

function buildRequestBody(provider: Provider, prompt: string): any {
    switch (provider.type) {
        case 'google':
            return {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
            };
        case 'openai_compatible':
            return {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1024,
            };
        case 'huggingface':
            return {
                inputs: prompt,
                parameters: { max_new_tokens: 1024, temperature: 0.7 },
            };
        case 'mock':
            return { prompt }; // No complex body needed
        default:
            throw new Error(`Unsupported provider type ${provider.type}`);
    }
}

async function callProvider(provider: Provider, prompt: string): Promise<string> {
    if (provider.type === 'mock') {
        // Return dummy JSON response directly
        return JSON.stringify({
            questions: [
                {
                    question: "Mock sual 1: İnformasiya nədir? (Test)",
                    options: ["Məlumat", "Səs", "Görüntü", "Kod"],
                    correctAnswer: 0,
                    explanation: "İnformasiya məlumatdır."
                },
                {
                    question: "Mock sual 2: Kompüterin beyni nədir?",
                    options: ["Monitor", "CPU", "Maus", "Klaviatura"],
                    correctAnswer: 1,
                    explanation: "CPU mərkəzi prosessordur."
                },
                {
                    question: "Mock sual 3: Hansı əməliyyat sistemidir?",
                    options: ["Word", "Excel", "Windows", "Paint"],
                    correctAnswer: 2,
                    explanation: "Windows OS-dir."
                },
                {
                    question: "Mock sual 4: 1 bayt neçə bitdir?",
                    options: ["8", "16", "32", "64"],
                    correctAnswer: 0,
                    explanation: "1 bayt 8 bitdir."
                },
                {
                    question: "Mock sual 5: Hansı giriş qurğusudur?",
                    options: ["Monitor", "Printer", "Klaviatura", "Dinamik"],
                    correctAnswer: 2,
                    explanation: "Klaviatura daxiletmə qurğusudur."
                }
            ]
        });
    }

    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) throw new Error(`Missing API key env ${provider.apiKeyEnv}`);

    const body = buildRequestBody(provider, prompt);
    const headers: any = { 'Content-Type': 'application/json' };
    if (provider.type === 'google') headers['x-goog-api-key'] = apiKey;
    else headers['Authorization'] = `Bearer ${apiKey}`;

    const resp = await fetch(provider.endpoint!, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Provider ${provider.name} error ${resp.status}: ${txt}`);
    }

    const data = await resp.json() as any;
    if (provider.type === 'google')
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (provider.type === 'openai_compatible')
        return data.choices?.[0]?.message?.content ?? '';
    if (provider.type === 'huggingface') return data?.generated_text ?? '';
    return '';
}

export async function generateQuestions(params: {
    topic: string;
    topicContent: string;
    difficulty: string;
    bloomLevel: string;
    count: number;
}): Promise<any> {
    const cfg = loadConfig();
    const usage = loadUsage();

    const prompt = cfg.promptTemplate
        .replace('{topic}', params.topic)
        .replace('{topicContent}', params.topicContent)
        .replace('{difficulty}', params.difficulty)
        .replace('{bloomLevel}', params.bloomLevel)
        .replace('{count}', String(params.count));

    // Check if any real API keys are configured for the providers in fallbackOrder
    const hasRealApiKeys = cfg.fallbackOrder.some(name => {
        const prov = cfg.providers.find(p => p.name === name);
        return prov && process.env[prov.apiKeyEnv];
    });

    let effectiveFallbackOrder = [...cfg.fallbackOrder];
    let effectiveProviders = [...cfg.providers];

    // If no real API keys are found, add a mock provider to the fallback order
    if (!hasRealApiKeys) {
        console.warn("No API keys found for configured providers. Using Mock Provider.");
        const mockProvider: Provider = {
            name: "mock-provider",
            type: "mock", // A new type for the mock provider
            apiKeyEnv: "MOCK_API_KEY", // Dummy env var, not actually used
            quota: { dailyTokens: null, dailyRequests: null }
        };
        effectiveProviders.push(mockProvider);
        effectiveFallbackOrder = ["mock-provider"]; // Only use mock provider
    }

    for (const name of effectiveFallbackOrder) {
        const prov = effectiveProviders.find(p => p.name === name)!;

        // Initialize usage for new providers if not present
        if (!usage[name]) {
            usage[name] = { tokensUsed: 0, requestsMade: 0 };
        }

        if (!hasQuota(prov, usage)) {
            console.warn(`Provider ${name} quota exhausted – skipping`);
            continue;
        }
        try {
            const raw = await callProvider(prov, prompt);
            const tokens = Math.ceil(raw.split(/\s+/).length);
            usage[name].tokensUsed += tokens;
            usage[name].requestsMade += 1;
            saveUsage(usage);

            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON found in model output');
            const parsed = JSON.parse(jsonMatch[0]);
            if (!Array.isArray(parsed.questions) || parsed.questions.length === 0)
                throw new Error('Invalid question format');

            // Respect the 'count' parameter for the mock provider's output
            const questionsToReturn = parsed.questions.slice(0, params.count);

            return {
                provider: prov.name,
                questions: questionsToReturn,
                generated: parsed.questions.length // Indicate how many were generated by mock
            };
        } catch (e: any) {
            console.error(`Provider ${name} failed: ${e.message}`);
            continue;
        }
    }
    throw new Error('All LLM providers failed or exhausted');
}
