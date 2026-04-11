/**
 * Pure helper functions for sitemap URL construction.
 * Kept in lib/ so they can be unit-tested without Next.js or JSX transforms.
 */

export const SITE_BASE_URL = "https://miretiromx.pxblx.com"

export type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: number
}

export function buildSitemapEntries(params: {
  blogSlugs: Array<{ slug: string; date: string }>
  glossarySlugs: string[]
  comparativaSlugs: string[]
  baseUrl?: string
}): SitemapEntry[] {
  const base = params.baseUrl ?? SITE_BASE_URL

  const staticPages: SitemapEntry[] = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/glosario`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ]

  const blogEntries: SitemapEntry[] = params.blogSlugs.map(({ slug, date }) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const glossaryEntries: SitemapEntry[] = params.glossarySlugs.map((slug) => ({
    url: `${base}/glosario/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  }))

  const comparativaEntries: SitemapEntry[] = params.comparativaSlugs.map((slug) => ({
    url: `${base}/comparativas/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticPages, ...blogEntries, ...glossaryEntries, ...comparativaEntries]
}
