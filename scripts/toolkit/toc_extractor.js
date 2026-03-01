/**
 * UIS Auto-TOC Extractor
 * Uses OCR to read TOC pages and LLM to structure them.
 * Fallback to regex heuristic if LLM is unavailable.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function extractTocText(pdfPath, pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    console.log(`Extracting TOC text from ${pdfPath}, pages: ${pages.join(',')}`);

    // Call ocr_master via CLI (Modularized to handle single files)
    const cmd = `node scripts/ocr_master.js "${pdfPath}" --pages ${pages.join(',')}`;
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error("OCR CLI Error:", e.message);
    }

    const bookId = path.basename(path.dirname(pdfPath));
    const resultFile = path.join(__dirname, `../../scripts/ocr_output/${bookId}.json`);

    if (fs.existsSync(resultFile)) {
        const data = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
        return data.map(p => p.text).join('\n\n');
    }
    return "";
}

async function structureTocWithLLM(rawText) {
    console.log("Structuring TOC...");

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no real API key
    if (!apiKey || apiKey.includes("placeholder")) {
        console.warn("⚠️ Valid GEMINI_API_KEY not found. Using enhanced regex heuristic for TOC.");
        const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        const extracted = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Pattern 1: Standard numbering 1.1., § 1. etc.
            // Pattern 2: BÖLMƏ 1, BÖLMƏ III, UNIT 2, MÖVZU 3
            const isTopic = /^(\d+\.)+/.test(line) || 
                /^(BÖLMƏ|BÖLÜM|UNIT|MÖVZU|CHAPTER|DƏRS|SECTION)\s+([IVX\d]+)/i.test(line) ||
                /^§\s*\d+/.test(line);

            if (isTopic) {
                let fullTitle = line;
                // Heuristic: If current line is just a number/header, join with next 2 lines if they look like text
                if (line.length < 10 && i < lines.length - 1) {
                    if (!/^(\d+\.)+/.test(lines[i + 1])) {
                        fullTitle += " " + lines[i + 1];
                        if (i < lines.length - 2 && lines[i + 2].length > 3 && !/^(\d+\.)+/.test(lines[i + 2])) {
                            fullTitle += " " + lines[i + 2];
                        }
                    }
                }

                // Clean noise
                const cleanTitle = fullTitle.replace(/\.*(\d+)$/, '') // Remove trailing page numbers
                    .replace(/\.{3,}/g, '')    // Remove dot leaders
                    .trim();

                if (cleanTitle.length > 5 && cleanTitle.length < 150) {
                    extracted.push(cleanTitle);
                }
            }
        }

        // Remove duplicates while preserving order
        return [...new Set(extracted)];
    }

    console.log("Using Gemini AI for structuring...");
    const prompt = `
Context: I have OCR'd Table of Contents from an Azerbaijani textbook. 
The text might be noisy or have character artifacts.
Task: Extract a clean, hierarchal list of topics (chapters and lessons).
Return only a JSON array of strings, where each string is a topic name.
Format example: ["1.1. Natural ədədlər", "1.2. Sadə ədədlər", ...]
Raw Text:
${rawText}
`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=" + apiKey;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const jsonMatch = output.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return output.split('\n').filter(l => l.trim().length > 5);
    } catch (e) {
        console.error("LLM Error:", e.message);
        // Fallback to regex on error
        return rawText.split('\n').filter(line => /^(\d+\.)+/.test(line.trim())).map(l => l.trim());
    }
}

module.exports = { extractTocText, structureTocWithLLM };
