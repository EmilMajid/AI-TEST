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

  // 5.7. CANONICAL KNOWLEDGE GRAPH RESOLUTION (SİTG Gold Core v5.0)
  const canonicalMatch = resolveCanonicalOntologyNode(fullText, subjName)
  if (canonicalMatch) {
    bt.canonical_node_id = canonicalMatch.id
    bt.canonical_type = canonicalMatch.type
    bt.first_grade_verified = canonicalMatch.firstGradeVerified
    
    if (canonicalMatch.prerequisiteId) {
      bt.prerequisite_node_id = canonicalMatch.prerequisiteId
      // Ground the root concept to the pedagogical prerequisite if cross-grade/hierarchical
      if (canonicalMatch.prerequisiteLabel) {
        bt.root_concept = canonicalMatch.prerequisiteLabel
        bt.concept_name = canonicalMatch.prerequisiteLabel
      }
    }
    
    if (canonicalMatch.distractorId) {
      bt.distractor_contrast_node_id = canonicalMatch.distractorId
      bt.distractor_contrast_label = canonicalMatch.distractorLabel
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

// ============================================================================
// CANONICAL ONTOLOGY REGISTRY & RESOLVER (SİTG Gold Core v5.0)
// ============================================================================

export interface CanonicalOntologyMatch {
  id: string
  label: string
  type: string
  subject: string
  firstGradeVerified: number
  prerequisiteId?: string
  prerequisiteLabel?: string
  distractorId?: string
  distractorLabel?: string
}

const CANONICAL_ONTOLOGY_REGISTRY = [
  {
    "id": "math_teorem_ters_teorem",
    "stem": "tərs teorem",
    "aliases": [
      "Hər hansı teoremi"
    ],
    "label": "Tərs teorem",
    "type": "Teorem",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "math_teorem_pifaqor",
    "distLabel": "Pifaqor teoremi"
  },
  {
    "id": "math_anlayis_ikideyisenli_xetti_tenlik",
    "stem": "i̇kidəyişənli xətti tənlik",
    "aliases": [
      "Dəyişənlərin ikidəyişənli xətti tənliyi"
    ],
    "label": "İkidəyişənli xətti tənlik",
    "type": "Anlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "math_teorem_pifaqor",
    "stem": "pifaqor",
    "aliases": [
      "Rasional ifadələr Pifaqor teoremi",
      "Z Pifaqor teoremi"
    ],
    "label": "Pifaqor teoremi",
    "type": "Teorem",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "math_teorem_ters_teorem",
    "distLabel": "Tərs teorem"
  },
  {
    "id": "math_anlayis_kvadrat_tenlik",
    "stem": "kvadrat tənlik",
    "aliases": [
      "Kvadrat tənliyi",
      "D Verilmiş kvadrat tənliyi"
    ],
    "label": "Kvadrat tənlik",
    "type": "Anlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "math_teorem_viyet",
    "stem": "viyet",
    "aliases": [
      "Onda Viyet teoremi"
    ],
    "label": "Viyet teoremi",
    "type": "Teorem",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": "math_anlayis_kvadrat_tenlik",
    "prereqLabel": "Kvadrat tənlik",
    "distId": null,
    "distLabel": null
  },
  {
    "id": "math_dustur_heron",
    "stem": "heron",
    "aliases": [],
    "label": "Heron düsturu",
    "type": "Düstur",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "math_teorem_fales",
    "stem": "fales",
    "aliases": [],
    "label": "Fales teoremi",
    "type": "Teorem",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "bio_proses_zulallarin_denaturasiyasi",
    "stem": "zülalların denaturasiyası",
    "aliases": [
      "Zülalların denaturasiyası prosesi"
    ],
    "label": "Zülalların denaturasiyası",
    "type": "BiolojiProses",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "bio_xestelik_qrip",
    "stem": "qrip",
    "aliases": [
      "Qrip xəstəliyi"
    ],
    "label": "Qrip",
    "type": "Xəstəlik",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "bio_xestelik_qizilca",
    "distLabel": "Qızılca"
  },
  {
    "id": "bio_xestelik_qizilca",
    "stem": "qızılca",
    "aliases": [
      "Qızılca xəstəliyi"
    ],
    "label": "Qızılca",
    "type": "Xəstəlik",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "bio_xestelik_qrip",
    "distLabel": "Qrip"
  },
  {
    "id": "bio_proses_translyasiya",
    "stem": "translyasiya",
    "aliases": [
      "Translyasiya prosesi"
    ],
    "label": "Translyasiya",
    "type": "BiolojiProses",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "bio_proses_qlukozanin_oksidlesmesi",
    "stem": "qlükozanın oksidləşməsi",
    "aliases": [
      "Qlükozanın oksidləşməsi prosesi"
    ],
    "label": "Qlükozanın oksidləşməsi",
    "type": "BiolojiProses",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": "chem_anlayis_oksidlesme_derecesi",
    "prereqLabel": "Oksidləşmə dərəcəsi",
    "distId": null,
    "distLabel": null
  },
  {
    "id": "bio_proses_tekamul",
    "stem": "təkamül",
    "aliases": [
      "Təkamül prosesi"
    ],
    "label": "Təkamül",
    "type": "BiolojiProses",
    "subject": "Biologiya",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "bio_proses_makrotekamul",
    "distLabel": "Makrotəkamül"
  },
  {
    "id": "bio_xestelik_talassemiya",
    "stem": "talassemiya",
    "aliases": [
      "Talassemiya xəstəliyi"
    ],
    "label": "Talassemiya",
    "type": "Xəstəlik",
    "subject": "Biologiya",
    "firstGradeVerified": 10,
    "prereqId": "bio_proses_translyasiya",
    "prereqLabel": "Translyasiya",
    "distId": null,
    "distLabel": null
  },
  {
    "id": "bio_xestelik_daun_sindromu",
    "stem": "daun sindromu",
    "aliases": [
      "Daun sindromu xəstəliyi"
    ],
    "label": "Daun sindromu",
    "type": "Xəstəlik",
    "subject": "Biologiya",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "bio_proses_makrotekamul",
    "stem": "makrotəkamül",
    "aliases": [
      "Makrotəkamül prosesi"
    ],
    "label": "Makrotəkamül",
    "type": "BiolojiProses",
    "subject": "Biologiya",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "bio_proses_tekamul",
    "distLabel": "Təkamül"
  },
  {
    "id": "bio_qanun_mendel_1",
    "stem": "mendelin birinci",
    "aliases": [
      "Mendelin I qanunu"
    ],
    "label": "Mendelin birinci qanunu",
    "type": "Qanun",
    "subject": "Biologiya",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_doyus_dzirav",
    "stem": "dzirav",
    "aliases": [],
    "label": "Dzirav döyüşü",
    "type": "TarixiDöyüş",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_doyus_dendenekan",
    "stem": "dəndənəkan",
    "aliases": [
      "Qəznəlilər arasında baş verən Dəndənəkan döyüşü"
    ],
    "label": "Dəndənəkan döyüşü",
    "type": "TarixiDöyüş",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_doyus_didqori",
    "stem": "didqori",
    "aliases": [],
    "label": "Didqori döyüşü",
    "type": "TarixiDöyüş",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_hadise_gence_usyani",
    "stem": "gəncə üsyanı (usta bəndər)",
    "aliases": [
      "Gəncə üsyanı"
    ],
    "label": "Gəncə üsyanı (Usta Bəndər)",
    "type": "TarixiHadisə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_hadise_qazan_xan_islahatlari",
    "stem": "qazan xanın islahatları",
    "aliases": [
      "Qazan xanın dini islahatı",
      "Miniatür Qazan xanın vergi islahatı",
      "Qazan xanın torpaq islahatı"
    ],
    "label": "Qazan xanın islahatları",
    "type": "TarixiHadisə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_muqavile_amasiya_1555",
    "stem": "amasiya",
    "aliases": [
      "Xoya hücum etməsi Amasiya sülhü"
    ],
    "label": "Amasiya sülhü",
    "type": "Müqavilə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "hist_muqavile_qesri_sirin_1639",
    "distLabel": "Qəsri-Şirin sülhü"
  },
  {
    "id": "hist_muqavile_qesri_sirin_1639",
    "stem": "qəsri-şirin",
    "aliases": [],
    "label": "Qəsri-Şirin sülhü",
    "type": "Müqavilə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "hist_muqavile_amasiya_1555",
    "distLabel": "Amasiya sülhü"
  },
  {
    "id": "hist_muqavile_serab_1618",
    "stem": "sərab",
    "aliases": [],
    "label": "Sərab sülhü",
    "type": "Müqavilə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_muqavile_gence_1735",
    "stem": "gəncə",
    "aliases": [
      "Gəncə sülhü"
    ],
    "label": "Gəncə müqaviləsi",
    "type": "Müqavilə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_muqavile_rest_1732",
    "stem": "rəşt",
    "aliases": [
      "Rəşt sülhü"
    ],
    "label": "Rəşt müqaviləsi",
    "type": "Müqavilə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_hadise_mugan_qurultayi_1736",
    "stem": "muğan qurultayı",
    "aliases": [],
    "label": "Muğan qurultayı",
    "type": "TarixiHadisə",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_doyus_serdrud_1408",
    "stem": "sərdrud",
    "aliases": [],
    "label": "Sərdrud döyüşü",
    "type": "TarixiDöyüş",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "hist_doyus_caldiran",
    "stem": "çaldıran",
    "aliases": [
      "A MərT məə Çaldıran döyüşü"
    ],
    "label": "Çaldıran döyüşü",
    "type": "TarixiDöyüş",
    "subject": "Azərbaycan tarixi",
    "firstGradeVerified": 10,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "phys_qanun_paskal",
    "stem": "paskal",
    "aliases": [],
    "label": "Paskal qanunu",
    "type": "FizikiQanun",
    "subject": "Fizika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "phys_cihaz_ampermetr",
    "stem": "ampermetr",
    "aliases": [],
    "label": "Ampermetr",
    "type": "Cihaz/Qurğu",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "phys_cihaz_voltmetr",
    "distLabel": "Voltmetr"
  },
  {
    "id": "phys_cihaz_voltmetr",
    "stem": "voltmetr",
    "aliases": [],
    "label": "Voltmetr",
    "type": "Cihaz/Qurğu",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "phys_cihaz_ampermetr",
    "distLabel": "Ampermetr"
  },
  {
    "id": "phys_qanun_kulon",
    "stem": "kulon",
    "aliases": [],
    "label": "Kulon qanunu",
    "type": "FizikiQanun",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "chem_anlayis_valentlik",
    "stem": "valentlik",
    "aliases": [],
    "label": "Valentlik",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "chem_anlayis_oksidlesme_derecesi",
    "stem": "oksidləşmə dərəcəsi",
    "aliases": [],
    "label": "Oksidləşmə dərəcəsi",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": "chem_qanun_dovri_qanun",
    "prereqLabel": "Mendeleyevin dövri qanunu",
    "distId": null,
    "distLabel": null
  },
  {
    "id": "geo_obyekt_xezer_denizi",
    "stem": "xəzər dənizi",
    "aliases": [],
    "label": "Xəzər dənizi",
    "type": "CoğrafiObyekt",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "geo_qanunauygunluq_enlik_zonalligi",
    "stem": "coğrafi enlik zonallığı",
    "aliases": [],
    "label": "Coğrafi enlik zonallığı",
    "type": "CoğrafiQanunauyğunluq",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "geo_hadise_musson",
    "stem": "musson küləkləri",
    "aliases": [],
    "label": "Musson küləkləri",
    "type": "CoğrafiHadisə",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "geo_hadise_passat",
    "distLabel": "Passat küləkləri"
  },
  {
    "id": "geo_hadise_passat",
    "stem": "passat küləkləri",
    "aliases": [],
    "label": "Passat küləkləri",
    "type": "CoğrafiHadisə",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": "geo_hadise_musson",
    "distLabel": "Musson küləkləri"
  },
  {
    "id": "geo_obyekt_kur_cayi",
    "stem": "kür çayı",
    "aliases": [],
    "label": "Kür çayı",
    "type": "CoğrafiObyekt",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "phys_qanun_ohm",
    "stem": "ohm",
    "aliases": [
      "Om qanunu"
    ],
    "label": "Ohm qanunu",
    "type": "FizikiQanun",
    "subject": "Fizika",
    "firstGradeVerified": 7,
    "prereqId": "math_anlayis_ikideyisenli_xetti_tenlik",
    "prereqLabel": "İkidəyişənli xətti tənlik",
    "distId": null,
    "distLabel": null
  },
  {
    "id": "chem_qanun_kutlenin_saxlanmasi",
    "stem": "maddə kütləsinin saxlanması",
    "aliases": [
      "Kütlənin saxlanması qanunu"
    ],
    "label": "Maddə kütləsinin saxlanması qanunu",
    "type": "KimyəviQanun",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": "chem_anlayis_valentlik",
    "prereqLabel": "Valentlik",
    "distId": null,
    "distLabel": null
  },
  {
    "id": "chem_qanun_dovri_qanun",
    "stem": "mendeleyevin dövri",
    "aliases": [
      "Dövri qanun"
    ],
    "label": "Mendeleyevin dövri qanunu",
    "type": "KimyəviQanun",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_model_451",
    "stem": "model",
    "aliases": [],
    "label": "Model",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_tminat_455",
    "stem": "tminat",
    "aliases": [],
    "label": "Tminat",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_tqqlt_456",
    "stem": "tqqlt",
    "aliases": [],
    "label": "Tqqlt",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_altmenyu_457",
    "stem": "altmenyu",
    "aliases": [],
    "label": "Altmenyu",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_menyusu_457",
    "stem": "menyusu",
    "aliases": [],
    "label": "Menyusu",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_alqoritm_466",
    "stem": "alqoritm",
    "aliases": [],
    "label": "Alqoritm",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_proqram_470",
    "stem": "proqram",
    "aliases": [],
    "label": "Proqram",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_xarakter_485",
    "stem": "xarakter",
    "aliases": [],
    "label": "Xarakter",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_samit_568",
    "stem": "samit",
    "aliases": [],
    "label": "Samit",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_mtn_586",
    "stem": "mtn",
    "aliases": [],
    "label": "Mtn",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_vzliklr_588",
    "stem": "vzliklr",
    "aliases": [],
    "label": "Vzliklr",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_marafon_590",
    "stem": "marafon",
    "aliases": [],
    "label": "Marafon",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kvadratda_728",
    "stem": "kvadratda",
    "aliases": [],
    "label": "Kvadratda",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kubda_728",
    "stem": "kubda",
    "aliases": [],
    "label": "Kubda",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ddinblni_736",
    "stem": "ddinblni",
    "aliases": [],
    "label": "Ddinblni",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ədədinbölünəni_738",
    "stem": "ədədinbölünəni",
    "aliases": [],
    "label": "Ədədinbölünəni",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_ərimətemperaturu_1247",
    "stem": "ərimətemperaturu",
    "aliases": [],
    "label": "Ərimətemperaturu",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_qaynamatemperaturu_1250",
    "stem": "qaynamatemperaturu",
    "aliases": [],
    "label": "Qaynamatemperaturu",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_kondensasiya_1251",
    "stem": "kondensasiya",
    "aliases": [],
    "label": "Kondensasiya",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_şeh_1251",
    "stem": "şeh",
    "aliases": [],
    "label": "Şeh",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_hadisə_1257",
    "stem": "hadisə",
    "aliases": [],
    "label": "Hadisə",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_hadisələr_1257",
    "stem": "hadisələr",
    "aliases": [],
    "label": "Hadisələr",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_reaksiyalar_1260",
    "stem": "reaksiyalar",
    "aliases": [],
    "label": "Reaksiyalar",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_qanunu_1293",
    "stem": "qanunu",
    "aliases": [],
    "label": "Qanunu",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_enerjisi_1305",
    "stem": "enerjisi",
    "aliases": [],
    "label": "Enerjisi",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_isəomnivorlar_1309",
    "stem": "isəomnivorlar",
    "aliases": [],
    "label": "Isəomnivorlar",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_şikar_1310",
    "stem": "şikar",
    "aliases": [],
    "label": "Şikar",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_leşyeyənlər_1312",
    "stem": "leşyeyənlər",
    "aliases": [],
    "label": "Leşyeyənlər",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_cisim_1316",
    "stem": "cisim",
    "aliases": [],
    "label": "Cisim",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_mühit_1326",
    "stem": "mühit",
    "aliases": [],
    "label": "Mühit",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_lava_1340",
    "stem": "lava",
    "aliases": [],
    "label": "Lava",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_vulkan_1344",
    "stem": "vulkan",
    "aliases": [],
    "label": "Vulkan",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_vulkanlar_1344",
    "stem": "vulkanlar",
    "aliases": [],
    "label": "Vulkanlar",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_qruplar_1524",
    "stem": "qruplar",
    "aliases": [],
    "label": "Qruplar",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 5,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_təhkiyəçi_2489",
    "stem": "təhkiyəçi",
    "aliases": [],
    "label": "Təhkiyəçi",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_piktoqrafiya_2509",
    "stem": "piktoqrafiya",
    "aliases": [],
    "label": "Piktoqrafiya",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_işarəpiktoqram_2509",
    "stem": "işarəpiktoqram",
    "aliases": [],
    "label": "Işarəpiktoqram",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_ideoqram_2510",
    "stem": "ideoqram",
    "aliases": [],
    "label": "Ideoqram",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_mənahiperonim_2519",
    "stem": "mənahiperonim",
    "aliases": [],
    "label": "Mənahiperonim",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_mühərriki_2625",
    "stem": "mühərriki",
    "aliases": [],
    "label": "Mühərriki",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_inversiya_2629",
    "stem": "inversiya",
    "aliases": [],
    "label": "Inversiya",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_yüksəltməəməli_2671",
    "stem": "yüksəltməəməli",
    "aliases": [],
    "label": "Yüksəltməəməli",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_prosesimitoz_2673",
    "stem": "prosesimitoz",
    "aliases": [],
    "label": "Prosesimitoz",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ədəd_2690",
    "stem": "ədəd",
    "aliases": [],
    "label": "Ədəd",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_bərabərliyinətənasüb_2704",
    "stem": "bərabərliyinətənasüb",
    "aliases": [],
    "label": "Bərabərliyinətənasüb",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_nisbətinəmiqyas_2708",
    "stem": "nisbətinəmiqyas",
    "aliases": [],
    "label": "Nisbətinəmiqyas",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_onunçözümlülüyü_2732",
    "stem": "onunçözümlülüyü",
    "aliases": [],
    "label": "Onunçözümlülüyü",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_milad_2737",
    "stem": "milad",
    "aliases": [],
    "label": "Milad",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_sistemidə_2787",
    "stem": "sistemidə",
    "aliases": [],
    "label": "Sistemidə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_tamədədlər_2788",
    "stem": "tamədədlər",
    "aliases": [],
    "label": "Tamədədlər",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_vuruğaəmsal_2814",
    "stem": "vuruğaəmsal",
    "aliases": [],
    "label": "Vuruğaəmsal",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_çəkilənhündürlüyü_2840",
    "stem": "çəkilənhündürlüyü",
    "aliases": [],
    "label": "Çəkilənhündürlüyü",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_median_2886",
    "stem": "median",
    "aliases": [],
    "label": "Median",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_moda_2887",
    "stem": "moda",
    "aliases": [],
    "label": "Moda",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_qüvvəsidə_2920",
    "stem": "qüvvəsidə",
    "aliases": [],
    "label": "Qüvvəsidə",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_qüvvəsi_2929",
    "stem": "qüvvəsi",
    "aliases": [],
    "label": "Qüvvəsi",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_isəmədəciklər_2938",
    "stem": "isəmədəciklər",
    "aliases": [],
    "label": "Isəmədəciklər",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_hissəsinəplazma_2943",
    "stem": "hissəsinəplazma",
    "aliases": [],
    "label": "Hissəsinəplazma",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_isəsahib_2961",
    "stem": "isəsahib",
    "aliases": [],
    "label": "Isəsahib",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_xəstəliklər_2972",
    "stem": "xəstəliklər",
    "aliases": [],
    "label": "Xəstəliklər",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_zərrəciklərmolekullar_2982",
    "stem": "zərrəciklərmolekullar",
    "aliases": [],
    "label": "Zərrəciklərmolekullar",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_element_2999",
    "stem": "element",
    "aliases": [],
    "label": "Element",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_yanaqillər_3033",
    "stem": "yanaqillər",
    "aliases": [],
    "label": "Yanaqillər",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_isədielektriklər_3033",
    "stem": "isədielektriklər",
    "aliases": [],
    "label": "Isədielektriklər",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_infrasəs_3046",
    "stem": "infrasəs",
    "aliases": [],
    "label": "Infrasəs",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_ötürülməsinəistilikkeçirmə_3058",
    "stem": "ötürülməsinəistilikkeçirmə",
    "aliases": [],
    "label": "Ötürülməsinəistilikkeçirmə",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_ötürülməsikonveksiya_3061",
    "stem": "ötürülməsikonveksiya",
    "aliases": [],
    "label": "Ötürülməsikonveksiya",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_uyğunlaşmamimikriya_3080",
    "stem": "uyğunlaşmamimikriya",
    "aliases": [],
    "label": "Uyğunlaşmamimikriya",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_gövdələr_3084",
    "stem": "gövdələr",
    "aliases": [],
    "label": "Gövdələr",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_mənbələri_3110",
    "stem": "mənbələri",
    "aliases": [],
    "label": "Mənbələri",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_planetlər_3126",
    "stem": "planetlər",
    "aliases": [],
    "label": "Planetlər",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_nəhəngləri_3126",
    "stem": "nəhəngləri",
    "aliases": [],
    "label": "Nəhəngləri",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_müddətil_3130",
    "stem": "müddətil",
    "aliases": [],
    "label": "Müddətil",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_yaygündönümü_3131",
    "stem": "yaygündönümü",
    "aliases": [],
    "label": "Yaygündönümü",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_təb_şgündönümü_3132",
    "stem": "şgündönümü",
    "aliases": [],
    "label": "Şgündönümü",
    "type": "TəbiiAnlayış",
    "subject": "Təbiət",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_litosfer_3416",
    "stem": "litosfer",
    "aliases": [],
    "label": "Litosfer",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_təbəqəsiatmosfer_3417",
    "stem": "təbəqəsiatmosfer",
    "aliases": [],
    "label": "Təbəqəsiatmosfer",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_hissəsibiosfer_3417",
    "stem": "hissəsibiosfer",
    "aliases": [],
    "label": "Hissəsibiosfer",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_hissəsihidrosfer_3417",
    "stem": "hissəsihidrosfer",
    "aliases": [],
    "label": "Hissəsihidrosfer",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_cəmirelyef_3418",
    "stem": "cəmirelyef",
    "aliases": [],
    "label": "Cəmirelyef",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_cəmiyyət_3447",
    "stem": "cəmiyyət",
    "aliases": [],
    "label": "Cəmiyyət",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_çərşənbəsi_3456",
    "stem": "çərşənbəsi",
    "aliases": [],
    "label": "Çərşənbəsi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_torpaqçərşənbəsi_3456",
    "stem": "torpaqçərşənbəsi",
    "aliases": [],
    "label": "Torpaqçərşənbəsi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_maddələr_3515",
    "stem": "maddələr",
    "aliases": [],
    "label": "Maddələr",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_qəza_3546",
    "stem": "qəza",
    "aliases": [],
    "label": "Qəza",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_dövrü_3581",
    "stem": "dövrü",
    "aliases": [],
    "label": "Dövrü",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_mədəniyyətidə_3607",
    "stem": "mədəniyyətidə",
    "aliases": [],
    "label": "Mədəniyyətidə",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_sistemfeodalizm_3681",
    "stem": "sistemfeodalizm",
    "aliases": [],
    "label": "Sistemfeodalizm",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_tuncdövrü_3712",
    "stem": "tuncdövrü",
    "aliases": [],
    "label": "Tuncdövrü",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_adamlara_3820",
    "stem": "adamlara",
    "aliases": [],
    "label": "Adamlara",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_vinçester_4037",
    "stem": "vinçester",
    "aliases": [],
    "label": "Vinçester",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_ğabayt_4041",
    "stem": "ğabayt",
    "aliases": [],
    "label": "Ğabayt",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_bit_4044",
    "stem": "bit",
    "aliases": [],
    "label": "Bit",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_dəslayd_4057",
    "stem": "dəslayd",
    "aliases": [],
    "label": "Dəslayd",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_naalqoritm_4067",
    "stem": "naalqoritm",
    "aliases": [],
    "label": "Naalqoritm",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_müəyyənlikxassəsi_4067",
    "stem": "müəyyənlikxassəsi",
    "aliases": [],
    "label": "Müəyyənlikxassəsi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_sonluluqxassəsi_4067",
    "stem": "sonluluqxassəsi",
    "aliases": [],
    "label": "Sonluluqxassəsi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_diskretlikxassəsi_4067",
    "stem": "diskretlikxassəsi",
    "aliases": [],
    "label": "Diskretlikxassəsi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_dövr_4070",
    "stem": "dövr",
    "aliases": [],
    "label": "Dövr",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_yaxudkonstantlar_4080",
    "stem": "yaxudkonstantlar",
    "aliases": [],
    "label": "Yaxudkonstantlar",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 6,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_çiçəklər_5258",
    "stem": "çiçəklər",
    "aliases": [],
    "label": "Çiçəklər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_hüceyrə_5265",
    "stem": "hüceyrə",
    "aliases": [],
    "label": "Hüceyrə",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_isəbirləpəlibitkilər_5267",
    "stem": "isəbirləpəlibitkilər",
    "aliases": [],
    "label": "Isəbirləpəlibitkilər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_meyvə_5275",
    "stem": "meyvə",
    "aliases": [],
    "label": "Meyvə",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_hissələrəeksplantlar_5286",
    "stem": "hissələrəeksplantlar",
    "aliases": [],
    "label": "Hissələrəeksplantlar",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_meduza_5299",
    "stem": "meduza",
    "aliases": [],
    "label": "Meduza",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_biomimikriya_5307",
    "stem": "biomimikriya",
    "aliases": [],
    "label": "Biomimikriya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_zonalar_5317",
    "stem": "zonalar",
    "aliases": [],
    "label": "Zonalar",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_hərəkət_5410",
    "stem": "hərəkət",
    "aliases": [],
    "label": "Hərəkət",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_larda_5465",
    "stem": "larda",
    "aliases": [],
    "label": "Larda",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_elektrostatika_5477",
    "stem": "elektrostatika",
    "aliases": [],
    "label": "Elektrostatika",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_izotoplar_5562",
    "stem": "izotoplar",
    "aliases": [],
    "label": "Izotoplar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_çuqun_5595",
    "stem": "çuqun",
    "aliases": [],
    "label": "Çuqun",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_polad_5596",
    "stem": "polad",
    "aliases": [],
    "label": "Polad",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_dəniz_5602",
    "stem": "dəniz",
    "aliases": [],
    "label": "Dəniz",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_xromatoqram_5615",
    "stem": "xromatoqram",
    "aliases": [],
    "label": "Xromatoqram",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_beləmaddələrəindikatorlar_5648",
    "stem": "beləmaddələrəindikatorlar",
    "aliases": [],
    "label": "Beləmaddələrəindikatorlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_resurslar_5682",
    "stem": "resurslar",
    "aliases": [],
    "label": "Resurslar",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_küləyi_5753",
    "stem": "küləyi",
    "aliases": [],
    "label": "Küləyi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_hava_5760",
    "stem": "hava",
    "aliases": [],
    "label": "Hava",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_kütlələri_5772",
    "stem": "kütlələri",
    "aliases": [],
    "label": "Kütlələri",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_ərazilərməskunlaşmaəraziləri_5785",
    "stem": "ərazilərməskunlaşmaəraziləri",
    "aliases": [],
    "label": "Ərazilərməskunlaşmaəraziləri",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_sahibkar_5819",
    "stem": "sahibkar",
    "aliases": [],
    "label": "Sahibkar",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_lar_5819",
    "stem": "lar",
    "aliases": [],
    "label": "Lar",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_feillər_5869",
    "stem": "feillər",
    "aliases": [],
    "label": "Feillər",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_ədə_mübaliğə_6015",
    "stem": "mübaliğə",
    "aliases": [],
    "label": "Mübaliğə",
    "type": "ƏdəbiNəzəriyyə",
    "subject": "Ədəbiyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kəsr_6195",
    "stem": "kəsr",
    "aliases": [],
    "label": "Kəsr",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_oxuda_6200",
    "stem": "oxuda",
    "aliases": [],
    "label": "Oxuda",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_birhədli_6238",
    "stem": "birhədli",
    "aliases": [],
    "label": "Birhədli",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ədədəmsal_6238",
    "stem": "ədədəmsal",
    "aliases": [],
    "label": "Ədədəmsal",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_konqruyent_6347",
    "stem": "konqruyent",
    "aliases": [],
    "label": "Konqruyent",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_qlar_6406",
    "stem": "qlar",
    "aliases": [],
    "label": "Qlar",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_lövhədə_7570",
    "stem": "lövhədə",
    "aliases": [],
    "label": "Lövhədə",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_klavişləridə_7574",
    "stem": "klavişləridə",
    "aliases": [],
    "label": "Klavişləridə",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_bayt_7610",
    "stem": "bayt",
    "aliases": [],
    "label": "Bayt",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_kəmiyyətlərəkonstantlarda_7624",
    "stem": "kəmiyyətlərəkonstantlarda",
    "aliases": [],
    "label": "Kəmiyyətlərəkonstantlarda",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_məlumatlara_7646",
    "stem": "məlumatlara",
    "aliases": [],
    "label": "Məlumatlara",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 7,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_rma_7657",
    "stem": "rma",
    "aliases": [],
    "label": "Rma",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_multimedia_7672",
    "stem": "multimedia",
    "aliases": [],
    "label": "Multimedia",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_interpretator_7688",
    "stem": "interpretator",
    "aliases": [],
    "label": "Interpretator",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_konstantlar_7695",
    "stem": "konstantlar",
    "aliases": [],
    "label": "Konstantlar",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_kök_7718",
    "stem": "kök",
    "aliases": [],
    "label": "Kök",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_ağac_7718",
    "stem": "ağac",
    "aliases": [],
    "label": "Ağac",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_yarpaqlar_7719",
    "stem": "yarpaqlar",
    "aliases": [],
    "label": "Yarpaqlar",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_pəncərəsi_7732",
    "stem": "pəncərəsi",
    "aliases": [],
    "label": "Pəncərəsi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_kitab_7747",
    "stem": "kitab",
    "aliases": [],
    "label": "Kitab",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_xana_7747",
    "stem": "xana",
    "aliases": [],
    "label": "Xana",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_istinadlar_7752",
    "stem": "istinadlar",
    "aliases": [],
    "label": "Istinadlar",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_funksiyalar_7754",
    "stem": "funksiyalar",
    "aliases": [],
    "label": "Funksiyalar",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_birləşməsi_7778",
    "stem": "birləşməsi",
    "aliases": [],
    "label": "Birləşməsi",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_birləşmələr_7792",
    "stem": "birləşmələr",
    "aliases": [],
    "label": "Birləşmələr",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_sitat_7863",
    "stem": "sitat",
    "aliases": [],
    "label": "Sitat",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_üzvlər_7940",
    "stem": "üzvlər",
    "aliases": [],
    "label": "Üzvlər",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_sözlər_7945",
    "stem": "sözlər",
    "aliases": [],
    "label": "Sözlər",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_xitab_7962",
    "stem": "xitab",
    "aliases": [],
    "label": "Xitab",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_söz-cümlə_7990",
    "stem": "söz-cümlə",
    "aliases": [],
    "label": "Söz-cümlə",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_cümlələr_8003",
    "stem": "cümlələr",
    "aliases": [],
    "label": "Cümlələr",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_ədə_kompozisiya_8180",
    "stem": "kompozisiya",
    "aliases": [],
    "label": "Kompozisiya",
    "type": "ƏdəbiNəzəriyyə",
    "subject": "Ədəbiyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_ədə_kinayə_8180",
    "stem": "kinayə",
    "aliases": [],
    "label": "Kinayə",
    "type": "ƏdəbiNəzəriyyə",
    "subject": "Ədəbiyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_ədə_dram_8229",
    "stem": "dram",
    "aliases": [],
    "label": "Dram",
    "type": "ƏdəbiNəzəriyyə",
    "subject": "Ədəbiyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_ədə_hissəsinə_8313",
    "stem": "hissəsinə",
    "aliases": [],
    "label": "Hissəsinə",
    "type": "ƏdəbiNəzəriyyə",
    "subject": "Ədəbiyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_vvə_8684",
    "stem": "vvə",
    "aliases": [],
    "label": "Vvə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_vvəsi_8689",
    "stem": "vvəsi",
    "aliases": [],
    "label": "Vvəsi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_şmə_8722",
    "stem": "şmə",
    "aliases": [],
    "label": "Şmə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_çəki_8727",
    "stem": "çəki",
    "aliases": [],
    "label": "Çəki",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_deformasiya_8739",
    "stem": "deformasiya",
    "aliases": [],
    "label": "Deformasiya",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_ling_8759",
    "stem": "ling",
    "aliases": [],
    "label": "Ling",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_qolu_8761",
    "stem": "qolu",
    "aliases": [],
    "label": "Qolu",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_momenti_8761",
    "stem": "momenti",
    "aliases": [],
    "label": "Momenti",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_enerji_8808",
    "stem": "enerji",
    "aliases": [],
    "label": "Enerji",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_təzyiq_8851",
    "stem": "təzyiq",
    "aliases": [],
    "label": "Təzyiq",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_qablar_8852",
    "stem": "qablar",
    "aliases": [],
    "label": "Qablar",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_atmosfer_8854",
    "stem": "atmosfer",
    "aliases": [],
    "label": "Atmosfer",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_dalğa_8879",
    "stem": "dalğa",
    "aliases": [],
    "label": "Dalğa",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_akustika_8891",
    "stem": "akustika",
    "aliases": [],
    "label": "Akustika",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_əks-səda_8893",
    "stem": "əks-səda",
    "aliases": [],
    "label": "Əks-səda",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_effekti_8899",
    "stem": "effekti",
    "aliases": [],
    "label": "Effekti",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_difraksiya_8909",
    "stem": "difraksiya",
    "aliases": [],
    "label": "Difraksiya",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_hərəkəti_8935",
    "stem": "hərəkəti",
    "aliases": [],
    "label": "Hərəkəti",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_temperaturu_8951",
    "stem": "temperaturu",
    "aliases": [],
    "label": "Temperaturu",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_istilikvermə_8960",
    "stem": "istilikvermə",
    "aliases": [],
    "label": "Istilikvermə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_istilikkeçirmə_8965",
    "stem": "istilikkeçirmə",
    "aliases": [],
    "label": "Istilikkeçirmə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_konveksiya_8968",
    "stem": "konveksiya",
    "aliases": [],
    "label": "Konveksiya",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_tutumu_8984",
    "stem": "tutumu",
    "aliases": [],
    "label": "Tutumu",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_ərimə_9000",
    "stem": "ərimə",
    "aliases": [],
    "label": "Ərimə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_kristallaşma_9002",
    "stem": "kristallaşma",
    "aliases": [],
    "label": "Kristallaşma",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_buxarəmələgəlmə_9005",
    "stem": "buxarəmələgəlmə",
    "aliases": [],
    "label": "Buxarəmələgəlmə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_desublimasiya_9008",
    "stem": "desublimasiya",
    "aliases": [],
    "label": "Desublimasiya",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_istiliyi_9010",
    "stem": "istiliyi",
    "aliases": [],
    "label": "Istiliyi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_takt_9036",
    "stem": "takt",
    "aliases": [],
    "label": "Takt",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_hərrik_9036",
    "stem": "hərrik",
    "aliases": [],
    "label": "Hərrik",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_istilik_9062",
    "stem": "istilik",
    "aliases": [],
    "label": "Istilik",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_s-orbital_9066",
    "stem": "s-orbital",
    "aliases": [],
    "label": "S-orbital",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_formulu_9071",
    "stem": "formulu",
    "aliases": [],
    "label": "Formulu",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_qrup_9081",
    "stem": "qrup",
    "aliases": [],
    "label": "Qrup",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_dövrlər_9081",
    "stem": "dövrlər",
    "aliases": [],
    "label": "Dövrlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_rabitələr_9099",
    "stem": "rabitələr",
    "aliases": [],
    "label": "Rabitələr",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_rabitəsi_9104",
    "stem": "rabitəsi",
    "aliases": [],
    "label": "Rabitəsi",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_rabitə_9109",
    "stem": "rabitə",
    "aliases": [],
    "label": "Rabitə",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_tənliklər_9146",
    "stem": "tənliklər",
    "aliases": [],
    "label": "Tənliklər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_inhibitorlar_9211",
    "stem": "inhibitorlar",
    "aliases": [],
    "label": "Inhibitorlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_oksidlər_9234",
    "stem": "oksidlər",
    "aliases": [],
    "label": "Oksidlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_prosesləri_9238",
    "stem": "prosesləri",
    "aliases": [],
    "label": "Prosesləri",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_reduksiyaedici_9239",
    "stem": "reduksiyaedici",
    "aliases": [],
    "label": "Reduksiyaedici",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_oksidləşdirici_9239",
    "stem": "oksidləşdirici",
    "aliases": [],
    "label": "Oksidləşdirici",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_oksidləşmə_9245",
    "stem": "oksidləşmə",
    "aliases": [],
    "label": "Oksidləşmə",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_reduksiya_9245",
    "stem": "reduksiya",
    "aliases": [],
    "label": "Reduksiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_turşular_9255",
    "stem": "turşular",
    "aliases": [],
    "label": "Turşular",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_dissosiasiya_9257",
    "stem": "dissosiasiya",
    "aliases": [],
    "label": "Dissosiasiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_qeyri-elektrolitlər_9257",
    "stem": "qeyri-elektrolitlər",
    "aliases": [],
    "label": "Qeyri-elektrolitlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_tənlikləri_9257",
    "stem": "tənlikləri",
    "aliases": [],
    "label": "Tənlikləri",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_əsaslar_9263",
    "stem": "əsaslar",
    "aliases": [],
    "label": "Əsaslar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_qələvilər_9264",
    "stem": "qələvilər",
    "aliases": [],
    "label": "Qələvilər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_duzlar_9274",
    "stem": "duzlar",
    "aliases": [],
    "label": "Duzlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_kristalhidratlar_9276",
    "stem": "kristalhidratlar",
    "aliases": [],
    "label": "Kristalhidratlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_suyu_9276",
    "stem": "suyu",
    "aliases": [],
    "label": "Suyu",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_tənliyi_9289",
    "stem": "tənliyi",
    "aliases": [],
    "label": "Tənliyi",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_elementlər_9325",
    "stem": "elementlər",
    "aliases": [],
    "label": "Elementlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mübadiləsi_9331",
    "stem": "mübadiləsi",
    "aliases": [],
    "label": "Mübadiləsi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_monosaxaridlər_9334",
    "stem": "monosaxaridlər",
    "aliases": [],
    "label": "Monosaxaridlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_plazmoliz_9353",
    "stem": "plazmoliz",
    "aliases": [],
    "label": "Plazmoliz",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_hemoliz_9354",
    "stem": "hemoliz",
    "aliases": [],
    "label": "Hemoliz",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_fotosintez_9372",
    "stem": "fotosintez",
    "aliases": [],
    "label": "Fotosintez",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_hüceyrələr_9393",
    "stem": "hüceyrələr",
    "aliases": [],
    "label": "Hüceyrələr",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_döyünməsi_9410",
    "stem": "döyünməsi",
    "aliases": [],
    "label": "Döyünməsi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_nəbz_9417",
    "stem": "nəbz",
    "aliases": [],
    "label": "Nəbz",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_resipiyent_9425",
    "stem": "resipiyent",
    "aliases": [],
    "label": "Resipiyent",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_sistemi_9426",
    "stem": "sistemi",
    "aliases": [],
    "label": "Sistemi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_tənəffüs_9437",
    "stem": "tənəffüs",
    "aliases": [],
    "label": "Tənəffüs",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mübadilə_9461",
    "stem": "mübadilə",
    "aliases": [],
    "label": "Mübadilə",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_metabolizm_9461",
    "stem": "metabolizm",
    "aliases": [],
    "label": "Metabolizm",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_peristaltika_9472",
    "stem": "peristaltika",
    "aliases": [],
    "label": "Peristaltika",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_dişi_9473",
    "stem": "dişi",
    "aliases": [],
    "label": "Dişi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mayalanma_9497",
    "stem": "mayalanma",
    "aliases": [],
    "label": "Mayalanma",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_orqanizmlər_9498",
    "stem": "orqanizmlər",
    "aliases": [],
    "label": "Orqanizmlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_hermafrodit_9498",
    "stem": "hermafrodit",
    "aliases": [],
    "label": "Hermafrodit",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_partenogenez_9499",
    "stem": "partenogenez",
    "aliases": [],
    "label": "Partenogenez",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_ətcəbala_9504",
    "stem": "ətcəbala",
    "aliases": [],
    "label": "Ətcəbala",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_cift_9505",
    "stem": "cift",
    "aliases": [],
    "label": "Cift",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_prosesi_9510",
    "stem": "prosesi",
    "aliases": [],
    "label": "Prosesi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_implantasiya_9514",
    "stem": "implantasiya",
    "aliases": [],
    "label": "Implantasiya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_immunitet_9560",
    "stem": "immunitet",
    "aliases": [],
    "label": "Immunitet",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_simmetriya_9589",
    "stem": "simmetriya",
    "aliases": [],
    "label": "Simmetriya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_xəritələr_9624",
    "stem": "xəritələr",
    "aliases": [],
    "label": "Xəritələr",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_xətti_9631",
    "stem": "xətti",
    "aliases": [],
    "label": "Xətti",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_gecəsi_9638",
    "stem": "gecəsi",
    "aliases": [],
    "label": "Gecəsi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_sərhədlər_9655",
    "stem": "sərhədlər",
    "aliases": [],
    "label": "Sərhədlər",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_cəbhələri_9665",
    "stem": "cəbhələri",
    "aliases": [],
    "label": "Cəbhələri",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_şəlakət_9672",
    "stem": "şəlakət",
    "aliases": [],
    "label": "Şəlakət",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_iqlim_9680",
    "stem": "iqlim",
    "aliases": [],
    "label": "Iqlim",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_pangeya_9686",
    "stem": "pangeya",
    "aliases": [],
    "label": "Pangeya",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_izoqalin_9694",
    "stem": "izoqalin",
    "aliases": [],
    "label": "Izoqalin",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_izobat_9695",
    "stem": "izobat",
    "aliases": [],
    "label": "Izobat",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_hündürlüyü_9697",
    "stem": "hündürlüyü",
    "aliases": [],
    "label": "Hündürlüyü",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_hadisəsi_9697",
    "stem": "hadisəsi",
    "aliases": [],
    "label": "Hadisəsi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_cərəyan_9698",
    "stem": "cərəyan",
    "aliases": [],
    "label": "Cərəyan",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_görə_9711",
    "stem": "görə",
    "aliases": [],
    "label": "Görə",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_vahə_9713",
    "stem": "vahə",
    "aliases": [],
    "label": "Vahə",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_meşələri_9718",
    "stem": "meşələri",
    "aliases": [],
    "label": "Meşələri",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_ölkələr_9723",
    "stem": "ölkələr",
    "aliases": [],
    "label": "Ölkələr",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_ölkələri_9729",
    "stem": "ölkələri",
    "aliases": [],
    "label": "Ölkələri",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_bri̇ks_9731",
    "stem": "bri̇ks",
    "aliases": [],
    "label": "Bri̇ks",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_miqrantlar_9741",
    "stem": "miqrantlar",
    "aliases": [],
    "label": "Miqrantlar",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_ehtiyatlar_9745",
    "stem": "ehtiyatlar",
    "aliases": [],
    "label": "Ehtiyatlar",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_xərclər_9757",
    "stem": "xərclər",
    "aliases": [],
    "label": "Xərclər",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_fayda_9757",
    "stem": "fayda",
    "aliases": [],
    "label": "Fayda",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_tropiki_9795",
    "stem": "tropiki",
    "aliases": [],
    "label": "Tropiki",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_materiya_9932",
    "stem": "materiya",
    "aliases": [],
    "label": "Materiya",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_gərilmə_9935",
    "stem": "gərilmə",
    "aliases": [],
    "label": "Gərilmə",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_plazma_9936",
    "stem": "plazma",
    "aliases": [],
    "label": "Plazma",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kökü_11307",
    "stem": "kökü",
    "aliases": [],
    "label": "Kökü",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ifadə_11307",
    "stem": "ifadə",
    "aliases": [],
    "label": "Ifadə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kökalma_11307",
    "stem": "kökalma",
    "aliases": [],
    "label": "Kökalma",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_qurama_11310",
    "stem": "qurama",
    "aliases": [],
    "label": "Qurama",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ədədlər_11311",
    "stem": "ədədlər",
    "aliases": [],
    "label": "Ədədlər",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_nöqtəsi_11318",
    "stem": "nöqtəsi",
    "aliases": [],
    "label": "Nöqtəsi",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_şəkli_11330",
    "stem": "şəkli",
    "aliases": [],
    "label": "Şəkli",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_üçlükləri_11337",
    "stem": "üçlükləri",
    "aliases": [],
    "label": "Üçlükləri",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_tənlik_11347",
    "stem": "tənlik",
    "aliases": [],
    "label": "Tənlik",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_paraleloqram_11375",
    "stem": "paraleloqram",
    "aliases": [],
    "label": "Paraleloqram",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_tərəfləri_11386",
    "stem": "tərəfləri",
    "aliases": [],
    "label": "Tərəfləri",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_trapesiya_11386",
    "stem": "trapesiya",
    "aliases": [],
    "label": "Trapesiya",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ifadələr_11395",
    "stem": "ifadələr",
    "aliases": [],
    "label": "Ifadələr",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_düsturu_11421",
    "stem": "düsturu",
    "aliases": [],
    "label": "Düsturu",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_nisbətinə_11442",
    "stem": "nisbətinə",
    "aliases": [],
    "label": "Nisbətinə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_qeyzer_11457",
    "stem": "qeyzer",
    "aliases": [],
    "label": "Qeyzer",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_çoxluğuna_11475",
    "stem": "çoxluğuna",
    "aliases": [],
    "label": "Çoxluğuna",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_bərabərsizliklər_11475",
    "stem": "bərabərsizliklər",
    "aliases": [],
    "label": "Bərabərsizliklər",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_tinə_11487",
    "stem": "tinə",
    "aliases": [],
    "label": "Tinə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ornitoloq_11493",
    "stem": "ornitoloq",
    "aliases": [],
    "label": "Ornitoloq",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_dönmə_11499",
    "stem": "dönmə",
    "aliases": [],
    "label": "Dönmə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_çevrilməsi_11503",
    "stem": "çevrilməsi",
    "aliases": [],
    "label": "Çevrilməsi",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_fiqurlar_11503",
    "stem": "fiqurlar",
    "aliases": [],
    "label": "Fiqurlar",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_homotetiya_11503",
    "stem": "homotetiya",
    "aliases": [],
    "label": "Homotetiya",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_nöqtə_11503",
    "stem": "nöqtə",
    "aliases": [],
    "label": "Nöqtə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_korrelyasiya_11513",
    "stem": "korrelyasiya",
    "aliases": [],
    "label": "Korrelyasiya",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_nəticə_11518",
    "stem": "nəticə",
    "aliases": [],
    "label": "Nəticə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 8,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_oxu_11859",
    "stem": "oxu",
    "aliases": [],
    "label": "Oxu",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_ədədə_11861",
    "stem": "ədədə",
    "aliases": [],
    "label": "Ədədə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_çoxluq_11862",
    "stem": "çoxluq",
    "aliases": [],
    "label": "Çoxluq",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_bucaq_11875",
    "stem": "bucaq",
    "aliases": [],
    "label": "Bucaq",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_qövs_11887",
    "stem": "qövs",
    "aliases": [],
    "label": "Qövs",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_toxunan_11889",
    "stem": "toxunan",
    "aliases": [],
    "label": "Toxunan",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kəsəni_11891",
    "stem": "kəsəni",
    "aliases": [],
    "label": "Kəsəni",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_funksiya_11898",
    "stem": "funksiya",
    "aliases": [],
    "label": "Funksiya",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_sektoru_11967",
    "stem": "sektoru",
    "aliases": [],
    "label": "Sektoru",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_seqmenti_11967",
    "stem": "seqmenti",
    "aliases": [],
    "label": "Seqmenti",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_həlli_11989",
    "stem": "həlli",
    "aliases": [],
    "label": "Həlli",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_çoxluğu_11989",
    "stem": "çoxluğu",
    "aliases": [],
    "label": "Çoxluğu",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_xətt_12006",
    "stem": "xətt",
    "aliases": [],
    "label": "Xətt",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_çevrə_12011",
    "stem": "çevrə",
    "aliases": [],
    "label": "Çevrə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_mərkəzi_12024",
    "stem": "mərkəzi",
    "aliases": [],
    "label": "Mərkəzi",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_parketləmə_12032",
    "stem": "parketləmə",
    "aliases": [],
    "label": "Parketləmə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_qiymətinə_12036",
    "stem": "qiymətinə",
    "aliases": [],
    "label": "Qiymətinə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_heyəti_12038",
    "stem": "heyəti",
    "aliases": [],
    "label": "Heyəti",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_kəmiyyətlər_12066",
    "stem": "kəmiyyətlər",
    "aliases": [],
    "label": "Kəmiyyətlər",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_modulu_12066",
    "stem": "modulu",
    "aliases": [],
    "label": "Modulu",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_vektorlar_12067",
    "stem": "vektorlar",
    "aliases": [],
    "label": "Vektorlar",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_hədləri_12109",
    "stem": "hədləri",
    "aliases": [],
    "label": "Hədləri",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_riy_silsilə_12113",
    "stem": "silsilə",
    "aliases": [],
    "label": "Silsilə",
    "type": "RiyaziAnlayış",
    "subject": "Riyaziyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_rastr_12127",
    "stem": "rastr",
    "aliases": [],
    "label": "Rastr",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_dərinliyi_12144",
    "stem": "dərinliyi",
    "aliases": [],
    "label": "Dərinliyi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_color_12146",
    "stem": "color",
    "aliases": [],
    "label": "Color",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_nüvəsi_12158",
    "stem": "nüvəsi",
    "aliases": [],
    "label": "Nüvəsi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_kəsim_12168",
    "stem": "kəsim",
    "aliases": [],
    "label": "Kəsim",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_parçalanma_12170",
    "stem": "parçalanma",
    "aliases": [],
    "label": "Parçalanma",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_indeks_12215",
    "stem": "indeks",
    "aliases": [],
    "label": "Indeks",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_uzunluğu_12215",
    "stem": "uzunluğu",
    "aliases": [],
    "label": "Uzunluğu",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_elementləri_12221",
    "stem": "elementləri",
    "aliases": [],
    "label": "Elementləri",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_ədədi_12241",
    "stem": "ədədi",
    "aliases": [],
    "label": "Ədədi",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_qraf_12246",
    "stem": "qraf",
    "aliases": [],
    "label": "Qraf",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_tillər_12246",
    "stem": "tillər",
    "aliases": [],
    "label": "Tillər",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_yol_12249",
    "stem": "yol",
    "aliases": [],
    "label": "Yol",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_dövrə_12249",
    "stem": "dövrə",
    "aliases": [],
    "label": "Dövrə",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_diqraf_12249",
    "stem": "diqraf",
    "aliases": [],
    "label": "Diqraf",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_göstərişlər_12279",
    "stem": "göstərişlər",
    "aliases": [],
    "label": "Göstərişlər",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_i̇n_hostinq_12284",
    "stem": "hostinq",
    "aliases": [],
    "label": "Hostinq",
    "type": "İnformatikaAnlayışı",
    "subject": "İnformatika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_ədə_qayisə_12643",
    "stem": "qayisə",
    "aliases": [],
    "label": "Qayisə",
    "type": "ƏdəbiNəzəriyyə",
    "subject": "Ədəbiyyat",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_fyordlar_12693",
    "stem": "fyordlar",
    "aliases": [],
    "label": "Fyordlar",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_pataqoniya_12717",
    "stem": "pataqoniya",
    "aliases": [],
    "label": "Pataqoniya",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_dərələri_12722",
    "stem": "dərələri",
    "aliases": [],
    "label": "Dərələri",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_radiasiya_12752",
    "stem": "radiasiya",
    "aliases": [],
    "label": "Radiasiya",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_albedo_12754",
    "stem": "albedo",
    "aliases": [],
    "label": "Albedo",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_fərqə_12759",
    "stem": "fərqə",
    "aliases": [],
    "label": "Fərqə",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_göl_12803",
    "stem": "göl",
    "aliases": [],
    "label": "Göl",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_kriklər_12812",
    "stem": "kriklər",
    "aliases": [],
    "label": "Kriklər",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_aləmə_12829",
    "stem": "aləmə",
    "aliases": [],
    "label": "Aləmə",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_böhran_12915",
    "stem": "böhran",
    "aliases": [],
    "label": "Böhran",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_sənayesi_12954",
    "stem": "sənayesi",
    "aliases": [],
    "label": "Sənayesi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_sənaye_12955",
    "stem": "sənaye",
    "aliases": [],
    "label": "Sənaye",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_xərclərə_12962",
    "stem": "xərclərə",
    "aliases": [],
    "label": "Xərclərə",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_coğ_əkinçiliyi_12974",
    "stem": "əkinçiliyi",
    "aliases": [],
    "label": "Əkinçiliyi",
    "type": "CoğrafiAnlayış",
    "subject": "Coğrafiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_türkməneli_13188",
    "stem": "türkməneli",
    "aliases": [],
    "label": "Türkməneli",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_tar_meqapolis_13196",
    "stem": "meqapolis",
    "aliases": [],
    "label": "Meqapolis",
    "type": "TarixiAnlayış",
    "subject": "Tarix",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_di̇li̇_13233",
    "stem": "di̇li̇",
    "aliases": [],
    "label": "Di̇li̇",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_cümlə_13295",
    "stem": "cümlə",
    "aliases": [],
    "label": "Cümlə",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_azə_nitq_13429",
    "stem": "nitq",
    "aliases": [],
    "label": "Nitq",
    "type": "DilQaydası",
    "subject": "Azərbaycan dili",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_elektronlar_13822",
    "stem": "elektronlar",
    "aliases": [],
    "label": "Elektronlar",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_elektrolitlər_13831",
    "stem": "elektrolitlər",
    "aliases": [],
    "label": "Elektrolitlər",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_katod_13831",
    "stem": "katod",
    "aliases": [],
    "label": "Katod",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_rekombinasiya_13846",
    "stem": "rekombinasiya",
    "aliases": [],
    "label": "Rekombinasiya",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_şimşək_13851",
    "stem": "şimşək",
    "aliases": [],
    "label": "Şimşək",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_maqnitlər_13881",
    "stem": "maqnitlər",
    "aliases": [],
    "label": "Maqnitlər",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_qütbləri_13882",
    "stem": "qütbləri",
    "aliases": [],
    "label": "Qütbləri",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_sahəsi_13893",
    "stem": "sahəsi",
    "aliases": [],
    "label": "Sahəsi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_maqnetiklər_13948",
    "stem": "maqnetiklər",
    "aliases": [],
    "label": "Maqnetiklər",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_mənbəyi_13966",
    "stem": "mənbəyi",
    "aliases": [],
    "label": "Mənbəyi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_güzgü_13985",
    "stem": "güzgü",
    "aliases": [],
    "label": "Güzgü",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_məsafəsi_13985",
    "stem": "məsafəsi",
    "aliases": [],
    "label": "Məsafəsi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_qütbü_13991",
    "stem": "qütbü",
    "aliases": [],
    "label": "Qütbü",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_müstəvisi_13991",
    "stem": "müstəvisi",
    "aliases": [],
    "label": "Müstəvisi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_lövhə_14004",
    "stem": "lövhə",
    "aliases": [],
    "label": "Lövhə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_linza_14015",
    "stem": "linza",
    "aliases": [],
    "label": "Linza",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_linzalara_14015",
    "stem": "linzalara",
    "aliases": [],
    "label": "Linzalara",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_müstəvi_14018",
    "stem": "müstəvi",
    "aliases": [],
    "label": "Müstəvi",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_örtüyü_14032",
    "stem": "örtüyü",
    "aliases": [],
    "label": "Örtüyü",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_akkomodasiya_14034",
    "stem": "akkomodasiya",
    "aliases": [],
    "label": "Akkomodasiya",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_şüalanma_14048",
    "stem": "şüalanma",
    "aliases": [],
    "label": "Şüalanma",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_vəziyyəti_14057",
    "stem": "vəziyyəti",
    "aliases": [],
    "label": "Vəziyyəti",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_nuklonlar_14065",
    "stem": "nuklonlar",
    "aliases": [],
    "label": "Nuklonlar",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_qüvvələrə_14066",
    "stem": "qüvvələrə",
    "aliases": [],
    "label": "Qüvvələrə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_çevrilmə_14077",
    "stem": "çevrilmə",
    "aliases": [],
    "label": "Çevrilmə",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_fiz_periodu_14082",
    "stem": "periodu",
    "aliases": [],
    "label": "Periodu",
    "type": "FizikiAnlayış",
    "subject": "Fizika",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_metallurgiya_14274",
    "stem": "metallurgiya",
    "aliases": [],
    "label": "Metallurgiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_filiz_14274",
    "stem": "filiz",
    "aliases": [],
    "label": "Filiz",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_ərintilər_14275",
    "stem": "ərintilər",
    "aliases": [],
    "label": "Ərintilər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_metallar_14279",
    "stem": "metallar",
    "aliases": [],
    "label": "Metallar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_paslanma_14287",
    "stem": "paslanma",
    "aliases": [],
    "label": "Paslanma",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_gips_14316",
    "stem": "gips",
    "aliases": [],
    "label": "Gips",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_codluq_14318",
    "stem": "codluq",
    "aliases": [],
    "label": "Codluq",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_anionit_14319",
    "stem": "anionit",
    "aliases": [],
    "label": "Anionit",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_alüminotermiya_14324",
    "stem": "alüminotermiya",
    "aliases": [],
    "label": "Alüminotermiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_turşusu_14383",
    "stem": "turşusu",
    "aliases": [],
    "label": "Turşusu",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_yodidlər_14393",
    "stem": "yodidlər",
    "aliases": [],
    "label": "Yodidlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_xalkogenlər_14399",
    "stem": "xalkogenlər",
    "aliases": [],
    "label": "Xalkogenlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_flotasiya_14405",
    "stem": "flotasiya",
    "aliases": [],
    "label": "Flotasiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_demerkurlaşma_14405",
    "stem": "demerkurlaşma",
    "aliases": [],
    "label": "Demerkurlaşma",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_oleum_14415",
    "stem": "oleum",
    "aliases": [],
    "label": "Oleum",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_spirti_14432",
    "stem": "spirti",
    "aliases": [],
    "label": "Spirti",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_şora_14448",
    "stem": "şora",
    "aliases": [],
    "label": "Şora",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_termoliz_14450",
    "stem": "termoliz",
    "aliases": [],
    "label": "Termoliz",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_gübrələr_14466",
    "stem": "gübrələr",
    "aliases": [],
    "label": "Gübrələr",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_karbidlər_14489",
    "stem": "karbidlər",
    "aliases": [],
    "label": "Karbidlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_desorbsiya_14489",
    "stem": "desorbsiya",
    "aliases": [],
    "label": "Desorbsiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_kvars_14516",
    "stem": "kvars",
    "aliases": [],
    "label": "Kvars",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_şüşə_14521",
    "stem": "şüşə",
    "aliases": [],
    "label": "Şüşə",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_alümosilikatlar_14525",
    "stem": "alümosilikatlar",
    "aliases": [],
    "label": "Alümosilikatlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_şüşəsi_14526",
    "stem": "şüşəsi",
    "aliases": [],
    "label": "Şüşəsi",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_klinker_14527",
    "stem": "klinker",
    "aliases": [],
    "label": "Klinker",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_quruluşu_14540",
    "stem": "quruluşu",
    "aliases": [],
    "label": "Quruluşu",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_izomerlər_14541",
    "stem": "izomerlər",
    "aliases": [],
    "label": "Izomerlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_izomerlik_14541",
    "stem": "izomerlik",
    "aliases": [],
    "label": "Izomerlik",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_törəmələri_14542",
    "stem": "törəmələri",
    "aliases": [],
    "label": "Törəmələri",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_sinif_14543",
    "stem": "sinif",
    "aliases": [],
    "label": "Sinif",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_alkanlar_14546",
    "stem": "alkanlar",
    "aliases": [],
    "label": "Alkanlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_fərq_14546",
    "stem": "fərq",
    "aliases": [],
    "label": "Fərq",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_karbohidrogenlər_14550",
    "stem": "karbohidrogenlər",
    "aliases": [],
    "label": "Karbohidrogenlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_karbohidrogenləri_14552",
    "stem": "karbohidrogenləri",
    "aliases": [],
    "label": "Karbohidrogenləri",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_alkenlər_14552",
    "stem": "alkenlər",
    "aliases": [],
    "label": "Alkenlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_qrupu_14552",
    "stem": "qrupu",
    "aliases": [],
    "label": "Qrupu",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_polimer_14555",
    "stem": "polimer",
    "aliases": [],
    "label": "Polimer",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_alkinlər_14558",
    "stem": "alkinlər",
    "aliases": [],
    "label": "Alkinlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_alkadienlər_14560",
    "stem": "alkadienlər",
    "aliases": [],
    "label": "Alkadienlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_tsikloparafinlər_14564",
    "stem": "tsikloparafinlər",
    "aliases": [],
    "label": "Tsikloparafinlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_tsikloalkanlar_14564",
    "stem": "tsikloalkanlar",
    "aliases": [],
    "label": "Tsikloalkanlar",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_arenlər_14565",
    "stem": "arenlər",
    "aliases": [],
    "label": "Arenlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_krekinq_14570",
    "stem": "krekinq",
    "aliases": [],
    "label": "Krekinq",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_spirtlər_14576",
    "stem": "spirtlər",
    "aliases": [],
    "label": "Spirtlər",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_formalin_14582",
    "stem": "formalin",
    "aliases": [],
    "label": "Formalin",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_sabun_14591",
    "stem": "sabun",
    "aliases": [],
    "label": "Sabun",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_sabunlaşma_14592",
    "stem": "sabunlaşma",
    "aliases": [],
    "label": "Sabunlaşma",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_polipeptid_14603",
    "stem": "polipeptid",
    "aliases": [],
    "label": "Polipeptid",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_denaturasiya_14605",
    "stem": "denaturasiya",
    "aliases": [],
    "label": "Denaturasiya",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_kim_dərəcəsi_14608",
    "stem": "dərəcəsi",
    "aliases": [],
    "label": "Dərəcəsi",
    "type": "KimyəviAnlayış",
    "subject": "Kimya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_həy_proseslər_15930",
    "stem": "proseslər",
    "aliases": [],
    "label": "Proseslər",
    "type": "TəbiiAnlayış",
    "subject": "Həyat bilgisi",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_lər_16042",
    "stem": "lər",
    "aliases": [],
    "label": "Lər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mikroelementlər_16053",
    "stem": "mikroelementlər",
    "aliases": [],
    "label": "Mikroelementlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_biopolimerlər_16058",
    "stem": "biopolimerlər",
    "aliases": [],
    "label": "Biopolimerlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_quruluş_16063",
    "stem": "quruluş",
    "aliases": [],
    "label": "Quruluş",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_renaturasiya_16065",
    "stem": "renaturasiya",
    "aliases": [],
    "label": "Renaturasiya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_orqanoidlər_16079",
    "stem": "orqanoidlər",
    "aliases": [],
    "label": "Orqanoidlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_zriplef_16085",
    "stem": "zriplef",
    "aliases": [],
    "label": "Zriplef",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_kod_16085",
    "stem": "kod",
    "aliases": [],
    "label": "Kod",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mafriks_16095",
    "stem": "mafriks",
    "aliases": [],
    "label": "Mafriks",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mərhələsi_16095",
    "stem": "mərhələsi",
    "aliases": [],
    "label": "Mərhələsi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_tənəffüsü_16096",
    "stem": "tənəffüsü",
    "aliases": [],
    "label": "Tənəffüsü",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_tsikli_16097",
    "stem": "tsikli",
    "aliases": [],
    "label": "Tsikli",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_autosom_16099",
    "stem": "autosom",
    "aliases": [],
    "label": "Autosom",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_sentromer_16100",
    "stem": "sentromer",
    "aliases": [],
    "label": "Sentromer",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_interfaza_16106",
    "stem": "interfaza",
    "aliases": [],
    "label": "Interfaza",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_hərşeyyeyən_16112",
    "stem": "hərşeyyeyən",
    "aliases": [],
    "label": "Hərşeyyeyən",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_çoxalma_16114",
    "stem": "çoxalma",
    "aliases": [],
    "label": "Çoxalma",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_fraqmentasiya_16114",
    "stem": "fraqmentasiya",
    "aliases": [],
    "label": "Fraqmentasiya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_qametogenez_16116",
    "stem": "qametogenez",
    "aliases": [],
    "label": "Qametogenez",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_heyvanlar_16117",
    "stem": "heyvanlar",
    "aliases": [],
    "label": "Heyvanlar",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_inkişaf_16124",
    "stem": "inkişaf",
    "aliases": [],
    "label": "Inkişaf",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_qametofit_16125",
    "stem": "qametofit",
    "aliases": [],
    "label": "Qametofit",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_meyarlar_16129",
    "stem": "meyarlar",
    "aliases": [],
    "label": "Meyarlar",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_dəyişkənlik_16139",
    "stem": "dəyişkənlik",
    "aliases": [],
    "label": "Dəyişkənlik",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mikrotəkamül_16147",
    "stem": "mikrotəkamül",
    "aliases": [],
    "label": "Mikrotəkamül",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_divergensiya_16149",
    "stem": "divergensiya",
    "aliases": [],
    "label": "Divergensiya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mutasiyalar_16152",
    "stem": "mutasiyalar",
    "aliases": [],
    "label": "Mutasiyalar",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_morfolofi_16153",
    "stem": "morfolofi",
    "aliases": [],
    "label": "Morfolofi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_inszinktlər_16156",
    "stem": "inszinktlər",
    "aliases": [],
    "label": "Inszinktlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_reflekslər_16156",
    "stem": "reflekslər",
    "aliases": [],
    "label": "Reflekslər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_tormozlanma_16159",
    "stem": "tormozlanma",
    "aliases": [],
    "label": "Tormozlanma",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_fəaliyyət_16161",
    "stem": "fəaliyyət",
    "aliases": [],
    "label": "Fəaliyyət",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_analiz_16162",
    "stem": "analiz",
    "aliases": [],
    "label": "Analiz",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_yaddaş_16164",
    "stem": "yaddaş",
    "aliases": [],
    "label": "Yaddaş",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_emosiya_16176",
    "stem": "emosiya",
    "aliases": [],
    "label": "Emosiya",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_mühiti_16179",
    "stem": "mühiti",
    "aliases": [],
    "label": "Mühiti",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_amillər_16179",
    "stem": "amillər",
    "aliases": [],
    "label": "Amillər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_optimum_16180",
    "stem": "optimum",
    "aliases": [],
    "label": "Optimum",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_həddi_16180",
    "stem": "həddi",
    "aliases": [],
    "label": "Həddi",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_amil_16180",
    "stem": "amil",
    "aliases": [],
    "label": "Amil",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_biosenozlar_16183",
    "stem": "biosenozlar",
    "aliases": [],
    "label": "Biosenozlar",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_produsentlər_16185",
    "stem": "produsentlər",
    "aliases": [],
    "label": "Produsentlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_ritmlər_16188",
    "stem": "ritmlər",
    "aliases": [],
    "label": "Ritmlər",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_fotoperiodizm_16189",
    "stem": "fotoperiodizm",
    "aliases": [],
    "label": "Fotoperiodizm",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  },
  {
    "id": "auto_bio_ritm_16190",
    "stem": "ritm",
    "aliases": [],
    "label": "Ritm",
    "type": "BiolojiAnlayış",
    "subject": "Biologiya",
    "firstGradeVerified": 9,
    "prereqId": null,
    "prereqLabel": null,
    "distId": null,
    "distLabel": null
  }
];

export function resolveCanonicalOntologyNode(text: string, subject?: string): CanonicalOntologyMatch | null {
  if (!text) return null
  const lowText = text.toLowerCase()
  
  for (const item of CANONICAL_ONTOLOGY_REGISTRY) {
    const candidates = [item.stem, ...(item.aliases || []).map((a: string) => a.toLowerCase().trim())]
    if (candidates.some((c: string) => c && c.length >= 2 && (lowText.includes(c) || new RegExp(`\b${c}\b`, 'i').test(lowText)))) {
      return {
        id: item.id,
        label: item.label,
        type: item.type,
        subject: item.subject,
        firstGradeVerified: item.firstGradeVerified,
        prerequisiteId: item.prereqId || undefined,
        prerequisiteLabel: item.prereqLabel || undefined,
        distractorId: item.distId || undefined,
        distractorLabel: item.distLabel || undefined
      }
    }
  }
  return null
}
