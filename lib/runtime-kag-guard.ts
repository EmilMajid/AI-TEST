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
