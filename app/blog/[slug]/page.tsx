import { blogData } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import { MainHeader, MainFooter } from "@/components/layout/main-header"
import { BlogClient } from "./blog-client"

export function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogData.find((p) => p.slug === slug)
  if (!post) {
    return { title: 'Not Found' }
  }

  // By default we return the Spanish metadata for the SEO engine
  return {
    title: `${post.es.title} | Mi Retiro MX`,
    description: post.es.description,
    openGraph: {
      title: post.es.title,
      description: post.es.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogData.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Generate BlogPosting JSON-LD for rich snippets
  // We use the Spanish text as the default schema injection since Google bots mostly crawl without JS state
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.es.title,
    "description": post.es.description,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://twitter.com/pabloarroyo" // Example URL, adds EEAT
    },
    "datePublished": post.date,
    "publisher": {
      "@type": "Organization",
      "name": "Mi Retiro MX",
      "logo": {
        "@type": "ImageObject",
        "url": "https://miretiro.mx/logo.png"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-[800px] px-4 py-12 flex-grow w-full">
        <BlogClient post={post} />
      </main>
      <MainFooter />
    </div>
  )
}
