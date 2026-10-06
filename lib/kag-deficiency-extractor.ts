export const cleanRemedialTip = (tip?: string): string => {
  if (!tip || typeof tip !== "string") return tip || ""
  return tip
    .replace(/,?\s*səhifə\s*\d+\s*[-–]\s*\d+(-dəki)?/gi, "")
    .replace(/\(səh\.\s*\d+\s*[-–]\s*\d+\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

export interface KagDeficiencyItem {
  id: string
  conceptName: string
  rootGrade: string | number
  rootBook: string
  remedialDuration: number
  parentActionTip: string
  remedialDefinition?: string
  isRootAnchor?: boolean
  isIntraGrade?: boolean
  crossSubject?: any[]
  subject: string
  errorCount: number
  failingQuestions: Array<{
    question: string
    options?: string[]
    userAnswer?: number | string
    correctAnswer?: number | string
    distractorDiagnostic?: string
    explanation?: string
    sourceContext?: string
    testDate?: string
  }>
}

export function extractStudentKagDeficiencies(recentTests: any[]): KagDeficiencyItem[] {
  if (!Array.isArray(recentTests) || recentTests.length === 0) return []

  const deficiencyMap = new Map<string, KagDeficiencyItem>()

  for (const test of recentTests) {
    const subject = test.textbook || test.subject || "Ümumi"
    const testDate = test.completedAt ? new Date(test.completedAt).toLocaleDateString("az-AZ") : "Bu gün"

    // 1. Check detailedResults
    if (Array.isArray(test.detailedResults) && test.detailedResults.length > 0) {
      for (const dr of test.detailedResults) {
        if (!dr.isCorrect) {
          const bt = dr.backward_trace
          const conceptKey = bt?.root_concept || bt?.concept_name || dr.topic || test.topic || "Təməl Anlayış"
          const rootGrade = bt?.root_grade || (test.class ? Math.max(1, Number(test.class) - 1) : "Təməl")
          const rootBook = bt?.root_book || subject
          const key = `${conceptKey}-${rootBook}`

          let distractorDiag: string | undefined = undefined
          if (dr.distractor_diagnostics && dr.userAnswer !== undefined) {
            const letter = typeof dr.userAnswer === "number" ? String.fromCharCode(65 + dr.userAnswer) : String(dr.userAnswer)
            distractorDiag = dr.distractor_diagnostics[letter] || dr.distractor_diagnostics[letter.toLowerCase()]
          }

          if (!deficiencyMap.has(key)) {
            deficiencyMap.set(key, {
              id: key,
              conceptName: conceptKey,
              rootGrade,
              rootBook,
              remedialDuration: bt?.remedial_duration_mins || 15,
              parentActionTip: cleanRemedialTip(bt?.parent_action_tip) || `Şagird ilə ${rootBook} dərsliyindən "${conceptKey}" təməl anlayışını nəzərdən keçirin.`,
              remedialDefinition: bt?.remedial_definition || "",
              isRootAnchor: bt?.is_root_anchor,
              isIntraGrade: bt?.is_intra_grade,
              crossSubject: bt?.cross_subject_connections || [],
              subject,
              errorCount: 1,
              failingQuestions: [{
                question: dr.question,
                userAnswer: dr.userAnswer,
                correctAnswer: dr.correctAnswer,
                distractorDiagnostic: distractorDiag,
                explanation: dr.explanation,
                sourceContext: dr.sourceContext,
                testDate,
              }]
            })
          } else {
            const existing = deficiencyMap.get(key)!
            existing.errorCount += 1
            existing.failingQuestions.push({
              question: dr.question,
              userAnswer: dr.userAnswer,
              correctAnswer: dr.correctAnswer,
              distractorDiagnostic: distractorDiag,
              explanation: dr.explanation,
              sourceContext: dr.sourceContext,
              testDate,
            })
          }
        }
      }
    } else if (Array.isArray(test.questions) && test.questions.length > 0) {
      // 2. Check test.questions with test.answers
      const answers = test.answers || {}
      for (const q of test.questions) {
        const userAns = answers[q.id]
        const isCorrect = userAns !== undefined && userAns === q.correctAnswer
        if (!isCorrect) {
          const bt = q.backward_trace
          const conceptKey = bt?.root_concept || bt?.concept_name || q.topic || test.topic || "Təməl Anlayış"
          const rootGrade = bt?.root_grade || (test.class ? Math.max(1, Number(test.class) - 1) : "Təməl")
          const rootBook = bt?.root_book || subject
          const key = `${conceptKey}-${rootBook}`

          let distractorDiag: string | undefined = undefined
          if (q.distractor_diagnostics && userAns !== undefined) {
            const letter = typeof userAns === "number" ? String.fromCharCode(65 + userAns) : String(userAns)
            distractorDiag = q.distractor_diagnostics[letter] || q.distractor_diagnostics[letter.toLowerCase()]
          }

          if (!deficiencyMap.has(key)) {
            deficiencyMap.set(key, {
              id: key,
              conceptName: conceptKey,
              rootGrade,
              rootBook,
              remedialDuration: bt?.remedial_duration_mins || 15,
              parentActionTip: cleanRemedialTip(bt?.parent_action_tip) || `Şagird ilə ${rootBook} dərsliyindən "${conceptKey}" təməl anlayışını nəzərdən keçirin.`,
              remedialDefinition: bt?.remedial_definition || "",
              isRootAnchor: bt?.is_root_anchor,
              isIntraGrade: bt?.is_intra_grade,
              crossSubject: bt?.cross_subject_connections || [],
              subject,
              errorCount: 1,
              failingQuestions: [{
                question: q.question,
                options: q.options,
                userAnswer: userAns,
                correctAnswer: q.correctAnswer,
                distractorDiagnostic: distractorDiag,
                explanation: q.explanation,
                sourceContext: q.sourceContext,
                testDate,
              }]
            })
          } else {
            const existing = deficiencyMap.get(key)!
            existing.errorCount += 1
            existing.failingQuestions.push({
              question: q.question,
              options: q.options,
              userAnswer: userAns,
              correctAnswer: q.correctAnswer,
              distractorDiagnostic: distractorDiag,
              explanation: q.explanation,
              sourceContext: q.sourceContext,
              testDate,
            })
          }
        }
      }
    }
  }

  return Array.from(deficiencyMap.values()).sort((a, b) => b.errorCount - a.errorCount)
}
