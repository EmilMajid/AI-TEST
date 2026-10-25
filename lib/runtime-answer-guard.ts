/**
 * Runtime Answer Key Guard (SİTG Standartı Təsdiq Edici)
 * Validates and reconciles question answer keys against scientific explanations.
 */

const STOP_WORDS = new Set([
  "ve", "və", "ile", "ilə", "bir", "bu", "o", "ki", "hem", "həm", "həmçinin",
  "daha", "cox", "çox", "az", "olan", "olur", "olurmu", "adlanir", "adlanır",
  "ucun", "üçün", "gore", "görə", "aid", "kimi", "her", "hər", "eyni", "ferqli",
  "fərqli", "butun", "bütün", "var", "yox", "yoxdur", "edir", "edilir", "olunan",
  "sual", "bənd", "variant", "doğru", "düzgün", "yanlış", "səhv"
])

const SUFFIXES = [
  "lar", "lər", "nın", "nin", "nun", "nün", "dan", "dən", "dək",
  "da", "də", "ya", "yə", "a", "ə", "ın", "in", "un", "ün",
  "nı", "ni", "nu", "nü", "ı", "i", "u", "ü",
  "dır", "dir", "dur", "dür", "dıran", "dirən", "duran", "dürən",
  "dı", "di", "du", "dü", "mış", "miş", "muş", "müş",
  "acaq", "əcək", "malı", "məli", "ar", "ər", "ır", "ir", "ur", "ür",
  "an", "ən", "ıcı", "ici", "ucu", "ücü",
  "lıq", "lik", "luq", "lük", "çı", "çi", "çu", "çü", "cı", "ci", "cu", "cü"
]

const MISTAKE_INDICATORS = [
  "yanlış", "səhv", "aldadıcı", "diqqətsizlik",
  "tapa bilər, lakin", "qarışdırıb", "yayğın səhv"
]

export function cleanOpt(opt: any): string {
  const s = String(opt ?? "").trim()
  return s.replace(/^[a-eA-E]\)\s*/, "").trim()
}

export function azStem(word: string): string {
  let w = word.toLowerCase().trim()
  w = w.replace(/^[(\"\'“‘]+|[)\"\'”’.,;:!?]+$/g, "")
  if (w.length <= 3) return w

  for (const sfx of SUFFIXES) {
    if (w.length >= sfx.length + 3 && w.endsWith(sfx)) {
      w = w.slice(0, -sfx.length)
      break
    }
  }
  return w
}

export function canonicalFormula(str: string): string {
  let s = str.toLowerCase()
  s = s.replace(/[\(\)]/g, "")
  s = s.replace(/[·•\*\s]/g, "")
  return s
}

export function normalizeMath(s: string): string {
  if (!s) return ""
  let t = s.trim().toLowerCase()
  t = t.replace(/^[a-e]\)\s*/, "").trim()
  t = t.replace(/−/g, "-").replace(/–/g, "-")
  t = t.replace(/(\d),(\d)/g, "$1.$2")
  return t
}

export function extractSolutionText(expl: any): string {
  if (!expl) return ""
  let text = ""
  if (typeof expl === "string") {
    const trimmed = expl.trim()
    if (trimmed.startsWith("{") && trimmed.includes("correct")) {
      try {
        const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
        text = parsed.correct || trimmed
      } catch {
        text = trimmed
      }
    } else {
      text = trimmed
    }
  } else if (typeof expl === "object") {
    text = expl.correct || expl.doğru_cavab_səbəbi || ""
  } else {
    text = String(expl)
  }

  // Strip distractor explanations / "Səhv variantlar" to keep pure solution
  if (text.includes("Səhv variantlar") || text.includes("Səhv variantların")) {
    const parts = text.split(/(?:Səhv variantlar|Səhv variantların təhlili):/i)
    text = parts[0].trim()
  }

  return text
}

function filterNoiseAndMistakes(text: string): string {
  let t = text.replace(/\b\d+-c[iıüu]\s+sinif\b/gi, "")
  t = t.replace(/['"“]\d+\.\s+[^"'\n”]+['"”]/g, "")

  const sentences = t.split(/[\.\!\?]\s+/)
  const valid = sentences.filter(s => {
    const low = s.toLowerCase()
    return !MISTAKE_INDICATORS.some(w => low.includes(w))
  })
  return valid.join(". ")
}

function matchesSingleNumberToken(tok: string, text: string): boolean {
  if (!tok || !text) return false
  const isNeg = tok.startsWith("-")
  const rawNum = tok.replace(/^-/, "")
  const prefix = isNeg ? "(?:^|[^\\w\\d])\\-" : "(?:^|[^\\w\\d\\-])"
  const body = rawNum.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`${prefix}${body}(?:$|[^\\w\\d\\/])`)
  return pattern.test(text)
}

/**
 * Reconcile and validate answer key at runtime.
 * Evaluates candidate options mathematically, syntactically, and scientifically against the explanation.
 */
export function reconcileAnswerKeyRuntime(
  cleanOptions: string[],
  rawExplanation: any,
  currentIdx: number
): number {
  if (!cleanOptions || cleanOptions.length === 0) return currentIdx
  if (currentIdx < 0 || currentIdx >= cleanOptions.length) currentIdx = 0

  const sol = extractSolutionText(rawExplanation)
  if (!sol || sol.trim().length === 0) return currentIdx

  const solLower = sol.toLowerCase()
  const solCanon = canonicalFormula(sol)
  const solFiltered = filterNoiseAndMistakes(sol) || sol
  const solFilteredLower = solFiltered.toLowerCase()

  // 1. Explicit letter assertion (e.g. "Doğru cavab: B" və ya "Düzgün cavab C variantıdır")
  const rxLetter = /(?:dəqiq\s+nəticə|doğru\s+cavab|düzgün\s+cavab)\s*:?\s*([a-e])\b(?:\s+(?:bəndi|variant|bəndidir|variantıdır))?/i
  const letterMatch = sol.match(rxLetter)
  let explicitLetterIdx = -1
  if (letterMatch && letterMatch[1]) {
    const targetIdx = letterMatch[1].toUpperCase().charCodeAt(0) - 65
    if (targetIdx >= 0 && targetIdx < cleanOptions.length) {
      explicitLetterIdx = targetIdx
    }
  }

  // Count word frequencies across all options to identify distinctive discriminator terms
  const wordFrequency = new Map<string, number>()
  const optionWordLists = cleanOptions.map(opt => {
    const clean = cleanOpt(opt).replace(/[()]/g, " ")
    const words = clean.split(/[\s,;:]+/)
      .map(w => azStem(w))
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w) && !/^\-?\d+$/.test(w))
    const uniqueInOpt = new Set(words)
    for (const w of uniqueInOpt) {
      wordFrequency.set(w, (wordFrequency.get(w) || 0) + 1)
    }
    return uniqueInOpt
  })

  // Evaluate candidate scores
  const scores = cleanOptions.map((opt, idx) => {
    let score = 0
    const clean = cleanOpt(opt)
    const cleanLower = clean.toLowerCase()
    const isCurrent = idx === currentIdx

    // Baseline loyalty to current index (do not switch unless challenger is overwhelmingly superior or current is contradicted)
    if (isCurrent) {
      score += 70
    }

    // Explicit letter confirmation
    if (idx === explicitLetterIdx) {
      score += 50
    }

    // A. Mathematical / Physical Formula Matching (e.g. F = m · g vs F = mg)
    const optCanon = canonicalFormula(clean)
    if (optCanon.includes("=") || /^[a-z][\+\-\*\/][a-z]$/i.test(optCanon)) {
      if (solCanon.includes(optCanon)) {
        score += 180
      }
    }

    // B. Pure Numeric / Coordinate Matching (e.g. "-7", "14", "3.5")
    const normNum = clean.replace(",", ".")
    if (/^\-?\d+(?:[\.,]\d+)?$/.test(normNum)) {
      const normText = solFilteredLower.replace(/(\d),(\d)/g, "$1.$2")
      if (matchesSingleNumberToken(normNum, normText)) {
        const pos = normText.lastIndexOf(normNum)
        const relPos = normText.length > 0 ? (pos / normText.length) : 0
        score += 80 + Math.round(relPos * 60)

        // Boost if directly preceded by "cavab", "x =", etc.
        const before = normText.slice(Math.max(0, pos - 15), pos)
        if (/cavab[:\s]*$|[=:]\s*$/.test(before)) {
          score += 45
        }
      }
    }

    // C. Exact substring match in solution
    if (clean.length >= 4 && solFilteredLower.includes(cleanLower)) {
      score += 90
    }

    // D. Substring match stripped of parenthetical text (e.g. "Arximed (itələmə) qüvvəsi" -> "Arximed qüvvəsi")
    const noParen = clean.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim().toLowerCase()
    if (noParen.length >= 4 && solFilteredLower.includes(noParen)) {
      score += 85
    }

    // E. Match inside parenthetical text (e.g. "itələmə" -> "itələyici")
    const parenMatches = clean.match(/\((.*?)\)/g)
    if (parenMatches) {
      for (const pm of parenMatches) {
        const inside = pm.replace(/[\(\)]/g, "").trim().toLowerCase()
        if (inside.length >= 3) {
          const stem = azStem(inside)
          if (solFilteredLower.includes(stem)) {
            score += 40
          }
        }
      }
    }

    // F. Distinctive stem overlap
    const wordsSet = optionWordLists[idx]
    for (const stem of wordsSet) {
      if (solFilteredLower.includes(stem)) {
        const freq = wordFrequency.get(stem) || 1
        if (freq === 1) {
          // Highly distinctive: exclusive to this option!
          score += 70
        } else if (freq === 2 && cleanOptions.length > 2) {
          score += 35
        } else {
          // Common term across multiple options
          score += 8
        }
      }
    }

    // G. Denounced / Mistake Check: deduct score if option text is explicitly marked as wrong
    const rxDenounced = new RegExp(`${cleanLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^.\\n]*?(?:səhv|yanlış|aldadıcı|deyil)`, "i")
    if (rxDenounced.test(solLower)) {
      score -= 60
    }

    return { idx, opt, score }
  })

  const curItem = scores.find(s => s.idx === currentIdx)
  const curScore = curItem ? curItem.score : 0

  scores.sort((a, b) => b.score - a.score)

  // Winner must have substantial confidence and strictly exceed next competitor
  if (scores[0].score >= 40) {
    if (scores[0].idx === currentIdx) {
      return currentIdx
    }
    // If switching away from currentIdx, the challenger must strictly exceed currentScore by a clear margin
    if (scores[0].score >= curScore + 25 && (scores.length === 1 || scores[0].score > scores[1].score)) {
      return scores[0].idx
    }
  }

  return currentIdx
}

export function sanitizeDistractorDiagnostics(
  diagnostics: Record<string, string> | undefined,
  correctAnswerIndex: number
): Record<string, string> | undefined {
  if (!diagnostics || typeof diagnostics !== "object") return undefined
  const correctLetter = String.fromCharCode(65 + correctAnswerIndex)
  const cleaned: Record<string, string> = {}

  for (const [key, rawVal] of Object.entries(diagnostics)) {
    const kUpper = key.toUpperCase().trim()
    if (typeof rawVal !== "string") continue

    // Never diagnose the correct answer as wrong
    if (kUpper === correctLetter) {
      if (rawVal.toLowerCase().startsWith("yanlış") || rawVal.toLowerCase().includes("səhvdir")) {
        cleaned[key] = `${key} bəndi dərslik qaydalarına və sualın şərtinə tam uyğun olan doğru cavabdır.`
      } else {
        cleaned[key] = rawVal
      }
      continue
    }

    // If a distractor is wrongly marked as DÜZGÜNDÜR, fix it!
    let distVal = rawVal
    if (distVal.startsWith("DÜZGÜNDÜR")) {
      distVal = `${key} variantı yanlışdır: dərslik qaydalarına və elmi qanunauyğunluqlara uyğun deyil.`
    }

    // Filter generic canned phrases that provide zero diagnostic value
    if (
      distVal.includes("tədris standartına uyğun deyil") ||
      distVal.includes("tarixi faktlarla uyğun gəlmir") ||
      distVal.includes("bioloji qanunauyğunluqlara və ya tərifə uyğun deyil")
    ) {
      continue
    }

    cleaned[key] = distVal
  }

  return Object.keys(cleaned).length > 0 ? cleaned : undefined
}
