import { blogData } from "@/lib/blog-data"
import { glossaryData } from "@/lib/glossary-data"
import { seoComparisons } from "@/lib/seo-comparisons"
import { buildSitemapEntries } from "@/lib/sitemap-helpers"

export default function sitemap() {
  return buildSitemapEntries({
    blogSlugs: blogData.map((p) => ({ slug: p.slug, date: p.date })),
    glossarySlugs: glossaryData.map((t) => t.slug),
    comparativaSlugs: seoComparisons.map((c) => c.slug),
  })
}
