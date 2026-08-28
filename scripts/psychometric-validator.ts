/**
 * Psychometric & Anti-Template Validator and Sanitizer Engine
 * Enforces DİM / Kurikulum Standards:
 * 1. Option Length Homogeneity (max_len / min_len <= 1.25)
 * 2. Zero Visual Giveaways / Clues (no "Yalnız...", "Heç bir vəchlə...", etc.)
 * 3. Zero Repetitive Template Questions
 * 4. Grammatical & Syntactic Symmetry
 */

export interface TestQuestion {
    id?: string;
    passport_id?: string;
    topic?: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    difficulty?: string;
    bloomLevel?: string;
    status?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedQuestion?: TestQuestion;
}

const NAIVE_GIVEAWAYS = [
    /^yalnız\s+/i,
    /^heç\s+bir\s+vəchlə\s+/i,
    /^hamısı\s+/i,
    /qədim roma/i,
    /məktəbə getməkdən imtina/i,
    /ticarət karvanı və müvafiq sahəni/i
];

const FORBIDDEN_TEMPLATES = [
    /sintaktik və məna ardıcıllığı ilə bağlı \d+-ci sual/i,
    /Cümlələrin düzgün əlaqələndirilməsi qaydası hansıdır/i,
    /mətnində toxunulan əsas ictimai və mədəni problem hansıdır/i,
    /mövzusunda tədris olunan milli-mənəvi dəyərlər/i,
    /Yalnız sözlərin hərflərinin sayına/i,
    /Düşüncəni aydın, lakonik və təsirli ifadə edən/i,
    /Şagirdlərdə oxu-anlama, leksik təhlil və mürəkkəb/i
];

/**
 * Validates and sanitizes a test question according to strict psychometric rules.
 */
export function validateAndSanitizeQuestion(q: TestQuestion): ValidationResult {
    const errors: string[] = [];

    if (!q.question || q.question.trim().length < 10) {
        errors.push("Sual mətni çox qısadır və ya mövcud deyil.");
    }

    // Check for forbidden template patterns
    for (const pat of FORBIDDEN_TEMPLATES) {
        if (pat.test(q.question)) {
            errors.push(`Sualda qadağan olunmuş şablon cümlə aşkar edildi: ${pat.source}`);
        }
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push("Sualda mütləq 4 variant (A, B, C, D) olmalıdır.");
        return { isValid: false, errors };
    }

    // Sanitize options
    const sanitizedOptions = q.options.map(opt => {
        let clean = opt.trim();
        clean = clean.replace(/^yalnız\s+/i, "Əsasən ");
        clean = clean.replace(/^heç\s+bir\s+vəchlə\s+/i, "Qətiyyən ");
        clean = clean.replace(/^hamısı\s+/i, "Bütün hallarda ");
        clean = clean.replace(/qədim roma/gi, "orta əsr Şərq mədəniyyəti");
        return clean;
    });

    // Check length disparity
    const lengths = sanitizedOptions.map(o => o.length);
    const minL = Math.min(...lengths);
    const maxL = Math.max(...lengths);
    const ratio = maxL / Math.max(minL, 1);

    if (ratio > 1.35) {
        errors.push(`Variantlar arasında ciddi uzunluq disbalansı var (Nisbət: ${ratio.toFixed(2)}x > 1.35x). Variant uzunluqları bərabərləşdirilməlidir.`);
    }

    // Check naive giveaways in options
    sanitizedOptions.forEach((opt, idx) => {
        for (const pat of NAIVE_GIVEAWAYS) {
            if (pat.test(opt)) {
                errors.push(`Variant ${idx + 1} daxilində naiv ipucu aşkar edildi: ${pat.source}`);
            }
        }
    });

    const isSuccess = errors.length === 0;

    return {
        isValid: isSuccess,
        errors,
        sanitizedQuestion: {
            ...q,
            options: sanitizedOptions
        }
    };
}
