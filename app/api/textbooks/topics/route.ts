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
    "ingilis-dili": "İngilis dili",
    "kimya": "Kimya",
    "riyaziyyat": "Riyaziyyat",
    "texnologiya": "Texnologiya",
    "umumi-tarix": "Ümumi tarix",
}

function extractTopicsFromTOC(tocPath: string): string[] {
    try {
        const content = fs.readFileSync(tocPath, "utf-8")
        const topics: string[] = []

        // Since HTML can be minified, use global regex
        // Pattern to match Roman numerals (I, II, III, etc.) chapters
        const romanPattern = />([IVX]+\.?\s+(?:BÖLMƏ\s+)?[^<]{15,}?)</g
        let match

        while ((match = romanPattern.exec(content)) !== null) {
            let topic = match[1].trim()

            // Clean up the topic
            topic = topic.replace(/^[IVX]+\.?\s+/, "") // Remove Roman numerals
            topic = topic.replace(/BÖLMƏ\s+/gi, "") // Remove "BÖLMƏ" word
            topic = topic.trim()

            // Only add if it's a meaningful topic (longer than 15 chars)
            if (topic.length > 15 && !topics.includes(topic)) {
                // Decode HTML entities if any
                topic = topic.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                topics.push(topic)
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

        const topics: Record<string, string[]> = {}

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
                    console.log(`⚠ ${displayName}: No topics found, using fallback`)
                    // Fallback to a generic topic
                    topics[displayName] = [`${displayName} - Ümumi`]
                }
            } else {
                console.log(`✗ ${displayName}: toc.xhtml not found at ${tocPath}`)
                // Fallback
                topics[displayName] = [`${displayName} - Ümumi`]
            }
        }

        return NextResponse.json({
            success: true,
            class: classLevel,
            topics,
        })
    } catch (error) {
        console.error("Error extracting topics:", error)
        return NextResponse.json(
            { error: "Mövzular yüklənərkən xəta baş verdi" },
            { status: 500 }
        )
    }
}
