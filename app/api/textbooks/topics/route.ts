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
    "heyat-bilgisi": "Həyat bilgisi",
    "tesviri-inceseent": "Təsviri incəsənət",
    // Foreign Languages
    "ingilis-dili": "İngilis dili",
    "ingilis-dili-ikinci": "İngilis dili",
    "alman-dili-esas": "Alman dili",
    "alman-dili-ikinci": "Alman dili",
    "fransiz-dili-esas": "Fransız dili",
    "fransiz-dili-ikinci": "Fransız dili",
    "rus-dili-esas": "Rus dili",
    "rus-dili-ikinci": "Rus dili"
}

interface Topic {
    title: string;
    page: number;
    endPage?: number;
    path: string;
}

function extractTopicsFromTOC(tocPath: string): Topic[] {
    try {
        const content = fs.readFileSync(tocPath, "utf-8")
        const topics: Topic[] = []

        // Extract text content from all anchor tags
        // Matches <a href="...">Text Content</a>
        const linkPattern = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi
        let match

        while ((match = linkPattern.exec(content)) !== null) {
            const href = match[1]
            let text = match[2].trim()

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

            // Filter logic:
            const isRoman = /^[IVX]+\.?\s+/i.test(text)
            const isNumbered = /^\d+(\.\d+)*\.?\s+/.test(text)
            const hasKeyword = /BÖLMƏ|FƏSİL/i.test(text)
            const isLongEnough = text.length > 5

            if ((isRoman || isNumbered || hasKeyword) && isLongEnough) {
                text = text.replace(/\s+/g, " ").trim()

                if (!topics.find(t => t.title === text)) {
                    topics.push({
                        title: text,
                        page: page,
                        path: href
                    })
                }
            }
        }

        // Calculate end pages
        for (let i = 0; i < topics.length; i++) {
            if (i < topics.length - 1) {
                topics[i].endPage = topics[i + 1].page - 1
            } else {
                topics[i].endPage = topics[i].page + 10 // Default buffer
            }
        }

        return topics
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

        const topics: Record<string, Topic[]> = {}

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
                const extractedTopics = extractTopicsFromTOC(tocPath)

                if (extractedTopics.length > 0) {
                    topics[displayName] = extractedTopics
                    console.log(`✓ ${displayName}: ${extractedTopics.length} topics extracted`)
                } else {
                    console.log(`⚠ ${displayName}: No topics found`)
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
