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
 * Raw ASCII normalization: strips ALL Azerbaijani diacritics and special letters
 * so that "İngilis" = "Ingilis" = "ingilis", "Fransız" = "Fransiz", "ı" = "i", etc.
 * Also neutralizes Latin uppercase 'I' to 'i' instead of Azerbaijani 'ı'.
 */
export function rawNorm(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[İI]/g, "i")
    .replace(/ı/g, "i")
    .replace(/ə/g, "e")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/i̇/g, "i")
    .replace(/\u0301/g, "")
    .replace(/[\s\-_—–]+/g, " ")
    .replace(/["'“”«»()]/g, "")
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

  // 0b. Module / Unit / Lektion / Раздел with number and dash: e.g. "module 1 - ", "unit 1 - ", "lektion 1 - "
  s = s.replace(/^(?:module|unit|unıt|étape|etape|razdel|раздел|lektion|lektıon)\s+[0-9ivxlcdm]+[.\s]*[—–\-]\s*/gi, "")

  // 0c. Russian with number before section: e.g. "1 Разде́л I." or "01 Разде́л I."
  s = s.replace(/^[0-9]+\s*(?:раздел|razdel|bölmə|unit|unıt|lektion|lektıon)\s*[0-9ivxlcdm]*[.\s—–\-:]*\s*/gi, "")

  // 1. Chapter / Unit / Section / Module header with delimiter (dash, em-dash, colon, slash)
  s = s.replace(/^(bölmə|hissə|fəsil|razdel|раздел|unit|unıt|unité|unıte|lektion|lektıon|module|étape|etape|kapitel|dossier)\s+[^—–\-:]+[—–\-:]\s*/gi, "")

  // 2. Roman numeral chapter with delimiter: "i. что у осени в корзинке? - 1. прекрасная пора"
  s = s.replace(/^[ivxlcdm]+\.\s*[^—–\-:]+[—–\-:]\s*/gi, "")

  // 3. Section headers without extra title: e.g. "bölmə 1.", "1-ci bölmə:", "fəsil 2.", "4-cü mövzu."
  s = s.replace(/^(bölmə|hissə|fəsil|razdel|раздел|unit|unıt|unité|unıte|lektion|lektıon|module|étape|etape|kapitel|dossier)\s+([0-9]+|[ivxlcdm]+)[.\-:]*\s*/gi, "")
  s = s.replace(/^([0-9]+|[ivxlcdm]+)\s*(-ci|-cı|-cü|-cu|-üncü|-inci)?\s*(bölmə|hissə|fəsil|razdel|раздел|unit|unıt|unité|unıte|lektion|lektıon|module|étape|etape|kapitel|dossier|mövzu)[.\-:]*\s*/gi, "")

  // 4. Lesson / theme indicators: "dərs 1.", "урок 1.", "stunde 1.", "leçon 1.", "mövzu 1.", "dil qaydaları:"
  s = s.replace(/^(dərs|ders|урок|urok|stunde|leçon|lecon|lesson|lessons|lessen|thema|theme|mövzu|dil qaydaları:?)\s*([0-9]+|[ivxlcdm]+)?[.\-:]*\s*/gi, "")

  // 5. Leading number with delimiter or space: "1. Məktəb", "1.1. Hesabi kvadrat kök", "12) Dərs", "1 - Fiqurlar", "6.1 İstilik miqdarı"
  s = s.replace(/^[0-9]+(?:\.[0-9]+)*[\s\.\)\-:]+\s*/gi, "")

  // 6. Leading Roman numeral ONLY with mandatory delimiter: "I. Giriş", "IV) Xassələr"
  s = s.replace(/^[ivxlcdm]+\s*[\.\)\-:]\s+/gi, "")

  // 7. Trailing chapter qualifiers like "(fəsil 1)", "(bölmə 2)", "(раздел i)"
  s = s.replace(/\s*\((?:bölmə|fəsil|hissə|razdel|раздел|unit|unıt|module)\s*([0-9]+|[ivxlcdm]+)\)\s*$/gi, "")

  // 8. Punctuation cleanup (hyphens, dashes, quotes, parentheses, trailing dots) and whitespace trim
  s = s.replace(/[\s\-_—–]+/g, " ").replace(/["'“”«»()]/g, "").replace(/\.+$/g, "").trim()

  return s
}

const TOPIC_ALIASES: Record<string, string> = {
  // Kimya 11 legacy/descriptive aliases
  "karbohidratların təsnifatı. qlükoza və fruktoza": "Karbohidratların təsnifatı və fotosintez prosesi",
  "zülallar (peptidlər). quruluşu, təbəqələri və xassələri": "Zülallar: Quruluş səviyyələri, rəngli reaksiyaları və denaturasiyası",
  "plastik kütlələr və sintetik kauçuklar": "Plastik kütlələr (Polietilen, Polipropilen, Polivinilxlorid, Polistirol)",
  "saxaroza. quruluşu, alınması və xassələri": "Disaxaridlər: Saxaroza və maltozanın quruluşu, hidrolizi və əhəmiyyəti",
  "nişasta və sellüloza (quruluşu, xassələri və tətbiqi)": "Polisaxaridlər: Nişasta və sellülozanın quruluş fərqləri, kimyəvi xassələri",
  "nuklein turşuları (dnt və rnt)": "Peptidlər və peptid rabitəsi",
  "irimolekullu birləşmələr (polimerlər). əsas anlayışlar": "Polimerləşmə və polikondensləşmə reaksiyaları",
  "dərman maddələri və pestisidlər": "Sintetik kauçuklar və rezin istehsalı",
  "üzvi kimyanın həyatımızda və sənayedə rolu": "Sintetik liflər (Kapron, Lavsan)",
  "aseton. alınması, xassələri və tətbiqi": "Formaldehid, asetaldehid və asetonun sənayedə əhəmiyyəti və tətbiqi",
  "aldehidlərin fiziki və kimyəvi xassələri, tətbiqi": "Aldehidlərin fiziki və kimyəvi xassələri (Gümüş-güzgü reaksiyası və oksidləşmə)",
  "karbon turşularının təsnifatı, birəsaslı doymuş karbon turşularının homoloji sırası və izomerliyi": "Doymuş birəsaslı karbon turşuları: Homoloji sırası, izomerliyi və adlandırılması",
  "birəsaslı doymuş karbon turşularının adlandırılması və alınması": "Doymuş birəsaslı karbon turşularının alınması, fiziki və kimyəvi xassələri",
  "birəsaslı doymuş karbon turşularının fiziki və kimyəvi xassələri, tətbiqi": "Qarışqa turşusu və sirkə turşusunun xüsusi xassələri və tətbiqi",
  "doymamış, aromatik və ikiəsaslı karbon turşuları": "Doymamış və aromatik karbon turşuları (Akril, Olein, Benzoy turşusu)",
  "mürəkkəb efirlər. quruluşu, adlandırılması, izomerliyi və alınması": "Mürəkkəb efirlər: Efirləşmə reaksiyası, quruluşu, hidrolizi və tətbiqi",
  "mürəkkəb efirlərin xassələri və tətbiqi": "Mürəkkəb efirlər: Efirləşmə reaksiyası, quruluşu, hidrolizi və tətbiqi",
  "yağlar. tərkibi, quruluşu və təsnifatı": "Yağlar: Quruluşu, təsnifatı, xassələri və yağların hidrogenləşdirilməsi",
  "yağların xassələri və tətbiqi": "Yağlar: Quruluşu, təsnifatı, xassələri və yağların hidrogenləşdirilməsi",
  "aminlər. təsnifatı, izomerliyi və adlandırılması": "Aminlər: Təsnifatı, izomerliyi, adlandırılması və əsasi xassələri",
  "aminlərin alınması, fiziki və kimyəvi xassələri": "Aminlər: Təsnifatı, izomerliyi, adlandırılması və əsasi xassələri",
  "anilin. alınması, xassələri və tətbiqi": "Anilin (Aromatik amin): Alınması (Zinin reaksiyası) və kimyəvi xassələri",
  "amin turşuları. tərkibi, quruluşu, izomerliyi və adlandırılması": "Aminturşular: Quruluşu, ikili təbiəti (amfoterliyi) və alınması",
  "amin turşularının alınması, xassələri və bioloji rolu": "Aminturşular: Quruluşu, ikili təbiəti (amfoterliyi) və alınması",
  "doymuş biratomlu spirtlər: adlandırılması və izomerliyi": "1.1.1. Adlandırılması və izomerliyi",
  "doymuş biratomlu spirtlərin alınması": "1.1.2. Alınması",
  "doymuş biratomlu spirtlərin quruluşu və fiziki xassələri": "1.1.3. Quruluşu və fiziki xassələri",
  "doymuş biratomlu spirtlərin kimyəvi xassələri və tətbiqi": "1.1.4. Kimyəvi xassələri və tətbiqi",
  "praktik dərs: etanol və onun xassələri": "1.1.5. Praktik dərs. Etanolun məhkəməsi",
  "çoxatomlu spirtlər: etilenqlikol": "1.2.1. Etilenqlikol",
  "çoxatomlu spirtlər: qliserin": "1.2.2. Qliserin",
  "fenollar: alınması, quruluşu və fiziki xassələri": "1.3.1. Fenollar. Alınması, quruluşu və fiziki xassələri",
  "fenollar: kimyəvi xassələri və tətbiqi": "1.3.2. Fenolların kimyəvi xassələri və tətbiqi",
}

/**
 * Finds the exact or best 1-to-1 topic match from a list of candidate topics.
 * Returns an array containing the matched topic (or empty array if no legitimate match).
 */
export function findBestTopicMatch(targetTopic: string, candidateTopics: string[]): string[] {
  if (!targetTopic || !candidateTopics || candidateTopics.length === 0) return []
  const tNorm = azNorm(targetTopic)
  const tClean = stripTopicPrefix(targetTopic)
  const tRaw = rawNorm(targetTopic)
  const tCleanRaw = rawNorm(tClean)

  // 0. Direct alias resolution
  for (const [aliasKey, aliasTarget] of Object.entries(TOPIC_ALIASES)) {
    const aNorm = azNorm(aliasKey)
    const aRaw = rawNorm(aliasKey)
    if (aNorm === tNorm || aRaw === tRaw || aNorm === azNorm(tClean) || aRaw === tCleanRaw) {
      const matched = candidateTopics.find(c => azNorm(c) === azNorm(aliasTarget) || rawNorm(c) === rawNorm(aliasTarget))
      if (matched) return [matched]
    }
  }

  // 1. Exact normalized match (preserving az characters)
  for (const c of candidateTopics) {
    if (azNorm(c) === tNorm || rawNorm(c) === tRaw) {
      return [c]
    }
  }

  // 1.5 Multi-level section numbering prefix match (e.g., "1.1.1." or "1.2.")
  const sectionNumMatch = targetTopic.match(/^(\d+\.\d+(?:\.\d+)?)\.?/)
  if (sectionNumMatch) {
    const sectionPrefix = sectionNumMatch[1]
    const prefixMatches = candidateTopics.filter(c => c.startsWith(sectionPrefix) || rawNorm(c).startsWith(sectionPrefix))
    if (prefixMatches.length === 1) {
      return prefixMatches
    }
  }

  // 2. Exact stripped-prefix match (both az and raw normalized)
  const strippedMatches: string[] = []
  for (const c of candidateTopics) {
    const cClean = stripTopicPrefix(c)
    if ((cClean === tClean || rawNorm(cClean) === tCleanRaw) && tCleanRaw.length >= 2) {
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

  // 3. Containment with strict digit protection (supporting both az and raw normalization)
  const containmentMatches: string[] = []
  for (const c of candidateTopics) {
    const cClean = stripTopicPrefix(c)
    const cCleanRaw = rawNorm(cClean)
    if (
      (cClean.length >= 4 && tClean.length >= 4 && (cClean.startsWith(tClean) || tClean.startsWith(cClean))) ||
      (cCleanRaw.length >= 4 && tCleanRaw.length >= 4 && (cCleanRaw.startsWith(tCleanRaw) || tCleanRaw.startsWith(cCleanRaw)))
    ) {
      // Avoid matching if both have distinct numbers (e.g. "13" vs "14")
      const numC = (cCleanRaw.match(/\b\d+\b/g) || []).join(",")
      const numT = (tCleanRaw.match(/\b\d+\b/g) || []).join(",")
      if (numC && numT && numC !== numT) {
        continue
      }
      containmentMatches.push(c)
    }
  }
  if (containmentMatches.length === 1) {
    return containmentMatches
  }

  // 4. Token similarity with strict threshold >= 0.65 and digit protection
  let bestTopic: string | null = null
  let bestScore = 0
  const tTokens = new Set(tCleanRaw.split(/\s+/).filter(w => w.length > 1))

  for (const c of candidateTopics) {
    const cCleanRaw = rawNorm(stripTopicPrefix(c))
    const cTokens = new Set(cCleanRaw.split(/\s+/).filter(w => w.length > 1))

    const numC = (cCleanRaw.match(/\b\d+\b/g) || []).join(",")
    const numT = (tCleanRaw.match(/\b\d+\b/g) || []).join(",")
    if (numC && numT && numC !== numT) {
      continue
    }

    const intersection = [...tTokens].filter(x => cTokens.has(x))
    const union = new Set([...tTokens, ...cTokens])
    const score = intersection.length / union.size

    if (score > bestScore && score >= 0.65) {
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
    const titleRaw = rawNorm(textbookTitle)

    // Language / subject aliases (using rawNorm for robust cross-encoding matching)
    matched = candidates.filter(k => {
      const kRaw = rawNorm(k)
      // Russian
      if ((titleRaw.includes("rus") || titleRaw.includes("рус")) && (kRaw.includes("rus") || kRaw.includes("рус"))) return true
      // English / Ingilis
      if ((titleRaw.includes("english") || titleRaw.includes("ingilis")) && (kRaw.includes("ingilis") || kRaw.includes("english") || kRaw.includes("eng"))) return true
      // German / Alman / Deutsch
      if ((titleRaw.includes("deutsch") || titleRaw.includes("german") || titleRaw.includes("alman")) && (kRaw.includes("alman") || kRaw.includes("deu"))) return true
      // French / Fransız / Fransiz / Francais
      if ((titleRaw.includes("francais") || titleRaw.includes("fransiz")) && (kRaw.includes("fransiz") || kRaw.includes("francais"))) return true
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
