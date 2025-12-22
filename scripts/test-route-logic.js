const fs = require('fs');
const path = require('path');

function extractTopicsFromTOC(tocPath) {
    try {
        const content = fs.readFileSync(tocPath, "utf-8")
        const groups = []
        let currentGroup = null

        // 1. Try Anchor Tags (Common in HTML TOCs)
        const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi
        let match
        let foundAny = false

        function processMatch(href, text) {
            // Extract page number from href
            const pageMatch = href.match(/page(\d+)/i) || href.match(/(\d+)\.xhtml/)
            let page = 0
            if (pageMatch) {
                page = parseInt(pageMatch[1])
            }

            // Decode HTML entities
            text = text
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")

            // Check if this is a chapter/section header
            const isChapter = /BÖLMƏ|FƏSİL|UNIT|CHAPTER|HİSSƏ/i.test(text) ||
                /B[^\w\s]lm[^\w\s]|B.lm./i.test(text) ||
                /F[^\w\s]sil/i.test(text); // Added fuzziness

            const isRoman = /^[IVX]+\.?\s+/i.test(text);
            const isLongEnough = text.length > 3;

            if ((isChapter || (isRoman && isLongEnough)) && isLongEnough) {
                // This is a chapter header - create new group
                if (currentGroup && currentGroup.topics.length > 0) {
                    groups.push(currentGroup)
                }
                currentGroup = {
                    chapter: text.replace(/\s+/g, " ").trim(),
                    topics: []
                }
            } else if (page > 0 && isLongEnough && !href.includes("cover") && !href.includes("info")) {
                // Ignore plain numbers if text is just digits or "page X"
                if (/^\d+$/.test(text) || /^\d+\.\s*$/.test(text)) return;

                // This is a topic - create default group if needed
                if (!currentGroup) {
                    currentGroup = {
                        chapter: "Mövzular",
                        topics: []
                    }
                }

                text = text.replace(/\s+/g, " ").trim()

                // Avoid duplicates
                if (!currentGroup.topics.find(t => t.title === text)) {
                    currentGroup.topics.push({
                        title: text,
                        page: page,
                        path: href
                    })
                }
            }
        }

        while ((match = linkPattern.exec(content)) !== null) {
            foundAny = true
            const href = match[1]
            let text = match[2].trim()
            processMatch(href, text)
        }

        // 2. If no anchors found, Try NavPoints
        if (!foundAny) {
            const navPointPattern = /<navPoint[^>]*>[\s\S]*?<text>([^<]+)<\/text>[\s\S]*?<content src="([^"]+)"/gi
            while ((match = navPointPattern.exec(content)) !== null) {
                const text = match[1].trim()
                const href = match[2]
                processMatch(href, text)
            }
        }

        // Push the last group
        if (currentGroup && currentGroup.topics.length > 0) {
            groups.push(currentGroup)
        }

        return groups
    } catch (error) {
        console.error(`Error reading TOC from ${tocPath}:`, error)
        return []
    }
}

const historyPath = path.join(process.cwd(), 'public', 'textbooks', '5', 'azerbaycan-tarixi', 'OEBPS', 'toc.xhtml');
const groups = extractTopicsFromTOC(historyPath);
console.log(JSON.stringify(groups, null, 2));
