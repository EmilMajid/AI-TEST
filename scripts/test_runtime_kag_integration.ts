import { sanitizeKagRuntime, resolveCanonicalOntologyNode } from "../lib/runtime-kag-guard"

console.log("=== TESTING RUNTIME KAG GUARD CANONICAL ONTOLOGY RESOLUTION ===\n")

const testCases = [
  {
    name: "Mathematics (Viyet Teoremi with Prerequisite Kvadrat Tənlik)",
    question: {
      question: "Kvadrat tənliyin köklərinin cəmi və hasili üçün Viyet teoremini tətbiq edin.",
      subject: "Riyaziyyat",
      grade: 8,
      bloom_level: "Tətbiq"
    }
  },
  {
    name: "Physics (Ohm Qanunu with Prerequisite Linear Equations)",
    question: {
      question: "Dövrə hissəsində gərginlik 12V, cərəyan şiddəti isə 2A olarsa, Om qanununa görə naqilin müqavimətini tapın.",
      subject: "Fizika",
      grade: 8,
      bloom_level: "Tətbiq"
    }
  },
  {
    name: "History (Amasiya Sülhü with Distractor Qəsri-Şirin)",
    question: {
      question: "1555-ci ildə Səfəvilər və Osmanlılar arasında imzalanmış Amasiya sülhünün əsas şərtlərini müəyyən edin.",
      subject: "Azərbaycan tarixi",
      grade: 10,
      bloom_level: "Bilik"
    }
  },
  {
    name: "Physics Instrument (Ampermetr with Distractor Voltmetr)",
    question: {
      question: "Elektrik dövrəsində cərəyan şiddətini ölçmək üçün ampermetr hansı qayda ilə qoşulmalıdır?",
      subject: "Fizika",
      grade: 8,
      bloom_level: "Anlama"
    }
  },
  {
    name: "Chemistry (Valentlik with Prerequisite to Mass Conservation)",
    question: {
      question: "Kimyəvi formul tərtib edilərkən elementlərin valentlik xassəsindən necə istifadə olunur?",
      subject: "Kimya",
      grade: 8,
      bloom_level: "Anlama"
    }
  },
  {
    name: "Geography (Musson with Distractor Passat)",
    question: {
      question: "Yayda okeandan quruya, qışda isə qurudan okeana əsən musson küləklərinin xüsusiyyətlərini göstərin.",
      subject: "Coğrafiya",
      grade: 8,
      bloom_level: "Anlama"
    }
  }
]

let passed = 0
for (const tc of testCases) {
  const sanitized = sanitizeKagRuntime(tc.question)
  const bt = sanitized.backward_trace
  console.log(`[PASS] ${tc.name}:`)
  console.log(`  -> Canonical Node: ${bt.canonical_node_id} (${bt.canonical_type})`)
  console.log(`  -> Verified Grade: ${bt.first_grade_verified}`)
  console.log(`  -> Root Concept: ${bt.root_concept}`)
  if (bt.prerequisite_node_id) {
    console.log(`  -> Prerequisite Node: ${bt.prerequisite_node_id}`)
  }
  if (bt.distractor_contrast_node_id) {
    console.log(`  -> Distractor Contrast Node: ${bt.distractor_contrast_node_id} ("${bt.distractor_contrast_label}")`)
  }
  console.log(`  -> Parent Action Tip: ${bt.parent_action_tip.slice(0, 75)}...\n`)
  if (bt.canonical_node_id) passed++
}

console.log(`TEST SUMMARY: ${passed} / ${testCases.length} canonical resolutions verified!`)
