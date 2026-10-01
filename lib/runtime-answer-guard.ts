/**
 * Runtime Answer Key Guard (SİTG Standartı Təsdiq Edici)
 * Validates and reconciles question answer keys against scientific explanations.
 */

const SUFFIXES = [
  "dir", "dür", "dır", "dur", "di", "dü", "dı", "du",
  "yə", "ya", "ə", "a", "dən", "dan", "i", "ü", "ı", "u",
  "ni", "nı", "nü", "nu", "ci", "cı", "cü", "cu"
]

const MISTAKE_INDICATORS = [
  "yanlış", "səhv", "aldadıcı", "diqqətsizlik",
  "tapa bilər, lakin", "qarışdırıb", "yayğın səhv"
]

function cleanOpt(opt: any): string {
  const s = String(opt ?? "").trim()
  return s.replace(/^[a-eA-E]\)\s*/, "").trim()
}

function normalizeMath(s: string): string {
  if (!s) return ""
  let t = s.trim().toLowerCase()
  t = t.replace(/^[a-e]\)\s*/, "").trim()
  t = t.replace(/−/g, "-").replace(/–/g, "-")
  // Replace comma between digits: 0,5 -> 0.5
  t = t.replace(/(\d),(\d)/g, "$1.$2")
  return t
}

function extractSolutionText(expl: any): string {
  if (!expl) return ""
  if (typeof expl === "string") {
    const trimmed = expl.trim()
    if (trimmed.startsWith("{") && trimmed.includes("correct")) {
      try {
        const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
        return parsed.correct || trimmed
      } catch {
        return trimmed
      }
    }
    return trimmed
  }
  if (typeof expl === "object") {
    return expl.correct || expl.doğru_cavab_səbəbi || ""
  }
  return String(expl)
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

function matchesSingleToken(tok: string, text: string): boolean {
  if (!tok || !text) return false
  const isNeg = tok.startsWith("-")
  const rawNum = tok.replace(/^-/, "")
  
  const prefix = isNeg ? "(?:^|[^\\w\\d])\\-" : "(?:^|[^\\w\\d\\-])"
  const body = rawNum.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const suffixPattern = `(?:-(?:${SUFFIXES.join("|")})\\b)?`
  const pattern = new RegExp(`${prefix}${body}${suffixPattern}(?:$|[^\\w\\d\\/])`)
  return pattern.test(text)
}

function matchesOptionInText(opt: string, text: string): boolean {
  const optNorm = normalizeMath(opt)
  const textNorm = normalizeMath(text)
  
  // 0. Key-value pairs e.g. "Cəmi: -7, Hasili: -10"
  const pairMatches = Array.from(optNorm.matchAll(/([a-zA-ZçəıöğşüÇƏİÖĞŞÜ\s]+)[:=]\s*(\-?\d+(?:[\.,]\d+)?)/g))
  if (pairMatches.length >= 2) {
    const allFound = pairMatches.every(m => {
      const valClean = m[2].replace(",", ".")
      return matchesSingleToken(valClean, textNorm)
    })
    if (allFound) return true
  }
  
  // 1. Multiple parts separated by ; , or ' və '
  const parts = optNorm.split(/[,;]|\s+və\s+/).map(p => p.trim()).filter(Boolean)
  if (parts.length >= 2) {
    if (parts.every(p => textNorm.includes(p))) return true
    return parts.every(p => matchesSingleToken(p, textNorm))
  }
  
  // 2. Full exact substring match
  if (optNorm.length >= 4 && textNorm.includes(optNorm)) return true
  
  // 3. Chemical / Science synonyms
  const synonyms: Record<string, string[]> = {
    "əhəng daşı": ["kalsium-karbonat", "caco3", "əhəngdaşı"],
    "kalsium-karbonat": ["əhəng daşı", "caco3", "əhəngdaşı"],
    "təbii qaz": ["metan", "ch4"],
    "su": ["h2o"],
    "karbon qazı": ["co2"],
    "paslanma": ["dəmir hidroksidləri", "dəmir oksidləri", "paslanma"]
  }
  for (const [k, synList] of Object.entries(synonyms)) {
    if (optNorm.includes(k) && synList.some(s => textNorm.includes(s))) {
      return true
    }
  }

  // 4. Substantive token stem overlap
  const words = optNorm.split(/[\s,;]+/).filter(w => w.length >= 3)
  if (words.length >= 2) {
    const matchedCount = words.filter(w => textNorm.includes(w.slice(0, Math.max(3, w.length - 2)))).length
    if (matchedCount >= Math.ceil(words.length * 0.7)) return true
  }
  
  return matchesSingleToken(optNorm, textNorm)
}

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
  
  // 1. Explicit letter check
  const rxLetter = /(?:dəqiq\s+nəticə|doğru\s+cavab|düzgün\s+cavab|cavab)\s*:?\s*([a-e])\b(?:\s+(?:bəndi|variant|bəndidir|variantıdır))?/i
  const letterMatch = sol.match(rxLetter)
  if (letterMatch && letterMatch[1]) {
    const targetIdx = letterMatch[1].toUpperCase().charCodeAt(0) - 65
    if (targetIdx >= 0 && targetIdx < cleanOptions.length) {
      return targetIdx
    }
  }
  
  // 2. Clean noise and mistakes
  const cleanSol = filterNoiseAndMistakes(sol) || sol
  const cleanSolNorm = normalizeMath(cleanSol)
  const tail = cleanSolNorm.length > 200 ? cleanSolNorm.slice(-200) : cleanSolNorm
  const sentences = cleanSolNorm.split(/[\.\!\?]\s+/).map(s => s.trim()).filter(Boolean)
  const lastSentence = sentences.length > 0 ? sentences[sentences.length - 1] : tail
  
  const currentOpt = cleanOptions[currentIdx] || ""
  let currentDenounced = false
  if (currentOpt) {
    const cNorm = normalizeMath(currentOpt).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const rxDenounced = new RegExp(`${cNorm}[^.\\n]*?(?:səhv|yanlış|aldadıcı|diqqətsizlik)`, "i")
    if (rxDenounced.test(solLower)) {
      currentDenounced = true
    }
  }
  
  // 3. Last sentence matches (rightmost wins)
  const lastMatches: { pos: number; idx: number }[] = []
  cleanOptions.forEach((opt, idx) => {
    if (matchesOptionInText(opt, lastSentence)) {
      const tok = normalizeMath(opt).replace(/^-/, "")
      const pos = lastSentence.lastIndexOf(tok)
      lastMatches.push({ pos, idx })
    }
  })
  
  if (lastMatches.length > 0) {
    lastMatches.sort((a, b) => b.pos - a.pos)
    const bestIdx = lastMatches[0].idx
    if (bestIdx === currentIdx && !currentDenounced) {
      return currentIdx
    }
    return bestIdx
  }
  
  if (!currentDenounced && currentOpt && matchesOptionInText(currentOpt, tail)) {
    return currentIdx
  }
  
  // 4. Tail matches
  const tailMatches: { pos: number; idx: number }[] = []
  cleanOptions.forEach((opt, idx) => {
    if (matchesOptionInText(opt, tail)) {
      const tok = normalizeMath(opt).replace(/^-/, "")
      const pos = tail.lastIndexOf(tok)
      tailMatches.push({ pos, idx })
    }
  })
  
  if (tailMatches.length > 0) {
    tailMatches.sort((a, b) => b.pos - a.pos)
    return tailMatches[0].idx
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
        continue
      }
      cleaned[key] = rawVal
      continue
    }

    // Filter generic canned phrases that provide zero diagnostic value
    if (
      rawVal.includes("tədris standartına uyğun deyil") ||
      rawVal.includes("tarixi faktlarla uyğun gəlmir") ||
      rawVal.includes("bioloji qanunauyğunluqlara və ya tərifə uyğun deyil")
    ) {
      continue
    }

    cleaned[key] = rawVal
  }

  return Object.keys(cleaned).length > 0 ? cleaned : undefined
}

