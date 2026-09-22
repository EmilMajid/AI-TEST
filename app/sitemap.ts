import { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://testai.az"
  const now = new Date()

  const languages = ["az", "en", "tr", "ru"] as const

  // Base public pages
  const staticRoutes = ["", "about", "privacy", "terms", "contact", "blog", "open-tests"]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes in all languages
  for (const route of staticRoutes) {
    for (const lang of languages) {
      const url =
        lang === "az"
          ? `${baseUrl}${route ? `/${route}` : ""}`
          : `${baseUrl}/${lang}${route ? `/${route}` : ""}`

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: route === "blog" || route === "" ? "daily" : "monthly",
        priority: route === "" ? 1.0 : route === "blog" ? 0.9 : 0.8,
      })
    }
  }

  // Add individual blog post pages in all languages
  for (const post of BLOG_POSTS) {
    for (const lang of languages) {
      const url =
        lang === "az"
          ? `${baseUrl}/blog/${post.slug}`
          : `${baseUrl}/${lang}/blog/${post.slug}`

      sitemapEntries.push({
        url,
        lastModified: new Date(post.publishDate),
        changeFrequency: "weekly",
        priority: 0.85,
      })
    }
  }

  return sitemapEntries
}
