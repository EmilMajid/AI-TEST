export const dynamic = "force-dynamic"
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

const DEFAULT_SUBJECT_TOPICS: Record<string, string[]> = {
    "Azərbaycan dili": ["Fonetika və Orfoepiya", "Leksikologiya və Semantika", "Morfologiya və Nitq hissələri", "Sintaksis və Cümlə üzvləri", "Mətn üzərində iş və Üslubiyyat"],
    "Ədəbiyyat": ["Şifahi xalq ədəbiyyatı və Dastanlar", "Klassik Azərbaycan ədəbiyyatı", "Müasir Azərbaycan ədəbiyyatı", "Mətn təhlili və Ədəbiyyat nəzəriyyəsi"],
    "İnformatika": ["İnformasiya və İnformasiya prosesləri", "Kompüterin arxitekturası və Aparat təminatı", "Proqramlaşdırma əsasları (Python)", "Alqoritmlər və Say sistemləri", "Kompüter şəbəkələri və İT təhlükəsizlik"],
    "Kimya": ["Atomun quruluşu və Dövri qanun", "Kimyəvi rabitə və Maddənin tərkibi", "Kimyəvi reaksiyalar və Tarazlıq", "Məhlullar və Dissosiasiya", "Qeyri-üzvi birləşmələr və Üzvi kimyaya giriş"],
    "Fizika": ["Mexaniki hərəkət və Dinamika", "Molekulyar fizika və Termodinamika", "Elektrostatika və Sabit cərəyan", "Optika və Dalğa fizikası", "Kvant və Atom fizikası"],
    "Biologiya": ["Hüceyrənin quruluşu və Biokimya", "Canlıların müxtəlifliyi və Botanika", "İnsan anatomiyası və Fiziologiyası", "Genetika və Selektsiya", "Ekologiya və Biosfer"],
    "Coğrafiya": ["Kartoqrafiya və Coğrafi informasiya", "Litosfer və Yer qabığı processes", "Atmsofer, İqlim və Hidrosfer", "Dünyanın və Azərbaycanın Əhalisi", "İqtisadi və Sosial coğrafiya"],
    "Azərbaycan tarixi": ["Qədim dövr dövlətləri", "Orta əsrlər Azərbaycan dövlətləri", "Yeni dövr və Xanlıqlar mübarizəsi", "Azərbaycan Xalq Cümhuriyyəti və XX əsr", "Müasir Azərbaycan Respublikası və Zəfər tarixi"],
    "Ümumi tarix": ["Qədim Şərq və Qədim Dünya tarixi", "Orta əsrlər Avropa və Asiya", "Yeni dövr dünya diplomatiyası", "Ən yeni tarix və Beynəlxalq münasibətlər"],
    "Riyaziyyat": ["Ədədlər və cəbri ifadələr", "Tənliklər və Tənliklər sistemi", "Funksiyalar və Qrafiklər", "Həndəsə fiqurları və Sahələr", "Trigonometriya və Statistika"],
    "Xarici dil": ["Lexicon & Vocabulary", "Grammar & Syntax", "Reading Comprehension", "Writing & Expression"],
    "İngilis dili": ["UNIT 1. FREE TIME FUN", "UNIT 2. FOOD AROUND THE WORLD", "UNIT 3. NATURE", "UNIT 4. MANNERS AND RULES", "UNIT 5. A PLACE CALLED HOME", "UNIT 6. CHANGE-MAKERS"],
    "Alman dili": ["Wortschatz & Grammatik", "Leseverstehen", "Schreiben & Ausdruck"],
    "Fransız dili": ["Vocabulaire & Grammaire", "Compréhension écrite", "Expression écrite"],
    "Rus dili": ["Лексика и Грамматика", "Чтение и Понимание", "Письменная речь"],
    "Həyat bilgisi": ["Sağlam həyat tərzi və Təhlükəsizlik", "İnsan, Cəmiyyət və Mədəniyyət", "Mənəvi dəyərlər və Hüquqlarımız"],
    "Təbiət": ["Canlılar aləmi və Hüceyrə", "Maddə və Enerji çevrilmələri", "Yer kürəsi və Kainat"],
    "Texnologiya": ["Qrafika və Modelləşdirmə", "Materialların emalı texnologiyası", "Elektronika əsasları və Məişət"],
    "Təsviri İncəsənət": ["Rəsm texnikaları və Kompozisiya", "Rəngşünaslıq və Tətbiqi sənət", "Dünya İncəsənət tarixi"],
    "Musiqi": ["Musiqi nəzəriyyəsi və Not savadı", "Azərbaycan Xalq musiqisi və Muğam", "Klassik Bəstəkar yaradıcılığı"]
};

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

const MOCK_PATTERNS = [/mocked/i, /tam m[əe]tn/i, /d[əe]rslik\s?\(pdf\)/i];

function isMockContent(text: string): boolean {
    if (!text) return true;
    if (text === "Mövzular") return false; // Allowed as a generic group name
    return MOCK_PATTERNS.some(p => p.test(text));
}

function loadExtractedTopics(): Record<string, TopicGroup[]> {

    // Cache disabled temporarily to pick up new manual-topics
    // if (extractedTopicsCache) return extractedTopicsCache;

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

                // Avoid duplicates and mock content
                if (!isMockContent(text) && !grp.topics.find(t => t.title === text)) {
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

function getTopicsFromOfflineTests(bookId: string, bookSubject: string, classLevel: string): TopicGroup[] {
    try {
        const offlinePath = path.join(process.cwd(), "data", "offline_tests.json");
        if (!fs.existsSync(offlinePath)) return [];
        
        const db = JSON.parse(fs.readFileSync(offlinePath, "utf-8"));
        const norm = (s: string) => s.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").replace(/[\s\-_]+/g, " ").trim();
        
        const targetNorm = norm(bookSubject) + " " + classLevel;
        const bookIdNorm = norm(bookId);

        let matchedKey = Object.keys(db).find(k => norm(k) === bookIdNorm);
        if (!matchedKey) {
            const specificLang = ["fransiz", "fransız", "rus", "alman", "ingilis"].find(lang => 
                bookIdNorm.includes(lang) || norm(bookSubject).includes(lang)
            );
            if (specificLang) {
                matchedKey = Object.keys(db).find(k => {
                    const kn = norm(k);
                    return kn.includes(specificLang) && k.includes(classLevel);
                });
            }
        }
        if (!matchedKey) {
            matchedKey = Object.keys(db).find(k => norm(k) === targetNorm);
        }
        if (!matchedKey) {
            matchedKey = Object.keys(db).find(k => {
                const kNorm = norm(k);
                return (kNorm.includes(norm(bookSubject)) && k.includes(classLevel)) ||
                       (kNorm.includes(bookIdNorm.replace(/\-\d+$/, "")));
            });
        }

        if (!matchedKey) return [];

        const topicsSet = new Set<string>();
        const val = db[matchedKey];
        if (Array.isArray(val)) {
            val.forEach((item: any) => {
                const t = item.topic || item.topic_key;
                if (t && typeof t === "string" && t.trim().length > 0 && !isMockContent(t)) {
                    topicsSet.add(t.trim());
                }
            });
        } else if (typeof val === "object" && val !== null) {
            Object.keys(val).forEach((t: string) => {
                if (t && typeof t === "string" && t.trim().length > 0 && !isMockContent(t)) {
                    topicsSet.add(t.trim());
                }
            });
        }

        if (topicsSet.size === 0) return [];

        return [{
            chapter: "Mövzular",
            topics: Array.from(topicsSet).map((t, idx) => ({
                title: t,
                page: idx + 1,
                path: ""
            }))
        }];
    } catch (e) {
        console.error("[Topics API] Offline fallback error:", e);
        return [];
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const classLevel = searchParams.get("class") || "8"
        const targetSubject = searchParams.get("subject")
        const targetBookId = searchParams.get("bookId")
        console.log(`[Topics API] Request for class: ${classLevel}, subject: ${targetSubject || 'any'}, bookId: ${targetBookId || 'any'}`)

        const textbooksDataPath = path.join(process.cwd(), "data", "textbooks.json");
        if (!fs.existsSync(textbooksDataPath)) {
            return NextResponse.json({ error: "Textbooks metadata not found" }, { status: 404 });
        }

        const allData = JSON.parse(fs.readFileSync(textbooksDataPath, 'utf8'));
        const textbooksMetadata = allData[classLevel] || [];

        const extractedTopics = loadExtractedTopics();

        const parseManualTopics = (topicData: string | string[]): TopicGroup[] => {
            if (!topicData || topicData === 'Mövzular') return [];
            const topicString = Array.isArray(topicData) ? topicData.join('\n') : topicData;
            const lines = topicString.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const groups: TopicGroup[] = [];
            let currentGroup: TopicGroup | null = null;
            const headerRegex = /^([0-9IVXLCDM]+\s*[\.\-:]*\s*)?(Lektion|Unit|Étape|BÖLMƏ|FƏSİL|UNIT|HİSSƏ|PROQRAMI|Раздел|FƏSİL ÜZRƏ)/i;

            const hasSubtopics = lines.some(line => !headerRegex.test(line));

            for (const line of lines) {
                if (headerRegex.test(line) && hasSubtopics) {
                    currentGroup = { chapter: line, topics: [] };
                    groups.push(currentGroup);
                } else {
                    if (!currentGroup) {
                        currentGroup = { chapter: "Mövzular", topics: [] };
                        groups.push(currentGroup);
                    }
                    currentGroup.topics.push({ title: line, page: currentGroup.topics.length + 1, path: "" });
                }
            }
            return groups;
        };

        const results: Record<string, TopicGroup[]> = {};

        for (const book of textbooksMetadata) {
            const bookId = book.id;
            const bookSubject = book.subject || book.title;
            const dirName = book.contentPath ? path.basename(book.contentPath) : "";
            let bookDisplayName = (dirName && SUBJECT_MAPPING[dirName]) ? SUBJECT_MAPPING[dirName] : bookSubject;
            if (bookDisplayName === "Xarici dil" || bookDisplayName === "İkinci xarici dil") {
                bookDisplayName = book.title;
            }
            const normalizedDisplayName = bookDisplayName.replace(/\s*\(Hissə \d+\)/i, "").trim();

            const normSubj = (s: string) => s.toLowerCase().replace(/i̇/g, "i").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ə/g, "e").replace(/[\s\-_]+/g, " ").trim();
            const targetSubjectNorm = targetSubject ? normSubj(targetSubject) : "";
            const bookSubjectNorm = normSubj(bookSubject);
            const normalizedDisplayNameNorm = normSubj(normalizedDisplayName);

            // FILTER logic: support both bookId and subject with unicode normalization
            const matches = targetBookId
                ? bookId === targetBookId
                : (!targetSubject || (
                    bookSubjectNorm === targetSubjectNorm ||
                    normalizedDisplayNameNorm === targetSubjectNorm ||
                    normalizedDisplayNameNorm.includes(targetSubjectNorm) ||
                    targetSubjectNorm.includes(bookSubjectNorm) ||
                    (targetSubject === "Xarici dil" && normalizedDisplayName.toLowerCase().includes("dili") && !normalizedDisplayName.includes("Azərbaycan"))
                ));

            if (!matches) continue;


            let bookTopics: TopicGroup[] = [];
            if (extractedTopics[bookId] && extractedTopics[bookId].length > 0) {
                if (typeof extractedTopics[bookId][0] === "string") {
                    bookTopics = parseManualTopics(extractedTopics[bookId] as any);
                } else {
                    bookTopics = extractedTopics[bookId];
                }
            } else if (dirName) {
                const folderKey = `${dirName}-${classLevel}`;
                if (extractedTopics[folderKey]) {
                    if (typeof extractedTopics[folderKey][0] === "string") {
                        bookTopics = parseManualTopics(extractedTopics[folderKey] as any);
                    } else {
                        bookTopics = extractedTopics[folderKey];
                    }
                }
            }

            if (bookTopics.length === 0 && book.topics && book.topics !== "Mövzular") {
                bookTopics = parseManualTopics(book.topics);
            }

            if (bookTopics.length === 0 && book.contentPath) {
                const subjectPath = path.join(process.cwd(), book.contentPath);
                let tPath = path.join(subjectPath, "OEBPS", "toc.xhtml");
                if (!fs.existsSync(tPath)) tPath = path.join(subjectPath, "toc.xhtml");
                if (fs.existsSync(tPath)) bookTopics = extractTopicsFromTOC(tPath);
            }

            let cleanGroups = bookTopics
                .filter(g => !isMockContent(g.chapter))
                .map(g => ({ ...g, topics: g.topics.filter(t => !isMockContent(t.title)) }))
                .filter(g => g.topics.length > 0);

            if (cleanGroups.length === 0) {
                cleanGroups = getTopicsFromOfflineTests(bookId, normalizedDisplayName, classLevel);
            }

            if (cleanGroups.length === 0) {
                const defaultList = DEFAULT_SUBJECT_TOPICS[bookSubject] || DEFAULT_SUBJECT_TOPICS[normalizedDisplayName] || DEFAULT_SUBJECT_TOPICS["Azərbaycan dili"];
                cleanGroups = [{
                    chapter: "Mövzular",
                    topics: defaultList.map((t, idx) => ({ title: t, page: idx + 1, path: "" }))
                }];
            }

            if (cleanGroups.length > 0) {
                results[normalizedDisplayName] = results[normalizedDisplayName]
                    ? [...results[normalizedDisplayName], ...cleanGroups]
                    : cleanGroups;
            }
        }

        return NextResponse.json({ success: true, class: classLevel, topics: results })
    } catch (error: any) {
        console.error("[Topics API] Error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

