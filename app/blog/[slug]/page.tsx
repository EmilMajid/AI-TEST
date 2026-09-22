import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-data"
import { ArticleViewer } from "@/components/blog/article-viewer"
import { Lang } from "@/components/language-dropdown"

interface PageProps {
  params: { slug: string }
  searchParams: { lang?: string }
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params, searchParams }: PageProps): Metadata {
  const post = getBlogPostBySlug(params.slug)
  if (!post) {
    return { title: "Məqalə tapılmadı - TESTAI.AZ" }
  }

  const requestedLang = (searchParams?.lang as Lang) || "az"
  const tr = post.translations[requestedLang] || post.translations.az

  return {
    title: `${tr.title} | TESTAI.AZ Pedaqoji Bloq`,
    description: tr.summary,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://testai.az/blog/${post.slug}`,
      languages: {
        az: `https://testai.az/blog/${post.slug}?lang=az`,
        en: `https://testai.az/blog/${post.slug}?lang=en`,
        tr: `https://testai.az/blog/${post.slug}?lang=tr`,
        ru: `https://testai.az/blog/${post.slug}?lang=ru`,
        "x-default": `https://testai.az/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: tr.title,
      description: tr.summary,
      url: `https://testai.az/blog/${post.slug}`,
      siteName: "TESTAI.AZ",
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author.name],
      tags: post.tags,
    },
  }
}

export default function BlogPostPage({ params, searchParams }: PageProps) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  const initialLang = (["az", "en", "tr", "ru"].includes(searchParams?.lang || "")
    ? searchParams.lang
    : "az") as Lang

  const tr = post.translations[initialLang] || post.translations.az

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: tr.title,
    description: tr.summary,
    datePublished: post.publishDate,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: "https://testai.az",
    },
    publisher: {
      "@type": "Organization",
      name: "TESTAI.AZ",
      url: "https://testai.az",
      logo: {
        "@type": "ImageObject",
        url: "https://testai.az/logo.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://testai.az/blog/${post.slug}`,
    },
  }

  return (
    <>
      <Script
        id={`schema-blog-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleViewer post={post} initialLang={initialLang} />
    </>
  )
}
