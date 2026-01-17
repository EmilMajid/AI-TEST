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
    "rus-dili-esas": "Rus dili (əsas)",
    "rus-dili-ikinci": "Rus dili (ikinci)",
    "alman-dili": "Alman dili (əsas)",
    "alman-dili-2": "Alman dili (ikinci)",
    "rus-dili": "Rus dili (əsas)",
    "rus-dili-2": "Rus dili (ikinci)",
    "fransiz-dili": "Fransız dili (əsas)",
    "fransiz-dili-2": "Fransız dili (ikinci)",
    // Grade 5 specific
    "azerbaycan-dili-hisse-1": "Azərbaycan dili",
    "azerbaycan-dili-hisse-2": "Azərbaycan dili",
    "riyaziyyat-hisse-1": "Riyaziyyat",
    "riyaziyyat-hisse-2": "Riyaziyyat",
    "tebiet-hisse-1": "Təbiət",
    "tebiet-hisse-2": "Təbiət",
    "ingilis-dili-5": "İngilis dili",
    "alman-dili-5": "Alman dili",
    "alman-dili-5-asas": "Alman dili",
    "fransiz-dili-5": "Fransız dili",
    "fransiz-dili-5-ikinci": "Fransız dili",
    "rus-dili-5": "Rus dili",
    "rus-dili-2-5": "Rus dili",
    "musiqi-5": "Musiqi",
    "texnologiya-5": "Texnologiya",
    "fiziki-terbiye-5": "Fiziki tərbiyə",
    "tesviri-incesenet-5": "Təsviri İncəsənət",
    "tesviri-incesenet": "Təsviri İncəsənət",
    "fiziki-terbiye": "Fiziki tərbiyə",
    "hayat-bilgisi": "Həyat bilgisi",
    "hayat-bilgisi-5": "Həyat bilgisi",
    "tebiet": "Təbiət",
    "tebiet-5": "Təbiət",
    "cografiya-hisse-1": "Coğrafiya",
    "cografiya-hisse-2": "Coğrafiya"
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
            currentGroup = processMatch(href, text, currentGroup)
        }

        // 2. If no anchors found, Try NavPoints (Common in NCX/EPUB TOCs)
        if (!foundAny) {
            // Regex to capture navLabel text and content src
            // Simple robust regex for <navPoint ...> ... <text>Title</text> ... <content src="File.xhtml"/>
            const navPointPattern = /<navPoint[^>]*>[\s\S]*?<text>([^<]+)<\/text>[\s\S]*?<content src="([^"]+)"/gi
            while ((match = navPointPattern.exec(content)) !== null) {
                const text = match[1].trim()
                const href = match[2]
                currentGroup = processMatch(href, text, currentGroup)
            }
        }

        function processMatch(href: string, text: string, grp: TopicGroup | null): TopicGroup | null {
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
            // Expanded regex to handle encoding issues (e.g., 'Blmt' for 'Bölmə') and Roman numerals
            const isChapter = /BÖLMƏ|FƏSİL|UNIT|CHAPTER|HİSSƏ/i.test(text) ||
                /B[^\w\s]lm[^\w\s]|B.lm./i.test(text) ||
                /F[^\w\s]sil/i.test(text);

            const isRoman = /^[IVX]+\.?\s+/i.test(text);
            const isLongEnough = text.length > 3;

            if ((isChapter || (isRoman && isLongEnough)) && isLongEnough) {
                // This is a chapter header - create new group
                if (grp && grp.topics.length > 0) {
                    groups.push(grp)
                }
                grp = {
                    chapter: text.replace(/\s+/g, " ").trim(),
                    topics: []
                }
            } else if (page > 0 && isLongEnough && !href.includes("cover") && !href.includes("info")) {
                // Ignore plain numbers if text is just digits or "page X"
                if (/^\d+$/.test(text) || /^\d+\.\s*$/.test(text)) return grp;
                // This is a topic - create default group if needed
                if (!grp) {
                    grp = {
                        chapter: "Mövzular",
                        topics: []
                    }
                }

                text = text.replace(/\s+/g, " ").trim()

                // Avoid duplicates
                if (!grp.topics.find(t => t.title === text)) {
                    grp.topics.push({
                        title: text,
                        page: page,
                        path: href
                    })
                }
            }
            return grp
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
        const targetSubject = searchParams.get("subject") // Optional: e.g., "Xarici dil" or "İkinci xarici dil"
        console.log(`[Topics API] Request for class: ${classLevel}, subject: ${targetSubject || 'any'}`)

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
        // Actually, we should iterate based on textbooks.json metadata to get the correct mapping and topics
        const textbooksDataPath = path.join(process.cwd(), "data", "textbooks.json");
        let textbooksMetadata: any[] = [];
        if (fs.existsSync(textbooksDataPath)) {
            const allData = JSON.parse(fs.readFileSync(textbooksDataPath, 'utf8'));
            textbooksMetadata = allData[classLevel] || [];
        }

        // Helper to parse manual topic string with hierarchy support
        const parseManualTopics = (topicData: string | string[]): TopicGroup[] => {
            if (!topicData || topicData === 'Mövzular') return [];

            const topicString = Array.isArray(topicData) ? topicData.join('\n') : topicData;
            if (topicString.length < 5) return [];

            const lines = topicString.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const groups: TopicGroup[] = [];
            let currentGroup: TopicGroup | null = null;

            // Regex for headers (Units/Lektions)
            // Added accented characters (e.g. Разде́л) and more keywords
            const headerRegex = /^(Lektion|Unit|Étape|Разде́л|Раздел|Section|Chapter|Projektarbeit|Das kannst du jetzt|Training|Grammatik|Lernwortschatz|Ответы|Словарь|Je révise|Ma lecture|Mes actes|Training|Wortliste|Mövzular)/i;

            for (const line of lines) {
                // Determine if this line is a header
                // Note: We also consider the first line a header if no group exists
                const isHeader = headerRegex.test(line);

                if (isHeader || !currentGroup) {
                    currentGroup = {
                        chapter: line,
                        topics: []
                    };
                    groups.push(currentGroup);
                } else {
                    currentGroup.topics.push({
                        title: line,
                        page: currentGroup.topics.length + 1,
                        path: ""
                    });
                }
            }

            // Fallback: If no topics were added to groups (e.g. all lines were headers), 
            // convert those groups to topics under a generic "Mövzular" group
            if (groups.every(g => g.topics.length === 0)) {
                return [{
                    chapter: "Mövzular",
                    topics: groups.map((g, idx) => ({
                        title: g.chapter,
                        page: idx + 1,
                        path: ""
                    }))
                }];
            }

            return groups.filter(g => g.topics.length > 0 || headerRegex.test(g.chapter));
        };

        const subjects = fs.readdirSync(textbooksPath)
        console.log(`[Topics API] Found ${subjects.length} subjects directory`)

        // Create a map to cache metadata by ID or Path
        const metadataMap = new Map();
        textbooksMetadata.forEach(book => {
            // Normalized ID or directory matching
            // book.contentPath is like "public/textbooks/5/azerbaycan-dili-hisse-1"
            const dirName = path.basename(book.contentPath || "");
            if (dirName) metadataMap.set(dirName, book);
        });

        for (const subjectDir of subjects) {
            const subjectPath = path.join(textbooksPath, subjectDir)

            // Skip if not a directory
            if (!fs.statSync(subjectPath).isDirectory()) continue

            // Get the display name
            let displayName = SUBJECT_MAPPING[subjectDir] || subjectDir;

            // Normalize Display Name: remove "(Hissə X)" to merge them
            const simplifiedName = displayName.replace(/\s*\(Hissə \d+\)/i, "").trim();
            displayName = simplifiedName;

            // Get metadata for this directory
            const bookMetadata = metadataMap.get(subjectDir);

            // FILTER: Flexible matching for subjects
            const metadataSubject = bookMetadata?.subject || "";
            const matchesSubject = !targetSubject || (
                metadataSubject === targetSubject ||
                metadataSubject.includes(targetSubject) ||
                targetSubject.includes(metadataSubject) ||
                displayName === targetSubject ||
                (targetSubject === "Xarici dil" && displayName.includes("dili") && !displayName.includes("Azərbaycan")) ||
                (targetSubject.includes("dil") && metadataSubject.includes("dil")) // Help match "Alman dili" vs "Xarici dil"
            );

            if (!matchesSubject) {
                console.log(`[Topics API] Skipping ${subjectDir} (Metadata: ${metadataSubject}, Display: ${displayName}) as it doesn't match ${targetSubject}`);
                continue;
            }

            let strategies = [
                // Strategy 0: Try manual/extracted topics (Priority for high-quality manual data)
                () => {
                    const extractedTopics = loadExtractedTopics();

                    // HIGHER PRIORITY: Try with class suffix first (to avoid mapping Grade 8 topics to Grade 6)
                    const classKey = `${subjectDir}-${classLevel}`;
                    if (extractedTopics[classKey] && extractedTopics[classKey].length > 0) return extractedTopics[classKey];

                    // Fallback for multi-part books (e.g., tebiet-hisse-1 -> tebiet-6-h1)
                    if (subjectDir.includes('hisse-')) {
                        const hissMatch = subjectDir.match(/(.*)-hisse-(\d+)/);
                        if (hissMatch) {
                            const mappedKey = `${hissMatch[1]}-${classLevel}-h${hissMatch[2]}`;
                            if (extractedTopics[mappedKey] && extractedTopics[mappedKey].length > 0) return extractedTopics[mappedKey];
                        }
                    }

                    // LOWER PRIORITY: Try exact match (ONLY if we are in Grade 8, as generic keys usually target Grade 8)
                    if (classLevel === "8" && extractedTopics[subjectDir] && extractedTopics[subjectDir].length > 0) {
                        return extractedTopics[subjectDir];
                    }

                    return [];
                },
                // Strategy 1: Check textbooks.json "topics" field (Priority for Manual Entries)
                () => {
                    if (bookMetadata && bookMetadata.topics && bookMetadata.topics !== "Mövzular") {
                        // If it's an array, it's valid if it has items
                        if (Array.isArray(bookMetadata.topics) && bookMetadata.topics.length > 0) {
                            // Check if first item looks like garbage (Strategy 1 fallback should be weak if it looks like strategy 2 output)
                            const firstTopic = typeof bookMetadata.topics[0] === 'string' ? bookMetadata.topics[0] : "";
                            if (firstTopic.includes('§') || firstTopic.includes('°')) return [];

                            return parseManualTopics(bookMetadata.topics);
                        }
                        // If it's a string, it should be long enough to be real topics
                        if (typeof bookMetadata.topics === 'string' && bookMetadata.topics.length > 30) {
                            if (bookMetadata.topics.includes('§') || bookMetadata.topics.includes('°')) return [];
                            return parseManualTopics(bookMetadata.topics);
                        }
                    }
                    return [];
                },
                // Strategy 2: Try reading toc.xhtml (OEBPS/toc.xhtml or toc.xhtml)
                () => {
                    let tPath = path.join(subjectPath, "OEBPS", "toc.xhtml")
                    if (!fs.existsSync(tPath)) tPath = path.join(subjectPath, "toc.xhtml") // Try root as fallback

                    if (fs.existsSync(tPath)) {
                        return extractTopicsFromTOC(tPath);
                    }
                    return [];
                }
            ];

            let foundTopics: TopicGroup[] = [];

            for (const strategy of strategies) {
                foundTopics = strategy();
                if (foundTopics.length > 0) break;
            }

            if (foundTopics.length > 0) {
                // Merge logic: If key exists, append topics
                if (topics[displayName]) {
                    // We merge topics. 
                    // Ideally we should merge chapters.
                    // But strictly appending groups is easiest.
                    topics[displayName] = [...topics[displayName], ...foundTopics];
                } else {
                    topics[displayName] = foundTopics;
                }

                const totalTopics = foundTopics.reduce((sum, g) => sum + g.topics.length, 0);
                console.log(`✓ ${displayName}: ${foundTopics.length} chapters, ${totalTopics} topics`);
            } else {
                console.log(`⚠ ${displayName}: No topics found (checked TOC and manual records)`);
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
