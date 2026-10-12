import { ScientificDiscovery, DiscoveryCategory } from "@/lib/discoveries-types"
import { NOBEL_DISCOVERIES } from "@/lib/discoveries/nobel-discoveries"
import { CLASSICAL_DISCOVERIES } from "@/lib/discoveries/classical-discoveries"
import { FUNDAMENTAL_DISCOVERIES } from "@/lib/discoveries/fundamental-discoveries"
import { MODERN_DISCOVERIES } from "@/lib/discoveries/modern-discoveries"
import { ADDITIONAL_DISCOVERIES } from "@/lib/discoveries/additional-discoveries"
import { SUPPLEMENTARY_DISCOVERIES } from "@/lib/discoveries/supplementary-discoveries"
import { FINAL_DISCOVERIES } from "@/lib/discoveries/final-discoveries"

export * from "@/lib/discoveries-types"

export const ALL_DISCOVERIES: ScientificDiscovery[] = [
  ...NOBEL_DISCOVERIES,
  ...CLASSICAL_DISCOVERIES,
  ...FUNDAMENTAL_DISCOVERIES,
  ...MODERN_DISCOVERIES,
  ...ADDITIONAL_DISCOVERIES,
  ...SUPPLEMENTARY_DISCOVERIES,
  ...FINAL_DISCOVERIES,
]

export function getAllDiscoveries(): ScientificDiscovery[] {
  return ALL_DISCOVERIES
}

export function getDiscoveryBySlug(slug: string): ScientificDiscovery | undefined {
  return ALL_DISCOVERIES.find((d) => d.slug === slug || d.id === slug)
}

export function getDiscoveriesByCategory(category: DiscoveryCategory): ScientificDiscovery[] {
  if (category === "nobel") {
    return ALL_DISCOVERIES.filter((d) => d.isNobel)
  }
  return ALL_DISCOVERIES.filter((d) => d.category === category)
}

export function getRecentNobelDiscoveries(): ScientificDiscovery[] {
  return ALL_DISCOVERIES.filter((d) => d.isNobel && d.nobelPrize && d.nobelPrize.year >= 2020)
}

export function getRelatedDiscoveries(currentSlug: string, count = 3): ScientificDiscovery[] {
  const current = getDiscoveryBySlug(currentSlug)
  if (!current) return ALL_DISCOVERIES.slice(0, count)

  return ALL_DISCOVERIES.filter(
    (d) => d.slug !== current.slug && (d.category === current.category || d.curriculumSubject === current.curriculumSubject)
  ).slice(0, count)
}
