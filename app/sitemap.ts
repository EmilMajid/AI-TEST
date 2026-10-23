import { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog-data"
import { ALL_DISCOVERIES } from "@/lib/discoveries-data"
import { DEFAULT_LOCALE } from "@/lib/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.testai.az"
  const now = new Date()

  const languages = ["en", "az", "tr", "ru"] as const

  // Base public pages
  const staticRoutes = ["", "about", "privacy", "terms", "contact", "blog", "open-tests", "discoveries"]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes in all languages (English first for AdSense compliance)
  for (const route of staticRoutes) {
    for (const lang of languages) {
      const isDefault = lang === DEFAULT_LOCALE
      const url = isDefault
        ? `${baseUrl}${route ? `/${route}` : ""}`
        : `${baseUrl}/${lang}${route ? `/${route}` : ""}`

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: route === "blog" || route === "discoveries" || route === "" ? "daily" : "monthly",
        priority: isDefault
          ? route === ""
            ? 1.0
            : route === "discoveries" || route === "blog"
              ? 0.95
              : 0.85
          : route === ""
            ? 0.8
            : 0.75,
      })
    }
  }

  // Add individual blog post pages in all languages
  for (const post of BLOG_POSTS) {
    for (const lang of languages) {
      const isDefault = lang === DEFAULT_LOCALE
      const url = isDefault
        ? `${baseUrl}/blog/${post.slug}`
        : `${baseUrl}/${lang}/blog/${post.slug}`

      sitemapEntries.push({
        url,
        lastModified: new Date(post.publishDate),
        changeFrequency: "weekly",
        priority: isDefault ? 0.9 : 0.75,
      })
    }
  }

  // Add all 50 scientific discovery pages in all languages
  for (const discovery of ALL_DISCOVERIES) {
    for (const lang of languages) {
      const isDefault = lang === DEFAULT_LOCALE
      const url = isDefault
        ? `${baseUrl}/discoveries/${discovery.slug}`
        : `${baseUrl}/${lang}/discoveries/${discovery.slug}`

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: isDefault
          ? discovery.isNobel ? 0.95 : 0.88
          : 0.75,
      })
    }
  }

  return sitemapEntries
}
