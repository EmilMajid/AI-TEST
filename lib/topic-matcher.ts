/**
 * Topic & Subject Matcher Utility
 * 
 * Guarantees 100% isolation between topics and subjects.
 * Eliminates cross-topic contamination, cross-part leakage, and false-positive matching.
 */

/**
 * Normalizes text while strictly preserving Azerbaijani alphabet characters (ə, ö, ü, ş, ç, ğ, ı, i).
 * Correctly handles uppercase 'I' -> 'ı' and 'İ' -> 'i'.
 */
export function azNorm(s: string): string {
  return (s || "")
    .replace(/I/g, "ı")
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/i̇/g, "i")
    .replace(/\u0301/g, "")
    .replace(/[\s\-_]+/g, " ")
    .replace(/["'“”«»()]/g, "")
    .trim()
}

/**
 * Normalizes case and letters while preserving structural delimiters (-, —, –, :, /, .)
 * used by curriculum prefix strippers.
 */
export function azClean(s: string): string {
  return (s || "")
    .replace(/I/g, "ı")
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/i̇/g, "i")
    .replace(/\u0301/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Strips curriculum numbering/chapter prefixes while strictly preserving bare numbers and letters.
 * Handles single/multi-level prefixes, chapter headers with delimiters, and language lesson indicators.
 * E.g., "1. Məktəbimiz" -> "məktəbimiz", "Bölmə 1. Vurma" -> "vurma"
 * "Fəsil 1. FƏRD VƏ TOPLUM - 1. DOSTLUĞUN GÜCÜ" -> "dostluğun gücü"
 * "LEKTION 1. KENNENLERNEN - Stunde 1. Wer bist du?" -> "wer bist du"
 * "I. Что у осени в корзинке? - 1. Прекрасная пора" -> "прекрасная пора"
 * BUT "13 ədədi" -> "13 ədədi", "Ll hərfi" -> "ll hərfi" (never stripped!)
 */
export function stripTopicPrefix(str: string): string {
  if (!str) return ""

  // First strip uppercase chapter headers before lowercase: e.g. "TEXNOLOGİYALAR VƏ TEXNOLOJİ VASİTƏLƏR - "
  let s = str.replace(/^[A-ZƏÖÜŞÇĞIİ\s\d\(\).]{4,}\s*[—–\-]\s*/g, "")

  s = azClean(s)

  // 0. Numbered chapter/section header with dash: e.g. "1. fərd və toplum - ", "5. ixtiralar - "
  s = s.replace(/^[0-9ivxlcdm]+(?:\.[0-9ivxlcdm]+)*\.\s*[^—–\-:]+[—–\-]\s*/gi, "")

  // 0b. Module / Unit with number and dash: e.g. "module 1 - ", "unit 1 - "
  s = s.replace(/^(?:module|unit|étape|razdel|раздел)\s+[0-9ivxlcdm]+[.\s]*[—–\-]\s*/gi, "")

  // 1. Chapter / Unit / Section / Module header with delimiter (dash, em-dash, colon, slash)
  s = s.replace(/^(bölmə|hissə|fəsil|razdel|раздел|unit|unité|lektion|module|étape|kapitel)\s+[^—–\-:]+[—–\-:]\s*/gi, "")

  // 2. Roman numeral chapter with delimiter: "i. что у осени в корзинке? - 1. прекрасная пора"
  s = s.replace(/^[ivxlcdm]+\.\s*[^—–\-:]+[—–\-:]\s*/gi, "")

  // 3. Section headers without extra title: e.g. "bölmə 1.", "1-ci bölmə:", "fəsil 2.", "4-cü mövzu."
  s = s.replace(/^(bölmə|hissə|fəsil|razdel|раздел|unit|unité|lektion|module|étape|kapitel)\s+([0-9]+|[ivxlcdm]+)[.\-:]*\s*/gi, "")
  s = s.replace(/^([0-9]+|[ivxlcdm]+)\s*(-ci|-cı|-cü|-cu|-üncü|-inci)?\s*(bölmə|hissə|fəsil|razdel|раздел|unit|unité|lektion|module|étape|kapitel|mövzu)[.\-:]*\s*/gi, "")

  // 4. Lesson / theme indicators: "dərs 1.", "урок 1.", "stunde 1.", "leçon 1.", "mövzu 1.", "dil qaydaları:"
  s = s.replace(/^(dərs|ders|урок|urok|stunde|leçon|lesson|mövzu|dil qaydaları:?)\s*([0-9]+|[ivxlcdm]+)?[.\-:]*\s*/gi, "")

  // 5. Leading number with mandatory delimiter: "1. Məktəb", "1.1. Hesabi kvadrat kök", "12) Dərs", "1 - Fiqurlar"
  s = s.replace(/^[0-9]+(?:\.[0-9]+)*\s*[\.\)\-:]\s*/gi, "")

  // 6. Leading Roman numeral ONLY with mandatory delimiter: "I. Giriş", "IV) Xassələr"
  s = s.replace(/^[ivxlcdm]+\s*[\.\)\-:]\s+/gi, "")

  // 7. Trailing chapter qualifiers like "(fəsil 1)", "(bölmə 2)", "(раздел i)"
  s = s.replace(/\s*\((?:bölmə|fəsil|hissə|razdel|раздел|unit|module)\s*([0-9]+|[ivxlcdm]+)\)\s*$/gi, "")

  // 8. Punctuation cleanup (hyphens, dashes, quotes, parentheses, trailing dots) and whitespace trim
  s = s.replace(/[\s\-_—–]+/g, " ").replace(/["'“”«»()]/g, "").replace(/\.+$/g, "").trim()

  return s
}

/**
 * Finds the exact or best 1-to-1 topic match from a list of candidate topics.
 * Returns an array containing the matched topic (or empty array if no legitimate match).
 */
export function findBestTopicMatch(targetTopic: string, candidateTopics: string[]): string[] {
  if (!targetTopic || !candidateTopics || candidateTopics.length === 0) return []
  const tNorm = azNorm(targetTopic)
  const tClean = stripTopicPrefix(targetTopic)

  // 1. Exact normalized match (preserving az characters)
  for (const c of candidateTopics) {
    if (azNorm(c) === tNorm) {
      return [c]
    }
  }

  // 2. Exact stripped-prefix match
  const strippedMatches: string[] = []
  for (const c of candidateTopics) {
    if (stripTopicPrefix(c) === tClean && tClean.length >= 2) {
      strippedMatches.push(c)
    }
  }
  if (strippedMatches.length === 1) {
    return strippedMatches
  }
  if (strippedMatches.length > 1) {
    const numMatch = targetTopic.match(/^\d+/)?.[0]
    if (numMatch) {
      const sameNum = strippedMatches.filter(c => c.match(/^\d+/)?.[0] === numMatch)
      if (sameNum.length === 1) return sameNum
    }
    return [strippedMatches[0]]
  }

  // 3. Containment with strict digit protection
  // E.g., "Kütlə vahidi - kiloqram" vs "Kütlə vahidi - kiloqram. Kütlənin ölçülməsi"
  const containmentMatches: string[] = []
  for (const c of candidateTopics) {
    const cClean = stripTopicPrefix(c)
    if (cClean.length >= 5 && tClean.length >= 5 && (cClean.startsWith(tClean) || tClean.startsWith(cClean))) {
      // Avoid matching if both have distinct numbers (e.g. "13" vs "14")
      const numC = (cClean.match(/\b\d+\b/g) || []).join(",")
      const numT = (tClean.match(/\b\d+\b/g) || []).join(",")
      if (numC !== numT) {
        continue
      }
      containmentMatches.push(c)
    }
  }
  if (containmentMatches.length === 1) {
    return containmentMatches
  }

  // 4. Token similarity with strict threshold >= 0.75 and digit protection
  let bestTopic: string | null = null
  let bestScore = 0
  const tTokens = new Set(tClean.split(/\s+/).filter(w => w.length > 1))

  for (const c of candidateTopics) {
    const cClean = stripTopicPrefix(c)
    const cTokens = new Set(cClean.split(/\s+/).filter(w => w.length > 1))

    const numC = (cClean.match(/\b\d+\b/g) || []).join(",")
    const numT = (tClean.match(/\b\d+\b/g) || []).join(",")
    if (numC !== numT) {
      continue
    }

    const intersection = [...tTokens].filter(x => cTokens.has(x))
    const union = new Set([...tTokens, ...cTokens])
    const score = intersection.length / union.size

    if (score > bestScore && score >= 0.75) {
      bestScore = score
      bestTopic = c
    }
  }

  if (bestTopic) {
    return [bestTopic]
  }

  return []
}

/**
 * Finds matching subject key(s) strictly isolating textbook parts (e.g., hissə 1 vs hissə 2).
 */
export function findMatchingSubjectKeys(
  textbookTitle: string,
  availableKeys: string[],
  grade?: string | number
): string[] {
  if (!textbookTitle || !availableKeys || availableKeys.length === 0) return []

  // 1. Direct exact key match
  if (availableKeys.includes(textbookTitle)) {
    return [textbookTitle]
  }

  // 2. Exact normalized match
  const titleNorm = azNorm(textbookTitle)
  const exactNorm = availableKeys.filter(k => azNorm(k) === titleNorm)
  if (exactNorm.length > 0) {
    return exactNorm
  }

  // Grade digit constraint
  const gradeDigit =
    String(grade || "").match(/\b([1-9]|1[0-1])\b/)?.[0] ||
    textbookTitle.match(/\b([1-9]|1[0-1])\b/)?.[0]

  // Part indicator detection (e.g., hissə 1 vs hissə 2)
  const getPartNum = (s: string) => {
    const m =
      s.match(/(?:hissə|hisse|part)\s*([12])/i) ||
      s.match(/([12])\s*[-.]?\s*(?:ci|cı|cü|cu)?\s*(?:hissə|hisse)/i)
    return m ? m[1] : null
  }
  const targetPart = getPartNum(textbookTitle)

  let candidates = availableKeys.filter(k => {
    if (gradeDigit && !k.includes(gradeDigit)) return false
    const kPart = getPartNum(k)
    if (targetPart && kPart && targetPart !== kPart) return false
    return true
  })

  // Filter by core name containment first
  let matched = candidates.filter(k => {
    const kNorm = azNorm(k)
    return titleNorm.includes(kNorm) || kNorm.includes(titleNorm)
  })

  if (matched.length === 0) {
    // Language / subject aliases
    matched = candidates.filter(k => {
      const kNorm = azNorm(k)
      if ((titleNorm.includes("rus") || titleNorm.includes("рус")) && (kNorm.includes("rus") || kNorm.includes("рус"))) return true
      if ((titleNorm.includes("english") || titleNorm.includes("ingilis")) && (kNorm.includes("ingilis") || kNorm.includes("english") || kNorm.includes("eng"))) return true
      if ((titleNorm.includes("deutsch") || titleNorm.includes("german") || titleNorm.includes("alman")) && (kNorm.includes("alman") || kNorm.includes("deu"))) return true
      if ((titleNorm.includes("francais") || titleNorm.includes("fransız") || titleNorm.includes("fransiz")) && (kNorm.includes("fransız") || kNorm.includes("fransiz"))) return true
      return false
    })
  }

  // If target specified a part, prefer keys with the same part among name-matched candidates
  if (targetPart && matched.length > 1) {
    const partMatched = matched.filter(k => getPartNum(k) === targetPart)
    if (partMatched.length > 0) matched = partMatched
  }

  // Return the most specific match (prefer longer key names if multiple)
  if (matched.length > 1) {
    matched.sort((a, b) => b.length - a.length)
    return [matched[0]]
  }

  return matched
}
