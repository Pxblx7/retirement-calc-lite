import { Suspense } from "react"
import { seoComparisons } from "@/lib/seo-comparisons"
import { SimulatorCore } from "@/components/simulator/simulator-core"
import { notFound } from "next/navigation"

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
    openGraph: {
      title: comp.title,
      description: comp.description,
      type: "website",
    }
  }
}

export default async function ComparativaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comp = seoComparisons.find(c => c.slug === slug)
  
  if (!comp) {
    notFound()
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SimulatorCore seoTemplate={comp} />
    </Suspense>
  )
}

