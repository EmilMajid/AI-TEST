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
