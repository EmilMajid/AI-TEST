import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Mapping of directory names to display names
const SUBJECT_MAPPING: Record<string, string> = {
    "azerbaycan-dili": "Azərbaycan dili",
    "azerbaycan-tarixi": "Azərbaycan tarixi",
    "biologiya": "Biologiya",
    "cografiya": "Coğrafiya",
    "edebiyyat": "Ədəbiyyat",
    "fizika": "Fizika",
    "informatika": "İnformatika",
    "kimya": "Kimya",
    "riyaziyyat": "Riyaziyyat",
    "texnologiya": "Texnologiya",
    "umumi-tarix": "Ümumi tarix",
    "musiqi": "Musiqi",
    "ortaq-turk-tarixi": "Ortaq türk tarixi",
    // Foreign Languages
    "ingilis-dili": "İngilis dili",
    "alman-dili-esas": "Alman dili",
    "alman-dili-ikinci": "Alman dili",
    "fransiz-dili-esas": "Fransız dili",
    "fransiz-dili-ikinci": "Fransız dili",
    "rus-dili-esas": "Rus dili",
    "rus-dili-ikinci": "Rus dili",
    // Grade 5 specific
    "azerbaycan-dili-hisse-1": "Azərbaycan dili (Hissə 1)",
    "azerbaycan-dili-hisse-2": "Azərbaycan dili (Hissə 2)",
    "riyaziyyat-hisse-1": "Riyaziyyat (Hissə 1)",
    "riyaziyyat-hisse-2": "Riyaziyyat (Hissə 2)",
    "tebiet-hisse-1": "Təbiət (Hissə 1)",
    "tebiet-hisse-2": "Təbiət (Hissə 2)"
}

interface Topic {
    title: string;
    page: number;
    endPage?: number;
    path: string;
}

interface TopicGroup {
    chapter: string;
    topics: Topic[];
}

// Load extracted topics from JSON file (for textbooks with empty TOC files)
let extractedTopicsCache: Record<string, TopicGroup[]> | null = null;

function loadExtractedTopics(): Record<string, TopicGroup[]> {
    if (extractedTopicsCache) return extractedTopicsCache;

    try {
        const mergedTopics: Record<string, TopicGroup[]> = {};

        // 1. Load auto-extracted topics
        const extractedPath = path.join(process.cwd(), "scripts", "extracted-topics.json");
        if (fs.existsSync(extractedPath)) {
            const content = fs.readFileSync(extractedPath, "utf-8");
            Object.assign(mergedTopics, JSON.parse(content));
        }

        // 2. Load manual topics (Overrides)
        const manualPath = path.join(process.cwd(), "scripts", "manual-topics.json");
        if (fs.existsSync(manualPath)) {
            const content = fs.readFileSync(manualPath, "utf-8");
            const manualTopics = JSON.parse(content);
            Object.assign(mergedTopics, manualTopics);
        }

        extractedTopicsCache = mergedTopics;
        return extractedTopicsCache!;
    } catch (error) {
        console.error("[Topics API] Error loading topics:", error);
    }

    return {};
}

function extractTopicsFromTOC(tocPath: string): TopicGroup[] {
    try {
        const content = fs.readFileSync(tocPath, "utf-8")
        const groups: TopicGroup[] = []
        let currentGroup: TopicGroup | null = null

        // 1. Try Anchor Tags (Common in HTML TOCs)
        const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi
        let match
        let foundAny = false

        while ((match = linkPattern.exec(content)) !== null) {
            foundAny = true
            const href = match[1]
            let text = match[2].trim()
            processMatch(href, text)
        }

        // 2. If no anchors found, Try NavPoints (Common in NCX/EPUB TOCs)
        if (!foundAny) {
            // Regex to capture navLabel text and content src
            // Simple robust regex for <navPoint ...> ... <text>Title</text> ... <content src="File.xhtml"/>
            const navPointPattern = /<navPoint[^>]*>[\s\S]*?<text>([^<]+)<\/text>[\s\S]*?<content src="([^"]+)"/gi
            while ((match = navPointPattern.exec(content)) !== null) {
                const text = match[1].trim()
                const href = match[2]
                processMatch(href, text)
            }
        }

        function processMatch(href: string, text: string) {
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
            const isChapter = /BÖLMƏ|FƏSİL|UNIT|CHAPTER|HİSSƏ/i.test(text)
            const isLongEnough = text.length > 3

            if (isChapter && isLongEnough) {
                // This is a chapter header - create new group
                if (currentGroup && currentGroup.topics.length > 0) {
                    groups.push(currentGroup)
                }
                currentGroup = {
                    chapter: text.replace(/\s+/g, " ").trim(),
                    topics: []
                }
            } else if (page > 0 && isLongEnough && !href.includes("cover") && !href.includes("info")) {
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

        // Push the last group
        if (currentGroup && currentGroup.topics.length > 0) {
            groups.push(currentGroup)
        }

        // Calculate end pages for all topics
        for (const group of groups) {
            for (let i = 0; i < group.topics.length; i++) {
                if (i < group.topics.length - 1) {
                    group.topics[i].endPage = group.topics[i + 1].page - 1
                } else {
                    group.topics[i].endPage = group.topics[i].page + 10
                }
            }
        }

        return groups
    } catch (error) {
        console.error(`Error reading TOC from ${tocPath}:`, error)
        return []
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const classLevel = searchParams.get("class") || "8"
        console.log(`[Topics API] Request for class: ${classLevel}`)

        // Path to textbooks for this class
        const textbooksPath = path.join(process.cwd(), "public", "textbooks", classLevel)
        console.log(`[Topics API] Textbooks path: ${textbooksPath}`)

        // Check if directory exists
        if (!fs.existsSync(textbooksPath)) {
            console.error(`[Topics API] Directory not found: ${textbooksPath}`)
            return NextResponse.json(
                { error: `Bu sinif üçün dərsliklər tapılmadı: ${classLevel}` },
                { status: 404 }
            )
        }

        const topics: Record<string, TopicGroup[]> = {}

        // Read all textbook directories
        const subjects = fs.readdirSync(textbooksPath)
        console.log(`[Topics API] Found ${subjects.length} subjects`)

        for (const subjectDir of subjects) {
            const subjectPath = path.join(textbooksPath, subjectDir)

            // Skip if not a directory
            if (!fs.statSync(subjectPath).isDirectory()) continue

            // Get the display name
            const displayName = SUBJECT_MAPPING[subjectDir] || subjectDir
            console.log(`[Topics API] Processing subject: ${displayName} (${subjectDir})`)

            // Path to toc.xhtml
            const tocPath = path.join(subjectPath, "OEBPS", "toc.xhtml")

            if (fs.existsSync(tocPath)) {
                const extractedGroups = extractTopicsFromTOC(tocPath)

                if (extractedGroups.length > 0) {
                    topics[displayName] = extractedGroups
                    const totalTopics = extractedGroups.reduce((sum, g) => sum + g.topics.length, 0)
                    console.log(`✓ ${displayName}: ${extractedGroups.length} chapters, ${totalTopics} topics`)
                } else {
                    // TOC file exists but is empty - try extracted topics
                    const extractedTopics = loadExtractedTopics();
                    if (extractedTopics[subjectDir]) {
                        topics[displayName] = extractedTopics[subjectDir];
                        const totalTopics = extractedTopics[subjectDir].reduce((sum, g) => sum + g.topics.length, 0);
                        console.log(`✓ ${displayName}: ${extractedTopics[subjectDir].length} chapters, ${totalTopics} topics (from extracted)`);
                    } else {
                        console.log(`⚠ ${displayName}: No topics found in TOC or extracted data`);
                    }
                }
            } else {
                console.log(`✗ ${displayName}: toc.xhtml not found at ${tocPath}`)
            }
        }

        console.log(`[Topics API] Total subjects with topics: ${Object.keys(topics).length}`)
        return NextResponse.json({ success: true, class: classLevel, topics })
    } catch (error: any) {
        console.error("[Topics API] Error:", error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
