const fs = require('fs');
const path = require('path');

// Textbooks with empty TOC files that need topic extraction
const TEXTBOOKS_TO_PROCESS = [
    'informatika',
    'musiqi',
    'tesviri-incesenet',
    'hayat-bilgisi',
    'texnologiya',
    'ortaq-turk-tarixi',
    'azerbaycan-tarixi',
    'alman-dili-esas',
    'alman-dili-ikinci',
    'fransiz-dili-esas',
    'fransiz-dili-ikinci',
    'rus-dili-esas',
    'rus-dili-ikinci'
];

const CLASS_LEVEL = '8';
const BASE_PATH = path.join(process.cwd(), 'public', 'textbooks', CLASS_LEVEL);

/**
 * Fix encoding issues common in these files
 */
function fixEncoding(text) {
    return text
        .replace(/Ã¼/g, 'ü').replace(/Ãœ/g, 'Ü')
        .replace(/É™/g, 'ə').replace(/Æ/g, 'Ə')
        .replace(/Ã¶/g, 'ö').replace(/Ã–/g, 'Ö')
        .replace(/Ä±/g, 'ı').replace(/Ä°/g, 'İ')
        .replace(/ÄŸ/g, 'ğ').replace(/Ä/g, 'Ğ')
        .replace(/ÅŸ/g, 'ş').replace(/Å/g, 'Ş')
        .replace(/Ã§/g, 'ç').replace(/Ã‡/g, 'Ç')
        .replace(/â€“/g, '–').replace(/â€”/g, '—')
        .replace(/â€œ/g, '"').replace(/â€/g, '"');
}

/**
 * Extract topics from page files
 */
function extractTopicsFromPages(textbookDir) {
    const results = [];
    const files = findAllPageFiles(textbookDir);

    console.log(`Found ${files.length} page files in ${path.basename(textbookDir)}`);

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');

            const pageMatch = path.basename(file).match(/page(\d+)/i) || path.basename(file).match(/(\d+)/);
            const pageNum = pageMatch ? parseInt(pageMatch[1]) : 0;

            const topics = extractTopicTitles(content, file, pageNum);
            results.push(...topics);

        } catch (error) {
            console.error(`Error reading ${file}:`, error.message);
        }
    }

    return results;
}

function findAllPageFiles(dir) {
    const files = [];
    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (!item.includes('assets') && !item.includes('css') && !item.includes('js')) traverse(fullPath);
            } else if (stat.isFile()) {
                if ((item.endsWith('.xhtml') || item.endsWith('.html')) && (item.includes('page') || item.includes('unit'))) files.push(fullPath);
            }
        }
    }
    traverse(dir);
    return files.sort((a, b) => {
        // Sort numerically by page number if possible
        const pA = (path.basename(a).match(/(\d+)/) || [0, 0])[1];
        const pB = (path.basename(b).match(/(\d+)/) || [0, 0])[1];
        return parseInt(pA) - parseInt(pB);
    });
}

function extractTopicTitles(content, filepath, pageNum) {
    const topics = [];

    // Apply formatting fixes to content first
    const fixedContent = fixEncoding(content);

    const patterns = [
        /<h[123][^>]*>([^<]+)<\/h[123]>/gi,
        /<[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</gi,
        /<div[^>]*class="[^"]*topic_title[^"]*"[^>]*>([^<]+)<\/div>/gi,

        // Azerbaijan History specific
        /<div[^>]*class="[^"]*e-bold[^"]*fs25[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,

        // Informatik specific
        /<div[^>]*class="[^"]*d[eə]rs[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,

        // General strong/bold
        /<b>([^<]{10,100})<\/b>/gi,
        /<strong>([^<]{10,100})<\/strong>/gi
    ];

    const seenTitles = new Set();

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(fixedContent)) !== null) {
            let title = match[1].trim();

            title = title
                .replace(/<br\s*\/?>/gi, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (title.length < 5 || title.length > 200) continue;
            if (/^\d+$/.test(title)) continue;
            if (title.toLowerCase().includes('səhifə')) continue;
            if (title.toLowerCase().includes('copyright')) continue;
            if (title.includes("The Ministry of Education")) continue;

            if (seenTitles.has(title)) continue;

            if (isLikelyTopicTitle(title)) {
                topics.push({
                    title: title,
                    page: pageNum,
                    path: path.relative(path.join(BASE_PATH, path.basename(path.dirname(filepath))), filepath).replace(/\\/g, '/')
                });
                seenTitles.add(title);
            }
        }
    }

    return topics;
}

function isLikelyTopicTitle(text) {
    const hasAzerbaijaniChars = /[a-zA-ZəƏıİöÖüÜğĞşŞçÇ]/.test(text);
    if (!hasAzerbaijaniChars) return false;

    const wordCount = text.split(/\s+/).length;
    if (wordCount < 2 || wordCount > 20) return false;

    const uiTerms = ['kömək', 'bağla', 'növbəti', 'əvvəlki', 'menu', 'qeyd', 'yüklənir'];
    if (uiTerms.some(term => text.toLowerCase().includes(term))) return false;

    return true;
}

function groupTopicsIntoChapters(topics) {
    const groups = [];
    let currentGroup = null;

    for (const topic of topics) {
        const isChapter = /^(I{1,3}|IV|V|VI{0,3}|[1-9]\d?)\s*[.)]?\s*(BÖLMƏ|FƏSİL|UNIT)/i.test(topic.title);
        const isImplicitChapter = topic.title.includes("Azərbaycan") && topic.title.includes("əsr");

        if (isChapter || isImplicitChapter) {
            if (currentGroup && currentGroup.topics.length > 0) groups.push(currentGroup);
            currentGroup = { chapter: topic.title, topics: [] };
        } else if (currentGroup) {
            currentGroup.topics.push(topic);
        } else {
            if (!currentGroup) currentGroup = { chapter: 'Mövzular', topics: [] };
            currentGroup.topics.push(topic);
        }
    }

    if (currentGroup && currentGroup.topics.length > 0) groups.push(currentGroup);
    if (groups.length === 0 && topics.length > 0) groups.push({ chapter: 'Mövzular', topics: topics });

    return groups;
}

async function main() {
    console.log('Starting topic extraction with ENCODING FIXES...\n');
    const results = {};

    for (const textbook of TEXTBOOKS_TO_PROCESS) {
        const textbookPath = path.join(BASE_PATH, textbook);
        if (!fs.existsSync(textbookPath)) continue;

        console.log(`Processing: ${textbook}`);
        const topics = extractTopicsFromPages(textbookPath);
        const grouped = groupTopicsIntoChapters(topics);

        if (grouped.length > 0) {
            const totalTopics = grouped.reduce((sum, g) => sum + g.topics.length, 0);
            console.log(`✓ ${textbook}: ${totalTopics} topics`);
            results[textbook] = grouped;
        } else {
            console.log(`✗ ${textbook}: No topics found`);
        }
    }

    const outputPath = path.join(process.cwd(), 'scripts', 'extracted-topics.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nSaved to: ${outputPath}`);
}

main().catch(console.error);
