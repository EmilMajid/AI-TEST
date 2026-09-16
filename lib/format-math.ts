// Universal Scientific & Mathematical Text Formatter for Azerbaijani Curriculum Platform

const SUPERSCRIPT_MAP: { [key: string]: string } = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'x': 'ˣ', '°': '°'
}

const SUBSCRIPT_MAP: { [key: string]: string } = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ'
}

export function formatSourceContext(source: any): string {
  if (source === null || source === undefined) return ""
  let ctx = source

  if (typeof ctx === "string") {
    const trimmed = ctx.trim()
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        ctx = JSON.parse(trimmed)
      } catch {
        try {
          ctx = (new Function(`return (${trimmed})`))()
        } catch {
          ctx = trimmed
        }
      }
    } else {
      return trimmed
        .replace(/^>\s*\*\*Mənbə(?:\s*\(Dərslik\))?:\*\*\s*/i, "Mənbə (Dərslik): ")
        .replace(/\*\*/g, "")
        .trim()
    }
  }

  if (typeof ctx === "object" && ctx !== null) {
    if (ctx.text) return String(ctx.text)

    const parts: string[] = []
    const curriculum = ctx.curriculum || ""
    const subject = ctx.subject || ""
    const grade = ctx.grade ? `${ctx.grade}-ci sinif` : ""
    const topic = ctx.topic || ""

    if (curriculum) {
      parts.push(`Mənbə (Dərslik): ${curriculum}`)
      if (topic) parts.push(`Mövzu: ${topic}`)
    } else {
      const subjGrade = [subject, grade].filter(Boolean).join(", ")
      if (subjGrade) parts.push(`Mənbə (Dərslik): ${subjGrade}`)
      if (topic) parts.push(`Mövzu: ${topic}`)
    }

    if (parts.length > 0) return parts.join(" • ")
  }

  return String(source || "")
}

export function cleanExplanation(val: any): string {
  if (val === null || val === undefined) return ""
  let obj = val

  if (typeof val === "string") {
    const trimmed = val.trim()
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        obj = JSON.parse(trimmed)
      } catch {
        try {
          obj = (new Function(`return (${trimmed})`))()
        } catch {
          const match = trimmed.match(/['"]correct['"]\s*:\s*['"]([^'"]+)['"]/)
          if (match) return formatScientificText(match[1])
          obj = trimmed
        }
      }
    }
  }

  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    const correctText = obj.correct || obj.doğru_cavab_səbəbi || obj.text || obj.izah || obj.explanation || ""
    const distObj = obj.distractors || obj.səhv_variantlar
    let distStr = ""

    if (distObj) {
      if (Array.isArray(distObj)) {
        const items = distObj
          .map((d: any) => (typeof d === "object" ? (d.reason || d.text || "") : String(d)))
          .filter((t: string) => t && !t.includes("hesablamaya və ya tərifə uyğun deyil"))
        if (items.length > 0) {
          distStr = items.map((t: string) => `- ${t}`).join("\n")
        }
      } else if (typeof distObj === "object") {
        const entries = Object.entries(distObj)
          .map(([k, v]: [string, any]) => {
            const label = isNaN(Number(k)) ? k : String.fromCharCode(65 + Number(k))
            const text = typeof v === "object" ? (v?.reason || v?.text || v?.səbəb || "") : String(v)
            return { label, text }
          })
          .filter((e) => e.text && !e.text.includes("hesablamaya və ya tərifə uyğun deyil"))
        if (entries.length > 0) {
          distStr = entries.map((e) => `- ${e.label} variantı: ${e.text}`).join("\n")
        }
      }
    }

    if (correctText && distStr) {
      return `${formatScientificText(correctText)}\n\nSəhv variantlar:\n${distStr}`
    }
    if (correctText) return formatScientificText(correctText)
  }

  return formatScientificText(typeof val === "string" ? val : String(val))
}

export function formatScientificText(text: any): string {
  if (text === null || text === undefined) return ""
  if (typeof text !== "string") {
    if (typeof text === "number" || typeof text === "boolean") return String(text)
    if (typeof text === "object") {
      if (text.curriculum || text.subject) return formatSourceContext(text)
      if (text.correct || text.doğru_cavab_səbəbi) return cleanExplanation(text)
      if (text.text) return formatScientificText(text.text)
      try {
        return JSON.stringify(text)
      } catch {
        return String(text)
      }
    }
    return String(text)
  }

  let s = text

  // 1. Clean markdown quotes & bold
  s = s.replace(/^\s*>\s*/gm, "")
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1")
  s = s.replace(/^\s*\*\s+/gm, "")

  // 2. Chemical reaction arrows & conditions
  s = s.replace(/\\xrightarrow\s*\[([^\]]+)\]\s*\{([^}]+)\}/g, " ──[$1, $2]──> ")
  s = s.replace(/\\xrightarrow\s*\{([^}]+)\}/g, " ──[$1]──> ")
  s = s.replace(/\\xrightarrow[a-zA-Z]*/g, " → ")
  s = s.replace(/\\rightleftharpoons/g, " ⇌ ")
  s = s.replace(/\\to/g, " → ")
  s = s.replace(/\\uparrow/g, "↑")
  s = s.replace(/\\downarrow/g, "↓")
  s = s.replace(/\\equiv/g, "≡")

  // 3. Greek & math symbols
  s = s.replace(/\\circ/g, "°")
  s = s.replace(/\\times/g, "×")
  s = s.replace(/\\cdot/g, "·")
  s = s.replace(/\\approx/g, "≈")
  s = s.replace(/\\le(?:q)?/g, "≤")
  s = s.replace(/\\ge(?:q)?/g, "≥")
  s = s.replace(/\\neq/g, "≠")
  s = s.replace(/\\pm/g, "±")
  s = s.replace(/\\infty/g, "∞")
  s = s.replace(/\\alpha/g, "α")
  s = s.replace(/\\beta/g, "β")
  s = s.replace(/\\gamma/g, "γ")
  s = s.replace(/\\pi/g, "π")
  s = s.replace(/\\sigma/g, "σ")
  s = s.replace(/\\Delta/g, "Δ")
  s = s.replace(/\\lambda/g, "λ")
  s = s.replace(/\\mu/g, "μ")
  s = s.replace(/\\nu/g, "ν")
  s = s.replace(/\\dots/g, "...")
  s = s.replace(/\\%/g, "%")

  // 4. Fractions: \frac{a}{b} -> (a / b)
  s = s.replace(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g, "($1 / $2)")

  // 5. LaTeX text blocks: \text{...} -> ...
  s = s.replace(/\\text\s*\{([^}]+)\}/g, "$1")

  // 6. Superscripts: ^{...} or ^...
  s = s.replace(/\^\{([^}]+)\}/g, (_, content) => {
    return content.split("").map((c: string) => SUPERSCRIPT_MAP[c] || c).join("")
  })
  s = s.replace(/\^([0-9°])/g, (_, c) => SUPERSCRIPT_MAP[c] || c)

  // 7. Subscripts: _{...} or _...
  s = s.replace(/_\{([^}]+)\}/g, (_, content) => {
    return content.split("").map((c: string) => SUBSCRIPT_MAP[c] || c).join("")
  })
  s = s.replace(/_([0-9a-z])/g, (_, c) => SUBSCRIPT_MAP[c] || c)

  // 8. Clean leftover LaTeX wrappers $, {, }, \
  s = s.replace(/[\${}]/g, "")
  s = s.replace(/\\([a-zA-Z]+)/g, "$1")

  // 9. Clean extra spaces
  s = s.replace(/\s+/g, " ").trim()

  return s
}
