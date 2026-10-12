import { Lang } from "@/components/language-dropdown"

export type DiscoveryCategory =
  | "nobel"
  | "fizika"
  | "kimya"
  | "biologiya"
  | "riyaziyyat"
  | "informatika"

export interface NobelPrizeInfo {
  year: number
  category: "Fizika" | "Kimya" | "Fiziologiya və ya Tibb" | "Physics" | "Chemistry" | "Physiology or Medicine"
  laureates: string[]
  citation: string
}

export interface DiscoveryQuizOption {
  id: "A" | "B" | "C" | "D"
  text: string
}

export interface DiscoveryQuizQuestion {
  id: string
  question: string
  options: DiscoveryQuizOption[]
  correctOption: "A" | "B" | "C" | "D"
  explanation: string
  bloomLevel: "Bilik" | "Anlama" | "Tətbiq" | "Təhlil"
}

export interface DiscoveryTranslation {
  title: string
  summary: string
  ahaMoment: string
  howItWorks: string
  realWorldImpact: string
  curriculumConnection: string
  funFacts: string[]
}

export interface ScientificDiscovery {
  id: string
  slug: string
  category: DiscoveryCategory
  isNobel: boolean
  nobelPrize?: NobelPrizeInfo
  discoveryYear: string | number
  discoverer: string
  curriculumSubject: string
  curriculumGrade: string
  curriculumTopic: string
  icon: string
  accentColor: string
  readTime: string
  translations: Record<Lang, DiscoveryTranslation>
  quiz: DiscoveryQuizQuestion[]
}
