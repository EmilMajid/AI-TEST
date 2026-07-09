with open('app/api/generate-test/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    return shuffled.map((q: any, idx: number) => ({
      id: idx + 1,
      question: q.question,
      options: Array.isArray(q.options) ? q.options.map((opt: string) => opt.replace(/^[A-D]\)\s*/i, "").trim()) : q.options,
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || "",
      difficulty: q.difficulty || difficulty,
      topic: q.topic || topic,
      bloomLevel: (q.bloomLevel || "anlama").toLowerCase(),
      timeEstimate: (q.difficulty === "sadə" || q.difficulty === "asan" || q.difficulty === "easy") ? 1 : (q.difficulty === "çətin" || q.difficulty === "hard") ? 3 : 2,
      sourceContext: q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${topic}" mövzusu`,
    }))'''

replacement = '''    return shuffled.map((q: any, idx: number) => {
      let correctAnswerIndex = 0;
      const cleanOptions = Array.isArray(q.options) 
        ? q.options.map((opt: string) => opt.replace(/^[A-D]\)\s*/i, "").trim()) 
        : q.options;

      if (typeof q.correctAnswer === "number") {
        correctAnswerIndex = q.correctAnswer;
      } else if (typeof q.answer === "string" && Array.isArray(q.options)) {
        const foundIdx = cleanOptions.findIndex((opt: string) => opt === q.answer.trim() || q.options.findIndex((o: string) => o.trim() === q.answer.trim()) === cleanOptions.indexOf(opt));
        correctAnswerIndex = foundIdx !== -1 ? foundIdx : 0;
      } else {
        correctAnswerIndex = q.correctAnswer ?? 0;
      }

      return {
        id: idx + 1,
        question: q.question,
        options: cleanOptions,
        correctAnswer: correctAnswerIndex,
        explanation: q.explanation || "",
        difficulty: q.difficulty || difficulty,
        topic: q.topic || topic,
        bloomLevel: (q.bloomLevel || "anlama").toLowerCase(),
        timeEstimate: (q.difficulty === "sadə" || q.difficulty === "asan" || q.difficulty === "easy") ? 1 : (q.difficulty === "çətin" || q.difficulty === "hard") ? 3 : 2,
        sourceContext: q.sourceContext || `> **Mənbə (Dərslik):** ${textbookTitle}, "${topic}" mövzusu`,
      };
    })'''

if target in content:
    new_content = content.replace(target, replacement)
    with open('app/api/generate-test/route.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Done!')
else:
    print('Target not found! Check characters.')
