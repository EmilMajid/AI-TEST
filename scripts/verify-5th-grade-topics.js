
const fs = require('fs');
const path = require('path');

const TOC_PATH = path.join(process.cwd(), 'public', 'textbooks', '5', 'informatika', 'OEBPS', 'toc.xhtml');

function extractTopicsFromTOC(tocPath) {
    try {
        if (!fs.existsSync(tocPath)) {
            console.error('TOC file not found:', tocPath);
            return [];
        }
        const content = fs.readFileSync(tocPath, "utf-8")
        const groups = []
        let currentGroup = null

        // Extract text content from all anchor tags
        const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi
        let match

        while ((match = linkPattern.exec(content)) !== null) {
            const href = match[1]
            let text = match[2].trim()

            const pageMatch = href.match(/page(\d+)/i) || href.match(/(\d+)\.xhtml/)
            let page = 0
            if (pageMatch) {
                page = parseInt(pageMatch[1])
            }

            text = text
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")

            const isChapter = /BÖLMƏ|FƏSİL|UNIT|CHAPTER/i.test(text)
            const isLongEnough = text.length > 5

            if (isChapter && isLongEnough) {
                if (currentGroup && currentGroup.topics.length > 0) {
                    groups.push(currentGroup)
                }
                currentGroup = {
                    chapter: text.replace(/\s+/g, " ").trim(),
                    topics: []
                }
            } else if (page > 0 && isLongEnough && !href.includes("cover") && !href.includes("info")) {
                if (!currentGroup) {
                    currentGroup = {
                        chapter: "Mövzular",
                        topics: []
                    }
                }

                text = text.replace(/\s+/g, " ").trim()

                if (!currentGroup.topics.find(t => t.title === text)) {
                    currentGroup.topics.push({
                        title: text,
                        page: page,
                        path: href
                    })
                }
            }
        }

        if (currentGroup && currentGroup.topics.length > 0) {
            groups.push(currentGroup)
        }

        return groups
    } catch (error) {
        console.error(`Error reading TOC from ${tocPath}:`, error)
        return []
    }
}

const topics = extractTopicsFromTOC(TOC_PATH);
console.log(JSON.stringify(topics, null, 2));
console.log(`Found ${topics.reduce((acc, g) => acc + g.topics.length, 0)} topics in ${topics.length} groups.`);
