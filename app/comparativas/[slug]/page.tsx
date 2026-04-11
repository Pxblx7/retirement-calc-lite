import { Suspense } from "react"
import { seoComparisons } from "@/lib/seo-comparisons"
import { SimulatorCore } from "@/components/simulator/simulator-core"
import { notFound } from "next/navigation"

const BASE_URL = "https://miretiromx.pxblx.com"

export const dynamicParams = false // Only allow the predefined slugs to 404 others

export function generateStaticParams() {
  return seoComparisons.map((comp) => ({
    slug: comp.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comp = seoComparisons.find(c => c.slug === slug)
  if (!comp) return {}

  return {
    title: comp.title,
    description: comp.description,
    alternates: {
      canonical: `${BASE_URL}/comparativas/${slug}`,
    },
    openGraph: {
      title: comp.title,
      description: comp.description,
      url: `${BASE_URL}/comparativas/${slug}`,
      type: "website",
      locale: "es_MX",
      siteName: "Mi Retiro MX",
    },
  }
}

export default async function ComparativaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comp = seoComparisons.find(c => c.slug === slug)
  
  if (!comp) {
    notFound()
  }

  return (
    <>
      {/*
        Server-rendered SEO anchor: Googlebot reads this H1 and subtitle in raw HTML.
        SimulatorCore below is "use client" and invisible to crawlers.
        This text is visually hidden from the UI (the simulator UI already has its own title)
        but fully readable and indexed by search engines.
      */}
      <h1 className="sr-only">{comp.h1}</h1>
      <p className="sr-only">{comp.subtitle}</p>

      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <SimulatorCore seoTemplate={comp} />
      </Suspense>
    </>
  )
}
