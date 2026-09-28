export interface TestData {
  textbook: string
  topic: string
  class: string
}

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty?: string
  topic?: string
  bloomLevel?: string
  sourceContext?: string
  image?: string
  audio?: string
  optionAudios?: string[]
  grounding?: {
    book?: string
    grade?: number
    page_start?: number
    page_end?: number
    canonical_concept?: string
    passport_id?: string
  }
  distractor_diagnostics?: Record<string, string>
  backward_trace?: {
    is_root_anchor?: boolean
    root_grade?: number | string
    root_book?: string
    root_page?: number | string
    root_concept?: string
    remedial_duration_mins?: number
    parent_action_tip?: string
  }
}

export interface TestResults {
  testData: TestData
  questions: Question[]
  answers: { [key: number]: number }
  score: number
  timeSpent: number
  completedAt: string
}

export interface UserData {
  firstName: string
  lastName: string
  fatherName: string
  region: string
  school: string
  class: string
  email: string
}
