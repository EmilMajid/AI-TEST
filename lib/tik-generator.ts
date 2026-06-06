// Test İdentifikasiya Kodu (TİK) Utility

export const TIK_SUBJECT_CODES: Record<string, string> = {
  "Azərbaycan dili": "001",
  "Ədəbiyyat": "002",
  "Azərbaycan tarixi": "003",
  "Riyaziyyat": "004",
  "İngilis dili (əsas xarici dil)": "005",
  "İngilis dili (ikinci xarici dil)": "006",
  "İngilis dili": "005", // Fallback
  "Təbiət": "007",
  "İnformatika": "008",
  "Ümumi tarix": "009",
  "Fizika": "010",
  "Kimya": "011",
  "Biologiya": "012",
  "Coğrafiya": "013",
  "Həyat bilgisi": "014",
  "Texnologiya": "015",
  "Təsviri İncəsənət": "016",
  "Təsviri incəsənət": "016", // fallback
  "Musiqi": "017",
  "Fiziki tərbiyə": "018",
  "Alman dili (əsas xarici dil)": "019",
  "Alman dili (ikinci xarici dil)": "020",
  "Alman dili": "019", // Fallback
  "Fransız dili (əsas xarici dil)": "021",
  "Fransız dili (ikinci xarici dil)": "022",
  "Fransız dili": "021", // Fallback
  "Rus dili (əsas xarici dil)": "023",
  "Rus dili (ikinci xarici dil)": "024",
  "Rus dili": "023", // Fallback
  "Русский язык": "023" // Fallback
};

export const TIK_BLOOM_CODES: Record<string, string> = {
  "xatırlama": "01",
  "bilmə": "01",
  "anlama": "02",
  "tətbiq": "03",
  "analiz": "04",
  "dəyərləndirmə": "05",
  "yaratma": "06"
};

export const TIK_DIFFICULTY_CODES: Record<string, string> = {
  "sadə": "01",
  "orta": "02",
  "çətin": "03"
};

export interface TIKParams {
  grade: number;                  // 1-11
  subject: string;                // Subject name
  edition: number;                // 1, 2 (Version of the book)
  part: number;                   // 1, 2 (Part of the book)
  topicCode: string;              // e.g. B1AM01
  bloomLevel: string;             // e.g. "anlama"
  difficulty: string;             // e.g. "orta"
  index: number;                  // 1, 2, 3...
}

/**
 * Generates a TİK (Test İdentifikasiya Kodu)
 * Format: [Grade]-[Subject]-[EditionPart]-[Topic]-[Bloom]-[Difficulty]-[Index]
 * Example: 07-004-0101-B1AM01-02-02-001
 */
export function generateTIK({
  grade,
  subject,
  edition,
  part,
  topicCode,
  bloomLevel,
  difficulty,
  index
}: TIKParams): string {
  const g = grade.toString().padStart(2, '0');
  const subjCode = TIK_SUBJECT_CODES[subject] || "999";
  const ep = edition.toString().padStart(2, '0') + part.toString().padStart(2, '0');
  const tc = topicCode.toUpperCase();
  const bloom = TIK_BLOOM_CODES[bloomLevel.toLowerCase()] || "00";
  const diff = TIK_DIFFICULTY_CODES[difficulty.toLowerCase()] || "00";
  const idx = index.toString().padStart(3, '0');

  return `${g}-${subjCode}-${ep}-${tc}-${bloom}-${diff}-${idx}`;
}

export function parseTIK(tik: string) {
  const parts = tik.split('-');
  if (parts.length !== 7) return null;

  return {
    grade: parseInt(parts[0], 10),
    subjectCode: parts[1],
    edition: parseInt(parts[2].substring(0, 2), 10),
    part: parseInt(parts[2].substring(2, 4), 10),
    topicCode: parts[3],
    bloomCode: parts[4],
    difficultyCode: parts[5],
    index: parseInt(parts[6], 10)
  };
}
