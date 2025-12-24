const fs = require('fs');
const path = require('path');

const TEXTBOOKS_FILE = path.join(process.cwd(), 'data', 'textbooks.json');

// Exact list from the user's requirements
const UNIFIED_SUBJECTS = [
    "Azərbaycan dili",
    "Ədəbiyyat",
    "Xarici dil",
    "İkinci xarici dil",
    "Riyaziyyat",
    "İnformatika",
    "Azərbaycan tarixi",
    "Ümumi tarix",
    "Fizika",
    "Kimya",
    "Biologiya",
    "Coğrafiya",
    "Təbiət",
    "Həyat bilgisi",
    "Texnologiya",
    "Təsviri incəsənət",
    "Musiqi",
    "Fiziki tərbiyə",
    "Çağırışaqədərki hazırlıq"
];

// Matrix of subjects per grade (Based on updated education-data.ts)
const SUBJECTS_BY_GRADE = {
    "5": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Təbiət", "Texnologiya", "Təsviri incəsənət", "Musiqi", "Fiziki tərbiyə"],
    "8": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Texnologiya", "Təsviri incəsənət", "Musiqi", "Fiziki tərbiyə"]
};

// Map legacy subject names to Unified names
const SUBJECT_MAPPING = {
    "Tarix": "Azərbaycan tarixi",
    "Gənclərin çağırışaqədərki hazırlığı": "Çağırışaqədərki hazırlıq",
    "İngilis dili": "Xarici dil"
};

function slugify(text) {
    return text.toLowerCase()
        .replace(/ə/g, 'e')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function normalize() {
    console.log("🔄 Starting Textbook Data Normalization...");
    
    let data = JSON.parse(fs.readFileSync(TEXTBOOKS_FILE, 'utf8'));
    let modified = false;

    // Process only existing grades in JSON + 5 and 8 if missing
    const gradesToProcess = new Set([...Object.keys(data), "5", "8"]);

    gradesToProcess.forEach(grade => {
        if (!data[grade]) data[grade] = [];
        
        const existingSubjects = new Set();
        
        // 1. Normalize existing books
        data[grade].forEach(book => {
            let originalSubject = book.subject;

            // Strip (Hissə X) from subject (but keep in title)
            // e.g. "Azərbaycan dili (Hissə 1)" -> "Azərbaycan dili"
            book.subject = book.subject.replace(/\s*\(Hissə\s*\d+\)/i, '').replace(/\s*\(hissə\s*\d+\)/i, '').trim();

            // Fix Subject Name mappings
            if (SUBJECT_MAPPING[book.subject]) {
                book.subject = SUBJECT_MAPPING[book.subject];
            }

            // Case-insensitive match against Unified List
            const unifiedMatch = UNIFIED_SUBJECTS.find(s => s.toLowerCase() === book.subject.toLowerCase());
            if (unifiedMatch) {
                if (book.subject !== unifiedMatch) {
                    // Fix casing (e.g. Təsviri İncəsənət -> Təsviri incəsənət)
                    book.subject = unifiedMatch; 
                }
            }

            // Special case for "Xarici dil" -> If title is "İngilis dili", subject is "Xarici dil"
             if (book.title.includes("İngilis dili") || book.subject === "İngilis dili") {
                 book.subject = "Xarici dil";
            }

            // Special case for "İkinci xarici dil" placeholders
            if (book.title.includes("Rus dili")) {
                book.subject = "İkinci xarici dil";
            }

            // Log changes
            if (originalSubject !== book.subject) {
                 console.log(`  📝 Normalized '${originalSubject}' -> '${book.subject}' for ${book.title}`);
                 modified = true;
            }

            // Verify against Unified List
            if (!UNIFIED_SUBJECTS.includes(book.subject)) {
                console.warn(`  ⚠️  Warning: Subject '${book.subject}' in '${book.title}' is not in Unified List!`);
            }
            
            existingSubjects.add(book.subject);

            // Ensure directory exists
            if (book.contentPath) {
                const fullPath = path.join(process.cwd(), book.contentPath);
                if (!fs.existsSync(fullPath)) {
                    console.log(`  📁 Creating missing directory: ${book.contentPath}`);
                    fs.mkdirSync(fullPath, { recursive: true });
                }
            }
        });

        // 2. Add Missing Subjects
        const requiredSubjects = SUBJECTS_BY_GRADE[grade] || [];
        requiredSubjects.forEach(reqSubject => {
            if (!existingSubjects.has(reqSubject)) {
                console.log(`  ➕ Adding missing subject: ${reqSubject} for Grade ${grade}`);
                
                let title = `${reqSubject} ${grade}`;
                let id = `${slugify(reqSubject)}-${grade}`;
                
                // Specific Titles
                if (reqSubject === "İkinci xarici dil" && grade === "5") {
                    title = "Rus dili 5";
                    id = "rus-dili-5";
                }
                
                const slug = slugify(reqSubject);
                const contentPath = `public/textbooks/${grade}/${slug}`;
                
                // Create Directory
                const fullPath = path.join(process.cwd(), contentPath);
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }

                data[grade].push({
                    id: id,
                    title: title,
                    subject: reqSubject,
                    type: "pdf", // Default placeholder type
                    path: `/textbooks/${grade}/${slug}/book.pdf`, // Placeholder
                    contentPath: contentPath,
                    topics: "Mövzular" // Placeholder
                });
                modified = true;
            }
        });
    });

    if (modified) {
        fs.writeFileSync(TEXTBOOKS_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log("✅ textbooks.json updated successfully!");
    } else {
        console.log("✨ No changes needed.");
    }
}

normalize();
