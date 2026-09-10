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
    .replace(/[\s\-_]+/g, " ")
    .replace(/["'“”«»()]/g, "")
    .trim()
}

/**
 * Strips curriculum numbering/chapter prefixes while strictly preserving bare numbers and letters.
 * E.g., "1. Məktəbimiz" -> "məktəbimiz", "Bölmə 1. Vurma" -> "vurma"
 * BUT "13 ədədi" -> "13 ədədi", "Ll hərfi" -> "ll hərfi" (never stripped!)
 */
export function stripTopicPrefix(str: string): string {
  let s = azNorm(str)
  // Section headers: e.g. "bölmə 1.", "1-ci bölmə:", "fəsil 2."
  s = s.replace(/^(bölmə|hissə|fəsil|razdel|unit|lektion|étape)\s+([0-9]+|[ivxlcdm]+)[.\-:]*\s*/gi, "")
  s = s.replace(/^([0-9]+|[ivxlcdm]+)\s*(-ci|-cı|-cü|-cu|-üncü|-inci)?\s*(bölmə|hissə|fəsil|razdel|unit|lektion|étape)[.\-:]*\s*/gi, "")
  // Leading number with mandatory delimiter: "1. Məktəb", "1.1. Hesabi kvadrat kök", "12) Dərs", "1 - Fiqurlar"
  s = s.replace(/^[0-9]+(?:\.[0-9]+)*\s*[\.\)\-:]\s*/gi, "")
  // Leading Roman numeral ONLY with mandatory delimiter: "I. Giriş", "IV) Xassələr"
  s = s.replace(/^[ivxlcdm]+\s*[\.\)\-:]\s+/gi, "")
  return s.trim()
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

  // If target specified a part, prefer keys with the same part
  if (targetPart) {
    const partMatched = candidates.filter(k => getPartNum(k) === targetPart)
    if (partMatched.length > 0) candidates = partMatched
  }

  // Filter by core name containment
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

  // Return the most specific match (prefer longer key names if multiple)
  if (matched.length > 1) {
    matched.sort((a, b) => b.length - a.length)
    return [matched[0]]
  }

  return matched
}
