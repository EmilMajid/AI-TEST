/**
 * Runtime KAG Guard (SİTG Standartı Canlı Bərpa Qoruyucusu)
 * Enforces live pedagogical integrity on every question's backward_trace before it reaches the student:
 * 1. Cross-Subject Firewall: Prevents history concepts (İqta, Mülk, Vəqf) or science concepts from leaking into language subjects.
 * 2. Grammar vs Reading Strand Firewall: Enforces grammar roots for grammar questions (direct speech, complex sentences), preventing links to reading poems/stories.
 * 3. Deterministic Bloom -> Duration Invariant: Duration is strictly mapped to Bloom (Bilik:10, Anlama:10, Tətbiq:15, Təhlil:20).
 * 4. Zero-Page & Tautology Guard: Eliminates page numbers and "bacarığı bacarığını" repetitions.
 */

const BLOOM_DURATION: Record<string, number> = {
  Bilik: 10,
  Anlama: 10,
  Tətbiq: 15,
  Təhlil: 20,
}

const EXACT_BLOOM_MAP: Record<string, string> = {
  bilik: "Bilik", knowledge: "Bilik", xatırlama: "Bilik", remembering: "Bilik",
  anlama: "Anlama", comprehension: "Anlama", understanding: "Anlama",
  tətbiq: "Tətbiq", tətbiqi: "Tətbiq", application: "Tətbiq", applying: "Tətbiq",
  təhlil: "Təhlil", analiz: "Təhlil", analysis: "Təhlil", analyzing: "Təhlil",
  dəyərləndirmə: "Təhlil", evaluation: "Təhlil", evaluating: "Təhlil",
  yaradıcılıq: "Təhlil", yaratmaq: "Təhlil", creation: "Təhlil",
}

const DISALLOWED_CONCEPT_WORDS = new Set([
  "correct", "incorrect", "true", "false", "answer", "question", "option", "choice",
  "doğru", "düzgün", "səhv", "yanlış", "bənd", "variant", "cavab", "sual", "seçim",
  "a dit", "a dit :", "c'est", "istifadə", "qayda", "elmi", "anlayış", "haqqında", "biri",
  "verilmiş", "aşağıdakı", "hansı", "müəyyən", "uyğundur", "uyğun"
])

const HISTORY_TERMS = [
  "iqta", "mülk", "vəqf", "torpaq mülkiyyəti", "eldəniz", "səfəvi", "çaldıran",
  "gülüstan", "türkmənçay", "atabəy", "xəlifə", "hökmdar", "feodal"
]

export function getGradeOrdinalSuffix(grade: number | string): string {
  const g = Number(grade) || 1
  switch (g) {
    case 6: return "cı"
    case 3:
    case 4: return "cü"
    case 9:
    case 10: return "cu"
    default: return "ci"
  }
}

export function cleanCanonicalSubjectName(subjStr: string): string {
  let s = String(subjStr || "").replace(/\s*\([^)]*\)/g, "").trim()
  s = s.replace(/[-_\s]+\d+$/g, "").trim()
  s = s.replace(/[-_]/g, " ")
  const words = s.split(/\s+/)
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    for (let i = 1; i < words.length; i++) {
      const w = words[i].toLowerCase()
      if (["dili", "tarixi", "bilgisi"].includes(w)) {
        words[i] = w
      } else {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
      }
    }
    return words.join(" ")
  }
  return s
}

export function normalizeBloom(rawBloom: any): string {
  const cleaned = String(rawBloom || "Anlama").trim().toLowerCase()
  return EXACT_BLOOM_MAP[cleaned] || "Anlama"
}

export function sanitizeKagRuntime(q: any, rawSubject?: string, grade?: number | string, currentTopic?: string): any {
  if (!q || typeof q !== "object") return q

  const qGrade = Number(q.grade || grade || 9) || 9
  const subjName = cleanCanonicalSubjectName(rawSubject || q.subject || "Azərbaycan dili")
  const isLanguageSubject = /dili|ingilis|rus|alman|fransız/i.test(subjName)
  const topicTitle = String(currentTopic || q.topic || "").replace(/^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*/i, "").trim()

  const qText = String(q.question || q.q || "").toLowerCase()
  const expText = String(q.explanation || q.izah || "").toLowerCase()
  const fullText = `${qText} ${expText}`

  // 1. Deterministic Bloom & Duration
  const bloom = normalizeBloom(q.bloom_level || q.bloomLevel)
  const duration = BLOOM_DURATION[bloom] || 10
  q.bloom_level = bloom
  q.bloomLevel = bloom.toLowerCase()

  // Ensure backward_trace exists
  if (!q.backward_trace || typeof q.backward_trace !== "object") {
    q.backward_trace = {}
  }
  const bt = q.backward_trace
  bt.remedial_duration_mins = duration

  let rootBook = String(bt.root_book || `${subjName} ${qGrade}`).trim()
  let rootConcept = String(bt.root_concept || topicTitle).trim()
  let conceptName = String(bt.concept_name || topicTitle).trim()
  let rootGrade = Number(bt.root_grade) || qGrade
  let isIntra = Boolean(bt.is_intra_grade) || (rootGrade === qGrade)

  // 2. Fix Double-Grade in Root Book Name (e.g. "İngilis dili 11 10" or "rus-dili-7 6")
  if (/\d+\s+\d+$/.test(rootBook) || /^[a-z]+-[a-z]+-\d+/i.test(rootBook) || /11\s+10/.test(rootBook)) {
    rootBook = `${subjName} ${rootGrade}`
    bt.root_book = rootBook
  }

  // 3. Clean Stopword / Sentence Concept Names
  const cleanCnCheck = conceptName.toLowerCase().replace(/^elmi anlayış:\s*/i, "").trim()
  if (
    !cleanCnCheck ||
    DISALLOWED_CONCEPT_WORDS.has(cleanCnCheck) ||
    cleanCnCheck.length < 3 ||
    cleanCnCheck.startsWith("correct") ||
    cleanCnCheck.includes("alınmaz qalasıdır") ||
    cleanCnCheck.length > 50
  ) {
    conceptName = topicTitle || "Əsas dərslik anlayışı"
    bt.concept_name = conceptName
  }

  // 4. CROSS-SUBJECT FIREWALL: Language subjects contaminated by History or Science
  if (isLanguageSubject) {
    const isContaminatedByHistory = HISTORY_TERMS.some(term => 
      conceptName.toLowerCase().includes(term) || rootConcept.toLowerCase().includes(term)
    )

    if (isContaminatedByHistory) {
      // Re-ground to clean language topic in current grade
      rootGrade = qGrade
      isIntra = true
      rootBook = `${subjName} ${qGrade}`
      rootConcept = topicTitle
      conceptName = topicTitle
      bt.is_root_anchor = false
      bt.is_intra_grade = true
      bt.root_grade = rootGrade
      bt.root_book = rootBook
      bt.root_concept = rootConcept
      bt.concept_name = conceptName
    }
  }

  // 5. GRAMMAR VS READING STRAND FIREWALL (Language subjects)
  if (isLanguageSubject) {
    // Check if question asks about Direct Speech (Vasitəsiz nitq)
    if (fullText.includes("vasitəsiz nitq") || fullText.includes("vasitəli nitq")) {
      rootGrade = qGrade >= 8 ? 8 : qGrade
      isIntra = (rootGrade === qGrade)
      rootBook = `${subjName} ${rootGrade}`
      rootConcept = "Vasitəsiz və vasitəli nitq"
      conceptName = "Vasitəsiz və vasitəli nitq"
      bt.root_grade = rootGrade
      bt.root_book = rootBook
      bt.root_concept = rootConcept
      bt.concept_name = conceptName
      bt.is_intra_grade = isIntra
    }
    // Check if question asks about Complex Sentences (Budaq cümlə, tabeli/tabesiz)
    else if (fullText.includes("budaq cümlə") || fullText.includes("tabeli mürəkkəb") || fullText.includes("tabesiz mürəkkəb") || fullText.includes("sintaktik növü")) {
      rootGrade = qGrade >= 9 ? 9 : 8
      isIntra = (rootGrade === qGrade)
      rootBook = `${subjName} ${rootGrade}`
      rootConcept = "Tabesiz və tabeli mürəkkəb cümlələr"
      conceptName = "Tabesiz və tabeli mürəkkəb cümlələr"
      bt.root_grade = rootGrade
      bt.root_book = rootBook
      bt.root_concept = rootConcept
      bt.concept_name = conceptName
      bt.is_intra_grade = isIntra
    }
    // Check if question asks about Sentence Members (Tamamlıq, mübtəda, xəbər, təyin, zərflik)
    else if (fullText.includes("tamamlıq") || fullText.includes("mübtəda") || fullText.includes("xəbər") || fullText.includes("təyin") || fullText.includes("zərflik")) {
      rootGrade = qGrade >= 8 ? 8 : (qGrade - 1 > 0 ? qGrade - 1 : 1)
      isIntra = (rootGrade === qGrade)
      rootBook = `${subjName} ${rootGrade}`
      rootConcept = "Cümlə üzvləri və sintaktik təhlil"
      conceptName = "Cümlə üzvləri və sintaktik təhlil"
      bt.root_grade = rootGrade
      bt.root_book = rootBook
      bt.root_concept = rootConcept
      bt.concept_name = conceptName
      bt.is_intra_grade = isIntra
    }
    // Check if question asks about Phraseology (Frazeoloji birləşmə)
    else if (fullText.includes("frazeoloji") || fullText.includes("sabit söz birləşməsi")) {
      rootGrade = qGrade >= 6 ? 6 : (qGrade - 1 > 0 ? qGrade - 1 : 1)
      isIntra = (rootGrade === qGrade)
      rootBook = `${subjName} ${rootGrade}`
      rootConcept = "Frazeoloji birləşmələr (Sabit söz birləşmələri)"
      conceptName = "Frazeoloji birləşmələr (Sabit söz birləşmələri)"
      bt.root_grade = rootGrade
      bt.root_book = rootBook
      bt.root_concept = rootConcept
      bt.concept_name = conceptName
      bt.is_intra_grade = isIntra
    }
    // If it's a reading comprehension question mapped to an arbitrary previous reading text (e.g. Oqtay Eloğlu)
    else if (rootConcept.includes("Oqtay Eloğlu") || rootConcept.includes("Nə gözəl səslənir")) {
      rootGrade = qGrade
      isIntra = true
      rootBook = `${subjName} ${qGrade}`
      rootConcept = topicTitle
      conceptName = topicTitle
      bt.root_grade = rootGrade
      bt.root_book = rootBook
      bt.root_concept = rootConcept
      bt.concept_name = conceptName
      bt.is_intra_grade = true
    }
  }

  // 5.5. PHYSICS DOMAIN FIREWALL
  const isPhysicsSubject = /fizika/i.test(subjName)
  if (isPhysicsSubject) {
    const lowTopic = topicTitle.toLowerCase()
    const lowRc = rootConcept.toLowerCase()
    const lowCn = conceptName.toLowerCase()

    // Molecular Physics & Thermodynamics -> Grade 10 intra-grade
    if (/səthi gərilmə|kapilyar|rütubət|doyan|buxar|mkt|termodinamika|temperatur|ideal qaz/i.test(lowTopic)) {
      if (rootBook.includes("Fizika 9") || /lorens|qaz boşalması|işığın yayılma|qüvvə momenti|arximed/i.test(lowRc) || /arximed/i.test(lowCn)) {
        rootGrade = 10
        isIntra = true
        rootBook = "Fizika 10"
        rootConcept = topicTitle
        conceptName = topicTitle
        bt.root_grade = 10
        bt.root_book = rootBook
        bt.root_concept = rootConcept
        bt.concept_name = conceptName
        bt.is_intra_grade = true
      }
    }
  }

  // 5.6. INFORMATICS DOMAIN FIREWALL
  const isInformaticsSubject = /informatika/i.test(subjName)
  if (isInformaticsSubject) {
    const lowTopic = topicTitle.toLowerCase()
    const lowRc = rootConcept.toLowerCase()

    // 1. Modeling topics contaminated by Cybercrime / Antivirus
    if (/model|formalizasiya|adekvatl/i.test(lowTopic)) {
      if (/cinayət|kibertəhlükəsizlik|fişinq|spaminq|antivirus|dövri alqoritm/i.test(lowRc)) {
        rootGrade = qGrade
        isIntra = true
        rootBook = `İnformatika ${qGrade}`
        rootConcept = topicTitle
        conceptName = topicTitle
        bt.root_grade = qGrade
        bt.root_book = rootBook
        bt.root_concept = rootConcept
        bt.concept_name = conceptName
        bt.is_intra_grade = true
      }
    }
    // 2. Algorithm / Programming topics contaminated by Cybercrime
    else if (/alqoritm|python|proqramlaşdırma|dövr|massiv|siyahı/i.test(lowTopic)) {
      if (/cinayət|kibertəhlükəsizlik|fişinq|spaminq|antivirus/i.test(lowRc)) {
        rootGrade = qGrade
        isIntra = true
        rootBook = `İnformatika ${qGrade}`
        rootConcept = topicTitle
        conceptName = topicTitle
        bt.root_grade = qGrade
        bt.root_book = rootBook
        bt.root_concept = rootConcept
        bt.concept_name = conceptName
        bt.is_intra_grade = true
      }
    }
    // 3. AI / Modern Tech (Grade 11) contaminated by Phishing / Cybercrime
    else if (/süni intellekt|maşın öyrənməsi|ai|ml/i.test(lowTopic)) {
      if (/fişinq|spaminq|dos\/ddos/i.test(lowRc)) {
        rootGrade = qGrade
        isIntra = true
        rootBook = `İnformatika ${qGrade}`
        rootConcept = topicTitle
        conceptName = topicTitle
        bt.root_grade = qGrade
        bt.root_book = rootBook
        bt.root_concept = rootConcept
        bt.concept_name = conceptName
        bt.is_intra_grade = true
      }
    }
  }

  // 6. SYNCHRONIZED PARENT ACTION TIP GENERATION
  const cleanConcept = rootConcept.replace(/^([0-9]+|[IVXLCDM]+)[\.\:\-]\s*/i, "").replace(/^elmi anlayış:\s*/i, "").trim()
  
  // Subject-specific pedagogical phrasing
  const isHistorySubject = /tarix|истори/i.test(subjName)
  const isSTEMSubject = /riyaziyyat|həndəsə|cəbr|fizika|kimya|математик|геометр|физик|хими/i.test(subjName)
  const isNatureSubject = /biologiya|coğrafiya|təbiət|həyat bilgisi|биолог|географ|естество/i.test(subjName)
  const isLiteratureSubject = /ədəbiyyat|литератур/i.test(subjName)
  const isGrammarQuestion = isLanguageSubject && (/(cümlə|nitq|isim|sifət|feil|zərf|əvəzlik|şəkilçi|morfoloj|sintaktik|orfoqraf|qrammatika|tense|grammar|noun|verb|adjective|preposition|морфолог|синтаксич|падеж|склонени|спряжени|причасти|деепричасти|глагол|существительн|прилагательн)/i.test(fullText))

  let skillPhrase = "təməl bacarıqları"
  let ruleSuffix = "(əsas qaydaları)"

  if (isHistorySubject) {
    ruleSuffix = "(əsas tarixi hadisələri və prosesləri)"
    if (bloom === "Bilik") skillPhrase = "tarixi fakt və xronologiya biliklərini"
    else if (bloom === "Anlama") skillPhrase = "tarixi səbəb-nəticə əlaqələrini anlama bacarığını"
    else if (bloom === "Tətbiq") skillPhrase = "tarixi hadisələri dövrlərlə əlaqələndirmə bacarığını"
    else skillPhrase = "müqayisəli tarixi təhlil və analiz bacarığını"
  } else if (isLiteratureSubject) {
    ruleSuffix = "(bədii təhlilini)"
    if (bloom === "Bilik") skillPhrase = "ədəbi fakt və məlumatları"
    else if (bloom === "Anlama") skillPhrase = "oxuyub-anlama və bədii məzmunu qavrama bacarığını"
    else if (bloom === "Tətbiq") skillPhrase = "bədii təhlil bacarığını"
    else skillPhrase = "müqayisəli ədəbi təhlil və analiz bacarığını"
  } else if (isSTEMSubject) {
    ruleSuffix = "(əsas qayda və həll üsullarını)"
    if (bloom === "Bilik") skillPhrase = "təməl düstur və nəzəri anlayışları"
    else if (bloom === "Anlama") skillPhrase = "riyazi/elmi məntiqi anlama bacarığını"
    else if (bloom === "Tətbiq") skillPhrase = "məsələ və misal həlli bacarığını"
    else skillPhrase = "mürəkkəb riyazi/elmi təhlil bacarığını"
  } else if (isNatureSubject) {
    ruleSuffix = "(elmi anlayış və qanunauyğunluqları)"
    if (bloom === "Bilik") skillPhrase = "təbiət və elmi faktları"
    else if (bloom === "Anlama") skillPhrase = "elmi hadisələri anlama və izah etmə bacarığını"
    else if (bloom === "Tətbiq") skillPhrase = "təbiət qanunlarını tətbiq etmə bacarığını"
    else skillPhrase = "elmi müşahidə və analiz bacarığını"
  } else if (isLanguageSubject) {
    if (isGrammarQuestion) {
      ruleSuffix = "(əsas qrammatik qaydaları)"
      if (bloom === "Bilik") skillPhrase = "təməl qrammatik qaydaları"
      else if (bloom === "Anlama") skillPhrase = "qrammatik qaydaları anlama və qavrama bacarığını"
      else if (bloom === "Tətbiq") skillPhrase = "qrammatik qaydaları nitqdə tətbiq etmə bacarığını"
      else skillPhrase = "dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
    } else if (fullText.includes("frazeoloji") || fullText.includes("sinonim") || fullText.includes("antonim")) {
      ruleSuffix = "(leksik məna xüsusiyyətlərini)"
      skillPhrase = "lüğət ehtiyatı və leksik bacarıqlarını"
    } else if (bloom === "Bilik") {
      ruleSuffix = "(dil qaydalarını)"
      skillPhrase = "lüğət ehtiyatı və faktik dil qaydalarını"
    } else if (bloom === "Anlama") {
      ruleSuffix = "(mətnin əsas məzmununu)"
      skillPhrase = "oxuyub-anlama və mətni qavrama bacarığını"
    } else if (bloom === "Tətbiq") {
      ruleSuffix = "(tətbiqi tapşırıqları)"
      skillPhrase = "praktik tətbiq bacarığını"
    } else {
      ruleSuffix = "(təhlil qaydalarını)"
      skillPhrase = "mətni və dil vahidlərini sintaktik/semantik təhlil etmə bacarığını"
    }
  } else {
    if (bloom === "Bilik") skillPhrase = "təməl anlayış və faktik bilikləri"
    else if (bloom === "Anlama") skillPhrase = "mövzunu anlama və qavrama bacarığını"
    else if (bloom === "Tətbiq") skillPhrase = "praktik tətbiq və məsələ həlli bacarığını"
    else skillPhrase = "müqayisəli təhlil və elmi analiz bacarığını"
  }

  let tip = ""
  const qSuff = getGradeOrdinalSuffix(qGrade)
  const rootSuff = getGradeOrdinalSuffix(rootGrade)

  // Clean redundant grade from book name if present (e.g. "Azərbaycan tarixi 10" -> "Azərbaycan tarixi")
  const cleanRootBook = rootBook.replace(new RegExp(`\\s+${rootGrade}$`), "")

  if (isIntra || rootGrade === qGrade) {
    if (duration === 10) {
      tip = `Övladınızın ${skillPhrase} möhkəmləndirmək üçün hazırda istifadə etdiyi ${qGrade}-${qSuff} sinif ${cleanRootBook} dərsliyindəki '${cleanConcept}' mövzusunu ${ruleSuffix} 10 dəqiqə nəzərdən keçirməsi kifayətdir.`
    } else if (duration === 15) {
      tip = `Övladınızın ${skillPhrase} möhkəmləndirmək üçün hazırda istifadə etdiyi ${qGrade}-${qSuff} sinif ${cleanRootBook} dərsliyindəki '${cleanConcept}' mövzusunu və nümunə situasiya tapşırıqlarını 15 dəqiqə işləyin.`
    } else {
      tip = `Övladınızın ${skillPhrase} inkişaf etdirməsi üçün hazırda istifadə etdiyi ${qGrade}-${qSuff} sinif ${cleanRootBook} dərsliyindəki '${cleanConcept}' mövzusunun dərin suallarını 20 dəqiqə dərindən araşdırın.`
    }
  } else {
    if (duration === 10) {
      tip = `Övladınızın ${skillPhrase} möhkəmləndirmək üçün ${rootGrade}-${rootSuff} sinif ${cleanRootBook} dərsliyindəki '${cleanConcept}' təməl mövzusunu 10 dəqiqə təkrarlayın.`
    } else if (duration === 15) {
      tip = `Övladınızın ${skillPhrase} möhkəmləndirmək üçün ${rootGrade}-${rootSuff} sinif ${cleanRootBook} dərsliyindəki '${cleanConcept}' təməl mövzusunu və 2-3 nümunə situasiya tapşırığını 15 dəqiqə işləyin.`
    } else {
      tip = `Övladınızın ${skillPhrase} inkişaf etdirməsi üçün ${rootGrade}-${rootSuff} sinif ${cleanRootBook} dərsliyindəki '${cleanConcept}' təməl mövzusunu və səbəb-nəticə əlaqələrini 20 dəqiqə dərindən araşdırın.`
    }
  }

  // Zero-Page Invariant
  tip = tip.replace(/\b(?:dərslik\s*)?(?:səh(?:ifə)?|s\.|page)\s*\.?\s*\d+[-–\d]*[:\.]?/gi, "")
  tip = tip.replace(/\s{2,}/g, " ").trim()
  bt.parent_action_tip = tip

  return q
}
