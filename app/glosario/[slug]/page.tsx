import { glossaryData } from "@/lib/glossary-data"
import { notFound } from "next/navigation"
import { MainHeader, MainFooter } from "@/components/layout/main-header"
import { GlossaryClient } from "./glossary-client"

export const dynamicParams = false // Only allow defined terms

export function generateStaticParams() {
  return glossaryData.map((term) => ({
    slug: term.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const termData = glossaryData.find(t => t.slug === slug)
  if (!termData) return {}

  return {
    title: `¿Qué es ${termData.es.term}? Definición y significado | Mi Retiro MX`,
    description: termData.es.shortDefinition,
    openGraph: {
      title: `¿Qué es ${termData.es.term}?`,
      description: termData.es.shortDefinition,
      type: "article",
    }
  }
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const termData = glossaryData.find(t => t.slug === slug)
  
  if (!termData) {
    notFound()
  }

  // Pre-generate JSON-LD Schema (Server-side, defaults to Spanish for Crawlers)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": termData.es.term,
    "description": termData.es.detailedExplanation,
    "inDefinedTermSet": "https://miretiro.mx/glosario",
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MainHeader />
      
      <main className="mx-auto max-w-[800px] px-4 py-16 flex-grow w-full">
        {/* Pass data to Client Component to handle i18n hydration */}
        <GlossaryClient termData={termData} />
      </main>

      <MainFooter />
    </div>
  )
}
